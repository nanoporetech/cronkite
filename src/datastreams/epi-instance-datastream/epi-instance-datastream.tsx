import { Component, Element, h, Prop } from '@stencil/core';
import * as CronkDataStream from '../interfaces';
import ResponseHandlers from './responseHandlers';

@Component({
  tag: 'epi-instance-datastream',
})
export class EpiInstanceDatastream {
  @Element() hostEl!: HTMLElement;

  @Prop() type = 'default';
  @Prop() flavour!: string;
  @Prop() idWorkflowInstance!: string | number;
  @Prop() channel = 'instance:default';
  @Prop() credentials: RequestCredentials = 'include';
  @Prop() mode: RequestMode = 'cors';
  @Prop() pollFrequency = 15000;

  getResponseHandler() {
    switch (this.type) {
      case CronkDataStream.EDatastreamTypes.telemetry:
        return ResponseHandlers.telemetry;
      case CronkDataStream.EDatastreamTypes.status:
        return ResponseHandlers.status;
      default:
        return ResponseHandlers.default;
    }
  }

  getPayloadResponseHandler(): CronkDataStream.IDatastreamResponseHandler {
    const handler: any = this.getResponseHandler();
    switch (this.flavour) {
      case 'basecalling_1d_barcode-v1':
        return handler.transformAndEmitQCData(this.hostEl);
      case 'simple_aligner_barcode_compact_quick-v1':
        return handler.transformAndEmitSimpleAlignerData(this.hostEl);
      default:
        return handler.transformFlatten(this.hostEl);
    }
  }

  render() {
    if (!this.type || !this.flavour || !this.idWorkflowInstance) return null;
    const url = `https://${location.host}/workflow_instance/${this.idWorkflowInstance}/${this.flavour}.json`;

    return (
      <cronk-poll-datastream
        credentials={this.credentials}
        responseHandler={this.getPayloadResponseHandler()}
        type={this.type}
        url={url}
        channels={[
          {
            channel: this.channel,
          },
        ]}
      />
    );
  }
}
