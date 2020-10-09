import { Component, h, Host, Prop, State } from '@stencil/core';
import { Stream } from '../../types/reportconfig.type';

@Component({
  tag: 'cronk-event-stream',
})
export class CronkEventStream {
  /** Event stream configuration */
  @Prop() config: Stream;

  @State() customElProps?: any;

  private streamEl?: string;

  async componentWillLoad() {
    if (!this.config) return;
    const { element, ...attributes } = this.config;
    if (!element) return;
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
      <Host aria-hidden={'true'}>
        <EventSource class="cronk-datastream" {...this.customElProps} />
      </Host>
    );
  }
}
