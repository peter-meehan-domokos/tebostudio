import * as d3 from "d3";

type BeatMathsGridAxesChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridAxesChart;
  height(): number;
  height(value: number): BeatMathsGridAxesChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridAxesChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridAxesChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridAxesChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridAxesChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridAxesChart;
  allowedSemitoneSet(): Set<number>;
  allowedSemitoneSet(value: Set<number>): BeatMathsGridAxesChart;
};

const beatMathsGridAxesComponent = (): BeatMathsGridAxesChart => {
  let width = 0;
  let height = 0;
  let xCount = 1;
  let yCount = 1;
  let xOffset = 0;
  let yOffset = 0;
  let xOriginIndex = 0;
  let allowedSemitoneSet = new Set(d3.range(1, 13));
  let wasCompactYTickLabels = false;
  const CHROMATIC_SEMITONE_COUNT = 12;

  const getSemitoneIndex = (yIndex: number) => {
    const yCenterIndex = yCount / 2;
    const midi = 60 + (yCenterIndex - yIndex);
    const normalized = ((midi % 12) + 12) % 12;
    return normalized + 1;
  };

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / Math.max(1, xCount);
      const centerX = xOffset + xOriginIndex * xStep;
      const centerY = yOffset + safeHeight / 2;
      const yStep = safeHeight / Math.max(1, yCount);
      const yCenterIndex = yCount / 2;
      const tickLength = d3
        .scaleLinear<number, number>()
        .domain([260, 900])
        .range([5, 8])
        .clamp(true)(safeHeight);
      const yTickStrokeWidth = d3
        .scaleLinear<number, number>()
        .domain([260, 900])
        .range([0.8, 1])
        .clamp(true)(safeHeight);
      const labelOffset = tickLength * 0.75;
      const xTickLabelGap = tickLength * 0.05;
      const compactYTickLabels = safeWidth > safeHeight * 1.2;
      const baseYTickLabelFontSize = d3
        .scaleLinear<number, number>()
        .domain([300, 900])
        .range([4, 10])
        .clamp(true)(safeHeight);
      const yTickLabelFontSize = compactYTickLabels ? baseYTickLabelFontSize * 0.85 : baseYTickLabelFontSize;
      if (compactYTickLabels !== wasCompactYTickLabels) {
        wasCompactYTickLabels = compactYTickLabels;
      }
      const axisColour = "#FFF8E7";
      const yTickX1 = centerX - tickLength;
      const yTickX2 = centerX;
      const yLabelX = centerX - tickLength - labelOffset;
      const yLabelAnchor = "end";

      const yTicks = d3.range(0, yCount + 1).map((index) => ({
        value: yOffset + index * yStep,
        offset: index - yCenterIndex,
        isAllowedByScale: allowedSemitoneSet.has(getSemitoneIndex(index)),
      }));
      const isVisibleYAxisTick = (tick: { offset: number; isAllowedByScale: boolean }) => {
        if (tick.offset === 0) {
          return false;
        }
        const isChromatic = allowedSemitoneSet.size === CHROMATIC_SEMITONE_COUNT;
        if (isChromatic) {
          return Math.abs(tick.offset) % 2 === 0;
        }
        return tick.isAllowedByScale;
      };
      const xTicks = d3
        .range(0, xCount + 1)
        .map((index) => ({
          value: xOffset + index * xStep,
          offset: index - xOriginIndex,
        }));

      svg
        .selectAll("line.axis")
        .data([
          { x1: centerX, y1: yOffset, x2: centerX, y2: yOffset + safeHeight },
          { x1: xOffset, y1: centerY, x2: xOffset + safeWidth, y2: centerY },
        ])
        .join("line")
          .attr("class", "axis")
          .attr("x1", (d) => d.x1)
          .attr("y1", (d) => d.y1)
          .attr("x2", (d) => d.x2)
          .attr("y2", (d) => d.y2)
          .attr("stroke", axisColour)
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", 1.5)
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("line.x-tick")
        .data(xTicks)
        .join("line")
          .attr("class", "x-tick")
          .attr("x1", (d) => d.value)
          .attr("x2", (d) => d.value)
          .attr("y1", centerY - tickLength / 2)
          .attr("y2", centerY + tickLength / 2)
          .attr("stroke", axisColour)
          .attr("stroke-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.8 : 0.55))
          .attr("stroke-width", (d) => (Math.abs(d.offset) % 16 === 0 ? 1.5 : 1))
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("text.x-tick-label")
        .data(xTicks)
        .join("text")
          .attr("class", "x-tick-label")
          .attr("x", (d) => d.value)
          .attr("y", centerY - tickLength / 2 - xTickLabelGap)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "text-after-edge")
          .attr("fill", axisColour)
          .attr("fill-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.85 : 0.65))
          .attr("font-size", yTickLabelFontSize)
          .attr("font-family", "var(--font-montserrat)")
          .text((d) => (d.offset === 0 ? "" : d.offset));

      svg
        .selectAll("line.y-tick")
        .data(yTicks.filter(isVisibleYAxisTick))
        .join("line")
          .attr("class", "y-tick")
          .attr("x1", yTickX1)
          .attr("x2", yTickX2)
          .attr("y1", (d) => d.value)
          .attr("y2", (d) => d.value)
          .attr("stroke", axisColour)
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", yTickStrokeWidth)
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("text.y-tick-label")
        .data(yTicks.filter(isVisibleYAxisTick))
        .join("text")
          .attr("class", "y-tick-label")
          .attr("x", yLabelX)
          .attr("y", (d) => d.value)
          .attr("text-anchor", yLabelAnchor)
          .attr("dominant-baseline", "middle")
          .attr("fill", axisColour)
          .attr("fill-opacity", 0.7)
          .attr("font-size", yTickLabelFontSize)
          .attr("font-family", "var(--font-montserrat)")
          .text((d) => -d.offset);
    });
  };

  chart.width = (value?: number) => {
    if (value === undefined) {
      return width;
    }
    width = value;
    return chart;
  };

  chart.height = (value?: number) => {
    if (value === undefined) {
      return height;
    }
    height = value;
    return chart;
  };

  chart.xOriginIndex = (value?: number) => {
    if (value === undefined) {
      return xOriginIndex;
    }
    xOriginIndex = value;
    return chart;
  };

  chart.allowedSemitoneSet = (value?: Set<number>) => {
    if (value === undefined) {
      return allowedSemitoneSet;
    }
    allowedSemitoneSet = value;
    return chart;
  };

  chart.xCount = (value?: number) => {
    if (value === undefined) {
      return xCount;
    }
    xCount = value;
    return chart;
  };

  chart.xOffset = (value?: number) => {
    if (value === undefined) {
      return xOffset;
    }
    xOffset = value;
    return chart;
  };

  chart.yOffset = (value?: number) => {
    if (value === undefined) {
      return yOffset;
    }
    yOffset = value;
    return chart;
  };

  chart.yCount = (value?: number) => {
    if (value === undefined) {
      return yCount;
    }
    yCount = value;
    return chart;
  };


  return chart as BeatMathsGridAxesChart;
};

export default beatMathsGridAxesComponent;
