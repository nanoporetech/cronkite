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

  panelEl?: string;
  listeners: any[] = [];

  eventHandler = async (event: CustomEvent): Promise<void> => {
    let { detail } = event;
    detail = detail || eventAsJSON(event);
    // console.info('eventHandler', detail);
    // const parent = customElRef.current && customElRef.current.parentNode;
    const newProps = await mapAttributesToProps(this.customElAttrs, detail);
    // if (parent) {
    //   newProps = { ...newProps, width: parent.clientWidth * 0.6, height: parent.clientHeight * 0.6 }
    // }
    this.customElProps = newProps;
  };

  async componentWillLoad() {
    const { element, listen, hidden, ...attributes } = this.panelConfig;
    this.panelEl = element;
    this.customElAttrs = attributes;
    this.customElProps = Object.assign(
      {},
      ...Object.entries(attributes)
        .filter(([attr]) => attr.startsWith('@'))
        .map(([attr, val]) => ({ [attr.substr(1)]: val })),
    );

    if (listen) {
      window.addEventListener(listen, this.eventHandler);
      this.listeners.push({ listen, handle: this.eventHandler });
    } else {
      this.customElProps = await mapAttributesToProps(attributes, {});
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

    return (
      <Host
        class="component-panel"
        style={{ display: this.panelConfig.hidden ? 'none' : 'initial' }}
        data-grid={this.panelConfig.layout}
      >
        <ReportPanel {...this.customElProps} />
      </Host>
    );
  }
}
