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
  shape: any;
}

export interface IMetadataObj {
  [key: string]: any;
}

export type IDatastreamEventDispatcher = (eventName: string, node: HTMLElement, payload: IMetadataObj) => Promise<void>;

export interface IStreamConfig {
  channel: string;
  channels: IChannelShape[];
  dispatch: IDatastreamEventDispatcher;
  filters: ((datum: any) => boolean)[];
  type: string;
}

export type IDatastreamResponseHandler = (data: IMetadataObj, streamState: IStreamConfig) => Promise<void>;
