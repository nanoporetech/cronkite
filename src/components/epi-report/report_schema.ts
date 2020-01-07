// tslint:disable: object-literal-sort-keys

export default {
  definitions: {
    channel: {
      type: 'object',
      additionalProperties: false,
      required: ['channel', 'shape'],
      properties: {
        channel: {
          type: 'string',
        },
        shape: {
          $ref: '#/definitions/componentProps',
        },
      },
    },
    componentArray: {
      $id: '#/definitions/componentArray',
      type: 'array',
      title: 'The Component Array Schema',
      items: {
        $ref: '#/definitions/component',
      },
    },
    component: {
      $id: '#/definitions/component',
      type: 'object',
      title: 'The Component Schema',
      required: ['element'],
      patternProperties: {
        '^@[a-z]+[A-Za-z]': {
          $ref: '#/definitions/componentProps',
        },
      },
      properties: {
        element: {
          $id: '#/definitions/component/properties/element',
          type: 'string',
          title: 'The Element Schema',
          default: '',
          examples: ['div', 'h1', 'epi-headlinevalue'],
          pattern: '^(.*)$',
        },
        listen: {
          $id: '#/definitions/component/properties/listen',
          type: 'string',
          title: 'The Listen Schema',
          minLength: 1,
          examples: ['mousemove'],
          pattern: '^\\w(.*)$',
        },
        style: {
          $id: '#/definitions/component/properties/style',
          type: 'object',
          title: 'The Style Schema',
          propertyNames: {
            pattern: '^[a-z][A-Za-z]*$',
          },
          additionalProperties: {
            type: ['string', 'number'],
          },
        },
        layout: {
          $id: '#/definitions/component/properties/layout',
          type: 'object',
          title: 'The Layout Schema',
          additionalProperties: false,
          properties: {
            width: {
              $id: '#/definitions/component/properties/layout/properties/width',
              type: 'integer',
              title: 'The Width Schema',
              minimum: 1,
              default: 4,
              examples: [4],
            },
            position: {
              $id: '#/definitions/component/properties/layout/properties/position',
              type: 'string',
              title: 'The Position Schema',
              enum: ['header', 'footer'],
              examples: ['header', 'footer'],
            },
          },
        },
        components: {
          $id: '#/definitions/component/properties/components',
          $ref: '#/definitions/componentArray',
        },
      },
    },
    datastream: {
      type: 'object',
      properties: {
        '@channels': {
          $id: '#/definitions/datastream/properties/@channels',
          type: 'array',
          title: 'The @channels Schema',
          items: {
            $ref: '#/definitions/channel',
          },
        },
        '@poll-frequency': {
          $id: '#/definitions/datastream/properties/@poll-frequency',
          type: 'integer',
          title: 'The @poll-frequency Schema',
          default: 15000,
          examples: [1000000000],
        },
        '@url': {
          $id: '#/definitions/datastream/properties/@url',
          type: 'string',
          title: 'The @url Schema',
          examples: ['https://example.com/example.json'],
          pattern: `^([a-zA-Z][a-zA-Z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-zA-Z0-9-._~!$&'()*+,;=:]|%[0-9a-fA-F]{2})*))(\\3)@)?(?=((?:\\[?(?:::[a-fA-F0-9]+(?::[a-fA-F0-9]+)?|(?:[a-fA-F0-9]+:)+(?::[a-fA-F0-9]+)+|(?:[a-fA-F0-9]+:)+(?::|(?:[a-fA-F0-9]+:?)*))\\]?)|(?:[a-zA-Z0-9-._~!$&'()*+,;=]|%[0-9a-fA-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-zA-Z0-9-._~!$&'()*+,;=:@\\/]|%[0-9a-fA-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-zA-Z0-9-._~!$&'()*+,;=:@\\/]|%[0-9a-fA-F]{2})*))\\10)?)(?:\\?(?=((?:[a-zA-Z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9a-fA-F]{2})*))\\11)?(?:#(?=((?:[a-zA-Z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9a-fA-F]{2})*))\\12)?$`,
        },
      },
    },
    componentProps: {
      oneOf: [
        {
          type: ['array', 'string'],
        },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            'fn:jmespath': {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            'fn:uniq': {
              $ref: '#/definitions/componentProps',
            },
            'fn:sum': {
              $ref: '#/definitions/componentProps',
            },
            'fn:round': {
              $ref: '#/definitions/componentProps',
            },
            'fn:count': {
              $ref: '#/definitions/componentProps',
            },
            'fn:average': {
              $ref: '#/definitions/componentProps',
            },
            'fn:tofixed': {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              items: [
                {
                  $ref: '#/definitions/componentProps',
                },
                {
                  type: 'integer',
                },
              ],
            },
            'fn:mode': {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              items: [
                {
                  $ref: '#/definitions/componentProps',
                },
                {
                  type: 'integer',
                },
              ],
            },
            'fn:formatNumber': {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: [
                {
                  $ref: '#/definitions/componentProps',
                },
                {
                  type: 'integer',
                },
                {
                  type: 'string',
                },
              ],
            },
            'fn:divide': {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              items: [
                {
                  type: 'object',
                  title: 'dividend',
                  oneOf: [
                    {
                      $ref: '#/definitions/componentProps',
                    },
                    {
                      type: 'integer',
                    },
                  ],
                },
                {
                  type: 'object',
                  title: 'divisor',
                  oneOf: [
                    {
                      $ref: '#/definitions/componentProps',
                    },
                    {
                      type: 'integer',
                    },
                  ],
                },
              ],
            },
            'fn:map': {
              type: 'array',
              items: [
                {
                  type: 'object',
                  required: ['name', 'value'],
                  properties: {
                    name: {
                      type: 'string',
                    },
                    value: {
                      $ref: '#/definitions/componentProps',
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://epi2me.io/report.json',
  type: 'object',
  title: 'Metrichor dashboard config schema',
  required: ['id', 'components', 'streams'],
  properties: {
    id: {
      $id: '#/properties/id',
      type: 'string',
      title: 'The Id Schema',
      default: '',
      examples: ['dashboard:workflow:instance:123456'],
      pattern: '^(.*)$',
    },
    components: {
      $id: '#/properties/components',
      $ref: '#/definitions/componentArray',
    },
    streams: {
      $id: '#/properties/streams',
      type: 'array',
      title: 'Dashboard data streams',
      items: {
        oneOf: [
          {
            type: 'object',
            required: ['element', '@url'],
            properties: {
              element: {
                type: 'string',
                title: 'Generic polling datastream',
                const: 'epi-poll-datastream',
              },
              '@url': {
                $ref: '#/definitions/datastream/properties/@url',
              },
              '@channels': {
                $ref: '#/definitions/datastream/properties/@channels',
              },
              '@poll-frequency': {
                $ref: '#/definitions/datastream/properties/@poll-frequency',
              },
            },
          },
          {
            type: 'object',
            required: ['element', '@flavour', '@type', '@id-workflow-instance'],
            properties: {
              '@flavour': {
                $id: '#/properties/streams/items/properties/@flavour',
                type: 'string',
                title: 'The @flavour Schema',
                default: '',
                examples: ['basecalling_1d_barcode-v1'],
                pattern: '^(.*)$',
              },
              '@type': {
                $id: '#/properties/streams/items/properties/@type',
                type: 'string',
                title: 'The @type Schema',
                default: '',
                examples: ['telemetry'],
                enum: ['telemetry', 'status'],
              },
              '@id-workflow-instance': {
                $id: '#/properties/streams/items/properties/@id-workflow-instance',
                type: ['string', 'number'],
                title: 'The @id-workflow-instance Schema',
                default: '',
                examples: ['123456', 234567],
                pattern: '^(\\d*)$',
              },
              element: {
                type: 'string',
                title: 'Workflow instance polling datastream',
                const: 'epi-workflow-instance-datastream',
              },
              '@channels': {
                $ref: '#/definitions/datastream/properties/@channels',
              },
              '@poll-frequency': {
                $ref: '#/definitions/datastream/properties/@poll-frequency',
              },
            },
          },
        ],
      },
    },
  },
};
