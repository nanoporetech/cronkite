import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { DEFAULT_CHANNEL, DEFAULT_CHANNELS, DEFAULT_SHAPE, RESPONSE_MIMETYPE } from '../../constants/datastream.constant';
import { DatastreamEventDispatcher, DatastreamResponseHandler, MetadataObj, ResponseTypes, StreamConfig } from '../../types/datastreams.type';
import { processValue } from '../../utils';

@Component({
  tag: 'cronk-poll-datastream',
})
export class CronkPollDatastream {
  private eTag = 'STARTER - ETAG';
  private intervalID: any;
  private cachedResponse: MetadataObj | null = null;
  private cachedBroadcasts = {};
  private filters = {};
  private dispatch: DatastreamEventDispatcher = async (
    eventName: string,
    sourceNode: HTMLElement,
    payload,
  ) => {
    const event = new CustomEvent(eventName || DEFAULT_CHANNEL, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
    // console.debug(eventName, payload);
    // TODO: HACK TO ENSURE EVENTS FIRE AFTER COMPONENTS ARE RENDERED
    // setTimeout(sourceNode.dispatchEvent, 100, event);
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLCronkPollDatastreamElement;

  /** sets class `cronk-${this.type}-eventstream` on cronk-poll-datastream element */
  @Prop() type = 'data';
  /** fetch API response format  */
  @Prop() responseFormat: ResponseTypes = 'json'
  /** fetch API URL */
  @Prop() url: string | null = null;
  /** Channel configuration describing how broadcasts are constructed */
  @Prop() channels = DEFAULT_CHANNELS;
  /** Whether or not a datastream is affected by filters like cronk-selector */
  @Prop() acceptsFilters = false;
  /** fetch API credentials */
  @Prop() credentials: RequestCredentials = 'include';
  /** fetch API request mode */
  @Prop() mode: RequestMode = 'cors';
  /** Polling interval to check URL for changes */
  @Prop() pollFrequency = 15000;
  /** Custom response handler */
  @Prop() responseHandler: DatastreamResponseHandler = async (
    data: any,
    streamState: StreamConfig,
  ) => {
    const { channels, dispatch, filters } = streamState;
    let filteredData: any;

    channels.forEach(async c => {
      filteredData = await processValue(data, c.shape || DEFAULT_SHAPE);
      const canFilter = c.filtered !== undefined ? c.filtered : true;
      if (canFilter && filters.length && Array.isArray(filteredData)) {
        filteredData = filteredData.filter((datum: MetadataObj) =>
          filters.map(filter => filter(datum)).every(i => i),
        );
      }
      const dispatchFn = (_channel: string, _hostEl: HTMLElement, _filteredData: any) => async () => {
        // console.debug(`%cEPI-POLL-DATASTREAM::dispatch::${_channel}`, 'color: violet');
        dispatch(_channel, _hostEl, _filteredData);
      };
      this.cachedBroadcasts[c.channel] = dispatchFn(c.channel, this.hostEl, filteredData);
      this.cachedBroadcasts[c.channel]();
    });
  };

  /** List any filter functions applied to the data streams */
  @Method()
  async listFilters(): Promise<any> {
    return this.filters;
  }

  /** Attach/add a new filter function to apply to members of a datastream */
  @Method()
  async addFilter(fnKey: string, filterFn: () => boolean) {
    this.filters[fnKey] = filterFn;
    await this.broadcast(this.cachedResponse);
  }

  /** Rebroadcast latest cached payload to on all configured channels */
  @Method()
  async resendBroadcast() {
    Object.values(this.cachedBroadcasts).forEach((dispatcherFn: any) => dispatcherFn());
  }

  private requestHandler = async (method: string): Promise<Response> => {
    const response = await fetch(this.url as string, {
      body: null,
      cache: 'force-cache',
      credentials: this.credentials,
      headers: {
        accept: RESPONSE_MIMETYPE[this.responseFormat],
      },
      method: method.toUpperCase(),
      mode: this.mode,
    });
    return response;
  };

  private async broadcast(data: any) {
    if (!data) return;
    await this.responseHandler(data, {
      channels: this.channels,
      dispatch: this.dispatch,
      filters: Object.values(this.filters),
      type: this.type,
    });
  }

  private fetchData = async () => {
    // console.debug('In fetchData', this.url);
    let response: Response | null = null;
    try {
      response = await this.requestHandler('GET');
    } catch (error) {
      console.error('Error (GET request)', error, response);
    }
    if (!response) return;
    let newData: any;
    switch (this.responseFormat) {
      case 'json':
        newData = await response.json();
        break;
      case 'csv':
        const rawCsvResponse: string = await response.text();
        newData = rawCsvResponse
          .trimRight()
          .split(/[\n\r]+/g)
          .map(line => line.split(','));
        break;
      case 'tsv':
        const rawTsvResponse: string = await response.text();
        newData = rawTsvResponse
          .trimRight()
          .split(/[\n\r]+/g)
          .map(line => line.split('\t'));
        break;
      default:
        newData = await response.text();
        break;
    }
    this.cachedResponse = newData;
    await this.broadcast(newData);
  };

  private pollData = async () => {
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

  private async initDataStream() {
    if (this.url) {
      this.intervalID = setInterval(this.pollData, this.pollFrequency);
      await this.pollData();
    }
  }

  async componentWillUpdate() {
    clearInterval(this.intervalID);
    await this.initDataStream();
  }

  disconnectedCallback() {
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
