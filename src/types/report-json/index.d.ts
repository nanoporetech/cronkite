declare namespace ReportJSONTypes {
  type JSONPrimitive = string | number | boolean | null;
  type JSONValue = JSONPrimitive | JSONObject | JSONArray;
  interface JSONObject {
    [member: string]: JSONValue;
  }
  type JSONArray = JSONValue[];

  interface ReportDefinition {
    id: string;
    components: Component[];
    streams: Stream[];
  }

  interface Stream extends JSONObject {
    element: string;
    '@url': string;
    '@channels': Channel[];
  }

  interface Channel {
    channel: string;
    shape: StatsList;
  }

  interface Component extends JSONObject {
    element: string;
    layout?: Layout;
    listen?: string;
    style?: Style;
    components?: Component[];
    heading?: string;
    [attribute: string]: Value;
  }

  type JMESPathNumber = JMESPath | number;

  interface Value extends JSONValue {
    'fn:sum'?: [JMESPathNumber, JMESPathNumber];
    'fn:divide'?: [JMESPathNumber, JMESPathNumber];
    'fn:formatNumber'?: [JMESPathNumber, number, string];
    'fn:toFixed'?: [JMESPathNumber, number];
    'fn:mode'?: [JMESPathNumber, number];
    'fn:uniq'?: Value;
    'fn:map'?: { [member: string]: Value }[];
    'fn:round'?: JMESPathNumber;
    'fn:count'?: JMESPath;
    'fn:average'?: JMESPath;
  }

  interface JMESPath {
    'fn:jmespath'?: string;
  }

  interface Style {
    [cssAttribute: string]: string | number;
  }

  interface Layout {
    position?: string;
    width?: number;
  }
}

export { ReportJSONTypes as CronkJSONTypes };

