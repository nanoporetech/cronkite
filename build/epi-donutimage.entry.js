import { r as registerInstance, h, c as getElement } from './index-c35d3352.js';
import { C as COLOUR_SCALE } from './constants-b2400060.js';
import { q as quantize, r as rgbBasis, l as linear, p as pie, a as arc, o as ordinal, b as linear$1, i as interpolate } from './index-027f5641.js';
import { d as select } from './index-03ab02a1.js';

const epiDonutimageCss = ".donut-container{display:flex;flex-flow:row wrap;width:min-content;flex:0 1 auto;justify-content:center;font-family:\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif;margin:0 auto}.donut-container .donut-image-container{display:flex;justify-content:center;align-content:center;flex:0 1 auto;flex-flow:row wrap}.donut-container .donut-image-container .svg-content.no-data{display:none}";

const DEFAULTS = {
    arcMargin: 0,
    cornerRadius: 0,
    height: 300,
    innerRadius: 50,
    outerRadius: 100,
    transitionDuration: 350,
    width: 300,
};
const EPI2ME_SCHEME = (length) => quantize(rgbBasis(COLOUR_SCALE), length).reverse();
const EpiDonutimage = class {
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
        /**
         * The donut height
         */
        this.height = 300;
        /**
         * The arc padding
         */
        this.arcMargin = 0;
        /**
         * The arc corner radius
         */
        this.cornerRadius = 0;
        /**
         * The arc inner radius
         */
        this.innerRadius = 50;
        /**
         * The arc outer radius
         */
        this.outerRadius = 100;
        /**
         * The arc animation duration
         */
        this.transitionDuration = 300;
        this.svg = null;
        this.radius = null;
        this.arcs = [];
        this.prevArcs = [];
        this.dataSortFn = (a, b) => b.value - a.value;
        this.arcMarginScale = linear()
            .domain([0, 100])
            .range([0.0, 0.2])
            .clamp(true);
        this.cornerRadiusScale = linear()
            .domain([0, 100])
            .range([0.0, 50.0])
            .clamp(true);
        this.innerRadiusScale = linear()
            .domain([0, 100])
            .range([0.0, 1])
            .clamp(true);
        this.outerRadiusScale = linear()
            .domain([0, 100])
            .range([0.0, 1])
            .clamp(true);
        this.pieGenerator = pie()
            .padAngle(this.arcMarginScale(this.arcMargin || 0))
            // .sort((a: Datum, b: Datum) => b.name.localeCompare(a.name))
            .sort(this.dataSortFn)
            .value(d => d.value);
    }
    // @Event() dataSelected: EventEmitter;
    // dataSelectedHandler(dataPoint) {
    //   this.dataSelected.emit(dataPoint)
    //   console.info(dataPoint)
    // }
    setDataHandler(newValue) {
        if (typeof this.data === 'string')
            this.data = this.formatData(newValue);
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
    componentWillUpdate() {
        this.prevArcs = [...this.arcs];
    }
    componentDidUpdate() {
        this.rebuildChartDefs();
        this.drawChart();
    }
    componentWillLoad() {
        if (typeof this.data === 'string')
            this.data = this.formatData(this.data);
    }
    componentDidLoad() {
        this.initChartRoot();
        this.rebuildChartDefs();
        this.drawChart();
    }
    initChartRoot() {
        if (!this.hostEl)
            return;
        const hostSVG = this.hostEl.querySelector('svg');
        if (!this.svg && hostSVG) {
            this.svg = select(hostSVG);
            this.svg
                .append('g')
                .attr('class', 'donut-image-group')
                .attr('transform', `translate(${(this.width || DEFAULTS.width) / 2},${(this.height || DEFAULTS.height) / 2})`);
        }
    }
    rebuildChartDefs() {
        this.radius = Math.min(this.width || DEFAULTS.width, this.height || DEFAULTS.height) / 2;
        this.arcDef = arc()
            .outerRadius(this.radius * this.outerRadiusScale(Math.max(this.outerRadius, this.innerRadius) + 1))
            .innerRadius(this.radius *
            (this.innerRadiusScale(Math.min(this.outerRadius, this.innerRadius) - 1) +
                this.arcMarginScale(this.arcMargin || 0) / 2))
            .cornerRadius(this.cornerRadiusScale(this.cornerRadius || 0))
            .padAngle(this.arcMarginScale(this.arcMargin || 0));
        if (this.data && typeof this.data !== 'string' && this.data.length) {
            this.colourScale = ordinal()
                .domain(this.data.sort(this.dataSortFn).map(d => d.name))
                .range(this.data.length > COLOUR_SCALE.length ? EPI2ME_SCHEME(this.data.length).reverse() : COLOUR_SCALE);
            this.arcs = this.pieGenerator(this.data);
        }
    }
    drawChart() {
        if (!this.svg || !this.arcDef)
            return;
        this.svg
            .select('g')
            .attr('transform', `translate(${(this.width || DEFAULTS.width) / 2},${(this.height || DEFAULTS.height) / 2})`)
            .selectAll('path')
            .data(this.arcs, (d) => d)
            .join((enter) => enter
            .append('path')
            .call((enterInner) => enterInner
            .transition()
            .duration(this.transitionDuration)
            .ease(linear$1)
            .attr('role', 'presentation')
            .attr('shape-rendering', 'auto')
            .attr('fill', (d) => d.data.colour || d.data.color || this.colourScale(d.data.name))
            .attrTween('d', (d) => {
            const current = this.prevArcs.filter(dPrev => dPrev.data.name === d.data.name)[0] || d;
            const interpolateStart = interpolate(current.startAngle, d.startAngle);
            const interpolateEnd = interpolate(current.endAngle, d.endAngle);
            return (t) => {
                d.startAngle = interpolateStart(t);
                d.endAngle = interpolateEnd(t);
                return this.arcDef(d) || '';
            };
        }))
            .append('text')
            .append('tspan')
            .data(this.arcs, (d) => d)
            .text((d) => d.data.name), (update) => update.call((updateInner) => updateInner
            .transition()
            .duration(this.transitionDuration || DEFAULTS.transitionDuration)
            .ease(linear$1)
            .attr('fill', (d) => d.data.colour || d.data.color || this.colourScale(d.data.name))
            .attrTween('d', (d) => {
            const current = this.prevArcs.filter(dPrev => dPrev.data.name === d.data.name)[0] || d;
            const interpolateStart = interpolate(current.startAngle, d.startAngle);
            const interpolateEnd = interpolate(current.endAngle, d.endAngle);
            return (t) => {
                d.startAngle = interpolateStart(t);
                d.endAngle = interpolateEnd(t);
                return this.arcDef(d) || '';
            };
        })), (exit) => exit.call((exitInner) => exitInner.remove()));
    }
    render() {
        return (h("div", { class: "donut-container", style: { minWidth: `${this.width || DEFAULTS.width}px` } }, h("div", { class: "donut-image-container" }, h("svg", { class: `svg-content${this.data && this.data.length ? '' : ' no-data'}`, width: this.width || DEFAULTS.width, height: this.height, xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${this.width || DEFAULTS.width} ${this.height || DEFAULTS.height}`, preserveAspectRatio: "xMinYMin meet" }))));
    }
    get hostEl() { return getElement(this); }
    static get watchers() { return {
        "data": ["setDataHandler"]
    }; }
};
EpiDonutimage.style = epiDonutimageCss;

export { EpiDonutimage as epi_donutimage };
