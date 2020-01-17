// tslint:disable: object-shorthand-properties-first
import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import io from 'socket.io-client';
import { processValue } from '../../utils';
import * as CronkDataStream from '../interfaces';

@Component({
  tag: 'cronk-socketio-datastream',
})
export class CronkSocketioDatastream {
  private _socket?: SocketIOClient.Socket;
  // private cachedResponse: CronkDataStream.IMetadataObj | null = null;
  private filters = {};
  private cachedResponse = {};
  private dispatch: CronkDataStream.IDatastreamEventDispatcher = async (
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
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLElement;

  @Prop() responseHandler: CronkDataStream.IDatastreamSocketResponseHandler = async (
    data: any,
    streamConfig: CronkDataStream.ISocketConfig,
  ) => {
    const { channel, dispatch, filters, shape, filtered } = streamConfig;

    let filteredData = await processValue(data, shape);

    const canFilter = filtered !== undefined ? filtered : true;

    if (canFilter && filters.length && Array.isArray(filteredData)) {
      filteredData = filteredData.filter((datum: CronkDataStream.IMetadataObj) =>
        filters.map(filter => filter(datum)).every(i => i),
      );
    }
    this.cachedResponse[channel] = async () => dispatch(channel, this.hostEl, filteredData);
    this.cachedResponse[channel]();
  };

  @Prop() type = 'data';
  @Prop() url: string | null = null;
  @Prop() channels: CronkDataStream.IChannelShape[] = [];
  @Prop() acceptsFilters = true;

  @Method() async resendBroadcast() {
    Object.values(this.cachedResponse).forEach((dispatcherFn: any) => dispatcherFn());
  }

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
          'cronk-filtered-datastream': this.acceptsFilters,
          [`cronk-${this.type}-eventstream`]: true,
        }}
      />
    );
  }
}
