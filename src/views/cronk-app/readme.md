# cronk-app



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description       | Type     | Default         |
| -------- | --------- | ----------------- | -------- | --------------- |
| `report` | `report`  | Example file name | `string` | `'hello-world'` |


## Dependencies

### Depends on

- [cronk-page](../../components/page)

### Graph
```mermaid
graph TD;
  cronk-app --> cronk-page
  cronk-page --> cronk-page-components
  cronk-page --> cronk-page-panel
  cronk-page --> cronk-datastreams
  cronk-page-panel --> cronk-errormessage
  cronk-page-panel --> cronk-page-components
  cronk-page-panel --> cronk-page-panel
  cronk-datastreams --> cronk-event-stream
  style cronk-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
