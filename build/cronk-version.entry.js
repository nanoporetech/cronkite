import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkVersionCss = "cronk-version{display:flex;width:100%;margin-top:1.5rem;font-size:0.9rem;margin-bottom:0.5rem;font-weight:200;line-height:1.2;color:#ccc;justify-content:flex-end;cursor:default}cronk-version::selection{background:none;}cronk-version::-moz-selection{background:none;}";

const CronkVersion = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h("slot", null)));
    }
};
CronkVersion.style = cronkVersionCss;

export { CronkVersion as cronk_version };
