// tslint:disable: no-import-side-effect
import { Component, Host, h, Prop, State } from '@stencil/core';
import 'epi2me-ui-headlinevalue/dist';

import { mapAttributesToProps } from '../../utils';

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
  styleUrl: 'epi-report-panel.scss',
  tag: 'epi-report-panel',
})
export class EpiReportPanel {
  @Prop() panelConfig: any;

  @State() customElProps?: any;
  @State() customElAttrs?: any;
  @State() errorMessage?: any;

  panelEl?: string;
  listeners: any[] = [];

  async updateCustomElProps(attributes: any, dataIn: any) {
    try {
      const newProps = await mapAttributesToProps(attributes, dataIn);
      console.info('updateCustomElProps::newProps', newProps);
      this.customElProps = newProps;
    } catch (error) {
      console.info('updateCustomElProps::error', error);
      this.errorMessage = error;
    }
  }

  eventHandler = async (event: CustomEvent): Promise<void> => {
    let { detail } = event;
    detail = detail || eventAsJSON(event);
    await this.updateCustomElProps(this.customElAttrs, detail);
    // // console.info('detail', detail)
    // try {
    //   const newProps = await mapAttributesToProps(this.customElAttrs, detail);
    //   console.info('newProps', newProps);
    //   // if (parent) {
    //   //   newProps = { ...newProps, width: parent.clientWidth * 0.6, height: parent.clientHeight * 0.6 }
    //   // }
    //   this.customElProps = newProps;
    // } catch (error) {
    //   this.errorMessage = error.message;
    // }
  };

  async componentWillLoad() {
    const { element, listen, hidden, ...attributes } = this.panelConfig;
    this.panelEl = element;
    this.customElAttrs = attributes;
    // this.customElProps = await mapAttributesToProps(attributes, {});

    if (listen) {
      window.addEventListener(listen, this.eventHandler);
      this.listeners.push({ listen, handle: this.eventHandler });
    } else {
      // this.customElProps = await mapAttributesToProps(attributes, {});
      await this.updateCustomElProps(attributes, {});
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
    return (
      <Host
        class={`component-panel ${this.panelConfig.hidden ? 'panel-hidden' : ''}`}
        data-grid={this.panelConfig.layout}
        style={{
          gridColumnStart: `span ${colSpan}`,
        }}
      >
        {this.errorMessage ? (
          <epi-error-message message={this.errorMessage} />
        ) : (
          <ReportPanel {...this.customElProps} />
        )}
      </Host>
    );
  }
}
