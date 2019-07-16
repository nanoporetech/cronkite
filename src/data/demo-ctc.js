/* eslint-disable no-template-curly-in-string */

export default {
    components: [
        {
            '@message': "$.data.*.mean_qscore_template.avg",
            element: "epi-checkmark",
            layout: {
                h: 21,
                i: "e1808092-4657-4999-ab5f-acc1e11bdb48",
                maxW: 24,
                minW: 1,
                moved: false,
                static: false,
                w: 8,
                x: 8,
                y: 0
            },
            listen: "datastream:telemetry"
        },
        {
            '@label': "Min Q Score",
            '@value': "$.data.*.mean_qscore_template.avg",
            element: "epi-headlinevalue",
            layout: {
                h: 8,
                i: "2016cc14-06f5-4fe2-a8d6-bcde3c39e22b",
                maxW: 24,
                minW: 1,
                moved: false,
                static: false,
                w: 5,
                x: 7,
                y: 21
            },
            listen: "datastream:telemetry"
        },
        {
            '@label': "Total reads",
            '@value': "$.data.*.count",
            element: "epi-headlinevalue",
            layout: {
                h: 8,
                i: "fa74ea8b-3cf1-4e71-a8b9-3993f82ca84b",
                maxW: 24,
                minW: 1,
                moved: false,
                static: false,
                w: 5,
                x: 12,
                y: 21
            },
            listen: "datastream:telemetry"
        },
        {
            '@data': "$.data.*.sequence_length_template.hist",
            '@label-x': "SEQUENCE LENGTH",
            '@label-x-left': "",
            '@label-x-right': "",
            '@label-y': "READ COUNT",
            '@tooltip-format-y': "value => `${value} reads`",
            '@units-y': "",
            element: "epi-coverageplot",
            layout: {
                h: 31,
                i: "0f4ca383-6d2d-40b2-962f-2317b3d7e238",
                maxW: 24,
                minW: 1,
                moved: false,
                static: false,
                w: 24,
                x: 0,
                y: 29
            },
            listen: "datastream:telemetry"
        }
    ],
    streams: [
        {
            flavour: "basecalling_1d_barcode-v1",
            type: "telemetry"
        }
    ]
}
