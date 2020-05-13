import { r as registerInstance, h } from './index-c35d3352.js';

const cronkSimpleGridCss = "cronk-simple-grid{}cronk-simple-grid table{border-collapse:collapse;text-align:left;width:100%}cronk-simple-grid table tr{background:white;border-bottom:1px solid}cronk-simple-grid table tr.grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(1%, 1fr))}cronk-simple-grid table th,cronk-simple-grid table td{padding:10px 20px}cronk-simple-grid table td span{background:#eee;color:dimgrey;display:none;font-size:10px;font-weight:bold;padding:5px;position:absolute;text-transform:uppercase;top:0;left:0}@media (max-width: 800px){cronk-simple-grid{}cronk-simple-grid table thead{left:-9999px;position:absolute;visibility:hidden}cronk-simple-grid table tr,cronk-simple-grid table tr.grid{border-bottom:0;display:flex;flex-direction:row;flex-wrap:wrap;margin-bottom:40px}cronk-simple-grid table td{border:1px solid;margin:0 -1px -1px 0;padding-top:35px;position:relative;width:100%}cronk-simple-grid table td span{display:block}}";

const CronkSimpleGrid = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.headers = [];
        this.display = 'auto';
        this.data = [];
    }
    render() {
        if (!this.data.length)
            return;
        return (h("table", null, h("thead", null, h("tr", { class: { grid: this.display === 'grid' } }, this.headers.map((header) => (h("th", null, header))))), h("tbody", null, this.data.map((row) => (h("tr", { class: { grid: this.display === 'grid' } }, row.map((data, index) => (h("td", null, h("span", null, this.headers[index]), " ", h("div", { innerHTML: data }))))))))));
    }
};
CronkSimpleGrid.style = cronkSimpleGridCss;

export { CronkSimpleGrid as cronk_simple_grid };
