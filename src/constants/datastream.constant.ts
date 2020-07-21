import type { ChannelShape } from '../types/datastreams.type';

export const DEFAULT_SHAPE = {
  'fn:jmespath': '@',
};
export const DEFAULT_CHANNEL = 'cronkite:stream';
export const DEFAULT_CHANNELS: ChannelShape[] = [
  {
    channel: DEFAULT_CHANNEL,
    shape: DEFAULT_SHAPE,
  },
];

export const RESPONSE_MIMETYPE = {
  csv: 'text/csv',
  json: 'application/json',
  text: 'text/plain',
  tsv: 'text/tab-separated-values',
};
