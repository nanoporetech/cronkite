import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { processValue } from '../../utils';
import * as CronkDataStream from '../interfaces';

const DEFAULT_SHAPE = {
  'fn:jmespath': '@',
};
const DEFAULT_CHANNEL = 'cronkite:stream';
const DEFAULT_CHANNELS: CronkDataStream.IChannelShape[] = [
  {
    channel: DEFAULT_CHANNEL,
    shape: DEFAULT_SHAPE,
  },
];

@Component({
  tag: 'cronk-poll-datastream',
})
export class CronkPollDatastream {
  private eTag = 'STARTER - ETAG';
  private intervalID: any;
  private cachedResponse: CronkDataStream.IMetadataObj | null = null;
  private cachedBroadcasts = {};
  private filters = {};
  private dispatch: CronkDataStream.IDatastreamEventDispatcher = async (
    eventName: string,
    sourceNode: HTMLElement,
    payload,
  ) => {
    const event = new CustomEvent(eventName || DEFAULT_CHANNEL, {
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

  @Prop() type = 'data';
  @Prop() url: string | null = null;
  @Prop() channels: CronkDataStream.IChannelShape[] = DEFAULT_CHANNELS;
  @Prop() acceptsFilters = false;
  @Prop() credentials: RequestCredentials = 'include';
  @Prop() mode: RequestMode = 'cors';
  @Prop() pollFrequency = 15000;
  @Prop() corsProxy = '';
  @Prop() responseHandler: CronkDataStream.IDatastreamResponseHandler = async (
    data: any,
    streamState: CronkDataStream.IStreamConfig,
  ) => {
    const { channels, dispatch, filters } = streamState;
    let filteredData: any;

    channels.forEach(async c => {
      filteredData = await processValue(data, c.shape || DEFAULT_SHAPE);
      const canFilter = c.filtered !== undefined ? c.filtered : true;
      if (canFilter && filters.length && Array.isArray(filteredData)) {
        filteredData = filteredData.filter((datum: CronkDataStream.IMetadataObj) =>
          filters.map(filter => filter(datum)).every(i => i),
        );
      }
      const dispatchFn = (_channel: string, _hostEl: HTMLElement, _filteredData: any) => async () => {
        console.debug(`%cEPI-POLL-DATASTREAM::dispatch::${_channel}`, 'color: violet');
        dispatch(_channel, _hostEl, _filteredData);
      };
      this.cachedBroadcasts[c.channel] = dispatchFn(c.channel, this.hostEl, filteredData);
      this.cachedBroadcasts[c.channel]();
    });
  };

  @Method() async listFilters(): Promise<{}> {
    return this.filters;
  }

  @Method() async addFilter(fnKey: string, filterFn: () => boolean) {
    this.filters[fnKey] = filterFn;
    await this.broadcast(this.cachedResponse);
  }

  @Method() async resendBroadcast() {
    Object.values(this.cachedBroadcasts).forEach((dispatcherFn: any) => dispatcherFn());
  }

  requestHandler = async (method: string): Promise<Response> => {
    const response = await fetch(this.url as string, {
      body: null,
      cache: 'force-cache',
      credentials: this.credentials,
      headers: {
        accept: 'application/json',
      },
      method: method.toUpperCase(),
      mode: this.mode,
    });
    return response;
  };

  requestSuccess = (response: Response) => {
    const status = response.status;
    return status >= 200 && status < 400;
  };

  async broadcast(data: any) {
    if (!data) return;
    await this.responseHandler(data, {
      channels: this.channels,
      dispatch: this.dispatch,
      filters: Object.values(this.filters),
      type: this.type,
    });
  }

  fetchData = async () => {
    console.debug('In fetchData', this.url);
    let response: Response | null = null;
    try {
      response = await this.requestHandler('GET');
    } catch (error) {
      console.error('Error (GET request)', error, response);
    }
    if (!response) return;
    // if (!this.requestSuccess(response)) {
    //   throw new Error(`Request error (${uri}) returned status ${response.status}`)
    // }
    const newData: CronkDataStream.IMetadataObj = await response.json();
    this.cachedResponse = newData;
    await this.broadcast(newData);
  };

  pollData = async () => {
    let response: Response | null = null;
    try {
      response = await this.requestHandler('HEAD');
    } catch (error) {
      console.error('Error (HEAD request)', error, response);
    }
    if (!response) return;

    // TODO: Handle other status codes
    const eTag = response.headers.get('etag') || '';
    if (eTag !== this.eTag) {
      await this.fetchData();
      this.eTag = eTag;
    } else {
      // TODO: Should the cached data be rebroadcast on every poll???
      // await this.broadcast(this.cachedResponse);
    }
  };

  async initDataStream() {
    if (this.url) {
      this.intervalID = setInterval(this.pollData, this.pollFrequency);
      await this.pollData();
    }
  }

  async componentWillUpdate() {
    clearInterval(this.intervalID);
    await this.initDataStream();
  }

  componentDidUnload() {
    this.filters = {};
    clearInterval(this.intervalID);
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
