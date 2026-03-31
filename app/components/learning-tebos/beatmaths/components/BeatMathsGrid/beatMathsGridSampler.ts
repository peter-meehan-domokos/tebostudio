import * as d3 from "d3";

type Note = {
  xIndex: number;
  yIndex: number;
};

type SamplePoint = {
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
  groupKey?: string;
  volume?: number;
  behavior?: JoinBehavior;
  type: "step" | "linear" | "quadratic" | "cubic" | "sine";
};

const getNotesAtX = (notes: Note[], xIndex: number) =>
  notes.filter((note) => note.xIndex === xIndex).map((note) => note.yIndex);

const getSortedTimepoints = (notes: Note[]) =>
  Array.from(new Set(notes.map((note) => note.xIndex))).sort((a, b) => a - b);

const getLowestNoteAtX = (notes: Note[], xIndex: number) => {
  const matches = notes.filter((note) => note.xIndex === xIndex);
  if (matches.length === 0) {
    return null;
  }
  // TODO: support polyphonic chords across multiple notes at the same x index.
  return matches.reduce((lowest, note) => (note.yIndex < lowest.yIndex ? note : lowest));
};

const getYFromStepPathAtX = (points: SamplePoint[], xIndex: number) => {
  if (points.length === 0) {
    return null;
  }

  const leftMost = points[0];
  const rightMost = points[points.length - 1];
  if (xIndex < leftMost.xIndex || xIndex > rightMost.xIndex) {
    return null;
  }

  const exact = points.find((point) => point.xIndex === xIndex);
  if (exact) {
    return exact.yIndex;
  }

  const before = [...points].reverse().find((point) => point.xIndex < xIndex);
  if (!before) {
    return leftMost.yIndex;
  }

  return before.yIndex;
};

const getSamplePoints = (notes: Note[]) => {
  const unique = notes.reduce<SamplePoint[]>((acc, note) => {
    const existing = acc.find((point) => point.xIndex === note.xIndex);
    if (!existing) {
      return [...acc, { xIndex: note.xIndex, yIndex: note.yIndex }];
    }
    return existing.yIndex < note.yIndex
      ? acc
      : [...acc.filter((point) => point.xIndex !== note.xIndex), { xIndex: note.xIndex, yIndex: note.yIndex }];
  }, []);

  return unique.sort((a, b) => a.xIndex - b.xIndex);
};

const getOrderedPointsForEdge = (edge: JoinEdge, noteById: Map<string, Note>) => {
  if (edge.waypointIds && edge.waypointIds.length >= 2) {
    const ordered = edge.waypointIds
      .map((id) => noteById.get(id))
      .filter((note): note is Note => Boolean(note))
      .sort((a, b) => (a.xIndex !== b.xIndex ? a.xIndex - b.xIndex : a.yIndex - b.yIndex))
      .map((note) => ({ xIndex: note.xIndex, yIndex: note.yIndex }));
    if (ordered.length >= 2) {
      return ordered;
    }
  }
  const from = noteById.get(edge.fromId);
  const to = noteById.get(edge.toId);
  if (!from || !to) {
    return [];
  }
  return [
    { xIndex: from.xIndex, yIndex: from.yIndex },
    { xIndex: to.xIndex, yIndex: to.yIndex },
  ];
};

const getYFromLinearPathAtX = (points: SamplePoint[], xIndex: number) => {
  if (points.length < 2) {
    return null;
  }
  if (xIndex < points[0].xIndex || xIndex > points[points.length - 1].xIndex) {
    return null;
  }
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (xIndex < a.xIndex || xIndex > b.xIndex) {
      continue;
    }
    if (a.xIndex === b.xIndex) {
      return a.yIndex;
    }
    if (xIndex === a.xIndex) {
      return a.yIndex;
    }
    if (xIndex === b.xIndex) {
      return b.yIndex;
    }
    const t = (xIndex - a.xIndex) / (b.xIndex - a.xIndex);
    return a.yIndex + t * (b.yIndex - a.yIndex);
  }
  return null;
};

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

const getEffectiveX = (edge: JoinEdge, xIndex: number, baseMinX: number, baseMaxX: number, maxX: number) => {
  const limit = getBehaviorLimit(edge, baseMinX, baseMaxX, maxX);
  if (xIndex < baseMinX || xIndex > limit) {
    return null;
  }
  if (!edge.behavior) {
    return xIndex;
  }
  const baseSpan = baseMaxX - baseMinX;
  if (baseSpan <= 0) {
    return null;
  }
  return baseMinX + ((xIndex - baseMinX) % baseSpan);
};

export const getActiveYIndicesAtX = (notes: Note[], xIndex: number) => {
  if (notes.length === 0) {
    return null;
  }

  const timepoints = getSortedTimepoints(notes);
  const first = timepoints[0];
  if (xIndex < first) {
    return null;
  }

  let activeX = first;
  for (const timepoint of timepoints) {
    if (timepoint <= xIndex) {
      activeX = timepoint;
    } else {
      break;
    }
  }

  const yIndices = getNotesAtX(notes, activeX);
  return yIndices.length > 0 ? yIndices : null;
};

export const getYIndexAtX = (notes: Note[], xIndex: number) => {
  const lowestNote = getLowestNoteAtX(notes, xIndex);
  if (lowestNote) {
    return lowestNote.yIndex;
  }
  const points = getSamplePoints(notes);
  return getYFromStepPathAtX(points, xIndex);
};

export const getActiveYIndicesForEdgesAtX = (
  edges: JoinEdge[],
  notes: Note[],
  xIndex: number,
  xCount: number,
  yCount: number
) => {
  if (edges.length === 0) {
    return null;
  }
  const noteById = new Map(notes.map((note) => [note.id, note]));
  const active: number[] = [];

  edges.forEach((edge) => {
    if (edge.type === "step" || edge.type === "linear") {
      const points = getOrderedPointsForEdge(edge, noteById);
      if (points.length < 2) {
        return;
      }
      const baseMinX = points[0].xIndex;
      const baseMaxX = points[points.length - 1].xIndex;
      const effectiveX = getEffectiveX(edge, xIndex, baseMinX, baseMaxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex =
        edge.type === "step"
          ? getYFromStepPathAtX(points, effectiveX)
          : getYFromLinearPathAtX(points, effectiveX);
      if (yIndex === null) {
        return;
      }
      active.push(yIndex);
      return;
    }

    const from = noteById.get(edge.fromId);
    const to = noteById.get(edge.toId);
    if (!from || !to) {
      return;
    }
    if (edge.type === "sine") {
      const via = edge.viaId ? noteById.get(edge.viaId) : null;
      if (!via) {
        return;
      }
      const axisY = from.yIndex;
      if (axisY !== to.yIndex) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const span = maxX - minX;
      if (span <= 0) {
        return;
      }
      const cycleSpan = span * 2;
      const effectiveX = getEffectiveX(edge, xIndex, minX, minX + cycleSpan, xCount);
      if (effectiveX === null) {
        return;
      }
      const omega = Math.PI / span;
      const sinTerm = Math.sin(omega * (via.xIndex - minX));
      if (sinTerm === 0) {
        return;
      }
      // Lowest-frequency full-wave (period=2L) keeps the curve smooth and makes it pass through the 3rd point.
      const amplitude = (via.yIndex - axisY) / sinTerm;
      const yIndex = axisY + amplitude * Math.sin(omega * (effectiveX - minX));
      active.push(yIndex);
      return;
    }
    if (edge.type === "quadratic") {
      const via = edge.viaId ? noteById.get(edge.viaId) : null;
      if (!via) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex, via.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const effectiveX = getEffectiveX(edge, xIndex, minX, maxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex = getQuadraticYAtX(effectiveX, from, via, to);
      if (yIndex === null) {
        return;
      }
      active.push(yIndex);
      return;
    }
    if (edge.type === "cubic") {
      const via1 = edge.viaId ? noteById.get(edge.viaId) : null;
      const via2 = edge.viaId2 ? noteById.get(edge.viaId2) : null;
      if (!via1 || !via2) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex, via1.xIndex, via2.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const effectiveX = getEffectiveX(edge, xIndex, minX, maxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex = getCubicYAtX(effectiveX, from, via1, via2, to);
      if (yIndex === null) {
        return;
      }
      active.push(yIndex);
      return;
    }
    const left = from.xIndex <= to.xIndex ? from : to;
    const right = from.xIndex <= to.xIndex ? to : from;
    const baseMinX = left.xIndex;
    const baseMaxX = right.xIndex;
    const effectiveX = getEffectiveX(edge, xIndex, baseMinX, baseMaxX, xCount);
    if (effectiveX === null) {
      return;
    }
    if (edge.type === "linear" && right.xIndex !== left.xIndex) {
      const progress = (effectiveX - left.xIndex) / (right.xIndex - left.xIndex);
      const yIndex = left.yIndex + (right.yIndex - left.yIndex) * progress;
      active.push(yIndex);
      return;
    }
    if (effectiveX === right.xIndex) {
      active.push(right.yIndex);
      return;
    }
    active.push(left.yIndex);
  });

  return active.length > 0 ? active : null;
};

export const getActiveNotesForEdgesAtX = (
  edges: JoinEdge[],
  notes: Note[],
  xIndex: number,
  xCount: number,
  yCount: number
) => {
  if (edges.length === 0) {
    return null;
  }
  const noteById = new Map(notes.map((note) => [note.id, note]));
  const active = new Map<number, number>();

  const addActive = (yIndex: number, volume: number) => {
    const existing = active.get(yIndex);
    if (existing === undefined || volume > existing) {
      active.set(yIndex, volume);
    }
  };

  edges.forEach((edge) => {
    const volume = edge.volume ?? 50;
    if (edge.type === "step" || edge.type === "linear") {
      const points = getOrderedPointsForEdge(edge, noteById);
      if (points.length < 2) {
        return;
      }
      const baseMinX = points[0].xIndex;
      const baseMaxX = points[points.length - 1].xIndex;
      const effectiveX = getEffectiveX(edge, xIndex, baseMinX, baseMaxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex =
        edge.type === "step"
          ? getYFromStepPathAtX(points, effectiveX)
          : getYFromLinearPathAtX(points, effectiveX);
      if (yIndex === null) {
        return;
      }
      addActive(yIndex, volume);
      return;
    }

    const from = noteById.get(edge.fromId);
    const to = noteById.get(edge.toId);
    if (!from || !to) {
      return;
    }
    if (edge.type === "sine") {
      const via = edge.viaId ? noteById.get(edge.viaId) : null;
      if (!via) {
        return;
      }
      const axisY = from.yIndex;
      if (axisY !== to.yIndex) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const span = maxX - minX;
      if (span <= 0) {
        return;
      }
      const cycleSpan = span * 2;
      const effectiveX = getEffectiveX(edge, xIndex, minX, minX + cycleSpan, xCount);
      if (effectiveX === null) {
        return;
      }
      const omega = Math.PI / span;
      const sinTerm = Math.sin(omega * (via.xIndex - minX));
      if (sinTerm === 0) {
        return;
      }
      const amplitude = (via.yIndex - axisY) / sinTerm;
      const yIndex = axisY + amplitude * Math.sin(omega * (effectiveX - minX));
      addActive(yIndex, volume);
      return;
    }
    if (edge.type === "quadratic") {
      const via = edge.viaId ? noteById.get(edge.viaId) : null;
      if (!via) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex, via.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const effectiveX = getEffectiveX(edge, xIndex, minX, maxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex = getQuadraticYAtX(effectiveX, from, via, to);
      if (yIndex === null) {
        return;
      }
      addActive(yIndex, volume);
      return;
    }
    if (edge.type === "cubic") {
      const via1 = edge.viaId ? noteById.get(edge.viaId) : null;
      const via2 = edge.viaId2 ? noteById.get(edge.viaId2) : null;
      if (!via1 || !via2) {
        return;
      }
      const extent = d3.extent([from.xIndex, to.xIndex, via1.xIndex, via2.xIndex]);
      if (!extent[0] && extent[0] !== 0) {
        return;
      }
      if (!extent[1] && extent[1] !== 0) {
        return;
      }
      const minX = extent[0];
      const maxX = extent[1];
      const effectiveX = getEffectiveX(edge, xIndex, minX, maxX, xCount);
      if (effectiveX === null) {
        return;
      }
      const yIndex = getCubicYAtX(effectiveX, from, via1, via2, to);
      if (yIndex === null) {
        return;
      }
      addActive(yIndex, volume);
      return;
    }
    const left = from.xIndex <= to.xIndex ? from : to;
    const right = from.xIndex <= to.xIndex ? to : from;
    const baseMinX = left.xIndex;
    const baseMaxX = right.xIndex;
    const effectiveX = getEffectiveX(edge, xIndex, baseMinX, baseMaxX, xCount);
    if (effectiveX === null) {
      return;
    }
    if (edge.type === "linear" && right.xIndex !== left.xIndex) {
      const progress = (effectiveX - left.xIndex) / (right.xIndex - left.xIndex);
      const yIndex = left.yIndex + (right.yIndex - left.yIndex) * progress;
      addActive(yIndex, volume);
      return;
    }
    if (effectiveX === right.xIndex) {
      addActive(right.yIndex, volume);
      return;
    }
    addActive(left.yIndex, volume);
  });

  if (active.size === 0) {
    return null;
  }
  return Array.from(active.entries()).map(([yIndex, volume]) => ({ yIndex, volume }));
};
