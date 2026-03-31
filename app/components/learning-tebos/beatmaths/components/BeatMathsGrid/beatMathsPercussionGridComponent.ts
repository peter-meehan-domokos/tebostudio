import * as d3 from "d3";
import beatMathsGridNotesComponent from "./beatMathsGridNotesComponent";
import beatMathsGridPlayheadComponent from "./beatMathsGridPlayheadComponent";

type BeatMathsPercussionGridChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsPercussionGridChart;
  height(): number;
  height(value: number): BeatMathsPercussionGridChart;
  xCount(): number;
  xCount(value: number): BeatMathsPercussionGridChart;
  yCount(): number;
  yCount(value: number): BeatMathsPercussionGridChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsPercussionGridChart;
  panOffset(): number;
  panOffset(value: number): BeatMathsPercussionGridChart;
  viewOffsetY(): number;
  viewOffsetY(value: number): BeatMathsPercussionGridChart;
  viewWidth(): number;
  viewWidth(value: number): BeatMathsPercussionGridChart;
  viewHeight(): number;
  viewHeight(value: number): BeatMathsPercussionGridChart;
  zoomX(): number;
  zoomX(value: number): BeatMathsPercussionGridChart;
  zoomY(): number;
  zoomY(value: number): BeatMathsPercussionGridChart;
  zoomK(): number;
  zoomK(value: number): BeatMathsPercussionGridChart;
  notes(): Array<{ id: string; xIndex: number; yIndex: number }>;
  notes(value: Array<{ id: string; xIndex: number; yIndex: number }>): BeatMathsPercussionGridChart;
  highlightedIds(): Set<string>;
  highlightedIds(value: Set<string>): BeatMathsPercussionGridChart;
  notesEnabled(): boolean;
  notesEnabled(value: boolean): BeatMathsPercussionGridChart;
  mode(): "notes" | "joins" | "play";
  mode(value: "notes" | "joins" | "play"): BeatMathsPercussionGridChart;
  onNoteMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNoteMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsPercussionGridChart;
  onNotePreviewMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNotePreviewMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsPercussionGridChart;
  onNoteDragState(): ((isDragging: boolean) => void) | null;
  onNoteDragState(value: ((isDragging: boolean) => void) | null): BeatMathsPercussionGridChart;
  onDragLockChange(): ((id: string, locked: boolean) => void) | null;
  onDragLockChange(value: ((id: string, locked: boolean) => void) | null): BeatMathsPercussionGridChart;
  onNoteDelete(): ((id: string) => void) | null;
  onNoteDelete(value: ((id: string) => void) | null): BeatMathsPercussionGridChart;
  activeLongPressIds(): Set<string>;
  activeLongPressIds(value: Set<string>): BeatMathsPercussionGridChart;
  onLongPressAdd(): ((id: string) => void) | null;
  onLongPressAdd(value: ((id: string) => void) | null): BeatMathsPercussionGridChart;
  onLongPressClear(): (() => void) | null;
  onLongPressClear(value: (() => void) | null): BeatMathsPercussionGridChart;
  onInstrumentAssign(): ((id: string) => void) | null;
  onInstrumentAssign(value: ((id: string) => void) | null): BeatMathsPercussionGridChart;
  instrumentLabelById(): Record<string, string>;
  instrumentLabelById(value: Record<string, string>): BeatMathsPercussionGridChart;
  playheadXIndex(): number;
  playheadXIndex(value: number): BeatMathsPercussionGridChart;
  playheadVisible(): boolean;
  playheadVisible(value: boolean): BeatMathsPercussionGridChart;
};

const beatMathsPercussionGridComponent = (): BeatMathsPercussionGridChart => {
  let width = 0;
  let height = 0;
  let xCount = 68;
  let yCount = 20;
  let xOriginIndex = 0;
  let panOffset = 0;
  let viewOffsetY = 0;
  let viewWidth = 0;
  let viewHeight = 0;
  let zoomX = 0;
  let zoomY = 0;
  let zoomK = 1;
  let notes: Array<{ id: string; xIndex: number; yIndex: number }> = [];
  let highlightedIds = new Set<string>();
  let notesEnabled = true;
  let mode: "notes" | "joins" | "play" = "notes";
  let onNoteMove: ((id: string, xIndex: number, yIndex: number) => void) | null = null;
  let onNotePreviewMove: ((id: string, xIndex: number, yIndex: number) => void) | null = null;
  let onNoteDragState: ((isDragging: boolean) => void) | null = null;
  let onDragLockChange: ((id: string, locked: boolean) => void) | null = null;
  let onNoteDelete: ((id: string) => void) | null = null;
  let activeLongPressIds = new Set<string>();
  let onLongPressAdd: ((id: string) => void) | null = null;
  let onLongPressClear: (() => void) | null = null;
  let onInstrumentAssign: ((id: string) => void) | null = null;
  let instrumentLabelById: Record<string, string> = {};
  let playheadXIndex = 0;
  let playheadVisible = false;
  let wasCompactYTickLabels = false;

  const playhead = beatMathsGridPlayheadComponent();
  const notesComponent = beatMathsGridNotesComponent();

  const outerContainerRect = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection
      .selectAll("rect.percussion-bg")
      .data([{ width, height }])
      .join("rect")
        .attr("class", "percussion-bg")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("fill", "#1B1E2B");
  };

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const safeOffset = Math.max(0, Math.min(panOffset, safeWidth));
      const safeZoomK = Math.max(0.01, zoomK);
      const safeViewWidth = Math.max(1, viewWidth);
      const safeViewHeight = Math.max(1, viewHeight);
      const paddingLeft = 28;
      const paddingTop = 10;
      const paddingRight = 8;
      const paddingBottom = 28;
      const innerWidth = Math.max(1, safeWidth - paddingLeft - paddingRight);
      const innerHeight = Math.max(1, safeHeight - paddingTop - paddingBottom);
      const innerX = paddingLeft;
      const innerY = paddingTop;
      const viewBoxWidth = safeViewWidth / safeZoomK;
      const viewBoxHeight = safeViewHeight / safeZoomK;
      const maxViewX = Math.max(0, safeWidth - viewBoxWidth);
      const maxViewY = Math.max(0, safeHeight - viewBoxHeight);
      const baseViewX = Math.max(0, Math.min(-zoomX / safeZoomK, maxViewX));
      const baseViewY = Math.max(0, Math.min(-zoomY / safeZoomK, maxViewY));
      const viewY = Math.max(0, Math.min(baseViewY + viewOffsetY, maxViewY));
      const viewX = Math.max(0, Math.min(baseViewX + safeOffset, maxViewX));

      svg
        .attr("viewBox", `${viewX} ${viewY} ${viewBoxWidth} ${viewBoxHeight}`)
        .attr("preserveAspectRatio", "xMidYMid slice");

      const xStep = innerWidth / Math.max(1, xCount);
      const yStep = innerHeight / Math.max(1, yCount);
      const displayedYStep = yStep * safeZoomK;
      const baseGridStrokeWidth = Math.max(0.5, Math.min(displayedYStep / 10, 1));
      const highlightedGridStrokeWidth = Math.max(0.5, Math.min((1.15 * displayedYStep) / 10, 1.25));
      const centerX = innerX + xOriginIndex * xStep;
      const axisY = innerY + innerHeight;
      const tickLength = Math.min(6, innerHeight * 0.1);
      const labelOffset = 4;
      const compactYTickLabels = safeWidth > safeHeight * 1.2;
      const yTickLabelFontSize = 10;//compactYTickLabels ? 7.5 : 10;
      if (compactYTickLabels !== wasCompactYTickLabels) {
        wasCompactYTickLabels = compactYTickLabels;
      }
      const axisColour = "#FFF8E7";
      const yTickX1 = centerX - tickLength;
      const yTickX2 = centerX;
      const yLabelX = centerX - tickLength - labelOffset;
      const yLabelAnchor = "end";

      const xTicks = d3.range(0, xCount + 1).map((index) => ({
        value: innerX + index * xStep,
        offset: index - xOriginIndex,
      }));
      const yTicks = d3.range(0, yCount + 1).map((index) => ({
        value: innerY + index * yStep,
        label: yCount - index,
        index,
      }));

      svg.call(outerContainerRect);

      svg
        .selectAll("line.grid-x")
        .data(xTicks)
        .join("line")
          .attr("class", "grid-x")
          .attr("x1", (d) => d.value)
          .attr("x2", (d) => d.value)
          .attr("y1", innerY)
          .attr("y2", innerY + innerHeight)
          .attr("stroke", (d) => (Math.abs(d.offset) % 16 === 0 ? "#E6E9F2" : "#4A5369"))
          .attr("stroke-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.45 : 0.2))
          .attr("stroke-width", (d) => (Math.abs(d.offset) % 16 === 0 ? highlightedGridStrokeWidth : baseGridStrokeWidth))
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("line.grid-y")
        .data(yTicks)
        .join("line")
          .attr("class", "grid-y")
          .attr("y1", (d) => d.value)
          .attr("y2", (d) => d.value)
          .attr("x1", innerX)
          .attr("x2", innerX + innerWidth)
          .attr("stroke", "#4A5369")
          .attr("stroke-opacity", 0.2)
          .attr("stroke-width", baseGridStrokeWidth)
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("line.axis")
        .data([
          { x1: centerX, y1: innerY, x2: centerX, y2: innerY + innerHeight },
          { x1: innerX, y1: axisY, x2: innerX + innerWidth, y2: axisY },
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
          .attr("y1", axisY - tickLength / 2)
          .attr("y2", axisY + tickLength / 2)
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
          .attr("y", axisY + tickLength / 2 + labelOffset)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging")
          .attr("fill", axisColour)
          .attr("fill-opacity", (d) => (Math.abs(d.offset) % 16 === 0 ? 0.85 : 0.65))
          .attr("font-size", (d) => (Math.abs(d.offset) % 16 === 0 ? 12 : 10))
          .attr("font-family", "var(--font-montserrat)")
          .text((d) => (d.offset === 0 ? "" : d.offset));

      svg
        .selectAll("line.y-tick")
        .data(yTicks)
        .join("line")
          .attr("class", "y-tick")
          .attr("x1", yTickX1)
          .attr("x2", yTickX2)
          .attr("y1", (d) => d.value)
          .attr("y2", (d) => d.value)
          .attr("stroke", axisColour)
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1)
          .attr("shape-rendering", "crispEdges");

      svg
        .selectAll("text.y-tick-label")
        .data(yTicks.filter((tick) => tick.label !== 0))
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
          .text((d) => d.label);

      svg
        .selectAll("circle.origin")
        .data([{ x: centerX, y: axisY }])
        .join("circle")
          .attr("class", "origin")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 6)
          .attr("fill", "#1B1E2B")
          .attr("stroke", axisColour)
          .attr("stroke-width", 1.25);

      svg
        .selectAll("circle.corner")
        .data([
          { x: innerX, y: innerY },
          { x: innerX + innerWidth, y: innerY },
          { x: innerX, y: innerY + innerHeight },
          { x: innerX + innerWidth, y: innerY + innerHeight },
        ])
        .join("circle")
          .attr("class", "corner")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 4)
          .attr("fill", axisColour);

      svg.call(
        notesComponent
          .width(innerWidth)
          .height(innerHeight)
          .xCount(xCount)
          .yCount(yCount)
          .xOffset(innerX)
          .yOffset(innerY)
          .mode(mode)
          .notes(notes)
          .highlightedIds(highlightedIds)
          .notesEnabled(notesEnabled)
          .onNoteMove(onNoteMove)
          .onNotePreviewMove(onNotePreviewMove)
          .onNoteDragState(onNoteDragState)
          .onDragLockChange(onDragLockChange)
          .onNoteDelete(onNoteDelete)
          .activeLongPressIds(activeLongPressIds)
          .onLongPressAdd(onLongPressAdd)
          .onLongPressClear(onLongPressClear)
          .onInstrumentAssign(onInstrumentAssign)
          .instrumentLabelById(instrumentLabelById)
      );

      svg.call(
        playhead
          .width(innerWidth)
          .height(innerHeight)
          .xCount(xCount)
          .xOffset(innerX)
          .yOffset(innerY)
          .xIndex(playheadXIndex)
          .visible(playheadVisible)
      );
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

  chart.xOriginIndex = (value?: number) => {
    if (value === undefined) {
      return xOriginIndex;
    }
    xOriginIndex = value;
    return chart;
  };

  chart.panOffset = (value?: number) => {
    if (value === undefined) {
      return panOffset;
    }
    panOffset = value;
    return chart;
  };

  chart.viewOffsetY = (value?: number) => {
    if (value === undefined) {
      return viewOffsetY;
    }
    viewOffsetY = value;
    return chart;
  };

  chart.viewWidth = (value?: number) => {
    if (value === undefined) {
      return viewWidth;
    }
    viewWidth = value;
    return chart;
  };

  chart.viewHeight = (value?: number) => {
    if (value === undefined) {
      return viewHeight;
    }
    viewHeight = value;
    return chart;
  };

  chart.zoomX = (value?: number) => {
    if (value === undefined) {
      return zoomX;
    }
    zoomX = value;
    return chart;
  };

  chart.zoomY = (value?: number) => {
    if (value === undefined) {
      return zoomY;
    }
    zoomY = value;
    return chart;
  };

  chart.zoomK = (value?: number) => {
    if (value === undefined) {
      return zoomK;
    }
    zoomK = value;
    return chart;
  };

  chart.playheadXIndex = (value?: number) => {
    if (value === undefined) {
      return playheadXIndex;
    }
    playheadXIndex = value;
    return chart;
  };

  chart.playheadVisible = (value?: boolean) => {
    if (value === undefined) {
      return playheadVisible;
    }
    playheadVisible = value;
    return chart;
  };

  chart.notes = (value?: Array<{ id: string; xIndex: number; yIndex: number }>) => {
    if (value === undefined) {
      return notes;
    }
    notes = value;
    return chart;
  };

  chart.highlightedIds = (value?: Set<string>) => {
    if (value === undefined) {
      return highlightedIds;
    }
    highlightedIds = value ?? new Set();
    return chart;
  };

  chart.notesEnabled = (value?: boolean) => {
    if (value === undefined) {
      return notesEnabled;
    }
    notesEnabled = value;
    return chart;
  };

  chart.mode = (value?: "notes" | "joins" | "play") => {
    if (value === undefined) {
      return mode;
    }
    mode = value;
    return chart;
  };

  chart.onNoteMove = (value?: ((id: string, xIndex: number, yIndex: number) => void) | null) => {
    if (value === undefined) {
      return onNoteMove;
    }
    onNoteMove = value ?? null;
    return chart;
  };

  chart.onNotePreviewMove = (value?: ((id: string, xIndex: number, yIndex: number) => void) | null) => {
    if (value === undefined) {
      return onNotePreviewMove;
    }
    onNotePreviewMove = value ?? null;
    return chart;
  };

  chart.onNoteDragState = (value?: ((isDragging: boolean) => void) | null) => {
    if (value === undefined) {
      return onNoteDragState;
    }
    onNoteDragState = value ?? null;
    return chart;
  };

  chart.onDragLockChange = (value?: ((id: string, locked: boolean) => void) | null) => {
    if (value === undefined) {
      return onDragLockChange;
    }
    onDragLockChange = value ?? null;
    return chart;
  };

  chart.onNoteDelete = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onNoteDelete;
    }
    onNoteDelete = value ?? null;
    return chart;
  };

  chart.activeLongPressIds = (value?: Set<string>) => {
    if (value === undefined) {
      return activeLongPressIds;
    }
    activeLongPressIds = value ?? new Set();
    return chart;
  };

  chart.onLongPressAdd = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onLongPressAdd;
    }
    onLongPressAdd = value ?? null;
    return chart;
  };

  chart.onLongPressClear = (value?: (() => void) | null) => {
    if (value === undefined) {
      return onLongPressClear;
    }
    onLongPressClear = value ?? null;
    return chart;
  };

  chart.onInstrumentAssign = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onInstrumentAssign;
    }
    onInstrumentAssign = value ?? null;
    return chart;
  };

  chart.instrumentLabelById = (value?: Record<string, string>) => {
    if (value === undefined) {
      return instrumentLabelById;
    }
    instrumentLabelById = value ?? {};
    return chart;
  };

  return chart as BeatMathsPercussionGridChart;
};

export default beatMathsPercussionGridComponent;
