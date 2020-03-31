# Using Cronkite in your project

Since Cronkite (`<cronk-page />` web component) is nothing more than a Stencil component you can get all the information about how to integrate it into your project [here](https://stenciljs.com/docs/overview) where framework integrations are discussed. Otherwise continue reading to see specific worked examples.


## Installation

Install from NPM (https://www.npmjs.com)

```sh
npm i @metrichor/cronkite
```

---

## Framework integrations

### React

With an application built using the `create-react-app` script the easiest way to include the component library is to call `defineCustomElements(window)` from the `index.js` file.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// cronkite is the name of our made up Web Component that we have
// published to npm:
import { defineCustomElements } from '@metrichor/cronkite/dist/loader';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
defineCustomElements(window);
```

This will create a custom tag in scope of the React app and so can be used like a normal tag in the JSX

```javascript
import React from 'react';

export default () => <cronk-page />;
```

### A Note on `pageConfig` prop

Cronkite config is a JSON/JS object and is set directly on the DOM element as a JS object i.e:

```javascript
document.querySelector('cronk-page').pageConfig = {
    components: [
        {
            element: "h1",
            "@innerText": "Hello world!"
        }
    ],
    streams : []
}
```

---

### Stencil

Using cronkite in other stencil components is as easy as

#### loading the page config

```javascript
import '@metrichor/cronkite'
```

and then in the render function you can use it as normal

```javascript

render() {
  return (
    <div>
      <cronk-page pageConfig={YOUR_CONFIG_HERE}></cronk-page>
    </div>
  )
}

```

---

### Javascript

#### loading the component from `unpkg`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://unpkg.com/@metrichor/cronkite/dist/cronkite/cronkite.js"></script>
</head>
<body>
  <cronk-page></cronk-page>
</body>
</html>
```

#### loading the page config

```html
<cronk-page></cronk-page>
<script>
  const cronkEl = document.querySelector('cronk-page');
  cronkEl.pageConfig = {...YOUR_CONFIG_HERE};
</script>
```

---
