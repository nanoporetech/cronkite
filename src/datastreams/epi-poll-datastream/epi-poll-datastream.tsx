import { Component, Element, Host, h, Method, Prop } from '@stencil/core';
import * as EpiReportDataStream from '../interfaces';

@Component({
  tag: 'epi-poll-datastream',
})
export class EpiPollDatastream {
  private eTag = 'STARTER - ETAG';
  private timeoutHandle: any;
  private cachedResponse: EpiReportDataStream.IMetadataObj | null = null;
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
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLElement;

  @Prop() channel = 'epi2me:stream';
  @Prop() credentials: RequestCredentials = 'include';
  @Prop() mode: RequestMode = 'cors';
  @Prop() pollFrequency = 15000;
  @Prop() corsProxy = '';
  @Prop() responseHandler: EpiReportDataStream.IDatastreamResponseHandler = async (
    data: any,
    streamState: EpiReportDataStream.IStreamConfig,
  ) => {
    const { channel, dispatch, filters } = streamState;
    let filteredData = data;
    if (filters.length) {
      filteredData = filteredData.filter((datum: EpiReportDataStream.IMetadataObj) =>
        filters.map(filter => filter(datum)).every(i => i),
      );
    }
    dispatch(channel, this.hostEl, {
      data: filteredData,
    });
  };
  @Prop() type = 'data';
  @Prop() url: string | null = null;

  @Method() async listFilters(): Promise<{}> {
    return this.filters;
  }

  @Method() async addFilter(fnKey: string, filterFn: () => boolean) {
    this.filters[fnKey] = filterFn;
    this.broadcast(this.cachedResponse);
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

  broadcast(data: any) {
    if (!data) return;
    this.responseHandler(data, {
      channel: this.channel,
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
    const newData: EpiReportDataStream.IMetadataObj = await response.json();
    this.cachedResponse = newData;
    this.broadcast(newData);
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
    }

    // TODO: CHANGE THIS TO SETINTERVAL!
    this.timeoutHandle = setTimeout(() => this.pollData(), this.pollFrequency);
  };

  async initDataStream() {
    if (this.url) this.pollData();
  }

  componentWillUpdate() {
    clearTimeout(this.timeoutHandle);
    this.initDataStream();
  }

  componentDidUnload() {
    this.filters = {};
    clearTimeout(this.timeoutHandle);
  }

  componentDidLoad() {
    if (!this.url) return;
    this.initDataStream();
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
