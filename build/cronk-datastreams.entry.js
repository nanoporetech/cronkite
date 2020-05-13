import { r as registerInstance, h, H as Host, c as getElement } from './index-c35d3352.js';

const cronkDatastreamsCss = "cronk-datastreams{display:flex;flex-direction:column;margin:0.5rem}cronk-datastreams .components-content{display:grid;grid-gap:0.5rem}";

const CronkDatastreams = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.pageComponentsReady = false;
    }
    async reload() {
        document.querySelectorAll('.cronk-datastream').forEach((datastreamEl) => datastreamEl.resendBroadcast());
    }
    async getState() {
        return { streams: this.streams, pageComponentsReady: this.pageComponentsReady };
    }
    render() {
        const hasStreams = this.streams !== undefined && this.streams.length > 0;
        const canRenderStreams = hasStreams;
        return (h(Host, null, (canRenderStreams &&
            this.streams &&
            this.streams.map((streamConfig, streamIndex) => (h("cronk-event-stream", { key: `${this.streamsID}-${streamIndex}`, config: streamConfig })))) ||
            null));
    }
    get el() { return getElement(this); }
};
CronkDatastreams.style = cronkDatastreamsCss;

export { CronkDatastreams as cronk_datastreams };
