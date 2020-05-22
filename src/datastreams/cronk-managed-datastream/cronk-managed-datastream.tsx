import { Component, Element, h, Host, Method, Prop, Watch } from '@stencil/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
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
  tag: 'cronk-managed-datastream',
})
export class CronkManagedDatastream {
  private cachedBroadcasts = {};

  listeners?: Subscription;
  filters$ = new BehaviorSubject<CronkDataStream.IFilterMap>({});
  data$ = new BehaviorSubject<CronkDataStream.JSONValue | undefined>(undefined);
  channels$ = new BehaviorSubject<CronkDataStream.IChannelShape[]>(DEFAULT_CHANNELS);
  streamState$ = combineLatest([this.data$, this.channels$, this.filters$]);

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
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLElement;

  @Prop() type = 'data';
  @Prop() channels: CronkDataStream.IChannelShape[] = DEFAULT_CHANNELS;
  @Prop() acceptsFilters = false;
  @Prop({ reflectToAttr: true }) data: CronkDataStream.JSONValue = null;

  @Watch('channels')
  handleChannelsUpdate(newChannels: CronkDataStream.IChannelShape[]) {
    let sanitized: CronkDataStream.IChannelShape[] | null = null;
    if (typeof newChannels === 'string' || Array.isArray(newChannels)) {
      try {
        sanitized = Array.isArray(newChannels) ? newChannels : JSON.parse(newChannels);
      } catch (ignore) {
        console.warn('TypeError: expected Array<channels>');
      }
    }
    if (Array.isArray(sanitized) && sanitized.length) {
      this.channels$?.next(sanitized);
      return;
    }
  }

  @Watch('data')
  handleDataUpdate(newData: CronkDataStream.JSONValue) {
    if (typeof newData !== 'string') {
      this.data$?.next(newData);
      return;
    }
    try {
      this.data$?.next(JSON.parse(newData));
    } catch (error) {
      this.data$?.next(newData);
    }
  }

  @Method() async listFilters(): Promise<{}> {
    return this.filters$.getValue();
  }

  @Method() async addFilter(fnKey: string, filterFn: CronkDataStream.IFilterFn) {
    this.filters$?.next({ ...this.filters$.getValue(), [fnKey]: filterFn });
  }

  @Method() async resendBroadcast() {
    Object.values(this.cachedBroadcasts).forEach((dispatcherFn: any) => dispatcherFn());
  }

  responseHandler: CronkDataStream.IManagedDatastreamResponseHandler = async (
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
        console.debug(`%cCRONK-MANAGED-DATASTREAM::dispatch::${_channel}`, 'color: violet');
        dispatch(_channel, _hostEl, _filteredData);
      };
      this.cachedBroadcasts[c.channel] = dispatchFn(c.channel, this.hostEl, filteredData);
      this.cachedBroadcasts[c.channel]();
    });
  };

  broadcast = async ([data, channels, filters]: [
    CronkDataStream.JSONValue | undefined,
    CronkDataStream.IChannelShape[],
    CronkDataStream.IFilterMap,
  ]): Promise<void> => {
    if (data === undefined) return;
    try {
      await this.responseHandler(data, {
        channels,
        dispatch: this.dispatch,
        filters: Object.values(filters),
        type: this.type,
      });
    } catch (error) {
      console.warn('Response handler failed: ', error);
    }
  };

  componentDidUnload() {
    this.listeners?.unsubscribe();
  }

  async componentDidLoad() {
    this.listeners = this.streamState$?.subscribe(this.broadcast);
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
