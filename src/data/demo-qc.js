/* eslint-disable no-template-curly-in-string */


export default {
  "components": [
    {
      "@label-x": "ALIGNMENT ACCURACY (%)",
      "@label-y": "COUNT",
      "@units-y": "",
      "@units-x": "%",
      "@label-x-left": "60%",
      "@label-x-right": "100%",
      "@data": {
        "fn:jmespath": "barcodes[].payload[? exit_status == 'Workflow successful'][].accuracy.hist[].{x: @[0], y: @[1]}"
      },
      "element": "epi-coverageplot",
      "layout": {
        "w": 17,
        "h": 25,
        "x": 7,
        "y": 33,
        "i": "1db9205e-a720-4ced-9cf3-5fddbfef1b3c",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:alignment-ecoli:1:barcodes"
    },
    {
      "@data": {
        "fn:jmespath": "sort_by(barcodes[].payload[? exit_status == 'Workflow successful'][].mean_qscore.hist[].{x: @[0], y: @[1]}, &x)"
      },
      "element": "epi-coverageplot",
      "layout": {
        "w": 17,
        "h": 25,
        "x": 7,
        "y": 8,
        "i": "f817a852-4922-466c-8c3e-f1231ba11f0c",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1:barcodes"
    },
    {
      "@selectList": {
        "fn:uniq": {
          "fn:jmespath": "data[? @.region != ''].region[]"
        }
      },
      "@selector": "region",
      "element": "Selector",
      "layout": {
        "w": 7,
        "h": 10,
        "x": 0,
        "y": 18,
        "i": "546c4038-45a0-4744-93ab-bb889a09358e",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:alignment-ecoli:1"
    },
    {
      "@selectList": {
        "fn:jmespath": "barcodeIds"
      },
      "@selector": "barcode",
      "element": "Selector",
      "layout": {
        "w": 7,
        "h": 10,
        "x": 0,
        "y": 8,
        "i": "e19ca404-29c5-4db8-b8fb-1d4134384480",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1:barcodes"
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
      "layout": {
        "w": 7,
        "h": 22,
        "x": 0,
        "y": 28,
        "i": "5a063459-6496-43eb-8fd2-d54b3623f4fd",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1"
    },
    {
      "@label": "TOTAL YIELD",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "data[?exit_status == 'Workflow successful'].seqlen.total"
        }
      },
      "element": "epi-headlinevalue",
      "layout": {
        "w": 6,
        "h": 8,
        "x": 18,
        "y": 0,
        "i": "6d471c02-da3a-4c02-ab23-bc24466e8e8e",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1"
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
      "layout": {
        "w": 6,
        "h": 8,
        "x": 12,
        "y": 0,
        "i": "8ade28b3-849e-4d3c-b163-92941b504bb7",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1"
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
      "layout": {
        "w": 6,
        "h": 8,
        "x": 6,
        "y": 0,
        "i": "9ccb1fbb-0976-4d1e-a0a8-25a726e4d908",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1"
    },
    {
      "@label": "READS ANALYSED",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "barcodes[].payload[].count"
        }
      },
      "element": "epi-headlinevalue",
      "layout": {
        "w": 6,
        "h": 8,
        "x": 0,
        "y": 0,
        "i": "31664bd5-3bb5-4f70-9826-62346494cf71",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1:barcodes"
    },
    {
      "@label": "Total reads",
      "@value": {
        "fn:sum": {
          "fn:jmespath": "data[].count"
        }
      },
      "element": "epi-headlinevalue",
      "layout": {
        "w": 7,
        "h": 8,
        "x": 0,
        "y": 50,
        "i": "fa74ea8b-3cf1-4e71-a8b9-3993f82ca84b",
        "moved": false,
        "static": false
      },
      "listen": "datastream:telemetry:basecalling1d:1"
    }
  ],
  "streams": [
    {
      "flavour": "basecalling_1d_barcode-v1",
      "type": "telemetry"
    },
    {
      "flavour": "simple_aligner_barcode_compact_quick-v1",
      "type": "telemetry"
    }
  ]
}