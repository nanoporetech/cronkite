// tslint:disable: object-shorthand-properties-first

import { Component, Element, Host, h, Prop } from '@stencil/core';
import io from 'socket.io-client';

import * as EpiReportDataStream from '../interfaces';
import { processValue } from '../../utils';

@Component({
  tag: 'epi-socketio-datastream',
})
export class EpiSocketioDatastream {
  private _socket?: SocketIOClient.Socket;
  // private cachedResponse: EpiReportDataStream.IMetadataObj | null = null;
  private filters = {};
  private dispatch: EpiReportDataStream.IDatastreamEventDispatcher = async (
    eventName: string,
    sourceNode: HTMLElement,
    payload,
  ) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
    console.debug(eventName, payload);
    // TODO: HACK TO ENSURE EVENTS FIRE AFTER COMPONENTS ARE RENDERED
    // setTimeout(sourceNode.dispatchEvent, 100, event);
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLElement;

  // @Prop() channel = 'epi2me:stream';
  // @Prop() credentials: RequestCredentials = 'include';
  // @Prop() mode: RequestMode = 'cors';
  // @Prop() pollFrequency = 15000;
  // @Prop() corsProxy = '';
  @Prop() responseHandler: EpiReportDataStream.IDatastreamSocketResponseHandler = async (
    data: any,
    streamConfig: EpiReportDataStream.ISocketConfig,
  ) => {
    const { channel, dispatch, filters, shape } = streamConfig;

    let filteredData = await processValue(data, shape);
    if (filters.length && Array.isArray(filteredData)) {
      filteredData = filteredData.filter((datum: EpiReportDataStream.IMetadataObj) =>
        filters.map(filter => filter(datum)).every(i => i),
      );
    }
    dispatch(channel, this.hostEl, filteredData);
  };

  @Prop() type = 'data';
  @Prop() url: string | null = null;
  @Prop() channels: EpiReportDataStream.IChannelShape[] = [];

  async broadcast(data: any, channel: string, shape: any) {
    if (!data) return;
    await this.responseHandler(data, {
      channel,
      dispatch: this.dispatch,
      filters: Object.values(this.filters),
      shape,
    });
  }

  async initStreamListeners() {
    if (!this._socket) return;

    this.channels.forEach(channelConfig => {
      const { channel, shape } = channelConfig;
      let { listen } = channelConfig;
      if (!listen) return;
      if (typeof listen === 'string') {
        listen = [listen];
      }

      listen.forEach(event => {
        this._socket &&
          this._socket.on(event, async (data: any) => {
            await this.broadcast(data, channel, shape);
          });
      });
    });

    this._socket.on('connect', () => {
      console.info('you have been connected');
    });

    this._socket.on('disconnect', () => {
      console.info('you have been disconnected');
    });

    this._socket.on('reconnect', () => {
      console.info('you have been reconnected');
    });

    this._socket.on('reconnect_error', () => {
      console.info('attempt to reconnect has failed');
    });
  }

  async initDataStream() {
    if (this.url) {
      this._socket = io.connect(this.url, {});
      this.initStreamListeners();
    }
  }

  async componentWillUpdate() {
    await this.initDataStream();
  }

  componentDidUnload() {
    this.filters = {};
    if (this._socket) {
      this._socket.disconnect();
      this._socket = undefined;
    }
  }

  async componentDidLoad() {
    if (!this.url) return;
    await this.initDataStream();
  }

  render() {
    return (
      <Host
        aria-hidden={'true'}
        class={{
          'epi-filtered-datastream': true,
          [`epi-${this.type}-eventstream`]: true,
        }}
      />
    );
  }
}
