/* eslint-disable no-template-curly-in-string */

// const idWorkflowInstance = 207139;
// const idWorkflowInstance = 207024;
// const idWorkflowInstance = 207357;
const idWorkflowInstance = 207912;

export default {
  "id": `dashboard:workflow:instance:${idWorkflowInstance}`,
  "components": [
    {
      "@label-x": "ALIGNMENT ACCURACY (%)",
      "@label-y": "COUNT",
      "@units-y": "",
      "@units-x": "%",
      "@tooltip-format-x": "value => `${value}%`",
      "@tooltip-format-y": "value => `${value} reads`",
      "@label-x-left": "",
      "@label-x-right": "",
      "@data": {
        "fn:jmespath": "barcodes[].payload[? exit_status == 'Workflow successful'][].accuracy.hist[].{x: @[0], y: @[1]}"
      },
      "element": "epi-coverageplot",
      "listen": "instance:telemetry:alignment-ecoli:1:barcodes"
    },
    {
      "@data": {
        "fn:jmespath": "sort_by(barcodes[].payload[? exit_status == 'Workflow successful'][].mean_qscore.hist[].{x: @[0], y: @[1]}, &x)"
      },
      "element": "epi-coverageplot",
      "listen": "instance:telemetry:basecalling1d:1:barcodes"
    },
    {
      "@selectList": {
        "fn:uniq": {
          "fn:jmespath": "data[? @.region != ''].region[]"
        }
      },
      "@selector": "region",
      "element": "Selector",
      "listen": "instance:telemetry:alignment-ecoli:1"
    },
    {
      "@selectList": {
        "fn:jmespath": "barcodeIds"
      },
      "@selector": "barcode",
      "element": "Selector",
      "listen": "instance:telemetry:basecalling1d:1:barcodes"
    },
    {
      "@data": {
        "fn:map": [
          {
            "name": "Workflow successful",
            "value": {
              "fn:sum": {
                "fn:jmespath": "data[?exit_status == 'Workflow successful'].count"
              }
            }
          },
          {
            "name": "Basecall failed qscore filter",
            "value": {
              "fn:sum": {
                "fn:jmespath": "data[?exit_status == 'Basecall failed qscore filter'].count"
              }
            }
          }
        ]
      },
      "element": "epi-donutsummary",
      "listen": "instance:telemetry:basecalling1d:1"
    },
    {
      "@label": "TOTAL YIELD",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "data[?exit_status == 'Workflow successful'].seqlen.total"
        }
      },
      "element": "epi-headlinevalue",
      "listen": "instance:telemetry:basecalling1d:1"
    },
    {
      "@label": "AVG SEQUENCE LENGTH",
      "@value": {
        "fn:round": {
          "fn:average": {
            "fn:jmespath": "data[?exit_status == 'Workflow successful'].seqlen.avg"
          }
        }
      },
      "element": "epi-headlinevalue",
      "listen": "instance:telemetry:basecalling1d:1"
    },
    {
      "@label": "AVG QUALITY SCORE",
      "@value": {
        "fn:tofixed": [
          {
            "fn:average": {
              "fn:jmespath": "data[?exit_status == 'Workflow successful'].mean_qscore.avg"
            }
          },
          2
        ]
      },
      "element": "epi-headlinevalue",
      "listen": "instance:telemetry:basecalling1d:1"
    },
    {
      "@label": "READS ANALYSED",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "barcodes[].payload[].count"
        }
      },
      "element": "epi-headlinevalue",
      "listen": "instance:telemetry:basecalling1d:1:barcodes"
    },
    {
      "@label": "Total reads",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "data[].count"
        }
      },
      "element": "epi-headlinevalue",
      "listen": "instance:telemetry:basecalling1d:1"
    }
  ],
  "streams": [
    {
      "@broadcast": "telemetry:qc",
      "@id-workflow-instance": idWorkflowInstance,
      "element": "epi-workflow-instance-datastream",
      "@flavour": "basecalling_1d_barcode-v1",
      "@poll-frequency": 25000
    },
    {
      "element": "epi-workflow-instance-datastream",
      "@id-workflow-instance": idWorkflowInstance,
      "@flavour": "simple_aligner_barcode_compact_quick-v1",
      "@poll-frequency": 25000,
      "@type": "telemetry"
    }
  ]
}