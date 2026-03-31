import * as d3 from "d3";

type BeatMathsGridPlayheadChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridPlayheadChart;
  height(): number;
  height(value: number): BeatMathsGridPlayheadChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridPlayheadChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridPlayheadChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridPlayheadChart;
  xIndex(): number;
  xIndex(value: number): BeatMathsGridPlayheadChart;
  visible(): boolean;
  visible(value: boolean): BeatMathsGridPlayheadChart;
};

const beatMathsGridPlayheadComponent = (): BeatMathsGridPlayheadChart => {
  let width = 0;
  let height = 0;
  let xCount = 1;
  let xOffset = 0;
  let yOffset = 0;
  let xIndex = 0;
  let visible = false;

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / Math.max(1, xCount);
      const x = xOffset + xIndex * xStep;
      const data = visible ? [{ x }] : [];

      svg
        .selectAll("line.playhead")
        .data(data)
        .join("line")
          .attr("class", "playhead")
          .attr("x1", (d) => d.x)
          .attr("x2", (d) => d.x)
          .attr("y1", yOffset)
          .attr("y2", yOffset + safeHeight)
          .attr("stroke", "#FFE1A8")
          .attr("stroke-opacity", 0.7)
          .attr("stroke-width", 2)
          .attr("shape-rendering", "crispEdges");
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

  chart.xIndex = (value?: number) => {
    if (value === undefined) {
      return xIndex;
    }
    xIndex = value;
    return chart;
  };

  chart.visible = (value?: boolean) => {
    if (value === undefined) {
      return visible;
    }
    visible = value;
    return chart;
  };

  return chart as BeatMathsGridPlayheadChart;
};

export default beatMathsGridPlayheadComponent;
