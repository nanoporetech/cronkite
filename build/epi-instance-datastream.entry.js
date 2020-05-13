import { r as registerInstance, h, c as getElement } from './index-c35d3352.js';

var EDatastreamTypes;
(function (EDatastreamTypes) {
    EDatastreamTypes["telemetry"] = "telemetry";
    EDatastreamTypes["status"] = "status";
})(EDatastreamTypes || (EDatastreamTypes = {}));

const normaliseBarcode = (barcode) => {
    return barcode
        .toLowerCase()
        .replace('bc', 'bc')
        .replace('na', 'no barcode');
};
const transformAndEmitQCData = (node) => async ({ type, data, version, key }, { channels, dispatch, filters }) => {
    let flattenedData = data.map((datum) => {
        return Object.assign(datum, ...datum.key.map((datumKey, i) => {
            const mapKey = key[i];
            return {
                [mapKey]: mapKey === 'barcode' ? normaliseBarcode(datumKey) : datumKey,
            };
        }));
    });
    if (filters.length) {
        flattenedData = flattenedData.filter((datum) => filters.map(filter => filter(datum)).every(i => i));
    }
    let barcodes = flattenedData.reduce((groupedBarcodes, datum) => {
        const { barcode } = datum;
        return Object.assign(Object.assign({}, groupedBarcodes), { [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum] });
    }, {});
    dispatch(`${channels}:${type}:${version}`, node, {
        data: flattenedData,
    });
    dispatch(`${channels}:${type}:${version}:barcodes`, node, {
        barcodeIds: Object.keys(barcodes),
        barcodes: Object.entries(barcodes).map(([label, payload]) => ({
            label,
            payload,
        })),
    });
    flattenedData = null;
    barcodes = null;
};
const transformAndEmitSimpleAlignerData = (node) => async ({ type, data, version, key }, { channels, dispatch, filters }) => {
    let flattenedData = data.map((datum) => {
        return Object.assign(datum, ...datum.key.map((datumKey, i) => ({ [key[i]]: datumKey })));
    });
    if (filters.length) {
        flattenedData = flattenedData.filter((datum) => filters.map(filter => filter(datum)).every(i => i));
    }
    let barcodes = flattenedData.reduce((groupedBarcodes, datum) => {
        const { barcode } = datum;
        return Object.assign(Object.assign({}, groupedBarcodes), { [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum] });
    }, {});
    dispatch(`${channels}:${type}:${version}`, node, {
        data: flattenedData,
    });
    dispatch(`${channels}:${type}:${version}:barcodes`, node, {
        barcodeIds: Object.keys(barcodes),
        barcodes: Object.entries(barcodes).map(([label, payload]) => ({
            label,
            payload,
        })),
    });
    flattenedData = null;
    barcodes = null;
};
const transformFlatten = (node) => async ({ type, data, version, key }, { channels, dispatch, filters }) => {
    let flattenedData = data.map((datum) => {
        return Object.assign(datum, ...datum.key.map((datumKey, i) => ({ [key[i]]: datumKey })));
    });
    if (filters.length) {
        flattenedData = flattenedData.filter((datum) => filters.map(filter => filter(datum)).every(i => i));
    }
    dispatch(`${channels}:${type}:${version}`, node, {
        data: flattenedData,
    });
    flattenedData = null;
};
const ResponseHandlers = {
    default: {
        transformFlatten,
    },
    status: {},
    telemetry: {
        transformAndEmitQCData,
        transformAndEmitSimpleAlignerData,
    },
};

const EpiInstanceDatastream = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.type = 'default';
        this.channel = 'instance:default';
        this.credentials = 'include';
        this.mode = 'cors';
        this.pollFrequency = 15000;
    }
    getResponseHandler() {
        switch (this.type) {
            case EDatastreamTypes.telemetry:
                return ResponseHandlers.telemetry;
            case EDatastreamTypes.status:
                return ResponseHandlers.status;
            default:
                return ResponseHandlers.default;
        }
    }
    getPayloadResponseHandler() {
        const handler = this.getResponseHandler();
        switch (this.flavour) {
            case 'basecalling_1d_barcode-v1':
                return handler.transformAndEmitQCData(this.hostEl);
            case 'simple_aligner_barcode_compact_quick-v1':
                return handler.transformAndEmitSimpleAlignerData(this.hostEl);
            default:
                return handler.transformFlatten(this.hostEl);
        }
    }
    render() {
        if (!this.type || !this.flavour || !this.idWorkflowInstance)
            return null;
        const url = `https://${location.host}/workflow_instance/${this.idWorkflowInstance}/${this.flavour}.json`;
        return (h("cronk-poll-datastream", { credentials: this.credentials, responseHandler: this.getPayloadResponseHandler(), type: this.type, url: url, channels: [
                {
                    channel: this.channel,
                },
            ] }));
    }
    get hostEl() { return getElement(this); }
};

export { EpiInstanceDatastream as epi_instance_datastream };
