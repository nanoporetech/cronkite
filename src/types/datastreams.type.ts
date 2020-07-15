import { JSONValue } from './json.type';

export interface MetadataObj {
  [key: string]: any;
}

export type DatastreamEventDispatcher = (eventName: string, node: HTMLElement, payload: MetadataObj) => Promise<void>;

export type ManagedDatastreamResponseHandler = (data: JSONValue, streamState: StreamConfig) => Promise<void>;
export type DatastreamResponseHandler = (data: MetadataObj, streamState: StreamConfig) => Promise<void>;

export interface StreamConfig {
  channels: ChannelShape[];
  dispatch: DatastreamEventDispatcher;
  filters: FilterFn[];
  type: string;
}

export interface ChannelShape {
  channel: string;
  filtered?: boolean;
  listen?: string | string[];
  shape: any;
}

export type FilterFn = (datum: any) => boolean;

export interface FilterFnMap {
  [fnKey: string]: FilterFn;
}

export type ResponseTypes = 'json' | 'csv' | 'tsv' | 'text';

