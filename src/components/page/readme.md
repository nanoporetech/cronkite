# cronk-page



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                            | Type                         | Default     |
| ------------------- | -------------------- | ------------------------------------------------------ | ---------------------------- | ----------- |
| `pageConfig`        | `page-config`        | Page configuration JSON                                | `ReportDefinition \| string` | `undefined` |
| `showConfig`        | `show-config`        | show or hide the configuration used to render the page | `boolean`                    | `false`     |
| `validationEnabled` | `validation-enabled` | enable/disable validation ot the cronkite schema       | `boolean`                    | `true`      |


## Events

| Event            | Description                                                                                                                                                      | Type                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `cronkPageReady` | broadcast to any listener (mostly datastreams) that the page has fully rendered and payloads should be rebroadcast to ensure the lated data is set on components | `CustomEvent<void>` |


## Methods

### `loadConfig(newConfig: any) => Promise<void>`

Load new page configuration JSON

#### Returns

Type: `Promise<void>`



### `validateConfig(configIn: any) => Promise<boolean>`

validate provided configuration JSON for a page

#### Returns

Type: `Promise<boolean>`




## Dependencies

### Used by

 - [cronk-app](../../views/cronk-app)

### Depends on

- [cronk-page-components](../page-components)
- [cronk-page-panel](../page-panel)
- [cronk-datastreams](../datastreams)

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
  cronk-app --> cronk-page
  style cronk-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
