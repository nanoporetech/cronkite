import { r as registerInstance, c as getElement } from './index-c35d3352.js';

var slice = Array.prototype.slice;

function identity(x) {
  return x;
}

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d)); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = slice.call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

const nanoshellLinechartAxisCss = ":host{--nanoshell-linechart-axis-background-color:var(--ont-background-color, transparent)}.axis path,.axis line{fill:none;stroke:#000;stroke-opacity:0.4;shape-rendering:geometricprecision}.tick text{font-size:11px;opacity:0.8}";

const LABEL_OFFSET = 5;
const MARGIN_MIN = 20;
const NanoshellLinechartAxis = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.chart = null;
        this.maxText = null;
        this.minText = null;
        this.marginLeft = -LABEL_OFFSET;
        this.marginBottom = -LABEL_OFFSET;
        this.marginTop = 0;
        /**
         * 3. State() variables
         */
        /**
         * 4. Public Property API
         */
        /**
         * The X axis units
         */
        this.unitsX = '';
        /**
         * The Y axis units
         */
        this.unitsY = '';
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
                this.initAxis();
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
        this.yXisG.empty();
        this.redrawAxis();
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
        if (this.yXisG) {
            marginLeft = Math.max(0, ...this.yXisG
                .selectAll('.tick text')
                .nodes()
                .map((labelNode) => labelNode.getBBox().width + LABEL_OFFSET));
            marginBottom = Math.max(0, ...this.axisG
                .selectAll('.axis-x-label')
                .nodes()
                .map((labelNode) => labelNode.getBBox().height + LABEL_OFFSET));
        }
        return { marginLeft, marginBottom };
    }
    async drawAxis() {
        this.drawXAxis();
        this.drawYAxis();
        const { marginLeft, marginBottom } = this.calculateMarginChange();
        const marginTop = this.marginTop;
        if (marginLeft !== this.marginLeft || marginBottom !== this.marginBottom) {
            await this.chart.updateMargins({
                bottom: marginBottom - this.marginBottom,
                left: marginLeft - this.marginLeft,
                top: LABEL_OFFSET - marginTop,
            });
        }
        this.marginLeft = marginLeft;
        this.marginBottom = marginBottom;
        this.marginTop = marginTop || LABEL_OFFSET;
    }
    drawXAxis() {
        if (!this.minText || !this.maxText)
            return;
        const { width, height } = this.chart.getChartDimensions();
        const { maxX } = this.chart.minMaxValues;
        this.axisG.attr('transform', `translate(0, ${height + MARGIN_MIN - LABEL_OFFSET})`);
        this.minText.text(`0${this.unitsX}`);
        this.maxText
            .text(`${(this.chart.refLength || maxX || 0).toLocaleString()}${this.unitsX}`)
            .attr('transform', `translate(${width - LABEL_OFFSET}, 0)`);
    }
    drawYAxis() {
        if (!this.yXisG)
            return;
        const scaleY = this.chart.yScale;
        const { height, width } = this.chart.getChartDimensions();
        scaleY.range([height, 0]);
        this.yXisG
            .call(axisRight(scaleY)
            .ticks(height / (height * 0.25) || 2, `,.0r`)
            .tickSize(width)
            .tickFormat((d) => {
            return `${d.toLocaleString()}${this.unitsY}`;
        }))
            .call((g) => {
            g.selectAll('.tick:not(:first-of-type) line').attr('stroke-dasharray', '2,2');
            g.selectAll('.tick text')
                .attr('text-anchor', 'end')
                .attr('x', -LABEL_OFFSET)
                .attr('dy', LABEL_OFFSET);
            g.select('.domain').remove();
        });
    }
    async initAxis() {
        this.axisG = this.chart.container.append('g').classed('axis', true);
        this.minText = this.axisG
            .append('text')
            .classed('axis-x-label min bold-chart-label', true)
            .attr('style', 'text-anchor: left;')
            .text(`0${this.unitsX}`)
            .attr('transform', `translate(${LABEL_OFFSET}, 0)`);
        this.maxText = this.axisG
            .append('text')
            .classed('axis-x-label max bold-chart-label', true)
            .attr('style', 'text-anchor: end;')
            .attr('transform', `translate(${this.chart.width - LABEL_OFFSET}, 0)`);
        this.yXisG = this.chart.container
            .append('g')
            .attr('transform', `translate(0, 0)`)
            .classed('y-axis', true)
            .classed('axis', true);
        this.drawAxis();
    }
    redrawAxis() {
        this.drawAxis();
    }
    /**
     * 10. render() function
     */
    render() {
        return null;
    }
    get hostEl() { return getElement(this); }
};
NanoshellLinechartAxis.style = nanoshellLinechartAxisCss;

export { NanoshellLinechartAxis as nanoshell_linechart_axis };
