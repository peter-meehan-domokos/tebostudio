import * as d3 from "d3";

type Note = {
  id: string;
  xIndex: number;
  yIndex: number;
  instrumentId?: string | null;
};

type BeatMathsGridNotesChart = {
  (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>): void;
  width(): number;
  width(value: number): BeatMathsGridNotesChart;
  height(): number;
  height(value: number): BeatMathsGridNotesChart;
  xCount(): number;
  xCount(value: number): BeatMathsGridNotesChart;
  yCount(): number;
  yCount(value: number): BeatMathsGridNotesChart;
  xOffset(): number;
  xOffset(value: number): BeatMathsGridNotesChart;
  yOffset(): number;
  yOffset(value: number): BeatMathsGridNotesChart;
  mode(): "notes" | "joins" | "play";
  mode(value: "notes" | "joins" | "play"): BeatMathsGridNotesChart;
  notes(): Note[];
  notes(value: Note[]): BeatMathsGridNotesChart;
  highlightedIds(): Set<string>;
  highlightedIds(value: Set<string>): BeatMathsGridNotesChart;
  notesEnabled(): boolean;
  notesEnabled(value: boolean): BeatMathsGridNotesChart;
  onNoteMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNoteMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsGridNotesChart;
  onNotePreviewMove(): ((id: string, xIndex: number, yIndex: number) => void) | null;
  onNotePreviewMove(value: ((id: string, xIndex: number, yIndex: number) => void) | null): BeatMathsGridNotesChart;
  onNoteDragState(): ((isDragging: boolean) => void) | null;
  onNoteDragState(value: ((isDragging: boolean) => void) | null): BeatMathsGridNotesChart;
  onDragLockChange(): ((id: string, locked: boolean) => void) | null;
  onDragLockChange(value: ((id: string, locked: boolean) => void) | null): BeatMathsGridNotesChart;
  onLockedDragEnd(): ((id: string) => void) | null;
  onLockedDragEnd(value: ((id: string) => void) | null): BeatMathsGridNotesChart;
  onNoteDelete(): ((id: string) => void) | null;
  onNoteDelete(value: ((id: string) => void) | null): BeatMathsGridNotesChart;
  activeLongPressIds(): Set<string>;
  activeLongPressIds(value: Set<string>): BeatMathsGridNotesChart;
  onLongPressAdd(): ((id: string) => void) | null;
  onLongPressAdd(value: ((id: string) => void) | null): BeatMathsGridNotesChart;
  onLongPressClear(): (() => void) | null;
  onLongPressClear(value: (() => void) | null): BeatMathsGridNotesChart;
  onInstrumentAssign(): ((id: string) => void) | null;
  onInstrumentAssign(value: ((id: string) => void) | null): BeatMathsGridNotesChart;
  instrumentLabelById(): Record<string, string>;
  instrumentLabelById(value: Record<string, string>): BeatMathsGridNotesChart;
  snapYIndex(): (yIndex: number) => number;
  snapYIndex(value: (yIndex: number) => number): BeatMathsGridNotesChart;
};

const beatMathsGridNotesComponent = (): BeatMathsGridNotesChart => {
  let width = 0;
  let height = 0;
  let xCount = 68;
  let yCount = 56;
  let xOffset = 0;
  let yOffset = 0;
  let mode: "notes" | "joins" | "play" = "notes";
  let notes: Note[] = [];
  let highlightedIds = new Set<string>();
  let notesEnabled = true;
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
  let dragActiveId: string | null = null;
  let dragProxyId: string | null = null;
  let dragProxyXIndex = 0;
  let dragProxyYIndex = 0;
  let dragLockedIds = new Set<string>();
  let dragPinnedIds = new Set<string>();
  let dragTempId: string | null = null;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressFired = false;
  const LONG_PRESS_MS = 400;
  const handleOffset = 13;
  const handleScale = 1.3;
  const handlePath =
    "M0 -7.2 L0 7.2 M-7.2 0 L7.2 0 M0 -7.2 L-2.9 -4.3 M0 -7.2 L2.9 -4.3 M0 7.2 L-2.9 4.3 M0 7.2 L2.9 4.3 M-7.2 0 L-4.3 -2.9 M-7.2 0 L-4.3 2.9 M7.2 0 L4.3 -2.9 M7.2 0 L4.3 2.9";
  const dragThreshold = 3;
  const deleteOffset = 18;
  const iconFill = "#F2F5F9";
  const iconStroke = "#F2F5F9";

  const renderIcon = (group: d3.Selection<SVGGElement, Note, d3.BaseType, unknown>, label: string) => {
    group.selectAll("*").remove();
    switch (label) {
      case "Kick":
        group.append("circle").attr("r", 3.5).attr("fill", iconFill);
        break;
      case "Low Tom":
        group.append("rect").attr("x", -4).attr("y", -2).attr("width", 8).attr("height", 4).attr("rx", 1).attr("fill", iconFill);
        break;
      case "Mid Tom":
        group.append("rect").attr("x", -3.5).attr("y", -2.5).attr("width", 7).attr("height", 5).attr("rx", 1).attr("fill", iconFill);
        break;
      case "High Tom":
        group.append("rect").attr("x", -3).attr("y", -3).attr("width", 6).attr("height", 6).attr("rx", 1).attr("fill", iconFill);
        break;
      case "Snare":
        group.append("circle").attr("r", 3.5).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.3);
        break;
      case "Clap":
        group.append("rect").attr("x", -3.5).attr("y", -3.5).attr("width", 7).attr("height", 7).attr("rx", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.3);
        break;
      case "Closed Hat":
        group.append("polygon").attr("points", "0,-4 4,3 -4,3").attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.3);
        break;
      case "Open Hat":
        group.append("circle").attr("r", 3).attr("cy", -1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("line").attr("x1", -4).attr("x2", 4).attr("y1", 4).attr("y2", 4).attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
      case "Crash":
        group.append("circle").attr("r", 4).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("circle").attr("r", 1.2).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
      case "Ride":
        group.append("ellipse").attr("rx", 4).attr("ry", 2.5).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("circle").attr("r", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
      case "Piano":
        group.append("rect").attr("x", -4).attr("y", -3).attr("width", 8).attr("height", 6).attr("rx", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("line").attr("x1", -1.5).attr("x2", -1.5).attr("y1", -3).attr("y2", 3).attr("stroke", iconStroke).attr("stroke-width", 1.1);
        group.append("line").attr("x1", 1.5).attr("x2", 1.5).attr("y1", -3).attr("y2", 3).attr("stroke", iconStroke).attr("stroke-width", 1.1);
        break;
      case "E Piano":
        group.append("rect").attr("x", -4).attr("y", -3).attr("width", 8).attr("height", 6).attr("rx", 1.4).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("circle").attr("cx", -2).attr("cy", 0).attr("r", 0.9).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1);
        group.append("circle").attr("cx", 2).attr("cy", 0).attr("r", 0.9).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1);
        break;
      case "Organ":
        group.append("rect").attr("x", -4).attr("y", -2.5).attr("width", 8).attr("height", 5).attr("rx", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("line").attr("x1", -2).attr("x2", -2).attr("y1", -2).attr("y2", 2.5).attr("stroke", iconStroke).attr("stroke-width", 1);
        group.append("line").attr("x1", 0).attr("x2", 0).attr("y1", -2).attr("y2", 2.5).attr("stroke", iconStroke).attr("stroke-width", 1);
        group.append("line").attr("x1", 2).attr("x2", 2).attr("y1", -2).attr("y2", 2.5).attr("stroke", iconStroke).attr("stroke-width", 1);
        break;
      case "Synth Lead":
        group.append("polyline").attr("points", "-4,3 -2,-3 0,1 2,-4 4,1").attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
      case "Synth Bass":
        group.append("rect").attr("x", -4).attr("y", 0).attr("width", 8).attr("height", 3).attr("rx", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("line").attr("x1", -4).attr("x2", 4).attr("y1", 0).attr("y2", 0).attr("stroke", iconStroke).attr("stroke-width", 1);
        break;
      case "Pad":
        group.append("rect").attr("x", -4).attr("y", -3).attr("width", 8).attr("height", 6).attr("rx", 3).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
      case "Pluck":
        group.append("line").attr("x1", -3.5).attr("y1", 3).attr("x2", 3.5).attr("y2", -3).attr("stroke", iconStroke).attr("stroke-width", 1.2);
        group.append("circle").attr("cx", 3.5).attr("cy", -3).attr("r", 1).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        break;
      case "Guitar":
        group.append("circle").attr("cx", -1.5).attr("cy", 1.5).attr("r", 2).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        group.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 4).attr("y2", -3).attr("stroke", iconStroke).attr("stroke-width", 1.1);
        group.append("circle").attr("cx", 4).attr("cy", -3).attr("r", 0.8).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        break;
      case "Bell":
        group.append("path").attr("d", "M-3,-1 A3,3 0 0 1 3,-1 V2 H-3 Z").attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        group.append("circle").attr("cx", 0).attr("cy", 3).attr("r", 0.8).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        break;
      case "Strings":
        group.append("rect").attr("x", -4).attr("y", -3).attr("width", 8).attr("height", 6).attr("rx", 2).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.1);
        group.append("line").attr("x1", -2).attr("x2", -2).attr("y1", -3).attr("y2", 3).attr("stroke", iconStroke).attr("stroke-width", 0.9);
        group.append("line").attr("x1", 0).attr("x2", 0).attr("y1", -3).attr("y2", 3).attr("stroke", iconStroke).attr("stroke-width", 0.9);
        group.append("line").attr("x1", 2).attr("x2", 2).attr("y1", -3).attr("y2", 3).attr("stroke", iconStroke).attr("stroke-width", 0.9);
        break;
      default:
        group.append("circle").attr("r", 3).attr("fill", "none").attr("stroke", iconStroke).attr("stroke-width", 1.2);
        break;
    }
  };
  const instrumentButtonWidth = 80;
  const buttonGap = 3;
  const buttonOffsetX = instrumentButtonWidth / 2 + buttonGap / 2;
  const instrumentOffsetX = -buttonOffsetX;
  const deleteOffsetX = buttonOffsetX;
  const instrumentButtonHeight = 14;
  const longPressFill = "#FFFFFF";

  const chart = (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    selection.each(function render() {
      const svg = d3.select(this);
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const xStep = safeWidth / xCount;
      const yStep = safeHeight / yCount;

      if (dragLockedIds.size > 0 || dragPinnedIds.size > 0) {
        const activeIds = new Set(notes.map((note) => note.id));
        dragLockedIds = new Set(Array.from(dragLockedIds).filter((id) => activeIds.has(id)));
        dragPinnedIds = new Set(Array.from(dragPinnedIds).filter((id) => activeIds.has(id)));
      }

      const clearLongPress = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        longPressFired = false;
      };

      svg.on("pointerdown.delete-dismiss", (event) => {
        const target = event.target as Element | null;
        if (target?.closest?.("g.note-delete") || target?.closest?.("g.note-instrument")) {
          return;
        }
        if (activeLongPressIds.size > 0) {
          (svg.node() as SVGSVGElement | null)?.setAttribute("data-suppress-grid-click", "true");
          event.stopPropagation();
          event.preventDefault();
          onLongPressClear?.();
          svg.call(chart);
        }
      });

      const updateDragStyles = () => {
        svg
          .selectAll<SVGCircleElement, Note>("circle.note")
          .attr("fill", (d) => {
            const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
            if (d.instrumentId) {
              return isLongPressed ? longPressFill : "none";
            }
            if (isLongPressed) {
              return longPressFill;
            }
            return highlightedIds.has(d.id) ? "#FFE1A8" : "#C9D3E3";
          })
          .attr("stroke", (d) => {
            const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
            if (d.instrumentId) {
              if (isLongPressed) {
                return "transparent";
              }
              return highlightedIds.has(d.id) ? "#FFE1A8" : "#C9D3E3";
            }
            if (d.id === dragActiveId || dragLockedIds.has(d.id)) {
              return "#F6D24A";
            }
            return "transparent";
          })
          .attr("stroke-width", (d) => (d.instrumentId ? 2 : 3))
          .attr("r", (d) => {
            if (d.instrumentId) {
              return d.id === dragActiveId || dragLockedIds.has(d.id) ? 9 : 8;
            }
            return d.id === dragActiveId || dragLockedIds.has(d.id) ? 7 : 6;
          });
      };

      const renderDeleteButton = (groupSelection: d3.Selection<SVGGElement, Note, SVGGElement, unknown>) => {
        groupSelection
          .selectAll<SVGGElement, Note>("g.note-delete")
          .data((d) => (activeLongPressIds.has(d.id) && notesEnabled ? [d] : []))
          .join(
            (enter) => enter.append("g"),
            (update) => update,
            (exit) => exit.remove()
          )
            .attr("class", "note-delete")
            .attr("transform", `translate(${deleteOffsetX}, ${-deleteOffset})`)
            .style("cursor", "pointer")
            .style("pointer-events", "all")
            .on("pointerdown", (event) => {
              event.stopPropagation();
              event.preventDefault();
            })
            .on("click", (event, d) => {
              event.stopPropagation();
              event.preventDefault();
              onNoteDelete?.(d.id);
              svg.call(chart);
            })
            .call((deleteGroup) => {
              deleteGroup
                .selectAll("rect")
                .data((d) => [d])
                .join("rect")
                  .attr("x", -instrumentButtonWidth / 2)
                  .attr("y", -instrumentButtonHeight / 2)
                  .attr("width", instrumentButtonWidth)
                  .attr("height", instrumentButtonHeight)
                  .attr("rx", 7)
                  .attr("fill", "#C5483B");
              deleteGroup
                .selectAll("text")
                .data((d) => [d])
                .join("text")
                  .attr("x", 0)
                  .attr("y", 1)
                  .attr("text-anchor", "middle")
                  .attr("font-size", 8)
                  .attr("font-family", "var(--font-montserrat)")
                  .attr("fill", "#ffffff")
                  .text("Delete");
            });
      };

      const renderInstrumentButton = (groupSelection: d3.Selection<SVGGElement, Note, SVGGElement, unknown>) => {
        groupSelection
          .selectAll<SVGGElement, Note>("g.note-instrument")
          .data((d) => (activeLongPressIds.has(d.id) && notesEnabled ? [d] : []))
          .join(
            (enter) => enter.append("g"),
            (update) => update,
            (exit) => exit.remove()
          )
            .attr("class", "note-instrument")
            .attr("transform", `translate(${instrumentOffsetX}, ${-deleteOffset})`)
            .style("cursor", "pointer")
            .style("pointer-events", "all")
            .on("pointerdown", (event) => {
              event.stopPropagation();
              event.preventDefault();
            })
            .on("click", (event, d) => {
              event.stopPropagation();
              event.preventDefault();
              onInstrumentAssign?.(d.id);
              svg.call(chart);
            })
            .call((instrumentGroup) => {
              instrumentGroup
                .selectAll("rect")
                .data((d) => [d])
                .join("rect")
                  .attr("x", -instrumentButtonWidth / 2)
                  .attr("y", -instrumentButtonHeight / 2)
                  .attr("width", instrumentButtonWidth)
                  .attr("height", instrumentButtonHeight)
                  .attr("rx", 7)
                  .attr("fill", "#2E3A52");
              instrumentGroup
                .selectAll("text")
                .data((d) => [d])
                .join("text")
                  .attr("x", 0)
                  .attr("y", 1)
                  .attr("text-anchor", "middle")
                  .attr("font-size", 7.5)
                  .attr("font-family", "var(--font-montserrat)")
                  .attr("fill", "#F2F5F9")
                  .text((d) => instrumentLabelById[d.instrumentId ?? ""] ?? "Instrument");
            });
      };

      const dragLayer = svg
        .selectAll<SVGGElement, null>("g.drag-layer")
        .data([null])
        .join("g")
          .attr("class", "drag-layer");

      const isCoarsePointer = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

      const renderDragProxy = () => {
        if (!dragProxyId) {
          dragLayer.selectAll("g.drag-proxy").remove();
          return;
        }
        const proxyNote = notes.find((note) => note.id === dragProxyId);
        if (!proxyNote) {
          dragProxyId = null;
          dragLayer.selectAll("g.drag-proxy").remove();
          return;
        }
        const proxy = dragLayer
          .selectAll<SVGGElement, Note>("g.drag-proxy")
          .data([proxyNote], (d) => (d as Note).id)
          .join("g")
            .attr("class", "drag-proxy")
            .attr("transform", `translate(${xOffset + dragProxyXIndex * xStep}, ${yOffset + dragProxyYIndex * yStep})`);

        proxy
          .selectAll<SVGCircleElement, Note>("circle.note")
          .data((d) => [d])
          .join("circle")
            .attr("class", "note")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", (d) => (d.instrumentId ? 9 : 7))
            .attr("fill", (d) => {
              const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
              if (d.instrumentId) {
                return isLongPressed ? longPressFill : "none";
              }
              if (isLongPressed) {
                return longPressFill;
              }
              return highlightedIds.has(d.id) ? "#FFE1A8" : "#C9D3E3";
            })
            .attr("stroke", (d) => {
              const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
              if (d.instrumentId) {
                return isLongPressed ? "transparent" : "#C9D3E3";
              }
              return "#F6D24A";
            })
            .attr("stroke-width", (d) => (d.instrumentId ? 2 : 3));

        proxy
          .selectAll<SVGGElement, Note>("g.note-icon")
          .data((d) => {
            if (!d.instrumentId) {
              return [];
            }
            const label = instrumentLabelById[d.instrumentId] ?? "";
            if (!label) {
              return [];
            }
            return [d];
          })
          .join(
            (enter) => enter.append("g"),
            (update) => update,
            (exit) => exit.remove()
          )
            .attr("class", "note-icon")
            .call((iconGroup) => {
              iconGroup.each(function (d) {
                const label = instrumentLabelById[d.instrumentId ?? ""] ?? "";
                const group = d3.select<SVGGElement, Note>(this);
                renderIcon(group, label);
              });
            });

        proxy
          .selectAll("path.handle-icon")
          .data((d) => (isCoarsePointer && dragPinnedIds.has(d.id) ? [d] : []))
          .join(
            (enter) => enter.append("path"),
            (update) => update,
            (exit) => exit.remove()
          )
            .attr("class", "handle-icon")
            .attr("transform", `translate(${handleOffset}, ${handleOffset}) scale(${handleScale})`)
            .attr("d", handlePath)
            .attr("stroke", "#F2F5F9")
            .attr("stroke-width", 1.6)
            .attr("stroke-linecap", "round");
      };

      const handleDrag = d3
        .drag<SVGGElement, Note>()
        .subject((event, d) => ({
          x: xOffset + d.xIndex * xStep,
          y: yOffset + d.yIndex * yStep,
        }))
        .on("start", function (event, d) {
          event.sourceEvent?.stopPropagation?.();
          event.sourceEvent?.preventDefault?.();
          if (mode !== "notes" || !dragLockedIds.has(d.id)) {
            return;
          }
          dragActiveId = d.id;
          dragProxyId = d.id;
          dragProxyXIndex = d.xIndex;
          dragProxyYIndex = d.yIndex;
          d3.select(this.parentNode as SVGGElement).attr("opacity", 0);
          (event.subject as { x: number; y: number }).x = xOffset + d.xIndex * xStep;
          (event.subject as { x: number; y: number }).y = yOffset + d.yIndex * yStep;
          (this as SVGGElement).dataset.dragDistance = "0";
          updateDragStyles();
          onNoteDragState?.(true);
          renderDragProxy();
        })
        .on("drag", function (event, d) {
          if (mode !== "notes" || dragActiveId !== d.id) {
            return;
          }
          const distance = Number((this as SVGGElement).dataset.dragDistance ?? "0") + Math.hypot(event.dx, event.dy);
          (this as SVGGElement).dataset.dragDistance = distance.toString();
          if (distance < dragThreshold) {
            return;
          }
          const xIndex = Math.max(0, Math.min(xCount, Math.round((event.x - xOffset) / xStep)));
          const rawYIndex = Math.max(0, Math.min(yCount, Math.round((event.y - yOffset) / yStep)));
          const yIndex = snapYIndex(rawYIndex);
          onNotePreviewMove?.(d.id, xIndex, yIndex);
          dragProxyXIndex = xIndex;
          dragProxyYIndex = yIndex;
          renderDragProxy();
        })
        .on("end", function (event, d) {
          if (mode !== "notes" || dragActiveId !== d.id) {
            dragActiveId = null;
            dragProxyId = null;
            d3.select(this.parentNode as SVGGElement).attr("opacity", 1);
            updateDragStyles();
            onNoteDragState?.(false);
            renderDragProxy();
            return;
          }
          const distance = Number((this as SVGGElement).dataset.dragDistance ?? "0");
          if (distance >= dragThreshold) {
            const xIndex = Math.max(0, Math.min(xCount, Math.round((event.x - xOffset) / xStep)));
            const rawYIndex = Math.max(0, Math.min(yCount, Math.round((event.y - yOffset) / yStep)));
            const yIndex = snapYIndex(rawYIndex);
            onNoteMove?.(d.id, xIndex, yIndex);
          }
          dragActiveId = null;
          dragProxyId = null;
          d3.select(this.parentNode as SVGGElement).attr("opacity", 1);
          updateDragStyles();
          onNoteDragState?.(false);
          renderDragProxy();
        });

      const ringDrag = d3
        .drag<SVGCircleElement, Note>()
        .subject((event, d) => ({
          x: xOffset + d.xIndex * xStep,
          y: yOffset + d.yIndex * yStep,
        }))
        .on("start", function (event, d) {
          if (mode !== "notes" || !notesEnabled) {
            return;
          }
          (this as SVGCircleElement).dataset.dragDistance = "0";
          (this as SVGCircleElement).dataset.suppressClick = "false";
        })
        .on("drag", function (event, d) {
          if (mode !== "notes" || !notesEnabled) {
            return;
          }
          const distance = Number((this as SVGCircleElement).dataset.dragDistance ?? "0") + Math.hypot(event.dx, event.dy);
          (this as SVGCircleElement).dataset.dragDistance = distance.toString();
          if (distance < dragThreshold) {
            return;
          }
          if (!dragActiveId) {
            dragActiveId = d.id;
            dragProxyId = d.id;
            dragProxyXIndex = d.xIndex;
            dragProxyYIndex = d.yIndex;
          if (!dragLockedIds.has(d.id)) {
            dragLockedIds.add(d.id);
            dragTempId = d.id;
            onDragLockChange?.(d.id, true);
          } else {
            dragTempId = null;
          }
            d3.select(this.parentNode as SVGGElement).attr("opacity", 0);
            updateDragStyles();
            onNoteDragState?.(true);
            renderDragProxy();
            (this as SVGCircleElement).dataset.suppressClick = "true";
          }
          if (dragActiveId !== d.id) {
            return;
          }
          const xIndex = Math.max(0, Math.min(xCount, Math.round((event.x - xOffset) / xStep)));
          const rawYIndex = Math.max(0, Math.min(yCount, Math.round((event.y - yOffset) / yStep)));
          const yIndex = snapYIndex(rawYIndex);
          onNotePreviewMove?.(d.id, xIndex, yIndex);
          dragProxyXIndex = xIndex;
          dragProxyYIndex = yIndex;
          renderDragProxy();
        })
        .on("end", function (event, d) {
          if (mode !== "notes" || !notesEnabled) {
            return;
          }
          const distance = Number((this as SVGCircleElement).dataset.dragDistance ?? "0");
          const shouldPlayLockedDragEndCue = dragPinnedIds.has(d.id) && dragTempId !== d.id;
          if (dragActiveId === d.id) {
            if (distance >= dragThreshold) {
              const xIndex = Math.max(0, Math.min(xCount, Math.round((event.x - xOffset) / xStep)));
              const rawYIndex = Math.max(0, Math.min(yCount, Math.round((event.y - yOffset) / yStep)));
              const yIndex = snapYIndex(rawYIndex);
              onNoteMove?.(d.id, xIndex, yIndex);
            }
            dragActiveId = null;
            dragProxyId = null;
            d3.select(this.parentNode as SVGGElement).attr("opacity", 1);
            if (dragTempId === d.id) {
              dragLockedIds.delete(d.id);
              dragTempId = null;
              onDragLockChange?.(d.id, false);
            }
            updateDragStyles();
            onNoteDragState?.(false);
            renderDragProxy();
            if (shouldPlayLockedDragEndCue) {
              onLockedDragEnd?.(d.id);
            }
          }
        });

      const groups = svg
        .selectAll<SVGGElement, Note>("g.note-group")
        .data(notes, (d) => (d as Note).id)
        .join("g")
          .attr("class", "note-group")
          .attr("transform", (d) => `translate(${xOffset + d.xIndex * xStep}, ${yOffset + d.yIndex * yStep})`)
          .attr("opacity", (d) => (d.id === dragProxyId || d.id === dragActiveId ? 0 : 1));

      groups
        .selectAll<SVGCircleElement, Note>("circle.note-ring")
        .data((d) => [d])
        .join("circle")
          .attr("class", "note-ring")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 12)
          .attr("fill", "transparent")
          .attr("stroke", "transparent")
          .attr("stroke-width", 10)
          .attr("data-locked", (d) => (dragPinnedIds.has(d.id) ? "true" : "false"))
          .style("cursor", mode === "notes" && notesEnabled ? "pointer" : "default")
          .style("pointer-events", notesEnabled ? "all" : "none")
          .call(ringDrag)
          .on("pointerdown", function (event, d) {
            if (mode !== "notes") {
              return;
            }
            clearLongPress();
            longPressFired = false;
            (this as SVGCircleElement).dataset.pointerHandled = "false";
            (this as SVGCircleElement).dataset.suppressClick = "false";
            const startX = event.clientX;
            const startY = event.clientY;
            (this as SVGCircleElement).dataset.pointerStartX = startX.toString();
            (this as SVGCircleElement).dataset.pointerStartY = startY.toString();
            if (dragPinnedIds.has(d.id)) {
              return;
            }
            longPressTimer = setTimeout(() => {
              longPressFired = true;
              (svg.node() as SVGSVGElement | null)?.setAttribute("data-suppress-grid-click", "true");
              (this as SVGCircleElement).dataset.suppressClick = "true";
              onLongPressAdd?.(d.id);
              svg.call(chart);
            }, LONG_PRESS_MS);
          })
          .on("pointermove", function (event) {
            if (!longPressTimer) {
              return;
            }
            const startX = Number((this as SVGCircleElement).dataset.pointerStartX ?? "0");
            const startY = Number((this as SVGCircleElement).dataset.pointerStartY ?? "0");
            const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
            if (distance > dragThreshold) {
              clearLongPress();
            }
          })
          .on("pointerup", function (event, d) {
            if ((this as SVGCircleElement).dataset.pointerHandled === "true") {
              clearLongPress();
              return;
            }
            (this as SVGCircleElement).dataset.pointerHandled = "true";
            if ((this as SVGCircleElement).dataset.suppressClick === "true") {
              clearLongPress();
              (this as SVGCircleElement).dataset.suppressClick = "false";
              return;
            }
            if (longPressFired) {
              event.stopPropagation();
              event.preventDefault();
              window.setTimeout(() => {
                clearLongPress();
                (this as SVGCircleElement).dataset.suppressClick = "false";
              }, 0);
              return;
            }
            if (!longPressFired && mode === "notes") {
              (svg.node() as SVGSVGElement | null)?.setAttribute("data-suppress-grid-click", "true");
              if (dragPinnedIds.has(d.id)) {
                dragPinnedIds.delete(d.id);
                dragLockedIds.delete(d.id);
                onNoteDragState?.(false);
                onDragLockChange?.(d.id, false);
              } else {
                dragPinnedIds.add(d.id);
                dragLockedIds.add(d.id);
                onNoteDragState?.(true);
                onDragLockChange?.(d.id, true);
              }
              updateDragStyles();
              event.stopPropagation();
              event.preventDefault();
              svg.call(chart);
            }
            clearLongPress();
          })
          .on("click", function (event) {
            if ((this as SVGCircleElement).dataset.suppressClick === "true") {
              event.stopPropagation();
              event.preventDefault();
              (this as SVGCircleElement).dataset.suppressClick = "false";
            }
          })
          .on("pointerleave pointercancel", function () {
            clearLongPress();
          });

      groups
        .selectAll<SVGCircleElement, Note>("circle.note")
        .data((d) => [d])
        .join("circle")
          .attr("class", "note")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", (d) => {
            if (d.instrumentId) {
              return d.id === dragActiveId || dragLockedIds.has(d.id) ? 9 : 8;
            }
            return d.id === dragActiveId || dragLockedIds.has(d.id) ? 7 : 6;
          })
          .attr("fill", (d) => {
            const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
            if (d.instrumentId) {
              return isLongPressed ? longPressFill : "none";
            }
            if (isLongPressed) {
              return longPressFill;
            }
            return highlightedIds.has(d.id) ? "#FFE1A8" : "#C9D3E3";
          })
          .attr("stroke", (d) => {
            const isLongPressed = activeLongPressIds.has(d.id) && notesEnabled;
            if (d.instrumentId) {
              if (isLongPressed) {
                return "transparent";
              }
              return highlightedIds.has(d.id) ? "#FFE1A8" : "#C9D3E3";
            }
            if (d.id === dragActiveId || dragLockedIds.has(d.id)) {
              return "#F6D24A";
            }
            return "transparent";
          })
          .attr("stroke-width", (d) => (d.instrumentId ? 2 : 3))
          .style("pointer-events", "none");

      groups
        .selectAll<SVGGElement, Note>("g.note-icon")
        .data((d) => {
          if (!d.instrumentId) {
            return [];
          }
          const label = instrumentLabelById[d.instrumentId] ?? "";
          if (!label) {
            return [];
          }
          return [d];
        })
        .join(
          (enter) => enter.append("g"),
          (update) => update,
          (exit) => exit.remove()
        )
          .attr("class", "note-icon")
          .attr("transform", "translate(0, 0)")
          .call((iconGroup) => {
            iconGroup.each(function (d) {
              const label = instrumentLabelById[d.instrumentId ?? ""] ?? "";
              const group = d3.select<SVGGElement, Note>(this);
              renderIcon(group, label);
            });
          });

      groups
        .selectAll<SVGGElement, Note>("g.note-handle")
        .data((d) => (dragPinnedIds.has(d.id) && notesEnabled && isCoarsePointer ? [d] : []))
        .join(
          (enter) => enter.append("g"),
          (update) => update,
          (exit) => exit.remove()
        )
          .attr("class", "note-handle")
          .attr("transform", `translate(${handleOffset}, ${handleOffset}) scale(${handleScale})`)
          .style("cursor", notesEnabled ? "move" : "default")
          .style("pointer-events", notesEnabled ? "all" : "none")
          .call(handleDrag)
          .call((handleGroup) => {
            handleGroup
              .selectAll("path.handle-icon")
              .data((d) => [d])
              .join("path")
                .attr("class", "handle-icon")
                .attr("d", handlePath)
                .attr("stroke", "#F2F5F9")
                .attr("stroke-width", 1.6)
                .attr("stroke-linecap", "round");
          });

      renderInstrumentButton(groups);
      renderDeleteButton(groups);
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

  chart.mode = (value?: "notes" | "joins" | "play") => {
    if (value === undefined) {
      return mode;
    }
    mode = value;
    return chart;
  };

  chart.notes = (value?: Note[]) => {
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

  chart.notesEnabled = (value?: boolean) => {
    if (value === undefined) {
      return notesEnabled;
    }
    notesEnabled = value;
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

  return chart as BeatMathsGridNotesChart;
};

export default beatMathsGridNotesComponent;
