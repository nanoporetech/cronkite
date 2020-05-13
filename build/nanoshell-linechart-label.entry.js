import { r as registerInstance, c as getElement } from './index-c35d3352.js';

const nanoshellLinechartLabelCss = ":host{--nanoshell-linechart-label-background-color:var(--ont-background-color, transparent)}.bold-chart-label{font-size:11px;opacity:0.8}";

const LABEL_OFFSET = 5;
const NanoshellLinechartLabel = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * 1. Own Properties
         */
        this.chart = null;
        this.marginLeft = 0;
        this.marginBottom = 0;
        this.marginTop = 0;
        /**
         * 3. State() variables
         */
        /**
         * 4. Public Property API
         */
        /**
         * The major label for the X axis
         */
        this.labelX = '';
        /**
         * Label for the minimum X value
         */
        this.labelXLeft = '';
        /**
         * Label for the maximum X value
         */
        this.labelXRight = '';
        /**
         * Label major label for the Y axis
         */
        this.labelY = '';
    }
    /**
     * 5. Events section
     */
    /**
     * 6. Component life-cycle events
     */
    componentDidLoad() {
        const chart = this.hostEl.querySelector('nanoshell-linechart');
        if (!chart)
            return;
        if (!this.chart) {
            chart.getInstance().then(chartInstance => {
                this.chart = chartInstance;
                this.initLabels();
            });
        }
    }
    componentWillUpdate() {
        this.updatechartHandler();
    }
    /**
     * 7. Listeners
     */
    updatechartHandler() {
        this.labelG.empty();
        this.redrawLabels();
    }
    /**
     * 8. Public methods API
     */
    /**
     * 9. Local methods
     */
    calculateMarginChange() {
        let marginLeft = 0;
        let marginBottom = 0;
        const yLabelText = this.yLabelText.node();
        const xLabelText = this.xLabelText.node();
        const xLeftLabelText = this.xLeftLabelText.node();
        const xRightLabelText = this.xRightLabelText.node();
        const labelYHeight = this.labelY && yLabelText ? yLabelText.getBBox().height : 0;
        let labelXHeight = this.labelX && xLabelText ? xLabelText.getBBox().height : 0;
        if ((this.labelXLeft || this.labelXRight) && !this.labelY) {
            const labelTextNode = xRightLabelText || xRightLabelText;
            labelXHeight = labelTextNode ? labelTextNode.getBBox().height : 0;
        }
        if (this.labelG && xLabelText && xLeftLabelText && xRightLabelText && yLabelText) {
            marginLeft = labelYHeight + LABEL_OFFSET;
            marginBottom = labelXHeight + LABEL_OFFSET;
        }
        return { marginLeft, marginBottom, labelYHeight, labelXHeight };
    }
    async drawLabels() {
        if (!this.labelG || !this.xLabelText || !this.xLeftLabelText || !this.xRightLabelText)
            return;
        const { left, top, bottom } = this.chart.margin;
        const { width, height } = this.chart.getChartDimensions();
        this.labelG.attr('transform', `translate(${-left}, ${height})`);
        this.xLabelText.text(this.labelX);
        this.xLeftLabelText.text(this.labelXLeft);
        this.xRightLabelText.text(this.labelXRight);
        this.yLabelText.text(this.labelY);
        const { marginLeft, marginBottom, labelXHeight, labelYHeight } = this.calculateMarginChange();
        this.xLabelText.attr('transform', `translate(${left + width / 2}, ${bottom - labelXHeight < marginBottom ? bottom - LABEL_OFFSET : bottom - labelXHeight})`);
        this.xLeftLabelText.attr('transform', `translate(${left + LABEL_OFFSET}, ${bottom - LABEL_OFFSET})`);
        this.xRightLabelText.attr('transform', `translate(${left + width - LABEL_OFFSET}, ${bottom - LABEL_OFFSET})`);
        this.yLabelText.attr('transform', `translate(${labelYHeight}, ${-height / 2}) rotate(-90)`);
        const marginTop = this.marginTop;
        if (marginLeft !== this.marginLeft || marginBottom !== this.marginBottom) {
            await this.chart.updateMargins({
                bottom: marginBottom - this.marginBottom,
                left: marginLeft - this.marginLeft,
            });
        }
        this.marginLeft = marginLeft;
        this.marginBottom = marginBottom;
        this.marginTop = marginTop || top;
    }
    async initLabels() {
        this.labelG = this.chart.container.append('g').classed('chart-label', true);
        this.xLabelText = this.labelG
            .append('text')
            .classed('bold-chart-label', true)
            .attr('style', 'text-anchor: middle;')
            .text(this.labelX);
        this.yLabelText = this.labelG
            .append('text')
            .classed('bold-chart-label', true)
            .attr('style', 'text-anchor: middle;')
            .text(this.labelY);
        this.xLeftLabelText = this.labelG
            .append('text')
            .classed('bold-chart-label', true)
            .attr('style', 'text-anchor: left;')
            .text(this.labelXLeft);
        this.xRightLabelText = this.labelG
            .append('text')
            .classed('bold-chart-label', true)
            .attr('style', 'text-anchor: end;')
            .text(this.labelXRight);
        this.drawLabels();
    }
    redrawLabels() {
        this.drawLabels();
    }
    /**
     * 10. render() function
     */
    render() {
        return null;
    }
    get hostEl() { return getElement(this); }
};
NanoshellLinechartLabel.style = nanoshellLinechartLabelCss;

export { NanoshellLinechartLabel as nanoshell_linechart_label };
