import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkTitleCss = "cronk-title{margin-top:0.5rem;margin-bottom:1.5rem;display:inline-flex;font-size:2rem;font-weight:500;line-height:1.2}";

const CronkTitle = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.reportTitle = '';
    }
    render() {
        return h(Host, null, (this.reportTitle && this.reportTitle) || null);
    }
};
CronkTitle.style = cronkTitleCss;

export { CronkTitle as cronk_title };
