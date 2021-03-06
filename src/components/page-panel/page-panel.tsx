// tslint:disable: no-import-side-effect
import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ComponentConfig } from '../../types/reportconfig.type';
import { mapAttributesToProps, transformValue } from '../../utils';
import { eventAsJSON } from '../../utils/event_transform';

@Component({
  styleUrl: 'page-panel.scss',
  tag: 'cronk-page-panel',
})
export class CronkPagePanel {
  @Element() hostEl: HTMLCronkPagePanelElement;
  /** Configuration for a specific component */
  @Prop() panelConfig: any;

  @State() customElProps?: any;
  @State() customElAttrs?: any;
  @State() errorMessage?: any;
  @State() shouldRender = true;

  private panelEl?: string;
  private listeners$?: Subscription;
  private streamCache?: ReplaySubject<any>;
  private renderCondition?: any;

  private async updateCustomElProps(attributes: any, dataIn: any) {
    try {
      const newProps = await mapAttributesToProps(attributes, dataIn);
      // console.debug(`updateCustomElProps::<${this.panelConfig.element}>`, newProps);
      this.customElProps = newProps;
    } catch (error) {
      console.error(`updateCustomElProps::<${this.panelConfig.element}>::error`, error);
      this.errorMessage = error.message;
    }
  }

  private payloadHandler = async (payload: any): Promise<void> => {
    if (this.renderCondition !== undefined) {
      try {
        [this.shouldRender] = await transformValue(this.renderCondition, payload);
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
    if (!this.shouldRender) {
      return;
    }
    await this.updateCustomElProps(this.customElAttrs, payload);
  };

  async componentWillLoad() {
    if (!this.panelConfig) return;
    const { element, listen, hidden: hiddenIgnored, when: renderCondition, ...attributes } = this.panelConfig;
    this.panelEl = element;
    this.customElAttrs = attributes;
    this.renderCondition = renderCondition;
    this.streamCache = new ReplaySubject<any>();
    let payloadCache: any[] = [];

    if (listen) {
      const { stream, debounce, cache: cacheSize } =
        typeof listen !== 'string' ? listen : { stream: listen, debounce: 0, cache: 1 };

      const eventObservable$ = fromEvent<Event | CustomEvent<any>>(window, stream);
      this.listeners$ = eventObservable$
        .pipe(
          debounceTime(debounce),
          // tap((event: Event | CustomEvent) => console.debug(`Got event for <${this.panelConfig.element}>`, event)),
          map((event: Event | CustomEvent) => {
            const { detail } = event as CustomEvent;
            return detail || eventAsJSON(event);
          }),
        )
        .subscribe(payload => {
          payloadCache = [payload, ...payloadCache.slice(0, cacheSize - 1)];
          this.streamCache?.next(cacheSize === 1 ? payloadCache[0] : payloadCache);
        });

      this.listeners$.add(this.streamCache.subscribe(this.payloadHandler));
    } else {
      await this.updateCustomElProps(attributes, {}); // For components not attached to event streams
    }
  }

  async disconnectedCallback() {
    this.listeners$?.unsubscribe();
  }

  render() {
    if (!this.panelConfig || !this.panelEl || !this.shouldRender) return;

    const ReportPanel = this.panelEl;
    const colSpan = (this.panelConfig.layout && this.panelConfig.layout.width) || 4;
    const hasComponents = this.panelConfig.components && this.panelConfig.components.length;
    return (
      <Host
        class={`component-panel ${this.panelConfig.hidden ? 'panel-hidden' : ''}`}
        data-grid={this.panelConfig.layout}
        style={{
          flex: `${colSpan} auto`,
          minWidth: `20rem`,
          width: `${(colSpan / 4) * 100 - 1}%`,
          ...(this.panelConfig.style || {}),
        }}
      >
        {(this.panelConfig.heading && <h5 key={this.panelConfig.heading}>{this.panelConfig.heading}</h5>) || null}
        {this.errorMessage ? (
          <cronk-errormessage message={this.errorMessage} ></cronk-errormessage>
        ) : (
          <ReportPanel {...this.customElProps}>
            {hasComponents ? (
              <cronk-page-components>
                {(this.panelConfig.components || []).map((compDef: ComponentConfig, componentIndex: number) => {
                  const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: {} };
                  const uuid = `${this.hostEl.id}-panel-${componentIndex}`;
                  return (
                    <cronk-page-panel
                      slot={componentDefinition.layout.position}
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
