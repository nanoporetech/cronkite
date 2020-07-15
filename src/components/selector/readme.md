# cronk-selector



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                 | Type                 | Default     |
| ------------------ | -------------------- | ----------------------------------------------------------- | -------------------- | ----------- |
| `heading`          | `heading`            | Custom heading for the selector                             | `string`             | `''`        |
| `label`            | `label`              | Label for each selectable - default 'COUNT'                 | `string`             | `'COUNT'`   |
| `minimumSelection` | `minimum-selection`  | Minimum number of selected members                          | `number`             | `0`         |
| `selectAllOnLoad`  | `select-all-on-load` | Should all selectable members be selected on initial render | `boolean`            | `true`      |
| `selectList`       | --                   | a list of selectable members {select, label, count}[]       | `SelectListMember[]` | `[]`        |
| `selector`         | `selector`           | a value that will be used to filter data streams by         | `any`                | `undefined` |


## Dependencies

### Depends on

- ion-item
- ion-checkbox
- ion-label
- ion-progress-bar

### Graph
```mermaid
graph TD;
  cronk-selector --> ion-item
  cronk-selector --> ion-checkbox
  cronk-selector --> ion-label
  cronk-selector --> ion-progress-bar
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style cronk-selector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
