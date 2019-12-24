import { Component, h, Host, Prop, State } from '@stencil/core';
// tslint:disable-next-line: no-import-side-effect
import 'epi2me-ui-datastream/dist';
@Component({
  styleUrl: 'epi-event-stream.scss',
  tag: 'epi-event-stream',
})
export class EpiEventStream {
  @Prop() config: any;

  @State() customElProps?: any;

  streamEl?: string;

  async componentWillLoad() {
    const { element, ...attributes } = this.config;
    this.streamEl = element;
    this.customElProps = Object.assign(
      {},
      ...Object.entries(attributes)
        .filter(([attr]) => attr.startsWith('@'))
        .map(([attr, val]) => ({ [attr.substr(1)]: val })),
    );
  }

  render() {
    if (!this.streamEl || !this.customElProps) return;

    const EventSource = this.streamEl;
    return (
      <Host>
        <EventSource {...this.customElProps} />
      </Host>
    );
  }
}
