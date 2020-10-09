import { Component, Element, h, Host, Method, Prop, State } from '@stencil/core';
import { Stream } from '../../types/reportconfig.type';

@Component({
  styleUrl: 'datastreams.scss',
  tag: 'cronk-datastreams',
})
export class CronkDatastreams {
  @Element() el!: HTMLCronkDatastreamsElement;

  /** Array of stream configuration*/
  @Prop() streams?: Stream[];
  /** Unique ID for stream */
  @Prop() streamsID?: string;

  @State() pageComponentsReady = false;

  /** Rebroadcast the last cached payload */

  /** Rebroadcast the last cached payload */

  /** Rebroadcast the last cached payload */

  /** Rebroadcast the last cached payload */
  @Method()
  async reload(): Promise<void> {
    document.querySelectorAll('.cronk-datastream').forEach((datastreamEl: any) => datastreamEl.resendBroadcast());
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
