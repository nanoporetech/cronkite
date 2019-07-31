# Cronkite - One __*hell*__ of a reporter

## Introduction

Conkite is a (sort of) UI framework for rendering UI interfaces (`dashboards`) that have been defined in a JSON schema. Basically, the JSON schema defines:

1. sources of data
2. HTML tags to render
4. Event listeners attached to the HTML element
3. How data from event payloads map to attributes on HTML elements


## Design

### Components

#### 1. ADDING HTML TAGS/ELEMENTS/WEB COMPONENTS

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

> #### What's going on
>
> We define HTML elements to render in `components`. The JSON above will render a single `div` element but you wouldn't see > anything on the `dashboard` because we haven't added and data of text.

<hr />

#### 2. ADDING ATTRIBUTES TO TAGS

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

> #### What's going on
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

#### 3. EVENT LISTENERS PAYLOAD TRANSFORMS

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



> #### What's going on
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

