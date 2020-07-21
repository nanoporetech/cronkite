import { Component, Element, h, Host, Method, Prop, Watch } from '@stencil/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { DEFAULT_CHANNEL, DEFAULT_CHANNELS, DEFAULT_SHAPE } from '../../constants/datastream.constant';
import { ChannelShape, DatastreamEventDispatcher, FilterFn, FilterFnMap, ManagedDatastreamResponseHandler, MetadataObj, StreamConfig } from '../../types/datastreams.type';
import { JSONValue } from '../../types/json.type';
import { processValue } from '../../utils';

@Component({
  tag: 'cronk-managed-datastream',
})
export class CronkManagedDatastream {
  private cachedBroadcasts = {};

  private listeners?: Subscription;
  private filters$ = new BehaviorSubject<FilterFnMap>({});
  private data$ = new BehaviorSubject<JSONValue | undefined>(undefined);
  private channels$ = new BehaviorSubject<ChannelShape[]>(DEFAULT_CHANNELS);
  private streamState$ = combineLatest([this.data$, this.channels$, this.filters$]);

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
    console.debug(eventName, payload);
    sourceNode.dispatchEvent(event);
  };

  @Element() hostEl!: HTMLCronkManagedDatastreamElement;
  /** sets class `cronk-${this.type}-eventstream` on cronk-managed-datastream element */
  @Prop() type = 'data';
  /** Channel configuration describing how broadcasts are constructed */
  @Prop() channels: ChannelShape[] = DEFAULT_CHANNELS;
  /** Whether or not a datastream is affected by filters like cronk-selector */
  @Prop() acceptsFilters = false;
  /** Stream data source managed externally to component */
  @Prop({ reflect: true }) data: JSONValue = null;

  @Watch('channels')
  handleChannelsUpdate(newChannels: ChannelShape[]) {
    let sanitized: ChannelShape[] | null = null;
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
  handleDataUpdate(newData: JSONValue) {
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

  /** List any filter functions applied to the data streams */
  @Method()
  async listFilters(): Promise<{}> {
    return this.filters$.getValue();
  }

  /** Attach/add a new filter function to apply to members of a datastream */
  @Method()
  async addFilter(fnKey: string, filterFn: FilterFn) {
    this.filters$?.next({ ...this.filters$.getValue(), [fnKey]: filterFn });
  }

  /** Rebroadcast latest cached payload to on all configured channels */
  @Method()
  async resendBroadcast() {
    Object.values(this.cachedBroadcasts).forEach((dispatcherFn: any) => dispatcherFn());
  }

  private responseHandler: ManagedDatastreamResponseHandler = async (
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
        console.debug(`%cCRONK-MANAGED-DATASTREAM::dispatch::${_channel}`, 'color: violet');
        dispatch(_channel, _hostEl, _filteredData);
      };
      this.cachedBroadcasts[c.channel] = dispatchFn(c.channel, this.hostEl, filteredData);
      this.cachedBroadcasts[c.channel]();
    });
  };

  private broadcast = async ([data, channels, filters]: [
    JSONValue | undefined,
    ChannelShape[],
    FilterFnMap,
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

  disconnectedCallback() {
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
