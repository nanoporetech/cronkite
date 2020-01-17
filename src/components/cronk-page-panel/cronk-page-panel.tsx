// tslint:disable: no-import-side-effect
import { Component, h, Host, Prop, State } from '@stencil/core';
import uuidv4 from 'uuid/v4';

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
  listeners: any[] = [];

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

  eventHandler = async (event: CustomEvent): Promise<void> => {
    console.debug(`Got event for <${this.panelConfig.element}>`, event);
    let { detail } = event;
    detail = detail || eventAsJSON(event);
    await this.updateCustomElProps(this.customElAttrs, detail);
  };

  async componentWillLoad() {
    if (!this.panelConfig) return;
    const { element, listen, hidden, ...attributes } = this.panelConfig;
    this.panelEl = element;
    this.customElAttrs = attributes;

    if (listen) {
      window.addEventListener(listen, this.eventHandler);
      this.listeners.push({ listen, handle: this.eventHandler });
    } else {
      await this.updateCustomElProps(attributes, {}); // For components not attached to event streams
    }
  }

  async componentDidUnload() {
    this.listeners.forEach(listener => {
      window.removeEventListener(listener.event, listener.handler);
    });
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
