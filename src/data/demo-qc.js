/* eslint-disable no-template-curly-in-string */


export default {
    "components": [
        // {
        //     "@label-x": "Q Score",
        //     "@data": {
        //         "fn:query": "$.data..mean_qscore.hist"
        //     },
        //     "element": "epi-coverageplot",
        //     "layout": {
        //         "h": 24,
        //         "moved": false,
        //         "static": false,
        //         "w": 24,
        //         "x": 0,
        //         "y": 0
        //     },
        //     "listen": "datastream:telemetry:basecalling1d:1"
        // },
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
                "h": 24,
                "i": "5a063459-6496-43eb-8fd2-d54b3623f4fd",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 0,
                "y": 0
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
                "h": 8,
                "i": "6d471c02-da3a-4c02-ab23-bc24466e8e8e",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 0,
                "y": 24
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
                "h": 8,
                "i": "8ade28b3-849e-4d3c-b163-92941b504bb7",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 6,
                "y": 0
            },
            "listen": "datastream:telemetry:basecalling1d:1"
        },
        {
            "@label": "AVG QUALITY SCORE",
            "@value": {
                "fn:average": {
                    "fn:jmespath": "data[?exit_status == 'Workflow successful'].mean_qscore.avg"
                }
            },
            "element": "epi-headlinevalue",
            "layout": {
                "h": 8,
                "i": "9ccb1fbb-0976-4d1e-a0a8-25a726e4d908",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 6,
                "y": 8
            },
            "listen": "datastream:telemetry:basecalling1d:1"
        },
        {
            "@label": "READS ANALYSED",
            "@value": {
                "fn:sum": {
                    "fn:jmespath": "barcodes.*[].count"
                }
            },
            "element": "epi-headlinevalue",
            "layout": {
                "h": 8,
                "i": "31664bd5-3bb5-4f70-9826-62346494cf71",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 6,
                "y": 16
            },
            "listen": "datastream:telemetry:basecalling1d:1:barcodes"
        },
        {
            "@label": "Total reads",
            "@value": {
                "fn:sum": {
                    "fn:jmespath": "barcodes.*[?exit_status == 'Workflow successful'].count[]"
                }
            },
            "element": "epi-headlinevalue",
            "layout": {
                "h": 8,
                "i": "fa74ea8b-3cf1-4e71-a8b9-3993f82ca84b",
                "moved": false,
                "static": false,
                "w": 6,
                "x": 6,
                "y": 24
            },
            "listen": "datastream:telemetry:basecalling1d:1:barcodes"
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