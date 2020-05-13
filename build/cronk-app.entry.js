import { r as registerInstance, h, H as Host, c as getElement } from './index-c35d3352.js';

const cronkAppCss = "cronk-app{height:inherit}";

const CronkApp = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.report = 'hello-world';
    }
    async componentDidLoad() {
        if (this.cronkPageEl) {
            const response = await fetch(`/cronkite/examples/reports/${this.report}.json`);
            const reportConfig = await response.json();
            this.cronkPageEl.pageConfig = reportConfig;
        }
    }
    async componentWillUpdate() {
        if (this.cronkPageEl) {
            const response = await fetch(`/cronkite/examples/reports/${this.report}.json`);
            const reportConfig = await response.json();
            this.cronkPageEl.pageConfig = reportConfig;
        }
    }
    render() {
        return (h(Host, null, h("cronk-page", { ref: init => (this.cronkPageEl = init) })));
    }
    get el() { return getElement(this); }
};
CronkApp.style = cronkAppCss;

export { CronkApp as cronk_app };
