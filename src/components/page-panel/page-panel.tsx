// tslint:disable: no-import-side-effect
import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { fromEvent, Subscription, debounceTime, map } from 'rxjs';
import { asBoolean, isDefined, isUndefined, JSONValue } from 'ts-runtime-typecheck';
import { ComponentConfig, PropTag, JMESPathFn } from '../../types';
import { mapAttributesToProps, transformValue } from '../../utils';
import { normaliseEvent } from '../../utils/event_transform';

@Component({
  styleUrl: 'page-panel.scss',
  tag: 'cronk-page-panel',
})
export class CronkPagePanel {
  @Element() hostEl: HTMLCronkPagePanelElement;
  /** Configuration for a specific component */
  @Prop() panelConfig: ComponentConfig;

  @State() customElProps?: Record<PropTag, JSONValue>;
  @State() errorMessage?: string;
  @State() shouldRender = true;

  private panelEl: string;
  private listeners$?: Subscription;
  private renderCondition?: JMESPathFn;

  private payloadCache: JSONValue[] = [];

  private async updateCustomElProps(dataIn: JSONValue = {}) {
    try {
      this.customElProps = await mapAttributesToProps(this.panelConfig, dataIn);
      // console.debug(`updateCustomElProps::<${this.panelConfig.element}>`, this.customElProps);
    } catch (error) {
      console.error(`updateCustomElProps::<${this.panelEl}>::error`, error);
      this.customElProps = {};
      this.errorMessage = error.message;
    }
  }

  private payloadHandler = async (payload: JSONValue): Promise<void> => {
    if (isDefined(this.renderCondition)) {
      try {
        const result = await transformValue(this.renderCondition, payload);
        this.shouldRender = asBoolean(result);
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
    if (!this.shouldRender) {
      return;
    }
    await this.updateCustomElProps(payload);
  };

  async componentWillLoad() {
    if (isUndefined(this.panelConfig)) {
      return;
    }
    const { element, listen, hidden: _, when: renderCondition } = this.panelConfig;
    this.panelEl = element;
    this.renderCondition = renderCondition;

    if (isDefined(listen)) {
      const {
        stream,
        debounce = 0,
        cache: cacheSize = 1,
      } = typeof listen !== 'string' ? listen : { stream: listen, debounce: 0, cache: 1 };

      const eventObservable$ = fromEvent<Event | CustomEvent<JSONValue>>(window, stream);
      this.listeners$ = eventObservable$
        .pipe(
          debounceTime(debounce),
          map(normaliseEvent),
          map(payload => {
            if (cacheSize === 1) {
              return payload;
            }
            this.payloadCache = [payload, ...this.payloadCache.slice(0, cacheSize - 1)];
            return this.payloadCache;
          }),
        )
        .subscribe(this.payloadHandler);
    } else {
      await this.updateCustomElProps(); // For components not attached to event streams
    }
  }

  async disconnectedCallback() {
    this.listeners$?.unsubscribe();
  }

  render() {
    if (!this.shouldRender) return;

    const { components = [], layout = {}, heading, style = {} } = this.panelConfig;
    const ReportPanel = this.panelEl;
    const colSpan = layout?.width ?? 4;
    const hasComponents = components.length > 0;
    const headingEl = isDefined(heading) ? <h5 key={heading}>{heading}</h5> : null;

    return (
      <Host
        class={'component-panel'}
        data-grid={layout}
        style={{
          flex: `${colSpan} auto`,
          minWidth: `20rem`,
          width: `${(colSpan / 4) * 100 - 1}%`,
          ...style,
        }}
      >
        {headingEl}
        {isDefined(this.errorMessage) ? (
          <cronk-errormessage message={this.errorMessage}></cronk-errormessage>
        ) : (
          <ReportPanel {...this.customElProps}>
            {hasComponents ? (
              <cronk-page-components>
                {components.map((componentDefinition: ComponentConfig, componentIndex: number) => {
                  const uuid = `${this.hostEl.id}-panel-${componentIndex}`;
                  return (
                    <cronk-page-panel
                      slot={componentDefinition?.layout?.position}
                      key={uuid}
                      id={uuid}
                      panelConfig={componentDefinition}
                    />
                  );
                })}
              </cronk-page-components>
            ) : null}
          </ReportPanel>
        )}
      </Host>
    );
  }
}
