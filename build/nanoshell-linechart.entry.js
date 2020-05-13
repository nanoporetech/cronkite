import { r as registerInstance, d as createEvent, h, c as getElement } from './index-c35d3352.js';
import { c as line, d as curveStep, l as linear, e as curveLinear, f as curveNatural } from './index-027f5641.js';
import { d as select } from './index-03ab02a1.js';

const nanoshellLinechartCss = ":root{--nanoshell-linechart-background-color:var(--ont-background-color, transparent);--nanoshell-linechart-fill:var(--ont-linechart-fill, rgb(1, 115, 143));--nanoshell-linechart-fill-opacity:var(--ont-linechart-fill-opacity, 0.8);--nanoshell-linechart-stroke:var(--ont-linechart-stroke, transparent);--nanoshell-linechart-stroke-width:var(--ont-linechart-stroke-width, 0);--nanoshell-linechart-stroke-opacity:var(--ont-linechart-stroke-opacity, 0.8)}:host{--nanoshell-linechart-background-color:var(--ont-background-color, transparent);--nanoshell-linechart-fill:var(--ont-linechart-fill, rgb(1, 115, 143));--nanoshell-linechart-fill-opacity:var(--ont-linechart-fill-opacity, 0.8);--nanoshell-linechart-stroke:var(--ont-linechart-stroke, transparent);--nanoshell-linechart-stroke-width:var(--ont-linechart-stroke-width, 0);--nanoshell-linechart-stroke-opacity:var(--ont-linechart-stroke-opacity, 0.8)}:root{--nanoshell-linechart-background-color:var(--ont-background-color, transparent);--nanoshell-linechart-fill:var(--ont-linechart-fill, rgb(1, 115, 143));--nanoshell-linechart-fill-opacity:var(--ont-linechart-fill-opacity, 0.8);--nanoshell-linechart-stroke:var(--ont-linechart-stroke, transparent);--nanoshell-linechart-stroke-width:var(--ont-linechart-stroke-width, 0);--nanoshell-linechart-stroke-opacity:var(--ont-linechart-stroke-opacity, 0.8)}:host{--nanoshell-linechart-background-color:var(--ont-background-color, transparent);--nanoshell-linechart-fill:var(--ont-linechart-fill, rgb(1, 115, 143));--nanoshell-linechart-fill-opacity:var(--ont-linechart-fill-opacity, 0.8);--nanoshell-linechart-stroke:var(--ont-linechart-stroke, transparent);--nanoshell-linechart-stroke-width:var(--ont-linechart-stroke-width, 0);--nanoshell-linechart-stroke-opacity:var(--ont-linechart-stroke-opacity, 0.8)}.chart-container{display:flex;flex-flow:row wrap;flex:0 1 auto;justify-content:center;font-family:\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif;margin:0 auto}.chart-container .svg-container{display:flex;position:relative;width:100%;vertical-align:middle;flex:1}.chart-container .svg-container .svg-content{display:flex;top:0;left:0;flex:1;align-self:center;justify-self:center;overflow:hidden}.chart-container .svg-container .svg-content.no-data{display:none}.chart-container .svg-container .svg-content .bold-chart-label{font-size:11px;opacity:0.8}.chart-container .svg-container .svg-content .linechart-path{fill:var(--nanoshell-linechart-fill);fill-opacity:var(--nanoshell-linechart-fill-opacity);stroke:var(--nanoshell-linechart-stroke);stroke-width:var(--nanoshell-linechart-stroke-width);stroke-opacity:var(--nanoshell-linechart-stroke-opacity)}";

const DEFAULTS = {
    height: 300,
    transitionDuration: 350,
    width: 600,
};
var CurveType;
(function (CurveType) {
    CurveType["linear"] = "line";
    CurveType["natural"] = "curve";
    CurveType["step"] = "step";
})(CurveType || (CurveType = {}));
const NanoshellLinechart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * 1. Own Properties
         */
        this.container = null;
        this.lineDef = line()
            .x((d) => this.xScale(d.x))
            .y((d) => this.yScale(d.y))
            .curve(curveStep);
        this.minMaxValues = { maxX: 0, maxY: 0, xForMaxY: 0, yForMaxX: 0 };
        this.path = null;
        this.svg = null;
        this.xScale = linear();
        this.yScale = linear();
        /**
         * 3. State() variables
         */
        this.margin = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
        };
        /**
         * 4. Public Property API
         */
        /**
         * The chart type
         */
        this.curveType = CurveType.step;
        /**
         * The data
         */
        this.data = [];
        /**
         * The chart height aspect
         */
        this.height = 200;
        /**
         * The animation duration
         */
        this.transitionDuration = 350;
        /**
         * The chart width aspect
         */
        this.width = 600;
        /**
         * The manually set limit of the X dimension
         */
        this.xLimit = 0;
        /**
         * The manually set limit of the Y dimension
         */
        this.yLimit = 0;
        this.readychart = createEvent(this, "readychart", 7);
        this.updatechart = createEvent(this, "updatechart", 7);
        this.beforeUpdatechart = createEvent(this, "beforeUpdatechart", 7);
    }
    formatData(dataIn) {
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
        return dataOut;
    }
    setDataHandler(newValue) {
        if (typeof this.data === 'string')
            this.data = this.formatData(newValue);
        this.minMaxValues = { maxX: this.xLimit, maxY: this.yLimit, xForMaxY: 0, yForMaxX: 0 };
    }
    setXLimitHandler(newXLimit) {
        this.minMaxValues.maxX = newXLimit;
    }
    setYLimitHandler(newYLimit) {
        this.minMaxValues.maxY = newYLimit;
    }
    /**
     * 6. Component life-cycle events
     */
    componentWillLoad() {
        if (typeof this.data === 'string')
            this.data = this.formatData(this.data);
    }
    componentDidLoad() {
        this.initChartRoot();
        this.rebuildChartDefs();
        this.drawChart();
        setTimeout(() => {
            this.readychart.emit(this); // only ready update after all animations have completed
        }, this.transitionDuration);
    }
    componentDidUpdate() {
        this.beforeUpdatechart.emit(this);
        this.rebuildChartDefs();
        this.drawChart();
        setTimeout(() => {
            this.updatechart.emit(this); // only notify update after all animations have completed
        }, this.transitionDuration);
    }
    /**
     * 7. Listeners
     */
    /**
     * 8. Public methods API
     */
    /**
     * Accessor for the d3 container selection
     */
    async getContainer() {
        return this.container;
    }
    /**
     * Fetch an instance of the chart
     */
    async getInstance() {
        return this;
    }
    /**
     * Accessor for the d3 path selection
     */
    async getPath() {
        return this.path;
    }
    /**
     * Update the margins around the chart - useful for other components to allocate space around chart
     */
    async updateMargins(newDimensions) {
        this.margin = Object.assign({}, this.margin, ...Object.keys(newDimensions)
            .filter(key => key in this.margin && typeof newDimensions[key] === 'number')
            .map(key => ({ [key]: this.margin[key] + newDimensions[key] })));
    }
    /**
     * 9. Local methods
     */
    drawChart() {
        const { left, top } = this.margin;
        if (!this.svg || !this.lineDef)
            return;
        this.svg.attr('viewBox', `0 0 ${this.width || DEFAULTS.width} ${this.height || DEFAULTS.height}`);
        this.container && this.container.attr('transform', `translate(${left || 0},${top || 0})`);
        if (!this.data.length)
            return;
        const data = [{ x: 0, y: 0 }, ...this.data, { x: this.data[this.data.length - 1].x, y: 0 }];
        this.path &&
            this.path
                .datum(data)
                .transition()
                .duration(this.transitionDuration)
                .attr('d', this.lineDef.curve(this.getCurveFromType()));
    }
    getChartDimensions() {
        const { left, right, top, bottom } = this.margin;
        const width = (this.width || DEFAULTS.width) - (left || 0) - (right || 0);
        const height = (this.height || DEFAULTS.height) - (top || 0) - (bottom || 0);
        return { width, height };
    }
    getCurveFromType() {
        if (this.curveType === CurveType.linear) {
            return curveLinear;
        }
        if (this.curveType === CurveType.natural) {
            return curveNatural;
        }
        return curveStep;
    }
    initChartRoot() {
        if (!this.hostEl || !this.hostEl)
            return;
        const hostSVG = this.hostEl.querySelector('svg');
        if (!this.svg && hostSVG) {
            this.svg = select(hostSVG);
        }
        if (this.svg && !this.container) {
            this.container = this.svg
                .append('g')
                .attr('class', 'linechart-image-group')
                .attr('transform', `translate(${0},${0})`);
            this.path = this.container ? this.container.append('path').classed('linechart-path', true) : null;
        }
    }
    rebuildChartDefs() {
        const { width, height } = this.getChartDimensions();
        this.minMaxValues = this.data.reduce(({ maxX: maxXIn, maxY: maxYIn, xForMaxY: xForMaxYIn, yForMaxX: yForMaxXIn }, { x, y }) => ({
            maxX: (x > maxXIn && x) || maxXIn,
            maxY: (y > maxYIn && y) || maxYIn,
            xForMaxY: (y > maxYIn && x) || xForMaxYIn,
            yForMaxX: (x > maxXIn && y) || yForMaxXIn,
        }), Object.assign({}, this.minMaxValues, { maxX: this.xLimit, maxY: this.yLimit }));
        const { maxX, maxY } = this.minMaxValues;
        this.xScale = linear()
            .domain([0, maxX]) // input
            .range([0, width]); // output
        this.yScale = linear()
            .domain([0, Math.max(5, maxY)]) // input
            .range([height, 0]) // output
            .clamp(true);
        this.lineDef = line()
            .x((d) => this.xScale(d.x))
            .y((d) => this.yScale(d.y))
            .curve(curveStep);
    }
    /**
     * 10. render() function
     */
    render() {
        return (h("div", { class: "chart-container" }, h("div", { class: "svg-container" }, h("svg", { class: `svg-content${this.data && this.data.length ? '' : ' no-data'}`, xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${this.width || DEFAULTS.width} ${this.height || DEFAULTS.height}`, preserveAspectRatio: "xMinYMin meet" }))));
    }
    get hostEl() { return getElement(this); }
    static get watchers() { return {
        "data": ["setDataHandler"],
        "xLimit": ["setXLimitHandler"],
        "yLimit": ["setYLimitHandler"]
    }; }
};
NanoshellLinechart.style = nanoshellLinechartCss;

export { NanoshellLinechart as nanoshell_linechart };
