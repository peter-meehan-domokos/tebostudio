import * as d3 from "d3";

type BeatMathsGridXAxisTicksChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridXAxisTicksChart;
  height(): number;
  height(value: number): BeatMathsGridXAxisTicksChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridXAxisTicksChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridXAxisTicksChart;
};

const beatMathsGridXAxisTicksComponent = (): BeatMathsGridXAxisTicksChart => {
  let width = 0;
  let height = 0;
  let xCount = 68;
  let xOriginIndex = 0;

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / xCount;
      const centerY = safeHeight / 2;
      const tickLength = Math.min(8, safeHeight * 0.04);
      const labelOffset = 6;

      const ticks = d3
        .range(0, xCount + 1)
        .map((index) => ({
          value: index * xStep,
          offset: index - xOriginIndex,
        }))
        .filter((tick) => Math.abs(tick.offset) % 2 === 0);

      svg
        .selectAll("line.x-tick")
        .data(ticks)
        .join("line")
          .attr("class", "x-tick")
          .attr("x1", (d) => d.value)
          .attr("x2", (d) => d.value)
          .attr("y1", centerY - tickLength / 2)
          .attr("y2", centerY + tickLength / 2)
          .attr("stroke", "#E6E9F2")
          .attr("stroke-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.8 : 0.55))
          .attr("stroke-width", (d) => (Math.abs(d.offset) % 16 === 0 ? 1.5 : 1))
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("text.x-tick-label")
        .data(ticks)
        .join("text")
          .attr("class", "x-tick-label")
          .attr("x", (d) => d.value)
          .attr("y", centerY - tickLength / 2 - labelOffset)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging")
          .attr("fill", "#E6E9F2")
          .attr("fill-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.85 : 0.65))
          .attr("font-size", (d) => (Math.abs(d.offset) % 16 === 0 ? 12 : 10))
          .attr("font-family", "var(--font-montserrat)")
          .text((d) => (d.offset === 0 ? "" : d.offset));
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

  return chart as BeatMathsGridXAxisTicksChart;
};

export default beatMathsGridXAxisTicksComponent;
