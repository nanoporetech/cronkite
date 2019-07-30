/* eslint-disable no-template-curly-in-string */

// const idWorkflowInstance = 207139;
// const idWorkflowInstance = 207024;
const idWorkflowInstance = 207357;

export default {
  "id": `dashboard:workflow:instance:${idWorkflowInstance}`,
  "components": [
    {
      "@selectList": {
        "fn:uniq": {
          "fn:jmespath": "data[? @.exit_status == 'Workflow successful'].run_id"
        }
      },
      "@selector": "run_id",
      "element": "Selector",
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
    },
    {
      "@label": "AVERAGE QUALITY SCORE",
      "@value": {
        "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].mean_qscore.avg)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1"
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
          'base'
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1"
    },
    {
      "@label": "READS ANALYSED",
      "@value": {
        "fn:jmespath": "sum(data[? @.exit_status == 'Workflow successful'].count)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
    },
    {
      "@label": "Average",
      "@value": {
        "fn:jmespath": "avg(data[? @.exit_status == 'Workflow successful'].mean_qscore.avg)"
      },
      "element": "epi-headlinevalue",
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
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
      "listen": "qctelemetry:basecalling1d:1"
    }
  ],
  "streams": [
    {
      "@channel": "qctelemetry",
      "element": "epi-workflow-instance-datastream",
      "@id-workflow-instance": idWorkflowInstance,
      "@flavour": "basecalling_1d_barcode-v1",
      "@poll-frequency": 25000,
      "@type": "telemetry",
      "@credentials": "omit"
    }
  ]
}