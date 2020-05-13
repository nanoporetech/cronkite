import { r as registerInstance, h, c as getElement } from './index-c35d3352.js';

const EpiCoverageplot = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * 3. State() variables
         */
        /**
         * 4. Public Property API
         */
        /**
         * The data
         */
        this.data = [];
        /**
         * The chart height aspect
         */
        this.height = 200;
        /**
         * The chart X label
         */
        this.labelX = 'REFERENCE SEQUENCE POSITION';
        /**
         * The chart X minimum value label
         */
        this.labelXLeft = 'START';
        /**
         * The chart X label
         */
        this.labelXRight = 'END';
        /**
         * The chart Y label
         */
        this.labelY = 'ESTIMATED COVERAGE';
        /**
         * The format function of the tooltip for the X-axis
         */
        this.tooltipFormatX = 'value => `POSITION: ${value}bp`';
        /**
         * The format function of the tooltip for the X-axis
         */
        this.tooltipFormatY = 'value => `≈ COVERAGE: ${value}X`';
        /**
         * The X-axis units
         */
        this.unitsX = 'bp';
        /**
         * The Y-axis units
         */
        this.unitsY = 'X';
        /**
         * The chart width aspect
         */
        this.width = 600;
        /**
         * The maximum X value (if zero then defaults to maximum X in data)
         */
        this.xLimit = 0;
        /**
         * The maximum Y value (if zero then defaults to maximum Y in data)
         */
        this.yLimit = 0;
    }
    /**
     * 1. Own Properties
     */
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
    }
    /**
     * 5. Events section
     */
    /**
     * 6. Component life-cycle events
     */
    componentWillLoad() {
        if (typeof this.data === 'string')
            this.data = this.formatData(this.data);
    }
    componentDidUpdate() {
        if (!this.hostEl)
            return;
        const linechart = this.hostEl.querySelector('nanoshell-linechart');
        if (linechart) {
            linechart.data = this.data;
        }
    }
    /**
     * 7. Listeners
     */
    /**
     * 8. Public methods API
     */
    /**
     * 9. Local methods
     */
    /**
     * 10. render() function
     */
    render() {
        return (h("nanoshell-linechart-label", { "label-x": this.labelX, "label-x-left": this.labelXLeft, "label-x-right": this.labelXRight, "label-y": this.labelY }, h("nanoshell-linechart-axis", { "units-x": this.unitsX, "units-y": this.unitsY }, h("nanoshell-linechart-tooltip", { "format-x": this.tooltipFormatX, "format-y": this.tooltipFormatY }, h("nanoshell-linechart", { data: this.data, width: this.width, height: this.height, "x-limit": this.xLimit, "y-limit": this.yLimit })))));
    }
    get hostEl() { return getElement(this); }
    static get watchers() { return {
        "data": ["setDataHandler"]
    }; }
};

export { EpiCoverageplot as epi_coverageplot };
