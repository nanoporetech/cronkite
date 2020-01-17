# cronk-socketio-datastream



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description | Type                                                                | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------- | ----------------- | ----------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `acceptsFilters`  | `accepts-filters` |             | `boolean`                                                           | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `channels`        | --                |             | `IChannelShape[]`                                                   | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `responseHandler` | --                |             | `(data: IMetadataObj, streamState: ISocketConfig) => Promise<void>` | `async (     data: any,     streamConfig: CronkDataStream.ISocketConfig,   ) => {     const { channel, dispatch, filters, shape, filtered } = streamConfig;      let filteredData = await processValue(data, shape);      const canFilter = filtered !== undefined ? filtered : true;      if (canFilter && filters.length && Array.isArray(filteredData)) {       filteredData = filteredData.filter((datum: CronkDataStream.IMetadataObj) =>         filters.map(filter => filter(datum)).every(i => i),       );     }     this.cachedResponse[channel] = async () => dispatch(channel, this.hostEl, filteredData);     this.cachedResponse[channel]();   }` |
| `type`            | `type`            |             | `string`                                                            | `'data'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `url`             | `url`             |             | `null \| string`                                                    | `null`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |


## Methods

### `resendBroadcast() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
