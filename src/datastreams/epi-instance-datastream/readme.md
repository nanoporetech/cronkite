# epi-instance-datastream



<!-- Auto Generated Below -->


## Properties

| Property                          | Attribute              | Description | Type                                                 | Default              |
| --------------------------------- | ---------------------- | ----------- | ---------------------------------------------------- | -------------------- |
| `channel`                         | `channel`              |             | `string`                                             | `'instance:default'` |
| `credentials`                     | `credentials`          |             | `"include" or "omit" or "same-origin"`               | `'include'`          |
| `flavour` _(required)_            | `flavour`              |             | `string`                                             | `undefined`          |
| `idWorkflowInstance` _(required)_ | `id-workflow-instance` |             | `number or string`                                   | `undefined`          |
| `mode`                            | `mode`                 |             | `"cors" or "navigate" or "no-cors" or "same-origin"` | `'cors'`             |
| `pollFrequency`                   | `poll-frequency`       |             | `number`                                             | `15000`              |
| `type`                            | `type`                 |             | `string`                                             | `'default'`          |


## Dependencies

### Depends on

- [cronk-poll-datastream](../cronk-poll-datastream)

### Graph
```mermaid
graph TD;
  epi-instance-datastream --> cronk-poll-datastream
  style epi-instance-datastream fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
