import * as d3 from "d3";

type Note = {
  id: string;
  xIndex: number;
  yIndex: number;
};

type JoinBehavior = {
  action: "continue" | "repeat";
  scope: "indefinitely" | "for" | "until";
  value: number;
};

type JoinEdge = {
  id: string;
  fromId: string;
  viaId?: string;
  viaId2?: string;
  toId: string;
  waypointIds?: string[];
  behavior?: JoinBehavior;
  groupKey?: string;
  type: "step" | "linear" | "quadratic" | "cubic" | "sine";
};

type BeatMathsGridJoinChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridJoinChart;
  height(): number;
  height(value: number): BeatMathsGridJoinChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridJoinChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridJoinChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridJoinChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridJoinChart;
  notes(): Note[];
  notes(value: Note[]): BeatMathsGridJoinChart;
  edges(): JoinEdge[];
  edges(value: JoinEdge[]): BeatMathsGridJoinChart;
  joinsEnabled(): boolean;
  joinsEnabled(value: boolean): BeatMathsGridJoinChart;
  selectedJoinIds(): Set<string>;
  selectedJoinIds(value: Set<string>): BeatMathsGridJoinChart;
  onJoinClick(): ((id: string) => void) | null;
  onJoinClick(value: ((id: string) => void) | null): BeatMathsGridJoinChart;
  onJoinDelete(): ((id: string) => void) | null;
  onJoinDelete(value: ((id: string) => void) | null): BeatMathsGridJoinChart;
  // Grouping disabled for now.
  // onJoinUngroup(): ((groupKey: string) => void) | null;
  // onJoinUngroup(value: ((groupKey: string) => void) | null): BeatMathsGridJoinChart;
  // groupColorByKey(): Record<string, string>;
  // groupColorByKey(value: Record<string, string>): BeatMathsGridJoinChart;
  joinEnabled(): boolean;
  joinEnabled(value: boolean): BeatMathsGridJoinChart;
};

const beatMathsGridJoinComponent = (): BeatMathsGridJoinChart => {
  let width = 0;
  let height = 0;
  let xCount = 68;
  let yCount = 56;
  let xOffset = 0;
  let yOffset = 0;
  let notes: Note[] = [];
  let edges: JoinEdge[] = [];
  let joinsEnabled = true;
  let selectedJoinIds = new Set<string>();
  let onJoinClick: ((id: string) => void) | null = null;
  let onJoinDelete: ((id: string) => void) | null = null;
  // Grouping disabled for now.
  // let onJoinUngroup: ((groupKey: string) => void) | null = null;
  // let groupColorByKey: Record<string, string> = {};
  let joinEnabled = false;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressFired = false;
  let deleteTargetId: string | null = null;
  // let ungroupTargetKey: string | null = null;
  const LONG_PRESS_MS = 400;
  const dragThreshold = 3;
  const deleteOffset = 18;

  const getQuadraticYAtX = (xIndex: number, from: Note, via: Note, to: Note) => {
    const x0 = from.xIndex;
    const x1 = via.xIndex;
    const x2 = to.xIndex;
    const denom0 = (x0 - x1) * (x0 - x2);
    const denom1 = (x1 - x0) * (x1 - x2);
    const denom2 = (x2 - x0) * (x2 - x1);
    if (denom0 === 0 || denom1 === 0 || denom2 === 0) {
      return null;
    }
    const l0 = ((xIndex - x1) * (xIndex - x2)) / denom0;
    const l1 = ((xIndex - x0) * (xIndex - x2)) / denom1;
    const l2 = ((xIndex - x0) * (xIndex - x1)) / denom2;
    return from.yIndex * l0 + via.yIndex * l1 + to.yIndex * l2;
  };

  const getCubicYAtX = (xIndex: number, from: Note, via1: Note, via2: Note, to: Note) => {
    const x0 = from.xIndex;
    const x1 = via1.xIndex;
    const x2 = via2.xIndex;
    const x3 = to.xIndex;
    const denom0 = (x0 - x1) * (x0 - x2) * (x0 - x3);
    const denom1 = (x1 - x0) * (x1 - x2) * (x1 - x3);
    const denom2 = (x2 - x0) * (x2 - x1) * (x2 - x3);
    const denom3 = (x3 - x0) * (x3 - x1) * (x3 - x2);
    if (denom0 === 0 || denom1 === 0 || denom2 === 0 || denom3 === 0) {
      return null;
    }
    const l0 = ((xIndex - x1) * (xIndex - x2) * (xIndex - x3)) / denom0;
    const l1 = ((xIndex - x0) * (xIndex - x2) * (xIndex - x3)) / denom1;
    const l2 = ((xIndex - x0) * (xIndex - x1) * (xIndex - x3)) / denom2;
    const l3 = ((xIndex - x0) * (xIndex - x1) * (xIndex - x2)) / denom3;
    return from.yIndex * l0 + via1.yIndex * l1 + via2.yIndex * l2 + to.yIndex * l3;
  };

  const getBehaviorLimit = (edge: JoinEdge, baseMinX: number, baseMaxX: number, maxX: number) => {
    if (!edge.behavior) {
      return Math.min(baseMaxX, maxX);
    }
    let limit = baseMaxX;
    if (edge.behavior.scope === "indefinitely") {
      limit = maxX;
    } else if (edge.behavior.scope === "for") {
      limit = baseMaxX + edge.behavior.value;
    } else {
      limit = edge.behavior.value;
    }
    return Math.min(Math.max(limit, baseMaxX), maxX);
  };

  const expandPoints = (
    edge: JoinEdge,
    points: Array<{ xIndex: number; yIndex: number }>,
    baseMinX: number,
    baseMaxX: number,
    maxX: number
  ) => {
    const limit = getBehaviorLimit(edge, baseMinX, baseMaxX, maxX);
    if (points.length < 2 || limit <= baseMinX) {
      return points;
    }
    if (!edge.behavior) {
      return points.filter((point) => point.xIndex <= limit);
    }
    const baseSpan = baseMaxX - baseMinX;
    if (baseSpan <= 0) {
      return points.filter((point) => point.xIndex <= limit);
    }
    const copies = Math.floor((limit - baseMinX) / baseSpan);
    const expanded: Array<{ xIndex: number; yIndex: number }> = [];
    for (let i = 0; i <= copies; i += 1) {
      const offset = i * baseSpan;
      points.forEach((point) => {
        const nextX = point.xIndex + offset;
        if (nextX <= limit) {
          expanded.push({ xIndex: nextX, yIndex: point.yIndex });
        }
      });
    }
    return expanded;
  };

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / xCount;
      const yStep = safeHeight / yCount;
      const baseJoinStrokeWidth = Math.max(1.25, Math.min((3 * yStep) / 10, 3));
      const highlightedJoinStrokeWidth = Math.max(
        baseJoinStrokeWidth + 0.5,
        Math.min((3.75 * yStep) / 10, 3.75)
      );
      const toX = (xIndex: number) => xOffset + xIndex * xStep;
      const toY = (yIndex: number) => yOffset + yIndex * yStep;
      const noteById = new Map(notes.map((note) => [note.id, note]));
      const edgesToRender = joinEnabled ? edges : [];

      const line = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinear);

      const stepLine = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveStepAfter);

      const buildStepSegments = (points: Array<{ xIndex: number; yIndex: number }>) => {
        const horizontals: Array<{ x1: number; x2: number; y: number }> = [];
        const verticals: Array<{ x: number; y1: number; y2: number }> = [];
        for (let i = 0; i < points.length - 1; i += 1) {
          const current = points[i];
          const next = points[i + 1];
          horizontals.push({ x1: current.xIndex, x2: next.xIndex, y: current.yIndex });
          verticals.push({ x: next.xIndex, y1: current.yIndex, y2: next.yIndex });
        }
        return { horizontals, verticals };
      };

      const buildHorizontalPath = (segments: Array<{ x1: number; x2: number; y: number }>) =>
        segments
          .map(
            (segment) =>
              `M${toX(segment.x1)} ${toY(segment.y)} L${toX(segment.x2)} ${toY(segment.y)}`
          )
          .join(" ");

      const buildRepeatSegments = (
        entry: {
          edge: JoinEdge;
          basePoints: Array<{ xIndex: number; yIndex: number }>;
          baseMinX: number;
          baseMaxX: number;
        }
      ) => {
        if (entry.edge.type === "step" || entry.edge.behavior?.action !== "repeat") {
          return [];
        }
        const span = entry.baseMaxX - entry.baseMinX;
        if (span <= 0) {
          return [];
        }
        const limit = getBehaviorLimit(entry.edge, entry.baseMinX, entry.baseMaxX, xCount);
        const copies = Math.floor((limit - entry.baseMinX) / span);
        if (copies <= 0) {
          return [];
        }
        const segments: Array<{ edge: JoinEdge; d: string }> = [];
        for (let i = 1; i <= copies; i += 1) {
          const offset = i * span;
          const shifted = entry.basePoints.map((point) => ({
            x: toX(point.xIndex + offset),
            y: toY(point.yIndex),
          }));
          if (shifted.length < 2) {
            continue;
          }
          segments.push({ edge: entry.edge, d: line(shifted) ?? "" });
        }
        return segments.filter((segment) => segment.d);
      };

      const buildStepRepeatSegments = (entry: {
        edge: JoinEdge;
        basePoints: Array<{ xIndex: number; yIndex: number }>;
        baseMinX: number;
        baseMaxX: number;
      }) => {
        if (entry.edge.type !== "step" || entry.edge.behavior?.action !== "repeat") {
          return { horizontals: [], verticals: [] };
        }
        const span = entry.baseMaxX - entry.baseMinX;
        if (span <= 0) {
          return { horizontals: [], verticals: [] };
        }
        const limit = getBehaviorLimit(entry.edge, entry.baseMinX, entry.baseMaxX, xCount);
        const copies = Math.floor((limit - entry.baseMinX) / span);
        const horizontals: Array<{ edge: JoinEdge; x1: number; x2: number; y: number }> = [];
        const verticals: Array<{ edge: JoinEdge; x: number; y1: number; y2: number }> = [];
        for (let i = 1; i <= copies; i += 1) {
          const offset = i * span;
          const shifted = entry.basePoints.map((point) => ({
            xIndex: point.xIndex + offset,
            yIndex: point.yIndex,
          }));
          const segments = buildStepSegments(shifted);
          segments.horizontals.forEach((segment) => {
            horizontals.push({
              edge: entry.edge,
              x1: toX(segment.x1),
              x2: toX(segment.x2),
              y: toY(segment.y),
            });
          });
          segments.verticals.forEach((segment) => {
            verticals.push({
              edge: entry.edge,
              x: toX(segment.x),
              y1: toY(segment.y1),
              y2: toY(segment.y2),
            });
          });
        }
        return { horizontals, verticals };
      };

      const edgePaths = edgesToRender
        .map((edge) => {
          const from = noteById.get(edge.fromId);
          const to = noteById.get(edge.toId);
          if (!from || !to) {
            return null;
          }
          const fromX = toX(from.xIndex);
          const fromY = toY(from.yIndex);
          const toXValue = toX(to.xIndex);
          const toYValue = toY(to.yIndex);
          if (edge.type === "quadratic") {
            const via = edge.viaId ? noteById.get(edge.viaId) : null;
            if (!via) {
              return null;
            }
            const extent = d3.extent([from.xIndex, to.xIndex, via.xIndex]);
            if (!extent[0] && extent[0] !== 0) {
              return null;
            }
            if (!extent[1] && extent[1] !== 0) {
              return null;
            }
            const minX = extent[0];
            const maxX = extent[1];
            const span = maxX - minX;
            if (span <= 0) {
              return null;
            }
            const sampleCount = Math.max(2, Math.round(span * 4) + 1);
            const step = span / (sampleCount - 1);
            const points = d3
              .range(sampleCount)
              .map((i) => {
                const xIndex = minX + step * i;
                const yIndex = getQuadraticYAtX(xIndex, from, via, to);
                if (yIndex === null) {
                  return null;
                }
                return { xIndex, yIndex };
              })
              .filter((point): point is { xIndex: number; yIndex: number } => point !== null);
            if (points.length < 2) {
              return null;
            }
            const scaled = points.map((point) => ({ x: toX(point.xIndex), y: toY(point.yIndex) }));
            const midIndex = Math.floor(scaled.length / 2);
            const midPoint = scaled[midIndex];
            return {
              edge,
              d: line(scaled),
              basePoints: points,
              baseMinX: minX,
              baseMaxX: maxX,
              midX: midPoint.x,
              midY: midPoint.y,
              fromX,
              fromY,
              toX: toXValue,
              toY: toYValue,
            };
          }
          if (edge.type === "cubic") {
            const via1 = edge.viaId ? noteById.get(edge.viaId) : null;
            const via2 = edge.viaId2 ? noteById.get(edge.viaId2) : null;
            if (!via1 || !via2) {
              return null;
            }
            const extent = d3.extent([from.xIndex, to.xIndex, via1.xIndex, via2.xIndex]);
            if (!extent[0] && extent[0] !== 0) {
              return null;
            }
            if (!extent[1] && extent[1] !== 0) {
              return null;
            }
            const minX = extent[0];
            const maxX = extent[1];
            const span = maxX - minX;
            if (span <= 0) {
              return null;
            }
            const sampleCount = Math.max(2, Math.round(span * 5) + 1);
            const step = span / (sampleCount - 1);
            const points = d3
              .range(sampleCount)
              .map((i) => {
                const xIndex = minX + step * i;
                const yIndex = getCubicYAtX(xIndex, from, via1, via2, to);
                if (yIndex === null) {
                  return null;
                }
                return { xIndex, yIndex };
              })
              .filter((point): point is { xIndex: number; yIndex: number } => point !== null);
            if (points.length < 2) {
              return null;
            }
            const scaled = points.map((point) => ({ x: toX(point.xIndex), y: toY(point.yIndex) }));
            const midIndex = Math.floor(scaled.length / 2);
            const midPoint = scaled[midIndex];
            return {
              edge,
              d: line(scaled),
              basePoints: points,
              baseMinX: minX,
              baseMaxX: maxX,
              midX: midPoint.x,
              midY: midPoint.y,
              fromX,
              fromY,
              toX: toXValue,
              toY: toYValue,
            };
          }
          if (edge.type === "sine") {
            const via = edge.viaId ? noteById.get(edge.viaId) : null;
            if (!via) {
              return null;
            }
            const axisY = from.yIndex;
            if (axisY !== to.yIndex) {
              return null;
            }
            const extent = d3.extent([from.xIndex, to.xIndex]);
            if (!extent[0] && extent[0] !== 0) {
              return null;
            }
            if (!extent[1] && extent[1] !== 0) {
              return null;
            }
            const minX = extent[0];
            const maxX = extent[1];
            const span = maxX - minX;
            if (span <= 0) {
              return null;
            }
            const cycleSpan = span * 2;
            const omega = Math.PI / span;
            const sinTerm = Math.sin(omega * (via.xIndex - minX));
            if (sinTerm === 0) {
              return null;
            }
            // Lowest-frequency full-wave (period=2L) keeps the curve smooth and makes it pass through the 3rd point.
            const amplitude = (via.yIndex - axisY) / sinTerm;
            const sampleCount = Math.max(2, Math.round(cycleSpan * 6) + 1);
            const step = cycleSpan / (sampleCount - 1);
            const points = d3.range(sampleCount).map((i) => {
              const xIndex = minX + step * i;
              const yIndex = axisY + amplitude * Math.sin(omega * (xIndex - minX));
              return { xIndex, yIndex };
            });
            if (points.length < 2) {
              return null;
            }
            const scaled = points.map((point) => ({ x: toX(point.xIndex), y: toY(point.yIndex) }));
            const midIndex = Math.floor(scaled.length / 2);
            const midPoint = scaled[midIndex];
            return {
              edge,
              d: line(scaled),
              basePoints: points,
              baseMinX: minX,
              baseMaxX: minX + cycleSpan,
              midX: midPoint.x,
              midY: midPoint.y,
              fromX,
              fromY,
              toX: toXValue,
              toY: toYValue,
            };
          }
          const waypointNotes = edge.waypointIds
            ? edge.waypointIds
                .map((id) => noteById.get(id))
                .filter((note): note is Note => Boolean(note))
            : [];
          const orderedWaypoints =
            edge.type !== "quadratic" && edge.type !== "cubic" && edge.type !== "sine" && waypointNotes.length >= 2
              ? waypointNotes.sort((a, b) => (a.xIndex !== b.xIndex ? a.xIndex - b.xIndex : a.yIndex - b.yIndex))
              : [];
          const points =
            orderedWaypoints.length >= 2
              ? orderedWaypoints.map((note) => ({ xIndex: note.xIndex, yIndex: note.yIndex }))
              : [
                  { xIndex: from.xIndex, yIndex: from.yIndex },
                  { xIndex: to.xIndex, yIndex: to.yIndex },
                ];
          const minX = points[0].xIndex;
          const maxX = points[points.length - 1].xIndex;
          if (points.length < 2) {
            return null;
          }
          const scaled = points.map((point) => ({ x: toX(point.xIndex), y: toY(point.yIndex) }));
          const midIndex = Math.floor(scaled.length / 2);
          const midPoint = scaled[midIndex];
          if (edge.type === "step") {
            const segments = buildStepSegments(points);
            const horizontalD = buildHorizontalPath(segments.horizontals);
            const stepVerticals = segments.verticals.map((segment) => ({
              x: toX(segment.x),
              y1: toY(segment.y1),
              y2: toY(segment.y2),
            }));
            return {
              edge,
              d: stepLine(scaled),
              basePoints: points,
              baseMinX: minX,
              baseMaxX: maxX,
              midX: midPoint.x,
              midY: midPoint.y,
              fromX,
              fromY,
              toX: toXValue,
              toY: toYValue,
              horizontalD,
              stepVerticals,
            };
          }
          return {
            edge,
            d: line(scaled),
            basePoints: points,
            baseMinX: minX,
            baseMaxX: maxX,
            midX: midPoint.x,
            midY: midPoint.y,
            fromX,
            fromY,
            toX: toXValue,
            toY: toYValue,
          };
        })
        .filter(
          (
            entry
          ): entry is {
            edge: JoinEdge;
            d: string;
            basePoints: Array<{ xIndex: number; yIndex: number }>;
            baseMinX: number;
            baseMaxX: number;
            midX: number;
            midY: number;
            fromX: number;
            fromY: number;
            toX: number;
            toY: number;
            horizontalD?: string | null;
            stepVerticals?: Array<{ x: number; y1: number; y2: number }>;
          } =>
            Boolean(entry?.d)
        );

      const hitStroke = joinsEnabled ? "transparent" : "none";
      const hitPointerEvents = joinsEnabled ? "stroke" : "none";
      const hitStrokeWidth = 24;
      const isLongPressedJoin = (edgeId: string) => deleteTargetId === edgeId;
      const getJoinStroke = (edgeId: string) => {
        if (isLongPressedJoin(edgeId)) {
          return "#FFFFFF";
        }
        if (selectedJoinIds.has(edgeId)) {
          return "#FFE1A8";
        }
        return "#C9D3E3";
      };
      const getJoinStrokeWidth = (edgeId: string) => {
        if (isLongPressedJoin(edgeId) || selectedJoinIds.has(edgeId)) {
          return highlightedJoinStrokeWidth;
        }
        return baseJoinStrokeWidth;
      };

      const clearLongPress = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        longPressFired = false;
      };

      svg.on("pointerdown.join-delete-dismiss", (event) => {
        const target = event.target as Element | null;
        if (target?.closest?.("g.join-delete")) {
          return;
        }
        if (deleteTargetId) {
          event.stopPropagation();
          event.preventDefault();
          deleteTargetId = null;
          svg.call(chart);
        }
        // Grouping disabled for now.
      });

      svg
        .selectAll("path.join-hit")
        .data(edgePaths, (d) => d.edge.id)
        .join("path")
          .attr("class", "join-hit")
          .attr("d", (d) => d.d)
          .attr("fill", "none")
          .attr("stroke", hitStroke)
          .attr("stroke-width", hitStrokeWidth)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .style("cursor", joinsEnabled ? "pointer" : "default")
          .style("pointer-events", hitPointerEvents)
          .on("pointerdown", function (event, d) {
            if (!joinsEnabled) {
              return;
            }
            clearLongPress();
            longPressFired = false;
            (this as SVGPathElement).dataset.pointerHandled = "false";
            (this as SVGPathElement).dataset.suppressClick = "false";
            const startX = event.clientX;
            const startY = event.clientY;
            (this as SVGPathElement).dataset.pointerStartX = startX.toString();
            (this as SVGPathElement).dataset.pointerStartY = startY.toString();
            longPressTimer = setTimeout(() => {
              longPressFired = true;
              (this as SVGPathElement).dataset.suppressClick = "true";
              deleteTargetId = d.edge.id;
              svg.call(chart);
            }, LONG_PRESS_MS);
          })
          .on("pointermove", function (event) {
            if (!longPressTimer) {
              return;
            }
            const startX = Number((this as SVGPathElement).dataset.pointerStartX ?? "0");
            const startY = Number((this as SVGPathElement).dataset.pointerStartY ?? "0");
            const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
            if (distance > dragThreshold) {
              clearLongPress();
            }
          })
          .on("pointerup", function (event, d) {
            if ((this as SVGPathElement).dataset.pointerHandled === "true") {
              clearLongPress();
              return;
            }
            (this as SVGPathElement).dataset.pointerHandled = "true";
            if (longPressFired) {
              event.stopPropagation();
              event.preventDefault();
              window.setTimeout(() => {
                clearLongPress();
                (this as SVGPathElement).dataset.suppressClick = "false";
              }, 0);
              return;
            }
            if (!longPressFired) {
              if (deleteTargetId) {
                return;
              }
              onJoinClick?.(d.edge.id);
              // Grouping disabled for now.
              event.stopPropagation();
            }
            clearLongPress();
          })
          .on("click", function (event) {
            if ((this as SVGPathElement).dataset.suppressClick === "true") {
              event.stopPropagation();
              event.preventDefault();
              (this as SVGPathElement).dataset.suppressClick = "false";
            }
          })
          .on("pointerleave pointercancel", function () {
            clearLongPress();
          });

      svg
        .selectAll("path.join-line")
        .data(edgePaths, (d) => d.edge.id)
        .join("path")
          .attr("class", "join-line")
          .attr("d", (d) => (d.horizontalD && d.horizontalD.length > 0 ? d.horizontalD : d.d))
          .attr("fill", "none")
          .attr("stroke", (d) => getJoinStroke(d.edge.id))
          .attr("stroke-opacity", (d) => (d.fromX === d.toX ? 0.3 : 0.75))
          .attr("stroke-dasharray", (d) => (d.fromX === d.toX ? "4 4" : "none"))
          .attr("stroke-width", (d) => getJoinStrokeWidth(d.edge.id));

      const repeatOverlay = edgePaths.flatMap((entry) => buildRepeatSegments(entry));

      svg
        .selectAll("path.join-repeat")
        .data(repeatOverlay, (d, index) => `${d.edge.id}-r-${index}`)
        .join("path")
          .attr("class", "join-repeat")
          .attr("d", (d) => d.d)
          .attr("fill", "none")
          .attr("stroke", (d) => getJoinStroke(d.edge.id))
          .attr("stroke-opacity", 0.2)
          .attr("stroke-width", (d) => getJoinStrokeWidth(d.edge.id))
          .attr("stroke-dasharray", "none")
          .style("pointer-events", "none");

      const stepVerticals = edgePaths
        .filter((entry) => entry.edge.type === "step" && entry.stepVerticals)
        .flatMap((entry) =>
          (entry.stepVerticals ?? []).map((segment) => ({
            edge: entry.edge,
            x: segment.x,
            y1: segment.y1,
            y2: segment.y2,
          }))
        );

      const stepRepeatSegments = edgePaths.map((entry) => buildStepRepeatSegments(entry));

      const repeatStepHorizontals = stepRepeatSegments.flatMap((segment) => segment.horizontals);
      const repeatStepVerticals = stepRepeatSegments.flatMap((segment) => segment.verticals);

      svg
        .selectAll("path.join-line-vertical")
        .data(stepVerticals, (d) => d.edge.id)
        .join("path")
          .attr("class", "join-line-vertical")
          .attr("d", (d) => `M${d.x} ${d.y1} L${d.x} ${d.y2}`)
          .attr("fill", "none")
          .attr("stroke", (d) => getJoinStroke(d.edge.id))
          .attr("stroke-opacity", 0.3)
          .attr("stroke-dasharray", "4 4")
          .attr("stroke-width", (d) => getJoinStrokeWidth(d.edge.id))
          .style("pointer-events", "none");

      svg
        .selectAll("path.join-repeat-step-horizontal")
        .data(repeatStepHorizontals, (d, index) => `${d.edge.id}-h-${index}`)
        .join("path")
          .attr("class", "join-repeat-step-horizontal")
          .attr("d", (d) => `M${d.x1} ${d.y} L${d.x2} ${d.y}`)
          .attr("fill", "none")
          .attr("stroke", (d) => getJoinStroke(d.edge.id))
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", (d) => getJoinStrokeWidth(d.edge.id))
          .style("pointer-events", "none");

      svg
        .selectAll("path.join-repeat-step-vertical")
        .data(repeatStepVerticals, (d, index) => `${d.edge.id}-v-${index}`)
        .join("path")
          .attr("class", "join-repeat-step-vertical")
          .attr("d", (d) => `M${d.x} ${d.y1} L${d.x} ${d.y2}`)
          .attr("fill", "none")
          .attr("stroke", (d) => getJoinStroke(d.edge.id))
          .attr("stroke-opacity", 0.15)
          .attr("stroke-dasharray", "4 4")
          .attr("stroke-width", (d) => getJoinStrokeWidth(d.edge.id))
          .style("pointer-events", "none");

      svg
        .selectAll<SVGGElement, { edge: JoinEdge; midX: number; midY: number }>("g.join-delete")
        .data(
          edgePaths
            .filter((entry) => entry.edge.id === deleteTargetId)
            .map((entry) => ({
              edge: entry.edge,
              midX: entry.midX,
              midY: entry.midY,
            })),
          (d) => d.edge.id
        )
        .join(
          (enter) => enter.append("g"),
          (update) => update,
          (exit) => exit.remove()
        )
          .attr("class", "join-delete")
          .attr("transform", (d) => `translate(${d.midX}, ${d.midY - deleteOffset})`)
          .style("cursor", "pointer")
          .style("pointer-events", "all")
          .on("pointerdown", (event) => {
            event.stopPropagation();
            event.preventDefault();
          })
          .on("click", (event, d) => {
            event.stopPropagation();
            event.preventDefault();
            onJoinDelete?.(d.edge.id);
            deleteTargetId = null;
            svg.call(chart);
          })
          .call((deleteGroup) => {
            deleteGroup
              .selectAll("rect")
              .data((d) => [d])
              .join("rect")
                .attr("x", -20)
                .attr("y", -10)
                .attr("width", 40)
                .attr("height", 16)
                .attr("rx", 8)
                .attr("fill", "#F16B5D");
            deleteGroup
              .selectAll("text")
              .data((d) => [d])
              .join("text")
                .attr("x", 0)
                .attr("y", 2)
                .attr("text-anchor", "middle")
                .attr("font-size", 8)
                .attr("font-family", "var(--font-montserrat)")
                .attr("fill", "#ffffff")
            .text("Delete");
          });

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

  chart.notes = (value?: Note[]) => {
    if (value === undefined) {
      return notes;
    }
    notes = value;
    return chart;
  };

  chart.edges = (value?: JoinEdge[]) => {
    if (value === undefined) {
      return edges;
    }
    edges = value;
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

  chart.joinEnabled = (value?: boolean) => {
    if (value === undefined) {
      return joinEnabled;
    }
    joinEnabled = value;
    return chart;
  };

  return chart as BeatMathsGridJoinChart;
};

export default beatMathsGridJoinComponent;
