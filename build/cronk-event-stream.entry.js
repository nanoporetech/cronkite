import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const CronkEventStream = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async componentWillLoad() {
        if (!this.config)
            return;
        const _a = this.config, { element } = _a, attributes = __rest(_a, ["element"]);
        if (!element)
            return;
        this.streamEl = element;
        this.customElProps = Object.assign({}, ...Object.entries(attributes)
            .filter(([attr]) => attr.startsWith('@'))
            .map(([attr, val]) => ({ [attr.substr(1)]: val })));
    }
    render() {
        if (!this.streamEl || !this.customElProps)
            return;
        const EventSource = this.streamEl;
        return (h(Host, { "aria-hidden": 'true' }, h(EventSource, Object.assign({ class: "cronk-datastream" }, this.customElProps))));
    }
};

export { CronkEventStream as cronk_event_stream };
