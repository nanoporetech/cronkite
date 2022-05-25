import { Dictionary, Index, JSONObject, JSONValue, Optional } from 'ts-runtime-typecheck';

export interface ReportDefinition extends JSONObject {
  id: Index;
  components: ComponentConfig[];
  streams: Stream[];
}

export interface HTMLDatastreamElement extends Element {
  resendBroadcast?: () => Promise<void>;
}

export type PropTag = `@${string}`;

export type FunctionTag = `fn:${string}`;

export interface Stream extends JSONObject {
  element: string;
  '@channels': Channel[];
  '@responseFormat'?: Optional<'json' | 'csv' | 'tsv' | 'text'>;
  '@acceptsFilters'?: Optional<boolean>;
  '@mode'?: Optional<string>;
  '@url'?: Optional<string>;
  [other: string]: JSONValue | Channel[];
}

export interface EventStream extends JSONObject {
  stream: string;
  debounce: number;
  cache: number;
}

export interface Channel extends JSONObject {
  channel: string;
  shape: JMESPathFn;
  filtered?: Optional<boolean>;
  listen?: Optional<string>;
}

export interface Layout extends JSONObject {
  position?: Optional<'header' | 'footer'>;
  width?: Optional<number>;
}

export type ComponentProps = Exclude<JSONValue, JSONObject> | TransformFn;

export interface ComponentConfig extends JSONObject {
  element: string;
  layout?: Optional<Layout>;
  listen?: Optional<string | EventStream>;
  style?: Optional<Dictionary<Index>>;
  components?: Optional<ComponentConfig[]>;
  heading?: Optional<string>;
  when?: Optional<JMESPathFn>;
  [param: string]: JSONValue;
}

export type JMESPathOrNumber = JMESPathFn | number;

export type TransformFn = FormatNumberFn | JMESPathFn;
export interface FormatNumberFn {
  'fn:formatNumber': [JMESPathOrNumber, number, string];
}
export interface JMESPathFn extends JSONObject {
  'fn:jmespath': string;
}
