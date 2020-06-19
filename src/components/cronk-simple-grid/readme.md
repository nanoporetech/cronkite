# cronk-simple-grid



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                               | Default  |
| -------------- | --------------- | ----------- | -------------------------------------------------- | -------- |
| `batchSize`    | `batch-size`    |             | `number`                                           | `50`     |
| `data`         | --              |             | `any[]`                                            | `[]`     |
| `display`      | `display`       |             | `"auto" or "grid"`                                 | `'auto'` |
| `headerColour` | `header-colour` |             | `"dark" or "primary" or "secondary" or "tertiary"` | `'dark'` |
| `headers`      | --              |             | `string[]`                                         | `[]`     |
| `rows`         | `rows`          |             | `number`                                           | `10`     |
| `sort`         | --              |             | `[number, string][] or null`                       | `null`   |


## Methods

### `appendItems() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- ion-content
- ion-infinite-scroll
- ion-infinite-scroll-content

### Graph
```mermaid
graph TD;
  cronk-simple-grid --> ion-content
  cronk-simple-grid --> ion-infinite-scroll
  cronk-simple-grid --> ion-infinite-scroll-content
  ion-infinite-scroll-content --> ion-spinner
  style cronk-simple-grid fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
