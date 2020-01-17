import { Component, Element, h, Host, Method, Prop, State } from '@stencil/core';
import { CronkJSONTypes } from '../../types/report-json';

@Component({
  styleUrl: 'cronk-datastreams.scss',
  tag: 'cronk-datastreams',
})
export class CronkDatastreams {
  @Element() el!: HTMLElement;

  @Prop() streams?: CronkJSONTypes.Stream[];
  @Prop() streamsID?: string;

  @State() pageComponentsReady = false;

  @Method()
  async reload() {
    document.querySelectorAll('.cronk-datastream').forEach((datastreamEl: any) => datastreamEl.resendBroadcast());
  }

  @Method()
  async getState() {
    return { streams: this.streams, pageComponentsReady: this.pageComponentsReady };
  }

  render() {
    const hasStreams = this.streams !== undefined && this.streams.length > 0;
    const canRenderStreams = hasStreams;

    return (
      <Host>
        {(canRenderStreams &&
          this.streams &&
          this.streams.map((streamConfig: any, streamIndex: number) => (
            <cronk-event-stream key={`${this.streamsID}-${streamIndex}`} config={streamConfig}></cronk-event-stream>
          ))) ||
          null}
      </Host>
    );
  }
}
