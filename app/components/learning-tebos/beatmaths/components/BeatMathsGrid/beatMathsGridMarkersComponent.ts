import * as d3 from "d3";

type BeatMathsGridMarkersChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridMarkersChart;
  height(): number;
  height(value: number): BeatMathsGridMarkersChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridMarkersChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridMarkersChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridMarkersChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridMarkersChart;
};

const beatMathsGridMarkersComponent = (): BeatMathsGridMarkersChart => {
  let width = 0;
  let height = 0;
  let xCount = 1;
  let xOffset = 0;
  let yOffset = 0;
  let xOriginIndex = 0;

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / Math.max(1, xCount);
      const centerX = xOffset + xOriginIndex * xStep;
      const centerY = yOffset + safeHeight / 2;

      svg
        .selectAll("circle.corner")
        .data([
          { x: xOffset, y: yOffset },
          { x: xOffset + safeWidth, y: yOffset },
          { x: xOffset, y: yOffset + safeHeight },
          { x: xOffset + safeWidth, y: yOffset + safeHeight },
        ])
        .join("circle")
          .attr("class", "corner")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 5)
          .attr("fill", "#E6E9F2");

      svg
        .selectAll("circle.origin")
        .data([{ x: centerX, y: centerY }])
        .join("circle")
          .attr("class", "origin")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 6)
          .attr("fill", "#1B1E2B")
          .attr("stroke", "#E6E9F2")
          .attr("stroke-width", 1.25);
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

  chart.xOriginIndex = (value?: number) => {
    if (value === undefined) {
      return xOriginIndex;
    }
    xOriginIndex = value;
    return chart;
  };

  return chart as BeatMathsGridMarkersChart;
};

export default beatMathsGridMarkersComponent;
