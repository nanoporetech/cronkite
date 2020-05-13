import { r as registerInstance, h } from './index-c35d3352.js';
import { C as COLOUR_SCALE } from './constants-b2400060.js';

const epiDonutsummaryCss = ".donutsummary-container{display:flex;flex-flow:row wrap;width:min-content;flex:0 1 auto;justify-content:center;font-family:\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif;line-height:1.7;margin:0 auto;color:#555555}.donutsummary-container .donutsummary-image-container{z-index:0}.donutsummary-container .donutsummary-legend-container{display:flex;justify-content:center;align-content:center;flex:0 1 auto;flex-flow:row wrap;position:absolute;z-index:1;transform:translateY(3.5rem)}.donutsummary-container .donutsummary-legend-container .legend-list{list-style:circle;list-style:none;margin:0;padding:0;width:60%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item{display:flex;flex:1;justify-content:flex-end;align-items:center;width:100%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-percentage{text-align:right;margin-right:5%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-icon{display:inline-block;border-radius:50%;margin-right:5%}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;min-width:60%;max-width:60%;text-align:left}.donutsummary-container .donutsummary-legend-container .legend-list .legend-item .legend-label:hover{overflow:visible}";

const DEFAULTS = {
    colour: COLOUR_SCALE,
    width: 300,
};
const EpiDonutsummary = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The data[]
         */
        this.data = [];
        /**
         * The donut width
         */
        this.width = 300;
    }
    setDataHandler(newValue) {
        if (typeof this.data === 'string')
            this.data = this.validateData(newValue);
    }
    componentWillLoad() {
        if (typeof this.data === 'string')
            this.data = this.validateData(this.data);
    }
    validateData(dataIn) {
        let dataOut = dataIn;
        if (typeof dataIn === 'string') {
            try {
                dataOut = JSON.parse(dataIn);
            }
            catch (parserError) {
                dataOut = [];
                console.warn('Could not process data', parserError.message);
            }
        }
        // return (dataOut as Datum[]).sort((a, b) => a.name.localeCompare(b.name)); // alphabetised
        return dataOut
            .sort((a, b) => b.value - a.value)
            .reduce((prevValue, currentValue, index) => {
            if (dataOut.length <= DEFAULTS.colour.length || index < DEFAULTS.colour.length) {
                return [...prevValue, currentValue];
            }
            // tslint:disable-next-line: prefer-const
            let [last, ...firstN] = prevValue.reverse();
            last = Object.assign(last, { name: 'Other', value: last.value || 0 + currentValue.value || 0 });
            return [last, ...firstN].reverse();
        }, []);
    }
    render() {
        if (!this.data || typeof this.data === 'string')
            return null;
        const dataTotal = this.data.reduce((previousValue, currentDatum) => previousValue + currentDatum.value || 0, 0);
        const data = this.validateData(this.data);
        const width = this.width || DEFAULTS.width;
        const scaleFactor = 18 / DEFAULTS.width;
        return (h("div", { class: "donutsummary-container", style: { minWidth: `${width}px`, fontSize: `calc(${scaleFactor} * ${width}px)` } }, h("div", { class: "donutsummary-legend-container", style: {
                minHeight: `calc(${width}px - calc(${scaleFactor} * 7rem))`,
                minWidth: `calc(${width}px - calc(${scaleFactor} * 7rem))`,
                transform: `translateY(calc(${scaleFactor} * 3.6rem))`,
            } }, data.length ? (h("slot", { name: "donut-legend" }, h("div", { class: "legend-list" }, data
            .sort((a, b) => b.value - a.value)
            .map(({ name, value, colour, color }, index) => (h("li", { class: "legend-item", key: name }, h("span", { class: `legend-percentage` }, ((value / dataTotal) * 100).toFixed(0), "%"), h("span", { class: `legend-icon`, role: "presentation", style: {
                backgroundColor: colour || color || DEFAULTS.colour[index],
                minHeight: `calc(${scaleFactor} * ${width}px)`,
                minWidth: `calc(${scaleFactor} * ${width}px)`,
            } }), h("span", { class: "legend-label" }, name))))))) : null), h("div", { class: "donutsummary-image-container" }, h("epi-donutimage", { width: this.width, height: this.width, data: data, "inner-radius": "80" }))));
    }
    static get watchers() { return {
        "data": ["setDataHandler"]
    }; }
};
EpiDonutsummary.style = epiDonutsummaryCss;

export { EpiDonutsummary as epi_donutsummary };
