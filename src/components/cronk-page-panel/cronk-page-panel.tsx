// tslint:disable: no-import-side-effect
import { Component, h, Host, Prop, State } from '@stencil/core';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { mapAttributesToProps } from '../../utils';

const DEFAULT_LAYOUT = {};

function eventAsJSON(event: Event | CustomEvent) {
  const obj = {};
  for (const key in event) {
    if (typeof event[key] === 'string' || typeof event[key] === 'number' || typeof event[key] === 'boolean') {
      obj[key] = event[key];
    }
  }
  return obj;
}

@Component({
  styleUrl: 'cronk-page-panel.scss',
  tag: 'cronk-page-panel',
})
export class CronkPagePanel {
  @Prop() panelConfig: any;

  @State() customElProps?: any;
  @State() customElAttrs?: any;
  @State() errorMessage?: any;

  panelEl?: string;
  listeners$?: Subscription;
  streamCache?: ReplaySubject<any>;

  async updateCustomElProps(attributes: any, dataIn: any) {
    try {
      const newProps = await mapAttributesToProps(attributes, dataIn);
      console.debug(`updateCustomElProps::<${this.panelConfig.element}>`, newProps);
      this.customElProps = newProps;
    } catch (error) {
      console.debug(`updateCustomElProps::<${this.panelConfig.element}>::error`, error);
      this.errorMessage = error;
    }
  }

  payloadHandler = async (payload: any): Promise<void> => {
    await this.updateCustomElProps(this.customElAttrs, payload);
  };

  async componentWillLoad() {
    if (!this.panelConfig) return;
    const { element, listen, hidden, ...attributes } = this.panelConfig;
    this.panelEl = element;
    this.customElAttrs = attributes;
    this.streamCache = new ReplaySubject<any>();
    let payloadCache: any[] = [];

    if (listen) {
      const { stream, debounce, cache: cacheSize } =
        typeof listen !== 'string' ? listen : { stream: listen, debounce: 0, cache: 1 };

      const eventObservable$ = fromEvent<Event | CustomEvent<any>>(window, stream);
      this.listeners$ = eventObservable$
        .pipe(
          debounceTime(debounce),
          tap((event: Event | CustomEvent) => console.debug(`Got event for <${this.panelConfig.element}>`, event)),
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

  async componentDidUnload() {
    this.listeners$?.unsubscribe();
  }

  render() {
    if (!this.panelConfig || !this.panelEl) return;

    const ReportPanel = this.panelEl;
    const colSpan = (this.panelConfig.layout && this.panelConfig.layout.width) || 4;
    const hasComponents = this.panelConfig.components && this.panelConfig.components.length;

    return (
      <Host
        class={`component-panel ${this.panelConfig.hidden ? 'panel-hidden' : ''}`}
        data-grid={this.panelConfig.layout}
        style={{
          gridColumnStart: `span ${colSpan}`,
          ...(this.panelConfig.style || {}),
        }}
      >
        {this.errorMessage ? (
          <cronk-errormessage message={this.errorMessage} />
        ) : (
          <ReportPanel {...this.customElProps}>
            {(this.panelConfig.heading && <h5>{this.panelConfig.heading}</h5>) || null}
            {hasComponents ? (
              <cronk-page-components>
                {(this.panelConfig.components || []).map((compDef: any) => {
                  const componentDefinition = compDef.layout ? compDef : { ...compDef, layout: DEFAULT_LAYOUT };
                  const uuid = componentDefinition.layout.i || uuidv4();
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
