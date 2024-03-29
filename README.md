# Cronkite - One __*helluva*__ reporter

## INTRODUCTION

Conkite is web component for rendering UI interfaces (`dashboards`) that have been defined in a JSON schema. Given a valid schema, cronkite will manage the rendering of UI and non-UI web components in a web page. These web components include:

1. Event emitters (sources of data)
2. Event consumers (listeners)
3. Web page tags to render including
    - style
    - layout
4. Event payload transforms
5. Mappings between payload transforms and tag attributes/props

## DEMO

https://nanoporetech.github.io/cronkite/

## [INSTALLING CRONKITE](./INSTALLING.md)

## COMPONENTS

### 1. ADDING HTML TAGS/ELEMENTS/WEB COMPONENTS

The most simple report would be one with a single component, no listeners and no data sources e.g:

```javascript
{
  "components": [
      {
          "element": "h1"
      }
  ],
  "streams" : []
}
```

would render...

`<h1></h1>`

> ### What's going on
>
> We define HTML elements to render in `components`. The JSON above will render a single `h1` element but you wouldn't see anything on the `dashboard` because we haven't added any data or text. If you inspect the page you will however notice an
`h1` tag has been written to the DOM.

<hr />

### 2. ADDING ATTRIBUTES TO TAGS

We will now add attributes to the h1 tag. Attributes are described in the JSON using the `@` prefix. We'll add the a `foo` and `innerHTML` attributes to the h1 tag below:

```javascript
{
    "components": [
        {
            "element": "h1",
            "@foo": "bar",
            "@innerHTML": "Hello world!"
        }
    ],
    "streams" : []
}
```

would render...

`<h1 foo="bar">Hello World!</h1>`

> ### What's going on
>
> Any key prefixed with the `@` symbol will be set as an `Element` prop on the tag and the value will be whatever is specified in the definition. Something special is happening with the `@innerHTML` attribute. `@innerHTML` is a prop that is native to any DOM Element objects (see [Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)). By setting this prop you are in fact interacting with the native DOM api for an Element and so the inner HTML content of the tag is set to whatever the values was. `@foo` is not a prop of `Element` and so is added to the tag as an attribute.

### 3. EVENT LISTENERS & EVENT PAYLOADS

In the example above `Hello World!` is a static value as it is hard coded as the text inside the h1 element. The value of any attribute (and hence the value of `@innerHTML` in the example above) can be extracted from the payload of any event. Cronkite wil handle any event provided it inherits from [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) such as `CustomEvent`. Events will usually carry a payload of data, and we can extract and transform values from these payloads using functions built into Cronkite. Pulling content out of complex JSON blobs is handled using the [JMESPath library](http://jmespath.org/) and spec. In order to reference the jmespath function in the `dashboard` JSON schema we use the following function reference:

```javascript
{
    "fn:jmespath": "<JMESPath goes here!!>"
}
```

So by way of example, lets display the `[clientX, clientY]` values of the mouse as it moves around over the UI. The corresponding JSON would look as follows:

```javascript
{
    "components": [
        {
            "element": "div",
            "@innerText": {
                "fn:jmespath": "[clientX, clientY]"
            },
            "listen": "mousemove"
        }
    ],
    "streams" : []
}
```
and would render...

`<div>123,456</div>`

and the X/Y coordinates would continue to change dynamically as the mouse is moved around



> ### What's going on
>
> Firstly, we set up a listener on the `element` using the `listen` attribute. The value set to the __event name__ that will be listened to (`mousemove` in this case). `mousemove` events are emitted when the mouse moves around the dashboard. Each `mousemove` event carries with it a payload of information including the `clientX` and `clientY` for example:

```javascript

// MouseMoveEvent payload
{
    "altKey": false,
    "bubbles": true,
    "cancelable": true,
    "clientX": 648,
    "clientY": 928,
    "layerX": 648,
    "layerY": 2194,
    // Many more attributes besides...
}

```

Using the jmespath `[clientX, clientY]` we pull out the clientX and clientY from the payload root cor current node `@` and project them into a new array containing both coordinates. NOTE: `[clientX, clientY]` and `[@.clientX, @.clientY]` are equivalent because both queries operate on the "current node" which is the event payload.

To demonstrate a more advanced JMESPath we could have set the `@innerText` value to `"Client X: NNN, Client Y: NNN"` with the following JMESPath expression:

```javascript
{
    "fn:jmespath": "format('Client X: ${0}, Client Y: ${1}', [clientX, clientY])"
}
```

Payloads can be arbitrarily nested and this is supported in the JMESPath spec.
We won't go into explaining the JMESPath above but if you're interested in finding out more then check out the [specification page](http://jmespath.org/specification.html).

#### 3.1 LISTENER OPTIONS

Listeners can optionally be fine tunes with options to window over event streams or debounce  busy streams. In the example above `mousemove` generates **LOADS** of events and hence payloads. We can do better that processing every payload by debouncing the stream. To do that the configuration can be changed to:

```javascript
{
    "components": [
        {
            "element": "div",
            "@innerText": {
                "fn:jmespath": "[clientX, clientY]"
            },
            "listen": {
              "stream": "mousemove",
              "debounce": 300,
              "cache": 1 // Not required as this is the default
            }
        }
    ],
    "streams" : []
}
```
> ### What's going on
>
> We're still listening to the `mousemove` event stream but now payloads are debounced to 300ms and although we've set the cache to 1 (the default) we could increase that number to collect a window of the last N `mousemove` payloads. This is particularly useful when you want to maintain a history of previous events as in the Socket.io demo.

<hr />

### 4. JMESPATH EXTENSIONS

In the example above we use the format function to generate a new string from a template and input source. This is one of many extensions to the JMESPath spec that are available in the expressions. JMESPath expressions in Cronkite include the [standard built-in functions from the spec](https://jmespath.org/specification.html#built-in-functions) as well as the following extra functions to help with payload reshaping:

#### LODASH EXTENSIONS TO JMESPATH EXPRESSIONS

All of lodash functions are included in JMESPath expressions and are prefixed with an `_` e.g:

to use `lodash.fromPairs()` you would write your expression like
```javascript
it('calls lodash.fromPairs with `_fromPairs` in JMESPath function expression', async () => {
    const returnValue = search('_fromPairs(@)', [
      ['a', 1],
      ['b', 2],
    ]);
    expect(returnValue).toStrictEqual({ a: 1, b: 2 });
  });

```
> This is caveated by the fact that some lodash functions require a predicate which is a function. These will obviously not work in JMESPath as there is no way to describe a function literal.

#### CRONKITE EXTENSIONS TO JMESPATH EXPRESSIONS

- `mean` - Calculate the mean of `Array<number>`
- `mode` - Calculate the mean of `Array<number>`
- `median` - Calculate the mean of `Array<number>`
- `toFixed` - Fixes the precision of a number to a given number decimals
- `formatNumber` - Formats numbers given a precision and unit
- `uniq` - De-duplicates a list of values
- `divide` - Divides two numbers
- `split` - Splits a string on a given pattern
- `entries` - Lists entries in a map
- `format` - Formats in put source given a template
- `flatMapValues` - Flatten objects into `Array<key,value>` where any iterable values are also decomposed
- `toUpperCase` - Upercase all characters in a string
- `toLowerCase` - Lowercase all characters in a string
- `trim` - Trim whitespace off the beginning and end of a string
- `groupBy` - Group an `Array<object>` on a key or expression
- `combine` - A better merge

### 5. PAYLOAD TRANSFORMS (JMESPath extensions)

You have already been introduced to your first payload transform `fn:jmespath` which fishes out values from any JSON blobs provided as a payload to `Event`. Transforms are `object` types and are identified by keys with the `fn:xxxxxx` prefix. The Cronkite transforms are provided as an escape hatch when the jmespath spec lacks operations necessary to reshape the payloads or perform unsupported operations. At the time of writing the following transforms were supported

```javascript
{
    "fn:average": // Calculate the average value for `number[]` (JMESPath spec see `avg` function)
    "fn:count": // Calculate the length of a `any[]` (JMESPath spec see `length` function)
    "fn:formatNumber": // Format a number with locale and units
    "fn:divide": // Divide two numbers and return the result
    "fn:mod": // Modulus two numbers and return the result
    "fn:jmespath": // Fish out values from Event payloads
    "fn:map": // Create a new object of key:value pairs
    "fn:mode": // Calculate the mode of a `number[]`
    "fn:round": // Round a number to the nearest whole
    "fn:sum": // Calculate the sum of a `number[]`
    "fn:toFixed": // Set the number of decimal values of a float
    "fn:uniq": // Create a unique list of values from `any[]`
}
```

<hr />

## STREAMS

Streams are a special type of component in that they __*do not*__ render any UI elements. They do however, emit events (usually `CustomEvent` types) with corresponding payloads that can be consumed by `components` via `listen` as described above.

There are (at the time of writing) two configurable data stream components available in Cronkite:
  1. [cronk-poll-datastream](src/components/cronk-poll-datastream/readme.md)


### 1. [cronk-poll-datastream](src/components/cronk-poll-datastream/readme.md)

The [cronk-poll-datastream](src/components/cronk-poll-datastream/readme.md) stream will abstract URL polling (via the fetch API) to any CORS enabled URL that returns an `application/json` response.

#### Parameterisation of the request

- `element` (required - `"cronk-poll-datastream"`)
- `@url` (required - CORS enabled remote resource returning JSON)
- `@channels` (optional - If a successful response is returned and no channels
    are defined then cronkite will emit the payload on a default stream called
    `cronkite:stream`)

    You are able to specify the name of the event(s) (stream) that payloads are delivered on as well as how payloads are shaped for each stream. You can use almost any event stream names and then Cronkite will attach listeners to UI components if they're defined correctly as was demonstrated above. In the example below event payloads are delivered on the `my:todos` event stream and one would expect (although not enforced) there to be a component with an `"@listen": "my:todos"` key:value in its JSON configuration.

- `@poll-frequency` (optional - default `15000`)

    Users can control the frequency with which to poll the URL for changes using the `@poll-frequency` attribute. Polling is useful in settings where source data is updating in real time. Responses are cached internally to the data stream which only makes new GET requests once changes are detected at the remote source. `@poll-frequency` is optional and set at 15sec (15000). In cases where polling is not required users can simulate single requests by setting `@poll-frequency` to a very large number like `1e10`

- `@acceptsFilters` (Optional - default `false`: Whether or not payloads emitted can be filtered by a custom function (discussed later))
- `@credentials` (Optional - default `"include"` can be set to `"include" | "omit" | "same-origin"`)

#### Example:

```javascript
"streams": [
    {
        "@channels": [
          {
            "channel": "my:todos"
          }
        ],
        "element": "cronk-poll-datastream",
        "@url": "https://jsonplaceholder.typicode.com/todos",
        "@poll-frequency": 25000
    }
]
```

> ### What's going on
>
> `element` specifies a web component [cronk-poll-datastream](src/components/cronk-poll-datastream/readme.md) that (in this case) abstracts the W3C fetch API. The component polls a URL provided by the user at regular intervals for JSON data. Successful responses are emitted as the payload to a `CustomEvent` object. The default event name is `cronkite:stream` although the user can specify a custom event name using the `@channels` attribute. In the example above, the url `https://jsonplaceholder.typicode.com/todos` will be polled every 25 seconds and the most recent successful response cached. On successful data fetch, the JSON response will be emitted as a `CustomEvent` with the event name set to `my:todos`.

<hr/>

## WEB COMPONENTS

Each component in the `components` block of the JSON specifies a single HTML tag in the `element` field. This will be rendered as a DOM element to which event handlers will be attached and attributes set. Apart from the standard set of HTML 5 tags a growing number of `Custom Elements` (web components) are being provided to help visualize more complex data. At the time of writing these include:

- [cronk-funnel](src/components/cronk-funnel/readme.md)
- [cronk-title](src/components/cronk-title/readme.md)
- [cronk-version](src/components/cronk-version/readme.md)
- [cronk-statsbox](src/components/cronk-statsbox/readme.md)
- [cronk-selector](src/components/cronk-selector/readme.md)
- `<epi-headlinevalue>`
- `<epi-coverageplot>`
- `<epi-donutsummary>`
- `<epi-checkmark>`

... as well as all of the web components in [Ionic 4](https://ionicframework.com/docs/components)

For information about the attributes available to set by the user see the [Storybook playground](https://metrichor-ui.git.oxfordnanolabs.local/component-storybook/?path=/story/epi2me-checkmark--default-configurable) where you can read documentation on the components and live-edit the values of attributes.

### The [cronk-selector](src/components/cronk-selector/readme.md) component

The [cronk-selector](src/components/cronk-selector/readme.md) component is a cronkite specific component that generates filter functions and attaches them to datastreams that are configures to accept filters with the `@acceptsFilters` prop. The [cronk-selector](src/components/cronk-selector/readme.md) component currently has the following configuration as illustrated in the full example below:

```javascript
{
  "element": "cronk-selector",
  "heading": "SELECT RUNID",
  "@selectList": {
    "fn:jmespath": "data.reads[?exit_status=='Classified'].{label: @.runid, select: @.runid, count: @._stats.count}"
  },
  "@selector": ["barcode"],
  "listen": "qctelemetry:basecalling1d:1"
}
```

> ### What's going on
>
> `element` specifies must be set to `"cronk-selector"` to use this component. In the example above the value of the `@selectList` attribute is set to a list of barcodes pulled out of event payload using JMESPath. A unique list of whatever is returned will be created by the component. The event listened to is `qctelemetry:basecalling1d:1`. Once the user makes a selection, a filter predicate (a closure containing the current selection) will be forwarded to all data streams which are configured to filter responses based on the `@selector` value. The `@acceptsFilters` prop is used to configure this for the datastream

<hr/>

## PUTTING IT ALL TOGETHER

Here's an full example of a [hello-world](./examples/reports/hello-world.json) report with layout defined including:

1. Static values
2. Components responding to DOM events
3. Conditional styling of components
4. Cronkite builtin functions
5. Polling datastream
6. JMESPath MAGIC!! ✨🌈🦄✨


```javascript
{
  "id": "hello:world",
  "components": [
    {
      "element": "epi-headlinevalue",
      "@label": "User defined values",
      "@value": "Hello World!"
    },
    {
      "element": "epi-headlinevalue",
      "@label": "Native DOM events",
      "@value": {
        "fn:jmespath": "join(`, `, [join(`Client X: `, [``, to_string(clientX)]), join(`Client Y: `, [``, to_string(clientY)])])"
      },
      "listen": "mousemove",
      "layout": {
        "width": 2
      }
    },
    {
      "element": "epi-checkmark",
      "@message": {
        "fn:jmespath": "(clientX>`500` && 'GREATER than 500px' || 'LESS than 500px') || 'Mouse position...'"
      },
      "@status": {
        "fn:jmespath": "clientX>`500` && `success` || `error`"
      },
      "@size": {
        "fn:divide": [
          {
            "fn:jmespath": "clientY"
          },
          4
        ]
      },
      "listen": "mousemove",
      "layout": {
        "width": 2
      }
    },
    {
      "element": "div",
      "style": {
        "backgroundColor": "#222"
      },
      "components": [
        {
          "element": "h1",
          "@innerHTML": "EUROPE PMC SEARCH RESULTS",
          "layout": {
            "position": "header"
          }
        },
        {
          "element": "epi-headlinevalue",
          "@value": {
            "fn:jmespath": "request.queryString"
          },
          "@label": "Query string",
          "listen": "hello:world:event"
        },
        {
          "element": "ol",
          "@innerHTML": {
            "fn:jmespath": "join(``, [].join(``,['<li><a href=\\'',@.id,'\\'>',@.title,'</a>']))"
          },
          "@label": "Query string",
          "listen": "hello:world:results"
        }
      ]
    }
  ],
  "streams": [
    {
      "element": "cronk-poll-datastream",
      "@url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=AUTH:%22Kulesha+E%22&format=json",
      "@poll-frequency": 25000,
      "@credentials": "omit",
      "@channels": [
        {
          "channel": "hello:world:event",
          "shape": {
            "fn:jmespath": "@"
          }
        },
        {
          "channel": "hello:world:results",
          "shape": {
            "fn:jmespath": "resultList.result"
          }
        }
      ]
    }
  ]
}

```