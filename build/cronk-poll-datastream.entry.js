import { r as registerInstance, h, H as Host, c as getElement } from './index-c35d3352.js';
import './_commonjsHelpers-cc66c86a.js';
import { p as processValue } from './index-566c5fd3.js';

const DEFAULT_SHAPE = {
    'fn:jmespath': '@',
};
const DEFAULT_CHANNEL = 'cronkite:stream';
const DEFAULT_CHANNELS = [
    {
        channel: DEFAULT_CHANNEL,
        shape: DEFAULT_SHAPE,
    },
];
const RESPONSE_MIMETYPE = {
    csv: 'text/csv',
    json: 'application/json',
    text: 'text/plain',
    tsv: 'text/tab-separated-values',
};
var RESPONSE_TYPES;
(function (RESPONSE_TYPES) {
    RESPONSE_TYPES["JSON"] = "json";
    RESPONSE_TYPES["CSV"] = "csv";
    RESPONSE_TYPES["TSV"] = "tsv";
    RESPONSE_TYPES["TEXT"] = "text";
})(RESPONSE_TYPES || (RESPONSE_TYPES = {}));
const CronkPollDatastream = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.eTag = 'STARTER - ETAG';
        this.cachedResponse = null;
        this.cachedBroadcasts = {};
        this.filters = {};
        this.dispatch = async (eventName, sourceNode, payload) => {
            const event = new CustomEvent(eventName || DEFAULT_CHANNEL, {
                bubbles: true,
                composed: true,
                detail: payload,
            });
            console.debug(eventName, payload);
            // TODO: HACK TO ENSURE EVENTS FIRE AFTER COMPONENTS ARE RENDERED
            // setTimeout(sourceNode.dispatchEvent, 100, event);
            sourceNode.dispatchEvent(event);
        };
        this.type = 'data';
        this.responseFormat = RESPONSE_TYPES.JSON;
        this.url = null;
        this.channels = DEFAULT_CHANNELS;
        this.acceptsFilters = false;
        this.credentials = 'include';
        this.mode = 'cors';
        this.pollFrequency = 15000;
        this.corsProxy = '';
        this.responseHandler = async (data, streamState) => {
            const { channels, dispatch, filters } = streamState;
            let filteredData;
            channels.forEach(async (c) => {
                filteredData = await processValue(data, c.shape || DEFAULT_SHAPE);
                const canFilter = c.filtered !== undefined ? c.filtered : true;
                if (canFilter && filters.length && Array.isArray(filteredData)) {
                    filteredData = filteredData.filter((datum) => filters.map(filter => filter(datum)).every(i => i));
                }
                const dispatchFn = (_channel, _hostEl, _filteredData) => async () => {
                    console.debug(`%cEPI-POLL-DATASTREAM::dispatch::${_channel}`, 'color: violet');
                    dispatch(_channel, _hostEl, _filteredData);
                };
                this.cachedBroadcasts[c.channel] = dispatchFn(c.channel, this.hostEl, filteredData);
                this.cachedBroadcasts[c.channel]();
            });
        };
        this.requestHandler = async (method) => {
            const response = await fetch(this.url, {
                body: null,
                cache: 'force-cache',
                credentials: this.credentials,
                headers: {
                    accept: RESPONSE_MIMETYPE[this.responseFormat],
                },
                method: method.toUpperCase(),
                mode: this.mode,
            });
            return response;
        };
        this.requestSuccess = (response) => {
            const status = response.status;
            return status >= 200 && status < 400;
        };
        this.fetchData = async () => {
            console.debug('In fetchData', this.url);
            let response = null;
            try {
                response = await this.requestHandler('GET');
            }
            catch (error) {
                console.error('Error (GET request)', error, response);
            }
            if (!response)
                return;
            // if (!this.requestSuccess(response)) {
            //   throw new Error(`Request error (${uri}) returned status ${response.status}`)
            // }
            let newData;
            // let textResponse: string[][];
            switch (this.responseFormat) {
                case RESPONSE_TYPES.JSON:
                    newData = await response.json();
                    break;
                case RESPONSE_TYPES.CSV:
                    const rawCsvResponse = await response.text();
                    newData = rawCsvResponse
                        .trimRight()
                        .split(/[\n\r]+/g)
                        .map(line => line.split(','));
                    break;
                case RESPONSE_TYPES.TSV:
                    const rawTsvResponse = await response.text();
                    newData = rawTsvResponse
                        .trimRight()
                        .split(/[\n\r]+/g)
                        .map(line => line.split('\t'));
                    break;
                default:
                    newData = await response.text();
                    break;
            }
            this.cachedResponse = newData;
            await this.broadcast(newData);
        };
        this.pollData = async () => {
            let response = null;
            try {
                response = await this.requestHandler('HEAD');
            }
            catch (error) {
                console.error('Error (HEAD request)', error, response);
            }
            if (!response)
                return;
            // TODO: Handle other status codes
            const eTag = response.headers.get('etag') || '';
            if (eTag !== this.eTag) {
                await this.fetchData();
                this.eTag = eTag;
            }
            else {
                // TODO: Should the cached data be rebroadcast on every poll???
                // await this.broadcast(this.cachedResponse);
            }
        };
    }
    async listFilters() {
        return this.filters;
    }
    async addFilter(fnKey, filterFn) {
        this.filters[fnKey] = filterFn;
        await this.broadcast(this.cachedResponse);
    }
    async resendBroadcast() {
        Object.values(this.cachedBroadcasts).forEach((dispatcherFn) => dispatcherFn());
    }
    async broadcast(data) {
        if (!data)
            return;
        await this.responseHandler(data, {
            channels: this.channels,
            dispatch: this.dispatch,
            filters: Object.values(this.filters),
            type: this.type,
        });
    }
    async initDataStream() {
        if (this.url) {
            this.intervalID = setInterval(this.pollData, this.pollFrequency);
            await this.pollData();
        }
    }
    async componentWillUpdate() {
        clearInterval(this.intervalID);
        await this.initDataStream();
    }
    componentDidUnload() {
        this.filters = {};
        clearInterval(this.intervalID);
    }
    async componentDidLoad() {
        if (!this.url)
            return;
        await this.initDataStream();
    }
    render() {
        return (h(Host, { "aria-hidden": 'true', class: {
                'cronk-filtered-datastream': this.acceptsFilters,
                [`cronk-${this.type}-eventstream`]: true,
            } }));
    }
    get hostEl() { return getElement(this); }
};

export { CronkPollDatastream as cronk_poll_datastream };
