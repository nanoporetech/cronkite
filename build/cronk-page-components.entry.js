import { r as registerInstance, d as createEvent, h, H as Host } from './index-c35d3352.js';

const cronkPageComponentsCss = "cronk-page-components{display:flex;flex-direction:column;margin:0.5rem}cronk-page-components .components-content{display:grid;grid-gap:0.5rem}";

const CronkPageComponents = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.componentsLoaded = createEvent(this, "componentsLoaded", 7);
    }
    componentDidLoad() {
        console.debug('%cEPI-REPORT-COMPONENTS :: componentDidLoad', 'color: goldenrod');
        this.componentsLoaded.emit();
    }
    render() {
        return (h(Host, null, h("slot", { name: "header" }), h("div", { class: "components-content", style: {
                gridTemplateColumns: `repeat(${4}, auto)`,
            } }, h("slot", null)), h("slot", { name: "footer" })));
    }
};
CronkPageComponents.style = cronkPageComponentsCss;

export { CronkPageComponents as cronk_page_components };
