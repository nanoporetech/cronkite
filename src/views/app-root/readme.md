# app-root



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default         |
| -------- | --------- | ----------- | -------- | --------------- |
| `report` | `report`  |             | `string` | `'hello-world'` |


## Dependencies

### Depends on

- [cronk-page](../../components/cronk-page)

### Graph
```mermaid
graph TD;
  app-root --> cronk-page
  cronk-page --> cronk-datastreams
  cronk-datastreams --> cronk-event-stream
  style app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
