import { r as registerInstance, c as getElement } from './index-c35d3352.js';
import { e as mouse } from './index-03ab02a1.js';

const nanoshellLinechartTooltipCss = ":host{--nanoshell-linechart-tooltip-background-color:var(--ont-background-color, transparent)}.tooltip-label-top,.tooltip-label-bottom{font-size:10px;font-weight:bold;color:#696969}";

const findYatXbyBisection = (x, path, error = 0.01) => {
    let length_end = path.getTotalLength();
    let length_start = 0;
    let point = path.getPointAtLength((length_end + length_start) / 2); // get the middle point;
    const bisection_iterations_max = 50;
    let bisection_iterations = 0;
    while (x < point.x - error || x > point.x + error) {
        // get the middle point
        point = path.getPointAtLength((length_end + length_start) / 2);
        if (x < point.x) {
            length_end = (length_start + length_end) / 2;
        }
        else {
            length_start = (length_start + length_end) / 2;
        }
        bisection_iterations += 1;
        // Increase iteration
        if (bisection_iterations_max < bisection_iterations) {
            break;
        }
    }
    return point.y;
};
const MARGIN_TOP = 20;
const LABEL_OFFSET = 10;
const looseParse = (fnAsString) => Function(`"use strict"; return ${fnAsString};`)().bind(undefined);
const NanoshellLinechartTooltip = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * 1. Own Properties
         */
        this.chart = null;
        /**
         * 3. State() variables
         */
        /**
         * 4. Public Property API
         */
        /**
         * The X value label formatter: (value: any): string => {}
         */
        this.formatX = (xValue) => `${typeof xValue === 'number' ? xValue.toLocaleString() : xValue}`;
        /**
         * The Y value label formatter: (value: any): string => {}
         */
        this.formatY = (yValue) => `${typeof yValue === 'number' ? yValue.toLocaleString() : yValue}`;
    }
    formatXHandler(newFormatFn) {
        this.formatX = typeof newFormatFn === 'string' ? looseParse(newFormatFn) : newFormatFn;
        if (this.chart)
            this.redrawTooltip();
    }
    formatYHandler(newFormatFn) {
        this.formatY = typeof newFormatFn === 'string' ? looseParse(newFormatFn) : newFormatFn;
        if (this.chart)
            this.redrawTooltip();
    }
    /**
     * 5. Events section
     */
    /**
     * 6. Component life-cycle events
     */
    componentDidLoad() {
        try {
            if (typeof this.formatX === 'string')
                this.formatX = looseParse(this.formatX);
        }
        catch (ignore) {
            console.warn('X label formatter is not a function');
        }
        try {
            if (typeof this.formatY === 'string')
                this.formatY = looseParse(this.formatY);
        }
        catch (ignore) {
            console.warn('Y label formatter is not a function');
        }
        const chart = this.hostEl.querySelector('nanoshell-linechart');
        if (!chart)
            return;
        if (!this.chart) {
            chart.getInstance().then(chartInstance => {
                this.chart = chartInstance;
                this.initTooltip();
            });
        }
    }
    /**
     * 7. Listeners
     */
    beforeUpdatechartHandler() {
        const { height } = this.chart.getChartDimensions();
        this.tooltipLabelYCircle
            .attr('r', 5)
            .attr('stroke-width', 8)
            .transition()
            .duration(this.chart.transitionDuration - 50)
            .attr('r', 0)
            .attr('stroke-width', 0);
        this.tooltipLine
            .attr('y1', 0)
            .transition()
            .duration(this.chart.transitionDuration - 50)
            .attr('y1', height);
    }
    updatechartHandler() {
        this.tooltipG.empty();
        this.redrawTooltip();
    }
    /**
     * 8. Public methods API
     */
    /**
     * 9. Local methods
     */
    drawTooltip() {
        const { height } = this.chart.getChartDimensions();
        this.tooltipLabelYCircle
            .attr('r', 0)
            .attr('stroke-width', 0)
            .transition()
            .duration(1000)
            .attr('r', 5)
            .attr('stroke-width', 8);
        this.tooltipLine
            .attr('y2', height)
            .attr('y1', height)
            .transition()
            .duration(this.chart.transitionDuration - 50)
            .attr('y1', 0);
        this.tooltipG.transition().style('opacity', 1);
    }
    async initTooltip() {
        await this.chart.updateMargins({ top: MARGIN_TOP });
        this.chart.svg
            .on('mousemove', () => {
            this.setTooltip(mouse(this.chart.svg.node())[0]);
        })
            .on('mouseleave', () => this.tooltipG.transition().style('opacity', 0))
            .on('mouseenter', () => this.drawTooltip());
        this.tooltipG = this.chart.container.append('g');
        this.tooltipLine = this.tooltipG
            .append('line')
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('opacity', 0.3)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('x1', 0)
            .attr('x2', 0);
        this.tooltipLabelX = this.tooltipG
            .append('text')
            .attr('fill', '#444')
            .classed('tooltip-label-top', true);
        this.tooltipLabelY = this.tooltipG
            .append('text')
            .attr('fill', '#444')
            .classed('tooltip-label-bottom', true);
        this.tooltipLabelYCircle = this.tooltipG
            .append('circle')
            .attr('fill', '#2c6d68')
            .attr('opacity', 0.8)
            .attr('stroke', '#53b8b1')
            .attr('stroke-opacity', 0.2)
            .attr('cx', 0);
        this.drawTooltip();
    }
    redrawTooltip() {
        this.drawTooltip();
        this.setMaxValue();
    }
    setMaxValue() {
        const { xForMaxY, yForMaxX } = this.chart.minMaxValues;
        const { left } = this.chart.margin;
        let transformAdjustment = 0;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            const scaleFactor = this.chart.width / this.hostEl.getBoundingClientRect().width;
            transformAdjustment = scaleFactor * this.chart.hostEl.getBoundingClientRect().left - 4;
        }
        const maxXCoord = Math.round(this.chart.xScale(xForMaxY));
        const maxYCoord = Math.round(this.chart.yScale(yForMaxX));
        this.setTooltip(maxXCoord + left + transformAdjustment, maxYCoord);
    }
    setTooltip(clientX, knownY) {
        const { width, height } = this.chart.getChartDimensions();
        let transformAdjustment = 0;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            const scaleFactor = this.chart.width / this.hostEl.getBoundingClientRect().width;
            transformAdjustment = scaleFactor * this.chart.hostEl.getBoundingClientRect().left - 4;
        }
        const { left } = this.chart.margin;
        const xCoord = clientX - left - transformAdjustment;
        const rawXValue = Math.round(this.chart.xScale.invert(xCoord));
        // If x is zero (0bp) then y would have no value and so be zero too
        let yCoord = knownY || Math.round(xCoord) !== 0
            ? findYatXbyBisection(Math.floor(xCoord), this.chart.path.node(), 1e-4)
            : height;
        if (xCoord >= 0 && xCoord <= width) {
            this.tooltipG.style('display', 'block');
            this.tooltipG.attr('transform', `translate(${Math.floor(xCoord)}, 0)`);
            this.tooltipLine.attr('y2', height);
            this.tooltipLabelX.text(this.formatX.call({}, rawXValue.toLocaleString()));
            this.tooltipLabelY.text(this.formatY.call({}, this.chart.yScale.invert(yCoord).toFixed(0)));
            this.tooltipLabelYCircle.attr('cy', yCoord);
            yCoord = Math.min(yCoord, height);
            const maxLabelWidth = Math.max((this.tooltipLabelX.node().getBBoxZ && this.tooltipLabelX.node().getBBoxZ().width) || 150, (this.tooltipLabelY.node().getBBoxZ && this.tooltipLabelY.node().getBBoxZ().width) || 150);
            const isLabelOutOfBounds = xCoord + maxLabelWidth + LABEL_OFFSET > width;
            if (maxLabelWidth) {
                if (isLabelOutOfBounds) {
                    this.tooltipG.style('text-anchor', 'end');
                    this.tooltipLabelX.attr('transform', `translate(-${LABEL_OFFSET},${height - 6})`);
                    this.tooltipLabelY.attr('transform', `translate(-${LABEL_OFFSET},${Math.min(yCoord - 6, height - 20)})`);
                }
                else {
                    this.tooltipG.style('text-anchor', 'start');
                    this.tooltipLabelX.attr('transform', `translate(${LABEL_OFFSET},${height - 6})`);
                    this.tooltipLabelY.attr('transform', `translate(${LABEL_OFFSET},${Math.min(yCoord - 6, height - 20)})`);
                }
            }
        }
    }
    /**
     * 10. render() function
     */
    render() {
        return null;
    }
    get hostEl() { return getElement(this); }
    static get watchers() { return {
        "formatX": ["formatXHandler"],
        "formatY": ["formatYHandler"]
    }; }
};
NanoshellLinechartTooltip.style = nanoshellLinechartTooltipCss;

export { NanoshellLinechartTooltip as nanoshell_linechart_tooltip };
