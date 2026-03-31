import * as d3 from "d3";

type BeatMathsGridLinesChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridLinesChart;
  height(): number;
  height(value: number): BeatMathsGridLinesChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridLinesChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridLinesChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridLinesChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridLinesChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridLinesChart;
  zoomK(): number;
  zoomK(value: number): BeatMathsGridLinesChart;
  allowedSemitoneSet(): Set<number>;
  allowedSemitoneSet(value: Set<number>): BeatMathsGridLinesChart;
  soundingYIndices(): Set<number>;
  soundingYIndices(value: Set<number>): BeatMathsGridLinesChart;
};

const beatMathsGridLinesComponent = (): BeatMathsGridLinesChart => {
  let width = 0;
  let height = 0;
  let xCount = 4;
  let yCount = 4;
  let xOffset = 0;
  let yOffset = 0;
  let xOriginIndex = 0;
  let zoomK = 1;
  let allowedSemitoneSet = new Set(d3.range(1, 13));
  let soundingYIndices = new Set<number>();

  const getSemitoneIndex = (yIndex: number) => {
    const yCenterIndex = yCount / 2;
    const midi = 60 + (yCenterIndex - yIndex);
    const normalized = ((midi % 12) + 12) % 12;
    return normalized + 1;
  };

  const applyScaleOpacity = (opacity: number, isAllowed: boolean, isFiltered: boolean) => {
    if (!isFiltered) {
      return opacity;
    }
    if (isAllowed) {
      return Math.min(1, opacity * 1.2);
    }
    return opacity * 0.5;
  };

  const HIGHLIGHT_STROKE = "#3B6FF5";
  const SOUNDING_STROKE = "#7FEFFF";
  const ALLOWED_STROKE = "#616266";
  const BASE_STROKE = "#4A5369";

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const safeZoomK = Math.max(0.01, zoomK);

      const xStep = safeWidth / xCount;
      const yStep = safeHeight / yCount;
      const displayedYStep = yStep * safeZoomK;
      const baseGridStrokeWidth = Math.max(0.5, Math.min(displayedYStep / 10, 1));
      const highlightedYStrokeWidth = Math.max(0.5, Math.min((1.15 * displayedYStep) / 10, 1.25));
      const yCenterIndex = yCount / 2;

      const xTicks = d3.range(0, xCount + 1).map((index) => ({
        value: xOffset + index * xStep,
        index,
        offset: index - xOriginIndex,
      }));
      const isScaleFiltered = allowedSemitoneSet.size < 12;

      const yTicks = d3.range(0, yCount + 1).map((index) => {
        const semitoneIndex = getSemitoneIndex(index);
        return {
          value: yOffset + index * yStep,
          index,
          offset: index - yCenterIndex,
          isHighlighted: Math.abs(index - yCenterIndex) % 12 === 0,
          isAllowed: allowedSemitoneSet.has(semitoneIndex),
          isScaleFiltered,
          isSounding: soundingYIndices.has(index),
        };
      });

      svg
        .selectAll("line.grid-x")
        .data(xTicks)
        .join("line")
          .attr("class", "grid-x")
        .attr("x1", (d) => d.value)
        .attr("x2", (d) => d.value)
        .attr("y1", yOffset)
        .attr("y2", yOffset + safeHeight)
        .attr("stroke", (d) => (Math.abs(d.offset) % 16 === 0 ? HIGHLIGHT_STROKE : BASE_STROKE))
        .attr("stroke-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.55 : 0.2))
        .attr("stroke-width", (d) => (Math.abs(d.offset) % 16 === 0 ? highlightedYStrokeWidth : baseGridStrokeWidth))
        .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("line.grid-y")
        .data(yTicks)
        .join("line")
          .attr("class", "grid-y")
        .attr("y1", (d) => d.value)
        .attr("y2", (d) => d.value)
        .attr("x1", xOffset)
        .attr("x2", xOffset + safeWidth)
        .attr("stroke", (d) => {
          if (d.isSounding) {
            return SOUNDING_STROKE;
          }
          if (d.isHighlighted) {
            return HIGHLIGHT_STROKE;
          }
          if (d.isAllowed && d.isScaleFiltered) {
            return ALLOWED_STROKE;
          }
          return BASE_STROKE;
        })
        .attr("stroke-opacity", (d) => {
          if (d.isSounding) {
            return 1;
          }
          if (d.isScaleFiltered && !d.isAllowed) {
            return 0;
          }
          const baseOpacity = d.isHighlighted
            ? 0.55
            : d.isAllowed && d.isScaleFiltered
              ? 0.45
              : 0.2;
          return applyScaleOpacity(baseOpacity, d.isAllowed, d.isScaleFiltered);
        })
        .attr("stroke-width", (d) => {
          if (d.isSounding) {
            return 2.6;
          }
          if (d.isHighlighted) {
            return highlightedYStrokeWidth;
          }
          if (d.isAllowed && d.isScaleFiltered) {
            return Math.min(1.125, Math.max(baseGridStrokeWidth, baseGridStrokeWidth * 1.125));
          }
          return baseGridStrokeWidth;
        })
        .style("filter", (d) => (d.isSounding ? "drop-shadow(0 0 4px #7FEFFF)" : "none"))
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

  chart.yCount = (value?: number) => {
    if (value === undefined) {
      return yCount;
    }
    yCount = value;
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

  chart.zoomK = (value?: number) => {
    if (value === undefined) {
      return zoomK;
    }
    zoomK = value;
    return chart;
  };

  chart.allowedSemitoneSet = (value?: Set<number>) => {
    if (value === undefined) {
      return allowedSemitoneSet;
    }
    allowedSemitoneSet = value;
    return chart;
  };

  chart.soundingYIndices = (value?: Set<number>) => {
    if (value === undefined) {
      return soundingYIndices;
    }
    soundingYIndices = value;
    return chart;
  };

  return chart as BeatMathsGridLinesChart;
};

export default beatMathsGridLinesComponent;
