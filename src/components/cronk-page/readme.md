# cronk-page



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type                            | Default     |
| ------------ | ------------- | ----------- | ------------------------------- | ----------- |
| `pageConfig` | --            |             | `ReportDefinition \| undefined` | `undefined` |
| `showConfig` | `show-config` |             | `boolean`                       | `false`     |


## Events

| Event            | Description | Type                |
| ---------------- | ----------- | ------------------- |
| `cronkPageReady` |             | `CustomEvent<void>` |


## Methods

### `loadConfig(newConfig: any) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `validateConfig(configIn: any) => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Used by

 - [app-root](../../views/app-root)

### Depends on

- [cronk-page-components](../cronk-page-components)
- [cronk-page-panel](../cronk-page-panel)
- [cronk-datastreams](../cronk-datastreams)

### Graph
```mermaid
graph TD;
  cronk-page --> cronk-page-components
  cronk-page --> cronk-page-panel
  cronk-page --> cronk-datastreams
  cronk-page-panel --> cronk-errormessage
  cronk-page-panel --> cronk-page-components
  cronk-page-panel --> cronk-page-panel
  cronk-datastreams --> cronk-event-stream
  app-root --> cronk-page
  style cronk-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
