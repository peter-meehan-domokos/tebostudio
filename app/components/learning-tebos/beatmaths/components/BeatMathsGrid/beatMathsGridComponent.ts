import * as d3 from "d3";
import beatMathsGridAxesComponent from "./beatMathsGridAxesComponent";
import beatMathsGridLinesComponent from "./beatMathsGridLinesComponent";
import beatMathsGridMarkersComponent from "./beatMathsGridMarkersComponent";
import beatMathsGridJoinComponent from "./beatMathsGridJoinComponent";
import beatMathsGridNotesComponent from "./beatMathsGridNotesComponent";
import beatMathsGridPlayheadComponent from "./beatMathsGridPlayheadComponent";

type BeatMathsGridChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridChart;
  height(): number;
  height(value: number): BeatMathsGridChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridChart;
  xOriginIndex(): number;
  xOriginIndex(value: number): BeatMathsGridChart;
  allowedSemitoneSet(): Set<number>;
  allowedSemitoneSet(value: Set<number>): BeatMathsGridChart;
  soundingYIndices(): Set<number>;
  soundingYIndices(value: Set<number>): BeatMathsGridChart;
  mode(): "notes" | "joins" | "play";
  mode(value: "notes" | "joins" | "play"): BeatMathsGridChart;
  notes(): Array<{ id: string; xIndex: number; yIndex: number }>;
  notes(value: Array<{ id: string; xIndex: number; yIndex: number }>): BeatMathsGridChart;
  highlightedIds(): Set<string>;
  highlightedIds(value: Set<string>): BeatMathsGridChart;
  onNoteMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNoteMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsGridChart;
  onNotePreviewMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNotePreviewMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsGridChart;
  onNoteDragState(): ((isDragging: boolean) => void) | null;
  onNoteDragState(value: ((isDragging: boolean) => void) | null): BeatMathsGridChart;
  onDragLockChange(): ((id: string, locked: boolean) => void) | null;
  onDragLockChange(value: ((id: string, locked: boolean) => void) | null): BeatMathsGridChart;
  onLockedDragEnd(): ((id: string) => void) | null;
  onLockedDragEnd(value: ((id: string) => void) | null): BeatMathsGridChart;
  onNoteDelete(): ((id: string) => void) | null;
  onNoteDelete(value: ((id: string) => void) | null): BeatMathsGridChart;
  activeLongPressIds(): Set<string>;
  activeLongPressIds(value: Set<string>): BeatMathsGridChart;
  onLongPressAdd(): ((id: string) => void) | null;
  onLongPressAdd(value: ((id: string) => void) | null): BeatMathsGridChart;
  onLongPressClear(): (() => void) | null;
  onLongPressClear(value: (() => void) | null): BeatMathsGridChart;
  onInstrumentAssign(): ((id: string) => void) | null;
  onInstrumentAssign(value: ((id: string) => void) | null): BeatMathsGridChart;
  instrumentLabelById(): Record<string, string>;
  instrumentLabelById(value: Record<string, string>): BeatMathsGridChart;
  snapYIndex(): (yIndex: number) => number;
  snapYIndex(value: (yIndex: number) => number): BeatMathsGridChart;
  notesEnabled(): boolean;
  notesEnabled(value: boolean): BeatMathsGridChart;
  joinsEnabled(): boolean;
  joinsEnabled(value: boolean): BeatMathsGridChart;
  selectedJoinIds(): Set<string>;
  selectedJoinIds(value: Set<string>): BeatMathsGridChart;
  onJoinClick(): ((id: string) => void) | null;
  onJoinClick(value: ((id: string) => void) | null): BeatMathsGridChart;
  onJoinDelete(): ((id: string) => void) | null;
  onJoinDelete(value: ((id: string) => void) | null): BeatMathsGridChart;
  // Grouping disabled for now.
  // onJoinUngroup(): ((groupKey: string) => void) | null;
  // onJoinUngroup(value: ((groupKey: string) => void) | null): BeatMathsGridChart;
  // groupColorByKey(): Record<string, string>;
  // groupColorByKey(value: Record<string, string>): BeatMathsGridChart;
  joinEdges(): Array<{
    id: string;
    fromId: string;
    viaId?: string;
    viaId2?: string;
    toId: string;
    waypointIds?: string[];
    groupKey?: string;
    behavior?: {
      action: "continue" | "repeat";
      scope: "indefinitely" | "for" | "until";
      value: number;
    };
    type: "step" | "linear" | "quadratic" | "cubic" | "sine";
  }>;
  joinEdges(
    value: Array<{
      id: string;
      fromId: string;
      viaId?: string;
      viaId2?: string;
      toId: string;
      waypointIds?: string[];
      groupKey?: string;
      behavior?: {
        action: "continue" | "repeat";
        scope: "indefinitely" | "for" | "until";
        value: number;
      };
      type: "step" | "linear" | "quadratic" | "cubic" | "sine";
    }>
  ): BeatMathsGridChart;
  joinEnabled(): boolean;
  joinEnabled(value: boolean): BeatMathsGridChart;
  panOffset(): number;
  panOffset(value: number): BeatMathsGridChart;
  viewOffsetY(): number;
  viewOffsetY(value: number): BeatMathsGridChart;
  viewWidth(): number;
  viewWidth(value: number): BeatMathsGridChart;
  viewHeight(): number;
  viewHeight(value: number): BeatMathsGridChart;
  playheadXIndex(): number;
  playheadXIndex(value: number): BeatMathsGridChart;
  playheadVisible(): boolean;
  playheadVisible(value: boolean): BeatMathsGridChart;
  zoomX(): number;
  zoomX(value: number): BeatMathsGridChart;
  zoomY(): number;
  zoomY(value: number): BeatMathsGridChart;
  zoomK(): number;
  zoomK(value: number): BeatMathsGridChart;
};

const beatMathsGridComponent = (): BeatMathsGridChart => {
  const paddingLeft = 28;
  const paddingTop = 10;
  const paddingRight = 8;
  const paddingBottom = 10;
  let width = 0;
  let height = 0;
  let xCount = 68;
  let yCount = 56;
  let xOriginIndex = 0;
  let allowedSemitoneSet = new Set(d3.range(1, 13));
  let soundingYIndices = new Set<number>();
  let panOffset = 0;
  let viewOffsetY = 0;
  let viewWidth = 0;
  let viewHeight = 0;
  let playheadXIndex = 0;
  let playheadVisible = false;
  let zoomX = 0;
  let zoomY = 0;
  let zoomK = 1;
  let mode: "notes" | "joins" | "play" = "notes";
  const gridLines = beatMathsGridLinesComponent();
  const axes = beatMathsGridAxesComponent();
  const joinLines = beatMathsGridJoinComponent();
  const markers = beatMathsGridMarkersComponent();
  const notesComponent = beatMathsGridNotesComponent();
  const playhead = beatMathsGridPlayheadComponent();
  let notes: Array<{ id: string; xIndex: number; yIndex: number }> = [];
  let highlightedIds = new Set<string>();
  let onNoteMove: ((id: string, xIndex: number, yIndex: number) => void) | null = null;
  let onNotePreviewMove: ((id: string, xIndex: number, yIndex: number) => void) | null = null;
  let onNoteDragState: ((isDragging: boolean) => void) | null = null;
  let onDragLockChange: ((id: string, locked: boolean) => void) | null = null;
  let onLockedDragEnd: ((id: string) => void) | null = null;
  let onNoteDelete: ((id: string) => void) | null = null;
  let activeLongPressIds = new Set<string>();
  let onLongPressAdd: ((id: string) => void) | null = null;
  let onLongPressClear: (() => void) | null = null;
  let onInstrumentAssign: ((id: string) => void) | null = null;
  let instrumentLabelById: Record<string, string> = {};
  let snapYIndex = (yIndex: number) => yIndex;
  let notesEnabled = true;
  let joinsEnabled = true;
  let selectedJoinIds = new Set<string>();
  let onJoinClick: ((id: string) => void) | null = null;
  let onJoinDelete: ((id: string) => void) | null = null;
  // Grouping disabled for now.
  // let onJoinUngroup: ((groupKey: string) => void) | null = null;
  // let groupColorByKey: Record<string, string> = {};
  let joinEdges: Array<{
    id: string;
    fromId: string;
    viaId?: string;
    viaId2?: string;
    toId: string;
    waypointIds?: string[];
    groupKey?: string;
    behavior?: {
      action: "continue" | "repeat";
      scope: "indefinitely" | "for" | "until";
      value: number;
    };
    type: "step" | "linear" | "quadratic" | "cubic" | "sine";
  }> = [];
  let joinEnabled = false;
  const outerContainerRect = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);

      svg
        .selectAll("rect.outer-container")
        .data([{ width: safeWidth, height: safeHeight }])
        .join("rect")
          .attr("class", "outer-container")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", (d) => d.width)
          .attr("height", (d) => d.height)
          .attr("fill", "#1B1E2B");
    });
  };

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const innerWidth = Math.max(1, safeWidth - paddingLeft - paddingRight);
      const innerHeight = Math.max(1, safeHeight - paddingTop - paddingBottom);
      const safeOffset = Math.max(0, Math.min(panOffset, safeWidth));
      const safeZoomK = Math.max(0.01, zoomK);
      const safeViewWidth = Math.max(1, viewWidth);
      const safeViewHeight = Math.max(1, viewHeight);
      const viewBoxWidth = safeViewWidth / safeZoomK;
      const viewBoxHeight = safeViewHeight / safeZoomK;
      const minViewX = -viewBoxWidth;
      const maxViewX = Math.max(0, safeWidth - viewBoxWidth);
      const maxViewY = Math.max(0, safeHeight - viewBoxHeight);
      const baseViewX = Math.max(minViewX, Math.min(-zoomX / safeZoomK, maxViewX));
      const baseViewY = Math.max(0, Math.min(-zoomY / safeZoomK, maxViewY));
      const viewY = Math.max(0, Math.min(baseViewY + viewOffsetY, maxViewY));
      const viewX = Math.max(minViewX, Math.min(baseViewX + safeOffset, maxViewX));

      svg
        .attr("viewBox", `${viewX} ${viewY} ${viewBoxWidth} ${viewBoxHeight}`)
        .attr("preserveAspectRatio", "xMidYMid slice");

      svg
        .call(outerContainerRect)
        .call(
          gridLines
            .width(innerWidth)
            .height(innerHeight)
            .xCount(xCount)
            .yCount(yCount)
            .xOffset(paddingLeft)
            .yOffset(paddingTop)
            .xOriginIndex(xOriginIndex)
            .zoomK(safeZoomK)
            .allowedSemitoneSet(allowedSemitoneSet)
            .soundingYIndices(soundingYIndices)
        )
          .call(
            axes
              .width(innerWidth)
              .height(innerHeight)
              .xCount(xCount)
              .yCount(yCount)
              .xOffset(paddingLeft)
              .yOffset(paddingTop)
              .xOriginIndex(xOriginIndex)
              .allowedSemitoneSet(allowedSemitoneSet)
          )
          .call(
            joinLines
              .width(innerWidth)
              .height(innerHeight)
              .xCount(xCount)
              .yCount(yCount)
              .xOffset(paddingLeft)
              .yOffset(paddingTop)
              .notes(notes)
              .edges(joinEdges)
              .joinsEnabled(joinsEnabled)
              .selectedJoinIds(selectedJoinIds)
              .onJoinClick(onJoinClick)
              .onJoinDelete(onJoinDelete)
              // .onJoinUngroup(onJoinUngroup)
              // .groupColorByKey(groupColorByKey)
              .joinEnabled(joinEnabled)
          )
          .call(
            markers
              .width(innerWidth)
              .height(innerHeight)
              .xCount(xCount)
              .xOffset(paddingLeft)
              .yOffset(paddingTop)
              .xOriginIndex(xOriginIndex)
          )
          .call(
            playhead
              .width(innerWidth)
              .height(innerHeight)
              .xCount(xCount)
              .xOffset(paddingLeft)
              .yOffset(paddingTop)
              .xIndex(playheadXIndex)
              .visible(playheadVisible)
          )
          .call(
            notesComponent
              .width(innerWidth)
              .height(innerHeight)
              .xCount(xCount)
              .yCount(yCount)
              .xOffset(paddingLeft)
              .yOffset(paddingTop)
              .mode(mode)
              .notes(notes)
              .highlightedIds(highlightedIds)
              .notesEnabled(notesEnabled)
              .onNoteMove(onNoteMove)
              .onNotePreviewMove(onNotePreviewMove)
              .onNoteDragState(onNoteDragState)
              .onDragLockChange(onDragLockChange)
              .onLockedDragEnd(onLockedDragEnd)
              .onNoteDelete(onNoteDelete)
              .activeLongPressIds(activeLongPressIds)
              .onLongPressAdd(onLongPressAdd)
              .onLongPressClear(onLongPressClear)
              .onInstrumentAssign(onInstrumentAssign)
              .instrumentLabelById(instrumentLabelById)
                .snapYIndex(snapYIndex)
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

  chart.mode = (value?: "notes" | "joins" | "play") => {
    if (value === undefined) {
      return mode;
    }
    mode = value;
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
    highlightedIds = value;
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

  chart.onLockedDragEnd = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onLockedDragEnd;
    }
    onLockedDragEnd = value ?? null;
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

  chart.snapYIndex = (value?: (yIndex: number) => number) => {
    if (value === undefined) {
      return snapYIndex;
    }
    snapYIndex = value;
    return chart;
  };

  chart.notesEnabled = (value?: boolean) => {
    if (value === undefined) {
      return notesEnabled;
    }
    notesEnabled = value;
    return chart;
  };

  chart.joinsEnabled = (value?: boolean) => {
    if (value === undefined) {
      return joinsEnabled;
    }
    joinsEnabled = value;
    return chart;
  };

  chart.selectedJoinIds = (value?: Set<string>) => {
    if (value === undefined) {
      return selectedJoinIds;
    }
    selectedJoinIds = value;
    return chart;
  };

  chart.onJoinClick = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onJoinClick;
    }
    onJoinClick = value ?? null;
    return chart;
  };

  chart.onJoinDelete = (value?: ((id: string) => void) | null) => {
    if (value === undefined) {
      return onJoinDelete;
    }
    onJoinDelete = value ?? null;
    return chart;
  };

  // Grouping disabled for now.
  // chart.onJoinUngroup = (value?: ((groupKey: string) => void) | null) => {
  //   if (value === undefined) {
  //     return onJoinUngroup;
  //   }
  //   onJoinUngroup = value ?? null;
  //   return chart;
  // };

  // chart.groupColorByKey = (value?: Record<string, string>) => {
  //   if (value === undefined) {
  //     return groupColorByKey;
  //   }
  //   groupColorByKey = value;
  //   return chart;
  // };

  chart.joinEdges = (
    value?: Array<{
      id: string;
      fromId: string;
      viaId?: string;
      viaId2?: string;
      toId: string;
      behavior?: {
        action: "continue" | "repeat";
        scope: "indefinitely" | "for" | "until";
        value: number;
      };
      type: "step" | "linear" | "quadratic" | "cubic" | "sine";
    }>
  ) => {
    if (value === undefined) {
      return joinEdges;
    }
    joinEdges = value;
    return chart;
  };

  chart.joinEnabled = (value?: boolean) => {
    if (value === undefined) {
      return joinEnabled;
    }
    joinEnabled = value;
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


  return chart as BeatMathsGridChart;
};

export default beatMathsGridComponent;
