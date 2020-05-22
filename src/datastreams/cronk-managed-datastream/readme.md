# cronk-managed-datastream



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                                                                     | Default            |
| ---------------- | ----------------- | ----------- | ---------------------------------------------------------------------------------------- | ------------------ |
| `acceptsFilters` | `accepts-filters` |             | `boolean`                                                                                | `false`            |
| `channels`       | --                |             | `IChannelShape[]`                                                                        | `DEFAULT_CHANNELS` |
| `data`           | `data`            |             | `JSONValue[] \| boolean \| null \| number \| string \| { [member: string]: JSONValue; }` | `null`             |
| `type`           | `type`            |             | `string`                                                                                 | `'data'`           |


## Methods

### `addFilter(fnKey: string, filterFn: CronkDataStream.IFilterFn) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `listFilters() => Promise<{}>`



#### Returns

Type: `Promise<{}>`



### `resendBroadcast() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
