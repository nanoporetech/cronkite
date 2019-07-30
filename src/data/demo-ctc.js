/* eslint-disable no-template-curly-in-string */

// const idWorkflowInstance = 207139;
// const idWorkflowInstance = 207024;
// const idWorkflowInstance = 207357;
const idWorkflowInstance = 207912;

export default {
    "id": `dashboard:workflow:instance:${idWorkflowInstance}`,
    "components": [
        {
            "@message": {
                "fn:jmespath": "avg(data[].mean_qscore.avg)"
            },
            "element": "epi-checkmark",
            "listen": "instance:telemetry:basecalling1d:1"
        },
        {
            "@label": "Min Q-score",
            "@value": {
                "fn:jmespath": "avg(data[].mean_qscore.avg)"
            },
            "element": "epi-headlinevalue",
            "listen": "instance:telemetry:basecalling1d:1"
        },
        {
            "@label": "Total reads",
            "@value": {
                "fn:jmespath": "sum(data[].count)"
            },
            "element": "epi-headlinevalue",
            "listen": "instance:telemetry:basecalling1d:1"
        },
        {
            "@data": {
                "fn:jmespath": "sort_by(data[? exit_status == 'Workflow successful'][].seqlen.hist[].{x: @[0], y: @[1]}, &x)"
            },
            "@label-x": "SEQUENCE LENGTH",
            "@label-x-left": "",
            "@label-x-right": "",
            "@label-y": "READ COUNT",
            "@tooltip-format-y": "value => `${value} reads`",
            "@units-y": "",
            "element": "epi-coverageplot",
            "listen": "instance:telemetry:basecalling1d:1"
        }
    ],
    "streams": [
        {
            "@broadcast": "telemetry:qc",
            "@id-workflow-instance": idWorkflowInstance,
            "element": "epi-workflow-instance-datastream",
            "@flavour": "basecalling_1d_barcode-v1",
            "@poll-frequency": 25000,
            "@type": "telemetry",
            "@credentials": "omit"
        },
    ]
}
