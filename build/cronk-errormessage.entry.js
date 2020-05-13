import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkErrormessageCss = "cronk-errormessage{color:var(--cronk-color-danger-rgb, var(--ion-color-danger-rgb, tomato));padding:1rem 0;font-family:monospace;display:flex;flex:1 1 auto}";

const CronkErrormessage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.message = 'Yikes! An error occurred';
    }
    render() {
        return h(Host, null, this.message);
    }
};
CronkErrormessage.style = cronkErrormessageCss;

export { CronkErrormessage as cronk_errormessage };
