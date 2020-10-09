import { JSONObject } from './json.type';

export interface ReportDefinition {
  id: string;
  components: ComponentConfig[];
  streams: Stream[];
}

export interface Stream {
  element: string;
  '@url': string;
  '@channels': Channel[];
}

export interface Channel {
  channel: string;
  shape: JMESPathFn;
}

export interface ComponentConfig extends JSONObject {
  element: string;
  layout?: Layout;
  listen?: string;
  style?: Style;
  components?: ComponentConfig[];
  heading?: string;
  [attribute: string]: ValueFn | any;
}

export type JMESPathNumber = JMESPathFn | number;

export type ValueFn =
  | SumFn
  | DivideFn
  | FormatNumberFn
  | ToFixedFn
  | ModeFn
  | UniqFn
  | MapFn
  | RoundFn
  | CountFn
  | AverageFn
  | JMESPathFn;

export interface SumFn {
  'fn:sum': [JMESPathNumber, JMESPathNumber];
}
export interface DivideFn {
  'fn:divide': [JMESPathNumber, JMESPathNumber];
}
export interface FormatNumberFn {
  'fn:formatNumber': [JMESPathNumber, number, string];
}
export interface ToFixedFn {
  'fn:toFixed': [JMESPathNumber, number];
}
export interface ModeFn {
  'fn:mode': [JMESPathNumber, number];
}
export interface UniqFn {
  'fn:uniq': ValueFn;
}
export interface MapFn {
  'fn:map': { [member: string]: ValueFn }[];
}
export interface RoundFn {
  'fn:round': JMESPathNumber;
}
export interface CountFn {
  'fn:count': JMESPathFn;
}
export interface AverageFn {
  'fn:average': JMESPathFn;
}

export interface JMESPathFn {
  'fn:jmespath': string;
}

export interface Style {
  [cssAttribute: string]: string | number;
}

export interface Layout {
  position?: string;
  width?: number;
}
