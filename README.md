# Cronkite - One __*hell*__ of a reporter

## INTRODUCTION

Conkite is a (sort of) UI framework for rendering UI interfaces (`dashboards`) that have been defined in a JSON schema. Basically, the JSON schema defines:

1. sources of data
2. HTML tags to render
4. Event listeners attached to the HTML element
3. How data from event payloads map to attributes on HTML elements


## COMPONENTS

### 1. ADDING HTML TAGS/ELEMENTS/WEB COMPONENTS

The most simple report would be one with a single component, no listeners and no data sources e.g:

```javascript
{
    "components": [
        {
            "element": "div"
        }
    ],
    "streams" : []
}
```

would render...

`<div></div>`

> ### What's going on
>
> We define HTML elements to render in `components`. The JSON above will render a single `div` element but you wouldn't see > anything on the `dashboard` because we haven't added and data of text.

<hr />

### 2. ADDING ATTRIBUTES TO TAGS

We will now add attributes to the div tag. Attributes are described in the JSON using the `@` prefix. We'll add the a `foo` attribute to the div tag below:

```javascript
{
    "components": [
        {
            "element": "div",
            "@foo": "bar"
        }
    ],
    "streams" : []
}
```

would render...

`<div foo="bar"></div>`

> ### What's going on
>
> Any key prefixed with the `@` symbol will be set as an attribute on the HTML tag. There is *ONE EXCEPTION*, that being the `@children` attribute. `@children` does not set an attribute but instead sets the `innerText` of the HTML tag for example:

```javascript
{
    "components": [
        {
            "element": "div",
            "@foo": "bar",
            "@children": "Hello world!"
        }
    ],
    "streams" : []
}
```

would render...

`<div foo="bar">Hello World</div>`

<hr />

### 3. EVENT LISTENERS & EVENT PAYLOADS

In the example above `Hello world!` is hard coded as the text inside the div element. The value of any attribute (and hence the value of `@children` in the example above) can be extracted from the payload of any event emitted on in the UI. The events can be anything that inherit from `Event` such as `CustomEvent`. Events will usually carry a payload of data, and we can extract and transform values from these payloads using functions built into Cronkite. Pulling content out of complex JSON blobs is handled using the [JMESPath library](http://jmespath.org/) and spec. In order to reference the jmespath function in the `dashboard` JSON schema we use the following function reference:

```javascript
{
    "fn:jmespath": "JMESPath goes here!!"
}
```

So by way of example, lets display the `[clientX, clientY]` values of the mouse as it moves around over the UI. The corresponding JSON would look as follows:

```javascript
{
    "components": [
        {
            "element": "div",
            "@foo": "bar",
            "@children": {
                "fn:jmespath": "[@.clientX, @.clientY]"
            },
            "listen": "mousemove"
        }
    ],
    "streams" : []
}
```
and would render...

`<div foo="bar">[123,456]</div>`

and the X/Y coordinates would continue to change dynamically as the mouse is moved around



> ### What's going on
>
> Firstly, we set up a listener on the `element` using the `listen` and the value set to the __event name__ that will be listened to (`mousemove` in this case). `mousemove` events are emitted and carry a payload of information including the `clientX` and `clientY` for example:

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

Using the jmespath `[@.clientX, @.clientY]` we pull out the clientX and clientY from the payload root `@` and project them into a new array containing both coordinates.

To demonstrate a more advanced JMESPath we could have set the `@children` value to `"Client X: NNN, Client Y: NNN"` with the following JMESPath config:

```javascript
{
    "fn:jmespath": "join(`, `, [join(`Client X: `, [``, to_string(clientX)]), join(`Client Y: `, [``, to_string(clientY)])])"
}
```

Payloads can be arbitrarily nested and this is supported in the JMESPath spec.
We won't go into explaining the JMESPath above but if you're interested in finding out more then check out the [specification page](http://jmespath.org/specification.html).

<hr />

### 4. PAYLOAD TRANSFORMS (BUILTIN FUNCTIONS)

You have already been introduced to your first payload transform `fn:jmespath` which fishes out values from any JSON blobs provided as a payload to `Event`. Transforms are `object` types are identified by keys with the `fn:xxxxxx` prefix. The Cronkite transforms are provided as an escape hatch when the jmespath spec is insufficient. At the time of writing the following transforms are supported

```javascript
{
    "fn:average": // Calculate the average value for `number[]` (JMESPath spec see `avg` function)
    "fn:count": // Calculate the length of a `any[]` (JMESPath spec see `length` function)
    "fn:formatNumber": // Format a number with locale and units
    "fn:jmespath": // Fish out values from Event payloads
    "fn:map": // Create a new object of key:value pairs
    "fn:mode": // Calculate the mode of a `number[]`
    "fn:round": // Round a number to the nearest whole
    "fn:sum": // Calculate the sum of a `number[]`
    "fn:tofixed": // Set the number of decimal values of a float
    "fn:uniq": // Create a unique list of values from `any[]`
}
```

<hr />

## STREAMS

Streams are a special type of component in that they __*do not*__ render any UI elements. They do however, emit events with corresponding payloads that can be consumed by `components` via `listen` as described above.

There are (at the time of writing) two configurable data stream components available in the Cronkite framework.

### 1. `epi-poll-datastream`

The `epi-poll-datastream` stream will abstract URL polling (via the fetch API) to any CORS enabled URL that returns an `application/json` response.

#### Parameterisation of the request

- `element` (required - `"epi-poll-datastream"`)
- `@url` (required - CORS enabled remote resource returning JSON)
- `@channel` (optional - default `"epi2me:stream"`)

    Users are able to specify the name of the event (stream) that payloads are delivered on. If no `@channel` is provided then payloads are delivered on a default event stream called `epi2me:stream`. This could cause problems if multiple polling data streams are configured that deliver different payloads on the same event stream. Users are therefore able to specify their own event stream names and then attach listeners to UI components as demonstrated above. In the example below event payloads are delivered on the `my:todos` event stream and one would expect (although not enforced) there to be a component with `"@listen": "my:todos"` in its JSON configuration.

- `@poll-frequency` (optional - default `15000`)

    Users can control the frequency with which to poll the URL for changes using the `@poll-frequency` attribute. Polling is useful in settings where source data is updating in real time. Responses are cached internally to the data stream which only makes new GET requests once changes are detected at the remote source. `@poll-frequency` is optional and set at 15sec (15000). In cases where polling is not required users can simulate single requests by setting `@poll-frequency` to a very large number like `1e10`

#### Example:

```javascript
"streams": [
    {
        "@channel": "my:todos",
        "element": "epi-poll-datastream",
        "@url": "https://jsonplaceholder.typicode.com/todos",
        "@poll-frequency": 25000
    }
]
```

> ### What's going on
>
> `element` specifies a web component `epi-poll-datastream` that (in this case) that abstracts the W3C fetch API, and which polls a URL provided by the user for JSON data. Successful responses are emitted as the payload to a `CustomEvent` object. The default event name is `epi2me:stream` although the user can specify a custom event name using the `@channel` attribute. In the example above, the url `https://jsonplaceholder.typicode.com/todos` will be polled every 25 seconds and the most recent  successful response cached. On successful data fetch, the JSON response will be emitted as a `CustomEvent` with the event name set to `my:todos`.

<hr/>

### 2. `epi-workflow-instance-datastream`

This datastream inherits from the `epi-poll-datastream` and inherits all `@attributes` __*except*__ `@url`. It is specialised at retrieval of workflow instance data. This is primarily due to a number of HTTP response transforms that augment workflow instance telemetry. Much of the implementation detail is abstracted away from the user with two attributes namely `@type` and `@flavour`. More information can be found ain the [git repository](https://git.oxfordnanolabs.local/metrichor-ui/components/datastream) for the datastream component. In the JSON schema it is implemented as follows:

#### Parameterisation of the request

- `element` (required - `"epi-workflow-instance-datastream"`)
- `@type` (required - `"telemetry" | "status"` specific types of instance data)
- `@flavour` (required - if `@type == "telemetry"` then this will be the name of the file output by the telemetry aggregation)
- `@id-workflow-instance` (required - Workflow instance ID)
- `@channel` (optional - `"instance:telemetry:"`)

    Users are able to specify the prefix to the name of the event (stream) that payloads are delivered on. If no `@channel` is provided then payloads are delivered on a default event stream with a name that is composed of the various bits of information provided for the QC reports this would be something like `instance:telemetry:basecalling1d:1`. The event name is created dynamically by concatenating the following with the `":"` character:

    - `@channel` | `"instance:telemetry"`
    - `<RESPONSE JSON>.type`
    - `<RESPONSE JSON>.version`

#### Example:

```javascript
"streams": [
    {
      "@channel": "qctelemetry",
      "element": "epi-workflow-instance-datastream",
      "@id-workflow-instance": 123456,
      "@flavour": "simple_aligner_barcode_compact_quick-v1",
      "@poll-frequency": 25000,
      "@type": "telemetry"
    }
]
```

> ### What's going on
>
> `element` specifies the special workflow instance datastream web component `epi-workflow-instance-datastream`. In the example above the `telemetry` JSON is being polled every 25 seconds (the assumption is that there will be an aggregated telemetry file for the instance ending in `simple_aligner_barcode_compact_quick-v1.json`). On successful retrieval of telemtry data, a flattened telemetry JSON will be emitted as a `CustomEvent` with the event name set to `qctelemetry:basecalling1d:1`.

<hr/>

## WEB COMPONENTS

Each component in the `components` block of the JSON specifies a single HTML tag in the `element` field. This will be rendered as a DOM element to which event handlers will be attached and attributes set. Apart from the standard set of HTML 5 tags a growing number of `Custom Elements` (web components) are being provided to help visualize more complex data. At the time of writing these include:

- `<epi-headlinevalue>`
- `<epi-coverageplot>`
- `<epi-donutsummary>`
- `<epi-checkmark>`

For information about the attributes available to set by the user see the [Storybook playground](https://metrichor-ui.git.oxfordnanolabs.local/component-storybook/?path=/story/epi2me-checkmark--default-configurable) where you can read documentation on the components and live-edit the values of attributes.

## PUTTING IT ALL TOGETHER

Here's an full example of a basic QC report with layout defined including:

1. Native DOM event listeners
2. Workflow instance data stream for aggregated telemetry
3. Polling data stream for workflow instance data (could be any URL)
4. JMESPath MAGIC!! ✨🌈🦄✨


```javascript
{
  "id": "dashboard:workflow:instance:163492",
  "components": [
    {
      "element": "epi-headlinevalue",
      "@label": "NativeDOMevents",
      "@value": {
        "fn:jmespath": "[@.clientX,@.clientY]"
      },
      "listen": "mousemove",
      "layout": {
        "w": 4,
        "h": 2,
        "x": 0,
        "y": 0,
        "i": "6231ec98-fad4-4c84-89b2-003b393dc589",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Instance ID",
      "@value": {
        "fn:jmespath": "data.id_workflow_instance"
      },
      "element": "epi-headlinevalue",
      "listen": "instance:data",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 0,
        "y": 2,
        "i": "db20beef-8e92-4959-8e22-cf41b43ee44f",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Workflow state",
      "@value": {
        "fn:jmespath": "data.state"
      },
      "element": "epi-headlinevalue",
      "listen": "instance:data",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 2,
        "y": 2,
        "i": "c261ac02-e2c8-4459-a279-1d111ff81069",
        "moved": false,
        "static": false
      }
    },
    {
      "@selectList": {
        "fn:uniq": {
          "fn:jmespath": "data[? @.exit_status == 'Workflow successful'].run_id"
        }
      },
      "@selector": "run_id",
      "element": "Selector",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 2,
        "h": 2,
        "x": 0,
        "y": 3,
        "i": "7c561107-ae27-44fa-84ae-2f90df60b410",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Average Sequence length",
      "@value": {
        "fn:tofixed": [
          {
            "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].seqlen.avg)"
          },
          0
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 1,
        "h": 1,
        "x": 2,
        "y": 3,
        "i": "92b0b9b3-5fb4-40c6-b0dc-732df2290fb2",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "AVERAGE QUALITY SCORE",
      "@value": {
        "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].mean_qscore.avg)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 1,
        "h": 1,
        "x": 3,
        "y": 4,
        "i": "4a0cb4fe-57ce-488b-81e8-783f664fd30d",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "TOTAL YIELD",
      "@case-sensitive": "true",
      "@value": {
        "fn:formatNumber": [
          {
            "fn:jmespath": "sum(data[? @.exit_status == 'Workflow successful'].seqlen.total)"
          },
          2,
          "base"
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 1,
        "h": 1,
        "x": 3,
        "y": 3,
        "i": "da0c14bd-52e4-4de0-b6ae-30bbeb760fc2",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "READS ANALYSED",
      "@value": {
        "fn:jmespath": "sum(data[? @.exit_status == 'Workflow successful'].count)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 1,
        "h": 1,
        "x": 2,
        "y": 4,
        "i": "10b063a1-a08a-4bcd-9e79-ecdec73a495b",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Mode",
      "@value": {
        "fn:mode": [
          {
            "fn:jmespath": "data[? @.exit_status == 'Workflow successful'].mean_qscore.avg"
          },
          2
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 0,
        "y": 5,
        "i": "8f534c78-0855-4b98-9e6b-8fbbb48ad3f9",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Average",
      "@value": {
        "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].mean_qscore.avg)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 2,
        "y": 5,
        "i": "52b31750-bba6-490f-aa3e-c2b1775d6708",
        "moved": false,
        "static": false
      }
    },
    {
      "@label-x": "Quality score",
      "@label-y": "Read Count",
      "@units-y": "",
      "@units-x": "",
      "@tooltip-format-x": "value => `${value}`",
      "@tooltip-format-y": "value => `${value} reads`",
      "@label-x-left": "",
      "@label-x-right": "",
      "@data": {
        "fn:jmespath": "sort_by(data[? @.exit_status == 'Workflow successful'].mean_qscore.hist[].{x: @[0], y: @[1]}, &x)"
      },
      "element": "epi-coverageplot",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 4,
        "h": 4,
        "x": 0,
        "y": 6,
        "i": "232ce690-6c7d-4294-ab58-88149036efdd",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Sequence Length Mode",
      "@case-sensitive": "true",
      "@value": {
        "fn:formatNumber": [
          {
            "fn:mode": [
              {
                "fn:jmespath": "data[? @.exit_status == 'Workflow successful'].seqlen.avg"
              },
              2
            ]
          },
          0,
          "base"
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 2,
        "y": 10,
        "i": "dc966885-1373-49e0-9079-85381d160276",
        "moved": false,
        "static": false
      }
    },
    {
      "@label": "Sequence Length Average",
      "@value": {
        "fn:tofixed": [
          {
            "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].seqlen.avg)"
          },
          0
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 2,
        "h": 1,
        "x": 0,
        "y": 10,
        "i": "85ff20bd-a2dc-4723-b71a-6f937d091330",
        "moved": false,
        "static": false
      }
    },
    {
      "@label-x": "Sequence Length (bases)",
      "@label-y": "Read Count",
      "@units-y": "",
      "@units-x": "",
      "@tooltip-format-x": "value => `${value} bases`",
      "@tooltip-format-y": "value => `${value} reads`",
      "@label-x-left": "",
      "@label-x-right": "",
      "@data": {
        "fn:jmespath": "sort_by(data[? @.exit_status == 'Workflow successful'].seqlen.hist[].{x: @[0], y: @[1]}, &x)"
      },
      "element": "epi-coverageplot",
      "listen": "qctelemetry:basecalling1d:1",
      "layout": {
        "w": 4,
        "h": 4,
        "x": 0,
        "y": 11,
        "i": "e2325eee-a028-4ff6-8e2d-15b050d78c31",
        "moved": false,
        "static": false
      }
    }
  ],
  "streams": [
    {
      "@channel": "instance:data",
      "element": "epi-poll-datastream",
      "@url": "https://epi2me-dev.nanoporetech.com/workflow_instance/163492.json",
      "@poll-frequency": 1000000000
    },
    {
      "@channel": "qctelemetry",
      "element": "epi-workflow-instance-datastream",
      "@id-workflow-instance": "163492",
      "@flavour": "basecalling_1d_barcode-v1",
      "@poll-frequency": 25000,
      "@type": "telemetry"
    }
  ]
}
```

