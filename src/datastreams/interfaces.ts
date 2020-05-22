export declare type JSONPrimitive = string | number | boolean | null;
export declare type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export declare type JSONObject = {
  [member: string]: JSONValue;
};
export declare type JSONArray = JSONValue[];

export enum EDatastreamTypes {
  telemetry = 'telemetry',
  status = 'status',
}

export interface IMetadata {
  key: string;
  value: any;
}

export interface IChannelShape {
  channel: string;
  filtered?: boolean;
  listen?: string | string[];
  shape: any;
}

export interface IMetadataObj {
  [key: string]: any;
}

export type IDatastreamEventDispatcher = (eventName: string, node: HTMLElement, payload: IMetadataObj) => Promise<void>;

export type IFilterFn = (datum: any) => boolean;

export interface IFilterMap {
  [fnKey: string]: IFilterFn;
}

export interface IStreamConfig {
  channels: IChannelShape[];
  dispatch: IDatastreamEventDispatcher;
  filters: IFilterFn[];
  type: string;
}

export interface ISocketConfig {
  channel: string;
  dispatch: IDatastreamEventDispatcher;
  filters: IFilterFn[];
  shape: any;
  filtered?: boolean;
}

export type IManagedDatastreamResponseHandler = (data: JSONValue, streamState: IStreamConfig) => Promise<void>;
export type IDatastreamResponseHandler = (data: IMetadataObj, streamState: IStreamConfig) => Promise<void>;
export type IDatastreamSocketResponseHandler = (data: IMetadataObj, streamState: ISocketConfig) => Promise<void>;
