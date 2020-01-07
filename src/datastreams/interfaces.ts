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

export interface IStreamConfig {
  channels: IChannelShape[];
  dispatch: IDatastreamEventDispatcher;
  filters: ((datum: any) => boolean)[];
  type: string;
}

export interface ISocketConfig {
  channel: string;
  dispatch: IDatastreamEventDispatcher;
  filters: ((datum: any) => boolean)[];
  shape: any;
  filtered?: boolean;
}

export type IDatastreamResponseHandler = (data: IMetadataObj, streamState: IStreamConfig) => Promise<void>;
export type IDatastreamSocketResponseHandler = (data: IMetadataObj, streamState: ISocketConfig) => Promise<void>;
