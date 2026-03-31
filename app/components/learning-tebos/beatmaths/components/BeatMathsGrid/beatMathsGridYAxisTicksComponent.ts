import * as d3 from "d3";

type BeatMathsGridYAxisTicksChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridYAxisTicksChart;
  height(): number;
  height(value: number): BeatMathsGridYAxisTicksChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridYAxisTicksChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridYAxisTicksChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridYAxisTicksChart;
};

const beatMathsGridYAxisTicksComponent = (): BeatMathsGridYAxisTicksChart => {
  let width = 0;
  let height = 0;
  let yCount = 52;
  let xCount = 1;
  let xOriginIndex = 0;

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const yStep = safeHeight / yCount;
      const xStep = safeWidth / Math.max(1, xCount);
      const yCenterIndex = yCount / 2;
      const centerX = xOriginIndex * xStep;
      const tickLength = Math.min(8, safeHeight * 0.04);
      const labelOffset = 6;

      const ticks = d3.range(0, yCount + 1).map((index) => ({
        value: index * yStep,
        offset: index - yCenterIndex,
      }));

      svg
        .selectAll("line.y-tick")
        .data(ticks)
        .join("line")
          .attr("class", "y-tick")
          .attr("x1", centerX)
          .attr("x2", centerX + tickLength)
          .attr("y1", (d) => d.value)
          .attr("y2", (d) => d.value)
          .attr("stroke", "#E6E9F2")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1)
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("text.y-tick-label")
        .data(ticks)
        .join("text")
          .attr("class", "y-tick-label")
          .attr("x", centerX + tickLength + labelOffset)
          .attr("y", (d) => d.value)
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#E6E9F2")
          .attr("fill-opacity", 0.7)
          .attr("font-size", 10)
          .attr("font-family", "var(--font-montserrat)")
          .text((d) => (d.offset === 0 ? "" : -d.offset));
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

  chart.yCount = (value?: number) => {
    if (value === undefined) {
      return yCount;
    }
    yCount = value;
    return chart;
  };

  chart.xCount = (value?: number) => {
    if (value === undefined) {
      return xCount;
    }
    xCount = value;
    return chart;
  };

  chart.xOriginIndex = (value?: number) => {
    if (value === undefined) {
      return xOriginIndex;
    }
    xOriginIndex = value;
    return chart;
  };

  return chart as BeatMathsGridYAxisTicksChart;
};

export default beatMathsGridYAxisTicksComponent;
