# cronk-managed-datastream



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                     | Type                                                                             | Default            |
| ---------------- | ----------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| `acceptsFilters` | `accepts-filters` | Whether or not a datastream is affected by filters like cronk-selector          | `boolean`                                                                        | `false`            |
| `channels`       | --                | Channel configuration describing how broadcasts are constructed                 | `ChannelShape[]`                                                                 | `DEFAULT_CHANNELS` |
| `data`           | `data`            | Stream data source managed externally to component                              | `JSONValue[] \| boolean \| number \| string \| { [member: string]: JSONValue; }` | `null`             |
| `type`           | `type`            | sets class `cronk-${this.type}-eventstream` on cronk-managed-datastream element | `string`                                                                         | `'data'`           |


## Methods

### `addFilter(fnKey: string, filterFn: FilterFn) => Promise<void>`

Attach/add a new filter function to apply to members of a datastream

#### Returns

Type: `Promise<void>`



### `listFilters() => Promise<{}>`

List any filter functions applied to the data streams

#### Returns

Type: `Promise<{}>`



### `resendBroadcast() => Promise<void>`

Rebroadcast latest cached payload to on all configured channels

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
