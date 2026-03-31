"use client";

import type { CSSProperties, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { getActiveNotesForEdgesAtX } from "./beatMathsGridSampler";
import * as d3 from "d3";
import beatMathsGridComponent from "./beatMathsGridComponent";
import beatMathsPercussionGridComponent from "./beatMathsPercussionGridComponent";
import { useBeatMathsMain } from "../BeatMathsMain/BeatMathsMainContext";
import BeatMathsGridControls from "./BeatMathsGridControls";
import BeatMathsGridOptionIcon from "./BeatMathsGridOptionIcons";
import ControlPanel from "./components/ControlPanel";
import Toast from "@/app/common/components/Toast";
import {
  SCALE_ALLOWED_NOTES,
  type ScaleType,
  type SemitoneIndex,
} from "./beatMathsScaleConstants";

type Note = {
  id: string;
  xIndex: number;
  yIndex: number;
  instrumentId?: string | null;
};

type Beat = {
  id: string;
  seriesId: string;
  isRepeat: boolean;
  xIndex: number;
  yIndex: number;
  instrumentId?: string | null;
};

type JoinBehavior = {
  action: "continue" | "repeat";
  scope: "indefinitely" | "for" | "until";
  value: number;
};

type JoinBehaviorDraft = {
  action: "continue" | "repeat" | null;
  scope: "indefinitely" | "for" | "until" | null;
  value: number;
};

type JoinEdge = {
  id: string;
  fromId: string;
  viaId?: string;
  viaId2?: string;
  toId: string;
  waypointIds?: string[];
  volume?: number;
  groupKey?: string;
  behavior?: JoinBehavior;
  type: "step" | "linear" | "quadratic" | "cubic" | "sine";
};

type PreviewInstrumentConfig = {
  type: "triangle" | "sine" | "square" | "sawtooth";
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
};

// Grouping disabled for now.
// const GROUP_PALETTE = d3.schemeSet3.slice(0, 10);
// const getNextGroupColor = (existingColors: string[]) => {
//   const used = new Set(existingColors);
//   const available = GROUP_PALETTE.find((color) => !used.has(color));
//   if (available) {
//     return available;
//   }
//   return GROUP_PALETTE[existingColors.length % GROUP_PALETTE.length];
// };

type Mode = "notes" | "joins" | "play";
type JoinsTool = "new" | "repeat" | "sound";
type ZoomPresetId = "bar1" | "bar2" | "bar4" | "bar8";

const SIDE_CONTROL_WIDTH = 152;
const TOP_BOTTOM_CONTROL_HEIGHT = 60;
const GRID_DIVIDER_HEIGHT = 12;
const BAR_STEP_COUNT = 16;
const MAIN_PAD_LEFT = 28;
const MAIN_PAD_TOP = 10;
const MAIN_PAD_RIGHT = 8;
const MAIN_PAD_BOTTOM = 10;
const PERCUSSION_PAD_LEFT = 28;
const PERCUSSION_PAD_TOP = 10;
const PERCUSSION_PAD_RIGHT = 8;
const PERCUSSION_PAD_BOTTOM = 28;
const ZOOM_PRESETS: Array<{ id: ZoomPresetId; label: string; visibleTicks: number; bars: number }> = [
  { id: "bar1", label: "1 Bar", visibleTicks: 18, bars: 1 },
  { id: "bar2", label: "2 Bars", visibleTicks: 34, bars: 2 },
  { id: "bar4", label: "4 Bars", visibleTicks: 66, bars: 4 },
  { id: "bar8", label: "8 Bars", visibleTicks: 130, bars: 8 },
];
const EDGE_PANEL_STYLE: CSSProperties = {
  backgroundColor: "#FFF8E7",
  border: "1px solid #D8CCB4",
};
const GRID_DIVIDER_STYLE: CSSProperties = {
  backgroundColor: "#FFF8E7",
  borderTop: "1px solid #D8CCB4",
  borderBottom: "1px solid #D8CCB4",
};

const INSTRUMENT_OPTIONS = [
  { id: "instr_piano", label: "Piano" },
  { id: "instr_epiano", label: "E Piano" },
  { id: "instr_organ", label: "Organ" },
  { id: "instr_lead", label: "Synth Lead" },
  { id: "instr_bass", label: "Synth Bass" },
  { id: "instr_pad", label: "Pad" },
  { id: "instr_pluck", label: "Pluck" },
  { id: "instr_guitar", label: "Guitar" },
  { id: "instr_bell", label: "Bell" },
  { id: "instr_strings", label: "Strings" },
];

const BEAT_OPTIONS = [
  { id: "beat_kick", label: "Kick" },
  { id: "beat_tom_low", label: "Low Tom" },
  { id: "beat_tom_mid", label: "Mid Tom" },
  { id: "beat_tom_high", label: "High Tom" },
  { id: "beat_snare", label: "Snare" },
  { id: "beat_clap", label: "Clap" },
  { id: "beat_hat_closed", label: "Closed Hat" },
  { id: "beat_hat_open", label: "Open Hat" },
  { id: "beat_crash", label: "Crash" },
  { id: "beat_ride", label: "Ride" },
];

const SCALE_OPTIONS = [
  { id: "major", label: "Major" },
  { id: "minor", label: "Minor" },
  { id: "pentatonicMajor", label: "Pent. Major" },
  { id: "pentatonicMinor", label: "Pent. Minor" },
  { id: "chromatic", label: "Chromatic" },
] as const satisfies Array<{ id: ScaleType; label: string }>;

export default function BeatMathsGrid() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const chartRef = useRef<ReturnType<typeof beatMathsGridComponent> | null>(null);
  const percussionChartRef = useRef<ReturnType<typeof beatMathsPercussionGridComponent> | null>(null);
  const percussionContainerRef = useRef<HTMLDivElement | null>(null);
  const splitterRef = useRef<HTMLDivElement | null>(null);
  const { size } = useBeatMathsMain();
  const outerWidth = size.width;
  const outerHeight = size.height;
  const visibleGridWidth = Math.max(1, outerWidth - SIDE_CONTROL_WIDTH * 2);
  const totalGridHeight = Math.max(
    1,
    outerHeight - TOP_BOTTOM_CONTROL_HEIGHT * 2 - GRID_DIVIDER_HEIGHT
  );
  const xMin = 0;
  const xMax = 260;
  const xCount = xMax - xMin;
  const xOriginIndex = 0;
  const yCount = 100;
  const percussionYCount = 10;
  const baseXCount = 50;
  const baseYCount = 52;
  const percussionBaseYCount = 5;
  const percussionPadding = 0;
  const percussionAxisPadding = 10;
  const tickSizeX = 30;
  const percussionTickSizeY = 30;
  const gridWorldWidth = tickSizeX * xCount;
  const mainInnerWorldWidth = Math.max(1, gridWorldWidth - MAIN_PAD_LEFT - MAIN_PAD_RIGHT);
  const zoomPresetKById = useMemo(
    () =>
      Object.fromEntries(
        ZOOM_PRESETS.map((preset) => [
          preset.id,
          Math.max(0.01, visibleGridWidth / (tickSizeX * preset.visibleTicks)),
        ])
      ) as Record<ZoomPresetId, number>,
    [tickSizeX, visibleGridWidth]
  );
  const zoomPresetMinK = useMemo(
    () => Math.min(...ZOOM_PRESETS.map((preset) => zoomPresetKById[preset.id])),
    [zoomPresetKById]
  );
  const zoomPresetMaxK = useMemo(
    () => Math.max(...ZOOM_PRESETS.map((preset) => zoomPresetKById[preset.id])),
    [zoomPresetKById]
  );
  const [selectedZoomPreset, setSelectedZoomPreset] = useState<ZoomPresetId>("bar1");
  const selectedZoomPresetRef = useRef<ZoomPresetId>("bar1");
  const desiredPercussionViewHeight = percussionTickSizeY * percussionBaseYCount + percussionAxisPadding * 2;
  const percussionWorldHeight = Math.max(1, percussionTickSizeY * percussionYCount);
  const percussionDrawHeight = percussionWorldHeight + percussionAxisPadding * 2;
  const percussionAxisWorldY =
    PERCUSSION_PAD_TOP + (percussionDrawHeight - PERCUSSION_PAD_TOP - PERCUSSION_PAD_BOTTOM);
  const minPercussionHeight = totalGridHeight * 0.1;
  const maxPercussionHeight = totalGridHeight * 0.9;
  const [percussionGridHeight, setPercussionGridHeight] = useState(
    totalGridHeight * 0.5
  );
  const mainGridHeight = Math.max(0, totalGridHeight - percussionGridHeight);
  const tickSizeY = useMemo(() => {
    const referenceK = zoomPresetKById.bar1;
    if (!Number.isFinite(referenceK) || referenceK <= 0 || mainGridHeight <= 0) {
      return 15;
    }
    // Fit 13 steps above zero and 13 below zero in the upper-grid viewport.
    return Math.max(1, mainGridHeight / (26 * referenceK));
  }, [mainGridHeight, zoomPresetKById]);
  const gridWorldHeight = tickSizeY * yCount;
  const mainAxisWorldY = MAIN_PAD_TOP + (gridWorldHeight - MAIN_PAD_TOP - MAIN_PAD_BOTTOM) / 2;
  const defaultZoomYMain = (mainGridHeight / 2) - zoomPresetKById[selectedZoomPreset] * mainAxisWorldY;
  const percussionViewHeight = Math.max(1, percussionGridHeight);
  const viewOffsetY = 0;
  const percussionViewOffsetY = 0;
  const percussionMaxViewY = Math.max(0, percussionWorldHeight + percussionAxisPadding * 2 - percussionViewHeight);
  const mainXAxisOriginWorldX = MAIN_PAD_LEFT + xOriginIndex * tickSizeX;
  const percussionXAxisOriginWorldX = PERCUSSION_PAD_LEFT + xOriginIndex * tickSizeX;
  const mainMinPanWorldX = mainXAxisOriginWorldX - MAIN_PAD_LEFT;
  const percussionMinPanWorldX = percussionXAxisOriginWorldX - PERCUSSION_PAD_LEFT;
  const clampSharedZoomX = useCallback((x: number, k: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(k) || k <= 0) {
      return x;
    }
    const maxXFromMainOrigin = -mainMinPanWorldX * k;
    const maxXFromPercussionOrigin = -percussionMinPanWorldX * k;
    return Math.min(x, maxXFromMainOrigin, maxXFromPercussionOrigin);
  }, [mainMinPanWorldX, percussionMinPanWorldX]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [joinEdges, setJoinEdges] = useState<JoinEdge[]>([]);
  const [mode, setMode] = useState<Mode>("notes");
  const [joinsTool, setJoinsTool] = useState<JoinsTool>("new");
  const [joinAnchor, setJoinAnchor] = useState<Note | null>(null);
  const [joinBuffer, setJoinBuffer] = useState<Note[]>([]);
  const [joinSeriesIds, setJoinSeriesIds] = useState<string[]>([]);
  const [joinSeriesEdgeId, setJoinSeriesEdgeId] = useState<string | null>(null);
  const [joinType, setJoinType] = useState<"step" | "linear" | "quadratic" | "cubic" | "sine">("step");
  const [scaleType, setScaleType] = useState<ScaleType>("major");
  const [selectedJoinIds, setSelectedJoinIds] = useState<Set<string>>(new Set());
  // Grouping disabled for now.
  // const [groupColorByKey, setGroupColorByKey] = useState<Record<string, string>>({});
  // const [groupArmed, setGroupArmed] = useState(false);
  const [joinBehavior, setJoinBehavior] = useState<JoinBehaviorDraft>({
    action: null,
    scope: null,
    value: 16,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [panOffset, setPanOffset] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedJoinVolume, setSelectedJoinVolume] = useState(50);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>(null);
  const [selectedBeatId, setSelectedBeatId] = useState<string | null>(null);
  const [cursorSoundEnabled, setCursorSoundEnabled] = useState(false);
  const [showInstrumentPanelOptions, setShowInstrumentPanelOptions] = useState(true);
  const [showBeatPanelOptions, setShowBeatPanelOptions] = useState(true);
  const [showScalePanelOptions, setShowScalePanelOptions] = useState(true);
  const [soundingYIndices, setSoundingYIndices] = useState<Set<number>>(new Set());
  const [longPressNoteIds, setLongPressNoteIds] = useState<Set<string>>(new Set());
  const [longPressBeatIds, setLongPressBeatIds] = useState<Set<string>>(new Set());
  const longPressNoteIdsRef = useRef<Set<string>>(new Set());
  const longPressBeatIdsRef = useRef<Set<string>>(new Set());
  const lastHoveredYIndexRef = useRef<number | null>(null);
  const activeHoverMidiRef = useRef<number | null>(null);
  const activeHoverYIndexRef = useRef<number | null>(null);
  const hoverSoundTimeoutRef = useRef<number | null>(null);

  const instrumentLabelById = useMemo(
    () => Object.fromEntries(INSTRUMENT_OPTIONS.map((option) => [option.id, option.label])),
    []
  );
  const beatLabelById = useMemo(
    () => Object.fromEntries(BEAT_OPTIONS.map((option) => [option.id, option.label])),
    []
  );

  useEffect(() => {
    longPressNoteIdsRef.current = longPressNoteIds;
  }, [longPressNoteIds]);

  useEffect(() => {
    longPressBeatIdsRef.current = longPressBeatIds;
  }, [longPressBeatIds]);

  useEffect(() => {
    if (longPressNoteIds.size === 0 && longPressBeatIds.size === 0) {
      return undefined;
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) {
        return;
      }
      if (
        target.closest("g.note-delete") ||
        target.closest("g.note-instrument") ||
        target.closest("[data-beatmaths-controls]")
      ) {
        return;
      }
      if (longPressNoteIds.size > 0 || longPressBeatIds.size > 0) {
        svgRef.current?.setAttribute("data-suppress-grid-click", "true");
        percussionSvgRef.current?.setAttribute("data-suppress-grid-click", "true");
        setLongPressNoteIds(new Set());
        setLongPressBeatIds(new Set());
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
    };
  }, [longPressBeatIds, longPressNoteIds]);
  const [sharedZoom, setSharedZoom] = useState(() => {
    const initialK = zoomPresetKById.bar1;
    return { x: clampSharedZoomX(0, initialK), k: initialK };
  });
  const [zoomYMain, setZoomYMain] = useState(() => (mainGridHeight / 2) - zoomPresetKById.bar1 * mainAxisWorldY);
  const [zoomYPercussion, setZoomYPercussion] = useState(0);
  const [playheadXIndex, setPlayheadXIndex] = useState(xOriginIndex);
  const splitterDragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const speedRef = useRef(1);
  const isPausedRef = useRef(false);
  const sharedZoomRef = useRef(sharedZoom);
  const zoomYMainRef = useRef(zoomYMain);
  const zoomYPercussionRef = useRef(zoomYPercussion);
  const didInitMainZoomRef = useRef(false);
  const didInitPercussionZoomRef = useRef(false);
  const didInitGridSplitRef = useRef(false);
  const hasUserAdjustedMainYRef = useRef(false);
  const needsInitialMainRecenteringRef = useRef(true);
  const isPresetZoomTransitionRef = useRef(false);
  const presetMainAxisScreenYRef = useRef(0);
  const presetPercussionAxisScreenYRef = useRef(0);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const percussionZoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const percussionSvgRef = useRef<SVGSVGElement | null>(null);
  const noteIdCounterRef = useRef(0);
  const beatIdCounterRef = useRef(0);
  const lockedNoteMidisRef = useRef<Map<string, number>>(new Map());
  const lockedNoteYIndicesRef = useRef<Map<string, number>>(new Map());
  const currentMidiSetRef = useRef<Set<number>>(new Set());
  const currentPlayingYIndicesRef = useRef<Set<number>>(new Set());
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const transportRef = useRef<Tone.Loop | null>(null);
  const previewTransportRef = useRef<Tone.Loop | null>(null);
  const previewInstrumentRef = useRef<Tone.PolySynth | null>(null);
  const previewNoiseRef = useRef<Tone.NoiseSynth | null>(null);
  const previewMetalRef = useRef<Tone.MetalSynth | null>(null);
  const previewMembraneRef = useRef<Tone.MembraneSynth | null>(null);
  const beatNoiseRef = useRef<Tone.NoiseSynth | null>(null);
  const beatMetalRef = useRef<Tone.MetalSynth | null>(null);
  const beatMembraneRef = useRef<Tone.MembraneSynth | null>(null);
  const lockedDragCueRef = useRef<Tone.FMSynth | null>(null);
  const previewTickIndexRef = useRef(0);
  const previewStartRef = useRef(0);
  const previewEndRef = useRef(0);
  const previewMidiSetRef = useRef<Set<number>>(new Set());
  const previewPlayingYIndicesRef = useRef<Set<number>>(new Set());
  const transientSoundTimeoutIdsRef = useRef<number[]>([]);
  const scalePreviewTimeoutIdsRef = useRef<number[]>([]);
  const scalePreviewYIndicesRef = useRef<Set<number>>(new Set());
  const soundingYCountRef = useRef<Map<number, number>>(new Map());
  const tickIndexRef = useRef(0);
  const startOffsetRef = useRef(0);
  const didDragRef = useRef(false);
  const lockSessionCreatedNoteIdsRef = useRef<Map<string, string[]>>(new Map());
  const lastCreatedNoteRef = useRef<{ noteId: string; timestamp: number } | null>(null);

  const velocityForMidi = useCallback((midi: number) => {
    const normalized = (midi - 36) / 48;
    const clamped = Math.min(1, Math.max(0, normalized));
    return 0.15 + clamped * 0.3;
  }, []);

  const syncSoundingYIndices = useCallback(() => {
    setSoundingYIndices(new Set(soundingYCountRef.current.keys()));
  }, []);

  const makeSound = useCallback((yIndex: number) => {
    const next = (soundingYCountRef.current.get(yIndex) ?? 0) + 1;
    soundingYCountRef.current.set(yIndex, next);
    syncSoundingYIndices();
  }, [syncSoundingYIndices]);

  const endSound = useCallback((yIndex: number) => {
    const current = soundingYCountRef.current.get(yIndex) ?? 0;
    if (current <= 1) {
      soundingYCountRef.current.delete(yIndex);
    } else {
      soundingYCountRef.current.set(yIndex, current - 1);
    }
    syncSoundingYIndices();
  }, [syncSoundingYIndices]);

  const stopScalePreview = useCallback(() => {
    scalePreviewTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scalePreviewTimeoutIdsRef.current = [];
    if (scalePreviewYIndicesRef.current.size > 0) {
      scalePreviewYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
      scalePreviewYIndicesRef.current.clear();
    }
  }, [endSound]);

  const getMidiForYIndex = useCallback(
    (yIndex: number) => {
      const yCenterIndex = yCount / 2;
      return 60 + (yCenterIndex - yIndex);
    },
    [yCount]
  );

  const getYIndexForMidi = useCallback(
    (midi: number) => {
      const yCenterIndex = yCount / 2;
      return Math.max(0, Math.min(yCount, Math.round(yCenterIndex - (midi - 60))));
    },
    [yCount]
  );

  const getFrequencyForMidi = useCallback(
    (midi: number) => 440 * 2 ** ((midi - 69) / 12),
    []
  );

  const normalizeSemitoneIndex = useCallback((value: number): SemitoneIndex => {
    const normalized = ((value % 12) + 12) % 12;
    return (normalized + 1) as SemitoneIndex;
  }, []);

  const getSemitoneIndex = useCallback(
    (yIndex: number): SemitoneIndex => {
      const yCenterIndex = yCount / 2;
      const midi = 60 + (yCenterIndex - yIndex);
      return normalizeSemitoneIndex(midi);
    },
    [normalizeSemitoneIndex, yCount]
  );

  const allowedSemitoneSet = useMemo(
    () => new Set(SCALE_ALLOWED_NOTES[scaleType]),
    [scaleType]
  );

  const allowedYIndices = useMemo(
    () =>
      d3
        .range(0, yCount + 1)
        .filter((index) => allowedSemitoneSet.has(getSemitoneIndex(index))),
    [allowedSemitoneSet, getSemitoneIndex, yCount]
  );

  const snapYIndexToScale = useCallback(
    (yIndex: number) => {
      if (allowedSemitoneSet.size === 12) {
        return yIndex;
      }
      const nearest = d3.least(allowedYIndices, (index) => Math.abs(index - yIndex));
      return nearest ?? yIndex;
    },
    [allowedSemitoneSet, allowedYIndices]
  );

  const ensureSynth = useCallback(async () => {
    if (!limiterRef.current) {
      limiterRef.current = new Tone.Limiter(-1).toDestination();
    }
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.MonoSynth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.08, sustain: 0.5, release: 0.12 },
        portamento: 0.02,
      }).connect(limiterRef.current);
      synthRef.current.volume.value = -12;
    }
    await Tone.start();
  }, []);

  const ensurePreviewSynths = useCallback(async () => {
    await ensureSynth();
    const limiter = limiterRef.current;
    if (!limiter) {
      return;
    }
    if (!previewInstrumentRef.current) {
      previewInstrumentRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
      }).connect(limiter);
    }
    if (!previewNoiseRef.current) {
      previewNoiseRef.current = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
      }).connect(limiter);
    }
    if (!previewMetalRef.current) {
      previewMetalRef.current = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.2, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(limiter);
      previewMetalRef.current.frequency.value = 250;
    }
    if (!previewMembraneRef.current) {
      previewMembraneRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 4,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.05 },
      }).connect(limiter);
    }
  }, [ensureSynth]);

  const ensureBeatSynths = useCallback(async () => {
    await ensureSynth();
    const limiter = limiterRef.current;
    if (!limiter) {
      return;
    }
    if (!beatNoiseRef.current) {
      beatNoiseRef.current = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
      }).connect(limiter);
    }
    if (!beatMetalRef.current) {
      beatMetalRef.current = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.2, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(limiter);
      beatMetalRef.current.frequency.value = 250;
    }
    if (!beatMembraneRef.current) {
      beatMembraneRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 4,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.05 },
      }).connect(limiter);
    }
  }, [ensureSynth]);

  const ensureLockedDragCue = useCallback(async () => {
    await ensureSynth();
    const limiter = limiterRef.current;
    if (!limiter) {
      return;
    }
    if (!lockedDragCueRef.current) {
      lockedDragCueRef.current = new Tone.FMSynth({
        harmonicity: 4.2,
        modulationIndex: 18,
        oscillator: { type: "triangle" },
        modulation: { type: "sawtooth" },
        envelope: { attack: 0.003, decay: 0.2, sustain: 0.02, release: 0.16 },
        modulationEnvelope: { attack: 0.001, decay: 0.14, sustain: 0.01, release: 0.08 },
      }).connect(limiter);
      lockedDragCueRef.current.volume.value = -15;
    }
  }, [ensureSynth]);

  const playLockedDragCue = useCallback(async () => {
    await ensureLockedDragCue();
    const synth = lockedDragCueRef.current;
    if (!synth) {
      return;
    }
    const now = Tone.now();
    synth.triggerAttackRelease("G5", 0.07, now, 0.4);
    synth.triggerAttackRelease("C6", 0.11, now + 0.06, 0.28);
  }, [ensureLockedDragCue]);

  const releaseLockedNote = useCallback((noteId: string) => {
    const midi = lockedNoteMidisRef.current.get(noteId);
    if (midi === undefined) {
      return;
    }
    synthRef.current?.triggerRelease(getFrequencyForMidi(midi), Tone.now());
    lockedNoteMidisRef.current.delete(noteId);
    const yIndex = lockedNoteYIndicesRef.current.get(noteId);
    if (yIndex !== undefined) {
      endSound(yIndex);
      lockedNoteYIndicesRef.current.delete(noteId);
    }
  }, [endSound, getFrequencyForMidi]);

  const clearLockedNotes = useCallback(() => {
    const midis = Array.from(lockedNoteMidisRef.current.values());
    if (midis.length > 0) {
      synthRef.current?.triggerRelease(
        midis.map(getFrequencyForMidi),
        Tone.now()
      );
    }
    lockedNoteYIndicesRef.current.forEach((yIndex) => {
      endSound(yIndex);
    });
    lockedNoteYIndicesRef.current.clear();
    lockedNoteMidisRef.current.clear();
  }, [endSound, getFrequencyForMidi]);

  const updateLockedNotePitch = useCallback(
    async (noteId: string, yIndex: number) => {
      const nextMidi = getMidiForYIndex(yIndex);
      const currentMidi = lockedNoteMidisRef.current.get(noteId);
      if (currentMidi === nextMidi) {
        return;
      }
      if (currentMidi !== undefined) {
        synthRef.current?.triggerRelease(getFrequencyForMidi(currentMidi), Tone.now());
        const currentYIndex = lockedNoteYIndicesRef.current.get(noteId);
        if (currentYIndex !== undefined) {
          endSound(currentYIndex);
        }
      }
      await ensureSynth();
      synthRef.current?.triggerAttack(getFrequencyForMidi(nextMidi), Tone.now(), velocityForMidi(nextMidi));
      lockedNoteMidisRef.current.set(noteId, nextMidi);
      lockedNoteYIndicesRef.current.set(noteId, yIndex);
      makeSound(yIndex);
    },
    [endSound, ensureSynth, getFrequencyForMidi, getMidiForYIndex, makeSound, velocityForMidi]
  );

  const playGridCreatedNote = useCallback(
    async (yIndex: number) => {
      const midi = getMidiForYIndex(yIndex);
      await ensureSynth();
      synthRef.current?.triggerAttackRelease(getFrequencyForMidi(midi), 2, Tone.now(), velocityForMidi(midi));
      makeSound(yIndex);
      const timeoutId = window.setTimeout(() => {
        endSound(yIndex);
        transientSoundTimeoutIdsRef.current = transientSoundTimeoutIdsRef.current.filter((id) => id !== timeoutId);
      }, 2050);
      transientSoundTimeoutIdsRef.current.push(timeoutId);
    },
    [endSound, ensureSynth, getFrequencyForMidi, getMidiForYIndex, makeSound, velocityForMidi]
  );

  const playCursorHoveredNote = useCallback(
    async (yIndex: number) => {
      const midi = getMidiForYIndex(yIndex);
      await ensureSynth();
      const now = Tone.now();
      const activeHoverMidi = activeHoverMidiRef.current;
      if (activeHoverMidi !== null) {
        synthRef.current?.triggerRelease(getFrequencyForMidi(activeHoverMidi), now);
        const activeHoverYIndex = activeHoverYIndexRef.current;
        if (activeHoverYIndex !== null) {
          endSound(activeHoverYIndex);
        }
      }
      if (hoverSoundTimeoutRef.current !== null) {
        window.clearTimeout(hoverSoundTimeoutRef.current);
        hoverSoundTimeoutRef.current = null;
      }
      synthRef.current?.triggerAttackRelease(
        getFrequencyForMidi(midi),
        1,
        now,
        velocityForMidi(midi)
      );
      activeHoverMidiRef.current = midi;
      activeHoverYIndexRef.current = yIndex;
      makeSound(yIndex);
      hoverSoundTimeoutRef.current = window.setTimeout(() => {
        if (activeHoverYIndexRef.current !== null) {
          endSound(activeHoverYIndexRef.current);
        }
        activeHoverMidiRef.current = null;
        activeHoverYIndexRef.current = null;
        hoverSoundTimeoutRef.current = null;
      }, 1050);
    },
    [endSound, ensureSynth, getFrequencyForMidi, getMidiForYIndex, makeSound, velocityForMidi]
  );

  const stopCursorHoveredNote = useCallback(() => {
    if (hoverSoundTimeoutRef.current !== null) {
      window.clearTimeout(hoverSoundTimeoutRef.current);
      hoverSoundTimeoutRef.current = null;
    }
    const activeHoverMidi = activeHoverMidiRef.current;
    if (activeHoverMidi !== null) {
      synthRef.current?.triggerRelease(getFrequencyForMidi(activeHoverMidi), Tone.now());
    }
    const activeHoverYIndex = activeHoverYIndexRef.current;
    if (activeHoverYIndex !== null) {
      endSound(activeHoverYIndex);
    }
    activeHoverMidiRef.current = null;
    activeHoverYIndexRef.current = null;
  }, [endSound, getFrequencyForMidi]);

  const createNoteId = useCallback(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    noteIdCounterRef.current += 1;
    return `note-${noteIdCounterRef.current}`;
  }, []);

  const createNoteAt = useCallback(
    (note: Note, shouldPlay: boolean) => {
      setNotes((prevNotes) => {
        if (prevNotes.some((item) => item.xIndex === note.xIndex && item.yIndex === note.yIndex)) {
          return prevNotes;
        }
        return [...prevNotes, note];
      });
      if (shouldPlay) {
        void playGridCreatedNote(note.yIndex);
      }
    },
    [playGridCreatedNote]
  );

  const toggleNote = useCallback(
    (xIndex: number, yIndex: number) => {
      const shouldPlayCreatedNote = !notes.some((note) => note.xIndex === xIndex && note.yIndex === yIndex);
      setNotes((prevNotes) => {
        const existing = prevNotes.find((note) => note.xIndex === xIndex && note.yIndex === yIndex);
        if (existing) {
          setLongPressNoteIds((prev) => {
            if (!prev.has(existing.id)) {
              return prev;
            }
            const next = new Set(prev);
            next.delete(existing.id);
            return next;
          });
          const nextNotes = prevNotes.filter((note) => note.id !== existing.id);
          setJoinEdges((prevEdges) =>
            prevEdges.filter(
              (edge) =>
                edge.fromId !== existing.id &&
                edge.toId !== existing.id &&
                edge.viaId !== existing.id &&
                edge.viaId2 !== existing.id &&
                !(edge.waypointIds && edge.waypointIds.includes(existing.id))
            )
          );
          setJoinAnchor((anchor) => (anchor?.id === existing.id ? null : anchor));
          return nextNotes;
        }
        return [...prevNotes, { id: createNoteId(), xIndex, yIndex, instrumentId: selectedInstrumentId }];
      });
      if (shouldPlayCreatedNote) {
        void playGridCreatedNote(yIndex);
      }
    },
    [createNoteId, notes, playGridCreatedNote, selectedInstrumentId]
  );

  const createBeatId = useCallback(() => {
    beatIdCounterRef.current += 1;
    return `beat-${beatIdCounterRef.current}`;
  }, []);

  const buildBeatSeries = useCallback(
    (baseBeat: Beat, existingBeats: Beat[]) => {
      const occupied = new Set(
        existingBeats
          .filter((beat) => beat.seriesId !== baseBeat.seriesId)
          .map((beat) => `${beat.xIndex}:${beat.yIndex}`)
      );
      const nextSeries: Beat[] = [];
      const addBeat = (beat: Beat) => {
        const key = `${beat.xIndex}:${beat.yIndex}`;
        if (occupied.has(key)) {
          return;
        }
        occupied.add(key);
        nextSeries.push(beat);
      };

      addBeat(baseBeat);
      for (let xIndex = baseBeat.xIndex + BAR_STEP_COUNT; xIndex <= xCount; xIndex += BAR_STEP_COUNT) {
        addBeat({
          ...baseBeat,
          id: createBeatId(),
          isRepeat: true,
          xIndex,
        });
      }
      return nextSeries;
    },
    [createBeatId, xCount]
  );

  const toggleBeat = useCallback(
    (xIndex: number, yIndex: number) => {
      setBeats((prevBeats) => {
        const existing = prevBeats.find((beat) => beat.xIndex === xIndex && beat.yIndex === yIndex);
        if (existing) {
          setLongPressBeatIds((prev) => {
            const next = new Set(prev);
            prevBeats
              .filter((beat) => beat.seriesId === existing.seriesId)
              .forEach((beat) => next.delete(beat.id));
            return next;
          });
          return prevBeats.filter((beat) => beat.seriesId !== existing.seriesId);
        }
        const baseId = createBeatId();
        const baseBeat: Beat = {
          id: baseId,
          seriesId: baseId,
          isRepeat: false,
          xIndex,
          yIndex,
          instrumentId: selectedBeatId,
        };
        const series = buildBeatSeries(baseBeat, prevBeats);
        return [...prevBeats, ...series];
      });
    },
    [buildBeatSeries, createBeatId, selectedBeatId]
  );

  const moveBeat = useCallback((beatId: string, xIndex: number, yIndex: number) => {
    setBeats((prevBeats) => {
      const existing = prevBeats.find((beat) => beat.id === beatId);
      if (!existing) {
        return prevBeats;
      }
      const seriesId = existing.seriesId;
      const baseBeat = prevBeats.find((beat) => beat.seriesId === seriesId && !beat.isRepeat) ?? existing;
      if (baseBeat.xIndex === xIndex && baseBeat.yIndex === yIndex) {
        return prevBeats;
      }
      if (prevBeats.some((beat) => beat.seriesId !== seriesId && beat.xIndex === xIndex && beat.yIndex === yIndex)) {
        return prevBeats;
      }
      const remaining = prevBeats.filter((beat) => beat.seriesId !== seriesId);
      const nextBase: Beat = { ...baseBeat, xIndex, yIndex, isRepeat: false, seriesId };
      const series = buildBeatSeries(nextBase, remaining);
      const nextBeats = [...remaining, ...series];
      setLongPressBeatIds((prev) => {
        const nextIds = new Set(nextBeats.map((beat) => beat.id));
        const next = new Set<string>();
        prev.forEach((id) => {
          if (nextIds.has(id)) {
            next.add(id);
          }
        });
        return next;
      });
      return nextBeats;
    });
  }, [buildBeatSeries]);

  const deleteBeat = useCallback((beatId: string) => {
    setBeats((prevBeats) => {
      const existing = prevBeats.find((beat) => beat.id === beatId);
      if (!existing) {
        return prevBeats;
      }
      const seriesId = existing.seriesId;
      setLongPressBeatIds((prev) => {
        const next = new Set(prev);
        prevBeats
          .filter((beat) => beat.seriesId === seriesId)
          .forEach((beat) => next.delete(beat.id));
        return next;
      });
      return prevBeats.filter((beat) => beat.seriesId !== seriesId);
    });
  }, []);

  const getExistingNote = useCallback(
    (xIndex: number, yIndex: number) => notes.find((note) => note.xIndex === xIndex && note.yIndex === yIndex) ?? null,
    [notes]
  );

  const getJoinNoteIds = useCallback((edge: JoinEdge): string[] => {
    const ids = [
      edge.fromId,
      edge.toId,
      edge.viaId ?? null,
      edge.viaId2 ?? null,
      ...(edge.waypointIds ?? []),
    ];
    return Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  }, []);

  const reconcileSelectedJoinIds = useCallback((nextEdges: JoinEdge[]) => {
    const nextEdgeIds = new Set(nextEdges.map((edge) => edge.id));
    setSelectedJoinIds((prev) => {
      let changed = false;
      const next = new Set<string>();
      prev.forEach((id) => {
        if (nextEdgeIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const upsertJoinEdgeWithExclusivity = useCallback(
    (prevEdges: JoinEdge[], nextEdge: JoinEdge, excludedEdgeIds: Set<string> = new Set()) => {
      // TEMP: exclusivity is disabled.
      // This keeps existing joins even when a new join shares one or more notes.
      const withoutConflicts = prevEdges.filter((edge) => !excludedEdgeIds.has(edge.id));

      // Exclusivity logic (disabled for now):
      // const nextEdgeNoteIds = new Set(getJoinNoteIds(nextEdge));
      // const withoutConflicts = prevEdges.filter((edge) => {
      //   if (excludedEdgeIds.has(edge.id)) {
      //     return false;
      //   }
      //   if (edge.id === nextEdge.id) {
      //     return true;
      //   }
      //   const edgeNoteIds = getJoinNoteIds(edge);
      //   return !edgeNoteIds.some((id) => nextEdgeNoteIds.has(id));
      // });
      const existingIndex = withoutConflicts.findIndex((edge) => edge.id === nextEdge.id);
      const nextEdges = existingIndex === -1
        ? [...withoutConflicts, nextEdge]
        : withoutConflicts.map((edge) => (edge.id === nextEdge.id ? { ...edge, ...nextEdge } : edge));
      reconcileSelectedJoinIds(nextEdges);
      return nextEdges;
    },
    [getJoinNoteIds, reconcileSelectedJoinIds]
  );

  const createStepJoin = useCallback((fromNote: Note, toNote: Note) => {
    if (fromNote.id === toNote.id || fromNote.xIndex === toNote.xIndex) {
      return;
    }
    const [from, to] = fromNote.xIndex <= toNote.xIndex ? [fromNote, toNote] : [toNote, fromNote];
    const edgeId = `edge-${from.id}-${to.id}`;
    const nextEdge: JoinEdge = { id: edgeId, fromId: from.id, toId: to.id, type: "step", volume: 50 };
    setJoinEdges((prevEdges) => {
      return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge);
    });
  }, [upsertJoinEdgeWithExclusivity]);

  const moveNote = useCallback(
    (noteId: string, xIndex: number, yIndex: number) => {
      const snappedYIndex = snapYIndexToScale(yIndex);
      setNotes((prevNotes) => {
        const existing = prevNotes.find((note) => note.id === noteId);
        if (!existing) {
          return prevNotes;
        }
        if (existing.xIndex === xIndex && existing.yIndex === snappedYIndex) {
          return prevNotes;
        }
        if (
          prevNotes.some(
            (note) => note.id !== noteId && note.xIndex === xIndex && note.yIndex === snappedYIndex
          )
        ) {
          return prevNotes;
        }
        if (lockedNoteMidisRef.current.has(noteId)) {
          void updateLockedNotePitch(noteId, snappedYIndex);
        }
        setJoinAnchor((anchor) =>
          anchor?.id === noteId ? { ...anchor, xIndex, yIndex: snappedYIndex } : anchor
        );
        return prevNotes.map((note) =>
          note.id === noteId ? { ...note, xIndex, yIndex: snappedYIndex } : note
        );
      });
    },
    [snapYIndexToScale, updateLockedNotePitch]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      setLongPressNoteIds((prev) => {
        if (!prev.has(noteId)) {
          return prev;
        }
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
      setNotes((prevNotes) => {
        const existing = prevNotes.find((note) => note.id === noteId);
        if (!existing) {
          return prevNotes;
        }
        lockSessionCreatedNoteIdsRef.current.delete(existing.id);
        lockSessionCreatedNoteIdsRef.current.forEach((ids, key) => {
          const nextIds = ids.filter((id) => id !== existing.id);
          if (nextIds.length === ids.length) {
            return;
          }
          if (nextIds.length === 0) {
            lockSessionCreatedNoteIdsRef.current.delete(key);
            return;
          }
          lockSessionCreatedNoteIdsRef.current.set(key, nextIds);
        });
        setJoinEdges((prevEdges) =>
          prevEdges.filter(
            (edge) =>
              edge.fromId !== existing.id &&
              edge.toId !== existing.id &&
              edge.viaId !== existing.id &&
              edge.viaId2 !== existing.id &&
              !(edge.waypointIds && edge.waypointIds.includes(existing.id))
          )
        );
        setJoinAnchor((anchor) => (anchor?.id === existing.id ? null : anchor));
        releaseLockedNote(existing.id);
        return prevNotes.filter((note) => note.id !== existing.id);
      });
    },
    [releaseLockedNote]
  );

  const handleNoteDragState = useCallback((isDragging: boolean) => {
    if (isDragging) {
      didDragRef.current = true;
    }
  }, []);

  const addLongPressNoteId = useCallback((noteId: string) => {
    setLongPressNoteIds((prev) => {
      if (prev.has(noteId)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(noteId);
      return next;
    });
  }, []);

  const clearLongPressNotes = useCallback(() => {
    setLongPressNoteIds(new Set());
  }, []);

  const addLongPressBeatId = useCallback((beatId: string) => {
    setLongPressBeatIds((prev) => {
      if (prev.has(beatId)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(beatId);
      return next;
    });
  }, []);

  const clearLongPressBeats = useCallback(() => {
    setLongPressBeatIds(new Set());
  }, []);

  const handleNoteInstrumentAssign = useCallback(
    (noteId: string) => {
      if (!selectedInstrumentId) {
        return;
      }
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? { ...note, instrumentId: selectedInstrumentId } : note))
      );
    },
    [selectedInstrumentId]
  );

  const handleBeatInstrumentAssign = useCallback(
    (beatId: string) => {
      if (!selectedBeatId) {
        return;
      }
      setBeats((prevBeats) => {
        const seriesId = prevBeats.find((item) => item.id === beatId)?.seriesId;
        if (!seriesId) {
          return prevBeats;
        }
        return prevBeats.map((beat) =>
          beat.seriesId === seriesId ? { ...beat, instrumentId: selectedBeatId } : beat
        );
      });
    },
    [selectedBeatId]
  );

  

  const getEdgeLimits = useCallback(
    (edge: JoinEdge, fromNote: Note, toNote: Note, viaNote?: Note | null, viaNote2?: Note | null) => {
      if ((edge.type === "step" || edge.type === "linear") && edge.waypointIds?.length) {
        const noteById = new Map(notes.map((note) => [note.id, note]));
        const waypointNotes = edge.waypointIds
          .map((id) => noteById.get(id))
          .filter((note): note is Note => Boolean(note));
        if (waypointNotes.length >= 2) {
          const xs = waypointNotes.map((note) => note.xIndex);
          const baseMinX = Math.min(...xs);
          const baseMaxX = Math.max(...xs);
          const baseEndX = baseMaxX;
          let limit = baseEndX;
          if (edge.behavior) {
            if (edge.behavior.scope === "indefinitely") {
              limit = xCount;
            } else if (edge.behavior.scope === "for") {
              limit = baseEndX + edge.behavior.value;
            } else {
              limit = edge.behavior.value;
            }
          }
          return {
            baseMinX,
            baseMaxX: baseEndX,
            limit: Math.min(Math.max(limit, baseEndX), xCount),
          };
        }
      }
      const xValues = [fromNote.xIndex, toNote.xIndex];
      if (viaNote) {
        xValues.push(viaNote.xIndex);
      }
      if (viaNote2) {
        xValues.push(viaNote2.xIndex);
      }
      const baseMinX = Math.min(...xValues);
      const baseMaxX = Math.max(...xValues);
      const baseEndX =
        edge.type === "sine" ? baseMinX + (baseMaxX - baseMinX) * 2 : baseMaxX;
      let limit = baseEndX;
      if (edge.behavior) {
        if (edge.behavior.scope === "indefinitely") {
          limit = xCount;
        } else if (edge.behavior.scope === "for") {
          limit = baseEndX + edge.behavior.value;
        } else {
          limit = edge.behavior.value;
        }
      }
      return {
        baseMinX,
        baseMaxX: baseEndX,
        limit: Math.min(Math.max(limit, baseEndX), xCount),
      };
    },
    [notes, xCount]
  );

  const handleGridClick = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      if (svgRef.current?.dataset.suppressGridClick === "true") {
        svgRef.current.dataset.suppressGridClick = "false";
        return;
      }
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }
      const svg = svgRef.current;
      if (!svg) {
        return;
      }
      const [pointerX, pointerY] = d3.pointer(event, svg);
      const innerWidth = Math.max(1, gridWorldWidth - MAIN_PAD_LEFT - MAIN_PAD_RIGHT);
      const innerHeight = Math.max(1, gridWorldHeight - MAIN_PAD_TOP - MAIN_PAD_BOTTOM);
      const xStep = innerWidth / xCount;
      const yStep = innerHeight / yCount;
      const xIndex = Math.max(0, Math.min(xCount, Math.round((pointerX - MAIN_PAD_LEFT) / xStep)));
      const target = event.target as Element | null;
      const rawYIndex = Math.max(0, Math.min(yCount, Math.round((pointerY - MAIN_PAD_TOP) / yStep)));
      const yIndex = snapYIndexToScale(rawYIndex);
      if (mode === "notes") {
        const noteEl = target?.closest?.("circle.note");
        if (noteEl && noteEl.getAttribute("data-locked") === "true") {
          return;
        }
        if (target?.closest?.("g.note-handle")) {
          return;
        }
      }
      if (mode === "joins" && joinsTool !== "new") {
        return;
      }
        const clickedNote = getExistingNote(xIndex, yIndex);
        if (mode === "notes" && !clickedNote) {
          const now = Date.now();
          const newNote: Note = {
            id: createNoteId(),
            xIndex,
            yIndex,
            instrumentId: selectedInstrumentId,
          };
          const lastCreated = lastCreatedNoteRef.current;
          if (lastCreated && now - lastCreated.timestamp < 10000) {
            const lastNote = notes.find((note) => note.id === lastCreated.noteId);
            if (lastNote) {
              createStepJoin(lastNote, newNote);
            }
          }
          lastCreatedNoteRef.current = { noteId: newNote.id, timestamp: now };
          createNoteAt(newNote, true);
          return;
        }
        if (mode === "notes") {
          toggleNote(xIndex, yIndex);
        }
        if (mode === "joins" && joinsTool === "new") {
          const existingNote = getExistingNote(xIndex, yIndex);
          if (!existingNote) {
            setJoinSeriesIds([]);
            setJoinSeriesEdgeId(null);
            setJoinBuffer([]);
            setJoinAnchor(null);
            return;
          }
          if (joinType === "step" || joinType === "linear") {
            const nextIds = joinSeriesIds.includes(existingNote.id)
              ? joinSeriesIds.filter((id) => id !== existingNote.id)
              : [...joinSeriesIds, existingNote.id];
            const noteById = new Map(notes.map((note) => [note.id, note]));
            const sortedIds = Array.from(new Set(nextIds))
              .map((id) => noteById.get(id))
              .filter((note): note is Note => Boolean(note))
              .sort((a, b) => (a.xIndex !== b.xIndex ? a.xIndex - b.xIndex : a.yIndex - b.yIndex))
              .map((note) => note.id);
            setJoinSeriesIds(sortedIds);

            if (sortedIds.length < 2) {
              if (joinSeriesEdgeId) {
                setJoinEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== joinSeriesEdgeId));
                setJoinSeriesEdgeId(null);
              }
              return;
            }

            const edgeId = `edge-${joinType}-${sortedIds.join("-")}`;
            const existingEdge = joinSeriesEdgeId
              ? joinEdges.find((edge) => edge.id === joinSeriesEdgeId)
              : null;
            const nextEdge: JoinEdge = {
              id: edgeId,
              fromId: sortedIds[0],
              toId: sortedIds[sortedIds.length - 1],
              waypointIds: sortedIds,
              type: joinType,
              volume: existingEdge?.volume ?? 50,
              groupKey: existingEdge?.groupKey,
            };

            setJoinEdges((prevEdges) => {
              const excludedEdgeIds = joinSeriesEdgeId ? new Set([joinSeriesEdgeId]) : new Set<string>();
              return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge, excludedEdgeIds);
            });
            setJoinSeriesEdgeId(edgeId);
            return;
          }
          if (joinType === "quadratic") {
            setJoinBuffer((prev) => {
              const last = prev[prev.length - 1];
              if (!last) {
                return [existingNote];
              }
              if (last.id === existingNote.id) {
                return [];
              }
              if (existingNote.xIndex <= last.xIndex) {
                setToastMessage("You can only join from left to right.");
                return prev;
              }
              if (prev.some((note) => note.id === existingNote.id)) {
                return prev;
              }
              const next = [...prev, existingNote];
              if (next.length < 3) {
                return next;
              }
              const [from, via, to] = next;
              const edgeId = `edge-${from.id}-${via.id}-${to.id}`;
              const nextEdge: JoinEdge = {
                id: edgeId,
                fromId: from.id,
                viaId: via.id,
                toId: to.id,
                type: "quadratic",
                volume: 50,
              };
              setJoinEdges((prevEdges) => {
                return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge);
              });
              return [to];
            });
            return;
          }
          if (joinType === "cubic") {
            setJoinBuffer((prev) => {
              const last = prev[prev.length - 1];
              if (!last) {
                return [existingNote];
              }
              if (last.id === existingNote.id) {
                return [];
              }
              if (existingNote.xIndex <= last.xIndex) {
                setToastMessage("You can only join from left to right.");
                return prev;
              }
              if (prev.some((note) => note.id === existingNote.id)) {
                return prev;
              }
              const next = [...prev, existingNote];
              if (next.length < 4) {
                return next;
              }
              const [from, via1, via2, to] = next;
              const edgeId = `edge-${from.id}-${via1.id}-${via2.id}-${to.id}`;
              const nextEdge: JoinEdge = {
                id: edgeId,
                fromId: from.id,
                viaId: via1.id,
                viaId2: via2.id,
                toId: to.id,
                type: "cubic",
                volume: 50,
              };
              setJoinEdges((prevEdges) => {
                return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge);
              });
              return [to];
            });
            return;
          }
          if (joinType === "sine") {
            setJoinBuffer((prev) => {
              if (prev.length === 0) {
                return [existingNote];
              }
              if (prev.some((note) => note.id === existingNote.id)) {
                return prev;
              }
              const next = [...prev, existingNote];
              if (next.length < 3) {
                return next;
              }
              const pairs: Array<[Note, Note, Note]> = [
                [next[0], next[1], next[2]],
                [next[0], next[2], next[1]],
                [next[1], next[2], next[0]],
              ];
              const match = pairs.find(([first, second]) => first.yIndex === second.yIndex);
              if (!match) {
                setToastMessage("Sine needs two notes on the same horizontal line.");
                return [];
              }
              const [axisA, axisB, amplitudeNote] = match;
              const axisExtent = d3.extent([axisA.xIndex, axisB.xIndex]);
              if (!axisExtent[0] && axisExtent[0] !== 0) {
                return [];
              }
              if (!axisExtent[1] && axisExtent[1] !== 0) {
                return [];
              }
              const from = axisA.xIndex <= axisB.xIndex ? axisA : axisB;
              const to = axisA.xIndex <= axisB.xIndex ? axisB : axisA;
              const edgeId = `edge-${from.id}-${to.id}-${amplitudeNote.id}-sine`;
              const nextEdge: JoinEdge = {
                id: edgeId,
                fromId: from.id,
                viaId: amplitudeNote.id,
                toId: to.id,
                type: "sine",
                volume: 50,
              };
              setJoinEdges((prevEdges) => {
                return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge);
              });
              return [to];
            });
            return;
          }
          if (!joinAnchor) {
            setJoinAnchor(existingNote);
            return;
          }
          if (joinAnchor.id === existingNote.id) {
            setJoinAnchor(null);
            return;
          }
          if (existingNote.xIndex <= joinAnchor.xIndex) {
            setToastMessage("You can only join from left to right.");
            return;
          }
          const edgeId = `edge-${joinAnchor.id}-${existingNote.id}`;
          const nextEdge: JoinEdge = {
            id: edgeId,
            fromId: joinAnchor.id,
            toId: existingNote.id,
            type: joinType,
            volume: 50,
          };
          setJoinEdges((prevEdges) => {
            return upsertJoinEdgeWithExclusivity(prevEdges, nextEdge);
          });
          setJoinAnchor(existingNote);
        }
    },
    [
      getExistingNote,
      createStepJoin,
      createNoteAt,
      createNoteId,
      gridWorldHeight,
      gridWorldWidth,
      joinAnchor,
      joinEdges,
      joinSeriesEdgeId,
      joinSeriesIds,
      joinType,
      mode,
      notes,
      upsertJoinEdgeWithExclusivity,
      toggleNote,
      selectedInstrumentId,
      xCount,
      yCount,
      joinsTool,
      snapYIndexToScale,
    ]
  );

  const handleGridPointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!cursorSoundEnabled || mode === "play") {
        stopCursorHoveredNote();
        return;
      }
      if (event.buttons !== 0) {
        stopCursorHoveredNote();
        lastHoveredYIndexRef.current = null;
        return;
      }
      const svg = svgRef.current;
      if (!svg) {
        return;
      }
      const [, pointerY] = d3.pointer(event, svg);
      const innerHeight = Math.max(1, gridWorldHeight - MAIN_PAD_TOP - MAIN_PAD_BOTTOM);
      const yStep = innerHeight / yCount;
      const rawYIndex = Math.max(0, Math.min(yCount, Math.round((pointerY - MAIN_PAD_TOP) / yStep)));
      const yIndex = snapYIndexToScale(rawYIndex);
      if (lastHoveredYIndexRef.current === yIndex) {
        return;
      }
      lastHoveredYIndexRef.current = yIndex;
      void playCursorHoveredNote(yIndex);
    },
    [
      cursorSoundEnabled,
      gridWorldHeight,
      mode,
      playCursorHoveredNote,
      snapYIndexToScale,
      stopCursorHoveredNote,
      yCount,
    ]
  );

  const handleGridPointerLeave = useCallback(() => {
    lastHoveredYIndexRef.current = null;
    stopCursorHoveredNote();
  }, [stopCursorHoveredNote]);

  const handlePercussionGridClick = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const svg = percussionSvgRef.current;
      if (!svg) {
        return;
      }
      const shouldSuppress = svg.getAttribute("data-suppress-grid-click") === "true";
      if (shouldSuppress) {
        svg.removeAttribute("data-suppress-grid-click");
        return;
      }
      const [pointerX, pointerY] = d3.pointer(event, svg);
      const innerWidth = Math.max(1, gridWorldWidth - PERCUSSION_PAD_LEFT - PERCUSSION_PAD_RIGHT);
      const innerHeight = Math.max(1, percussionDrawHeight - PERCUSSION_PAD_TOP - PERCUSSION_PAD_BOTTOM);
      const xStep = innerWidth / xCount;
      const yStep = innerHeight / percussionYCount;
      const xIndex = Math.max(0, Math.min(xCount, Math.round((pointerX - PERCUSSION_PAD_LEFT) / xStep)));
      const yIndex = Math.max(0, Math.min(percussionYCount, Math.round((pointerY - PERCUSSION_PAD_TOP) / yStep)));
      if (mode !== "notes") {
        return;
      }
      const existing = beats.find((beat) => beat.xIndex === xIndex && beat.yIndex === yIndex);
      if (existing) {
        return;
      }
      toggleBeat(xIndex, yIndex);
    },
    [beats, gridWorldWidth, mode, percussionDrawHeight, percussionYCount, toggleBeat, xCount]
  );


  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }
    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 1400);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  useEffect(
    () => () => {
      if (hoverSoundTimeoutRef.current !== null) {
        window.clearTimeout(hoverSoundTimeoutRef.current);
      }
      transientSoundTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      scalePreviewTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    []
  );

  const joinEnabled = joinEdges.length > 0;
  const notesEnabled = mode === "notes";
  const joinsEnabled = mode === "joins";
  const joinSelectionEnabled = mode === "joins";

  const highlightedIds = useMemo(() => {
    if (mode === "joins" && joinsTool === "new") {
      if (joinType === "step" || joinType === "linear") {
        return new Set(joinSeriesIds);
      }
      if (joinType === "quadratic" || joinType === "cubic" || joinType === "sine") {
        return new Set(joinBuffer.map((note) => note.id));
      }
      return new Set(joinAnchor ? [joinAnchor.id] : []);
    }
    return new Set<string>();
  }, [joinAnchor, joinBuffer, joinSeriesIds, joinType, joinsTool, mode]);

  useEffect(() => {
    if (!joinSelectionEnabled) {
      setSelectedJoinIds(new Set());
    }
  }, [joinSelectionEnabled]);

  useEffect(() => {
    setSelectedJoinIds(new Set());
  }, [mode]);

  const handlePlay = useCallback(async () => {
    try {
      setMode("play");
      setIsPlaying(true);
      stopScalePreview();
      previewTransportRef.current?.dispose();
      previewTransportRef.current = null;
      previewMidiSetRef.current = new Set();
      if (previewPlayingYIndicesRef.current.size > 0) {
        previewPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
        previewPlayingYIndicesRef.current = new Set();
      }
      setShowTimer(true);
      setIsFinished(false);
      setIsPaused(false);
      isPausedRef.current = false;
      const shouldPlayNotes = joinEdges.length > 0;
      const noteById = new Map(notes.map((note) => [note.id, note]));
      const lastJoinX = shouldPlayNotes
        ? (d3.max(
            joinEdges
              .map((edge) => {
                const from = noteById.get(edge.fromId);
                const to = noteById.get(edge.toId);
                if (!from || !to) {
                  return null;
                }
                const via = edge.viaId ? noteById.get(edge.viaId) : null;
                const via2 = edge.viaId2 ? noteById.get(edge.viaId2) : null;
                const { limit } = getEdgeLimits(edge, from, to, via, via2);
                return limit ?? null;
              })
              .filter((value): value is number => value !== null)
          ) ?? null)
        : null;

      const hasJoinPlaybackRange = shouldPlayNotes && lastJoinX !== null && lastJoinX >= xOriginIndex;

      await Tone.start();
      await ensureSynth();
      if (beats.length > 0) {
        await ensureBeatSynths();
      }
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      Tone.Transport.position = 0;

      transportRef.current?.dispose();
      transportRef.current = null;

      tickIndexRef.current = 0;
      startOffsetRef.current = xOriginIndex;
      setElapsedMs(0);
      setPanOffset(0);
      setPlayheadXIndex(xOriginIndex);

      if (hasJoinPlaybackRange) {
        const initialNotes = getActiveNotesForEdgesAtX(
          joinEdges,
          notes,
          startOffsetRef.current,
          xCount,
          yCount
        );
        if (initialNotes && initialNotes.length > 0) {
          const yCenterIndex = yCount / 2;
          const midiEntries = initialNotes.map((entry) => ({
            midi: 60 + (yCenterIndex - entry.yIndex),
            volume: entry.volume,
          }));
          midiEntries.forEach((entry) => {
            synthRef.current?.triggerAttack(
              getFrequencyForMidi(entry.midi),
              Tone.now(),
              velocityForMidi(entry.midi) * (entry.volume / 100)
            );
          });
          const midiSet = new Set(midiEntries.map((entry) => entry.midi));
          currentMidiSetRef.current = midiSet;
          const ySet = new Set(initialNotes.map((entry) => entry.yIndex));
          ySet.forEach((yIndex) => makeSound(yIndex));
          currentPlayingYIndicesRef.current = ySet;
        } else {
          currentMidiSetRef.current = new Set();
          currentPlayingYIndicesRef.current = new Set();
        }
      } else {
        currentMidiSetRef.current = new Set();
        currentPlayingYIndicesRef.current = new Set();
      }

    const beatByXIndex = new Map<number, Beat[]>();
    beats.forEach((beat) => {
      const bucket = beatByXIndex.get(beat.xIndex);
      if (bucket) {
        bucket.push(beat);
      } else {
        beatByXIndex.set(beat.xIndex, [beat]);
      }
    });

    const triggerBeat = (beatId: string, time: number) => {
      const membrane = beatMembraneRef.current;
      const noise = beatNoiseRef.current;
      const metal = beatMetalRef.current;
      if (!membrane || !noise || !metal) {
        return;
      }
      switch (beatId) {
        case "beat_kick":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("C1", "8n", time);
          break;
        case "beat_snare":
          noise.set({ envelope: { attack: 0.001, decay: 0.18, sustain: 0 } });
          noise.triggerAttackRelease("16n", time);
          break;
        case "beat_clap":
          noise.set({ envelope: { attack: 0.001, decay: 0.08, sustain: 0 } });
          noise.triggerAttackRelease("32n", time);
          break;
        case "beat_hat_closed":
          metal.set({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 } });
          metal.triggerAttackRelease(400, "16n", time);
          break;
        case "beat_hat_open":
          metal.set({ envelope: { attack: 0.001, decay: 0.2, release: 0.05 } });
          metal.triggerAttackRelease(400, "8n", time);
          break;
        case "beat_tom_low":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("E2", "8n", time);
          break;
        case "beat_tom_mid":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("A2", "8n", time);
          break;
        case "beat_tom_high":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("D3", "8n", time);
          break;
        case "beat_crash":
          metal.set({ envelope: { attack: 0.001, decay: 0.6, release: 0.1 } });
          metal.triggerAttackRelease(200, "4n", time);
          break;
        case "beat_ride":
          metal.set({ envelope: { attack: 0.001, decay: 0.35, release: 0.08 } });
          metal.triggerAttackRelease(300, "8n", time);
          break;
        default:
          break;
      }
    };

      const loop = new Tone.Loop((time) => {
        const tickIndex = tickIndexRef.current;
        const nextOffset = startOffsetRef.current + tickIndex;
        setPlayheadXIndex(nextOffset);
      if (hasJoinPlaybackRange && lastJoinX !== null && nextOffset > lastJoinX) {
        if (currentMidiSetRef.current.size > 0) {
          synthRef.current?.triggerRelease(
            Array.from(currentMidiSetRef.current).map(getFrequencyForMidi),
            time
          );
          currentMidiSetRef.current = new Set();
        }
        if (currentPlayingYIndicesRef.current.size > 0) {
          currentPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
          currentPlayingYIndicesRef.current = new Set();
        }
        synthRef.current?.releaseAll?.(time);
        Tone.Transport.stop();
        transportRef.current?.dispose();
        transportRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setIsFinished(true);
        return;
      }
      if (!hasJoinPlaybackRange && nextOffset >= xCount) {
        Tone.Transport.stop();
        transportRef.current?.dispose();
        transportRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setIsFinished(true);
        return;
      }

      if (hasJoinPlaybackRange) {
        const notesAtX = getActiveNotesForEdgesAtX(joinEdges, notes, nextOffset, xCount, yCount);
        const yCenterIndex = yCount / 2;
        const nextEntries = notesAtX?.map((entry) => ({
          midi: 60 + (yCenterIndex - entry.yIndex),
          yIndex: entry.yIndex,
          volume: entry.volume,
        })) ?? [];
        const nextMidiSet = new Set(nextEntries.map((entry) => entry.midi));
        const nextYSet = new Set(nextEntries.map((entry) => entry.yIndex));
        const currentMidiSet = currentMidiSetRef.current;
        const releases = [...currentMidiSet].filter((midi) => !nextMidiSet.has(midi));
        const attacks = [...nextMidiSet].filter((midi) => !currentMidiSet.has(midi));
        const currentYSet = currentPlayingYIndicesRef.current;
        const yReleases = [...currentYSet].filter((yIndex) => !nextYSet.has(yIndex));
        const yAttacks = [...nextYSet].filter((yIndex) => !currentYSet.has(yIndex));

        if (releases.length > 0) {
          synthRef.current?.triggerRelease(
            releases.map(getFrequencyForMidi),
            time
          );
        }
        if (attacks.length > 0) {
          attacks.forEach((midi) => {
            const entry = nextEntries.find((item) => item.midi === midi);
            const volume = entry?.volume ?? 50;
            synthRef.current?.triggerAttack(
              getFrequencyForMidi(midi),
              time,
              velocityForMidi(midi) * (volume / 100)
            );
          });
        }
        yReleases.forEach((yIndex) => endSound(yIndex));
        yAttacks.forEach((yIndex) => makeSound(yIndex));
        currentMidiSetRef.current = nextMidiSet;
        currentPlayingYIndicesRef.current = nextYSet;
      } else {
        currentMidiSetRef.current = new Set();
        if (currentPlayingYIndicesRef.current.size > 0) {
          currentPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
          currentPlayingYIndicesRef.current = new Set();
        }
      }

      const beatsAtX = beatByXIndex.get(nextOffset) ?? [];
      beatsAtX.forEach((beat) => {
        const beatId = beat.instrumentId ?? selectedBeatId;
        if (beatId) {
          triggerBeat(beatId, time);
        }
      });

      const bpm = 120 * speedRef.current;
      const tickSeconds = (60 / bpm) / 4;
      setElapsedMs(tickIndex * tickSeconds * 1000);
      setPanOffset((nextOffset - startOffsetRef.current) * (gridWorldWidth / xCount));
      tickIndexRef.current += 1;
    }, "16n");

      transportRef.current = loop;
      loop.start(0);
      Tone.Transport.bpm.value = 120 * speedRef.current;
      Tone.Transport.start("+0.01");
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      isPausedRef.current = false;
      setMode("notes");
    }
  }, [
    beats,
    ensureBeatSynths,
    ensureSynth,
    endSound,
    getEdgeLimits,
    gridWorldWidth,
    joinEdges,
    notes,
    makeSound,
    selectedBeatId,
    velocityForMidi,
    xCount,
    xOriginIndex,
    yCount,
    stopScalePreview,
  ]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setElapsedMs(0);
    setPanOffset(0);
    setPlayheadXIndex(xOriginIndex);
    setShowTimer(false);
    setIsFinished(false);
    Tone.Transport.stop();
    transportRef.current?.dispose();
    transportRef.current = null;
    if (currentMidiSetRef.current.size > 0) {
      synthRef.current?.triggerRelease(
        Array.from(currentMidiSetRef.current).map(getFrequencyForMidi)
      );
      currentMidiSetRef.current = new Set();
    }
    if (currentPlayingYIndicesRef.current.size > 0) {
      currentPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
      currentPlayingYIndicesRef.current = new Set();
    }
    synthRef.current?.releaseAll?.();
    setMode("notes");
  }, [endSound, xOriginIndex]);

  const handlePauseToggle = useCallback(() => {
    if (!isPlaying) {
      return;
    }
    if (isPausedRef.current) {
      isPausedRef.current = false;
      setIsPaused(false);
      Tone.Transport.start("+0.01");
      const midis = Array.from(currentMidiSetRef.current);
      if (midis.length > 0) {
        midis.forEach((midi) => {
          synthRef.current?.triggerAttack(getFrequencyForMidi(midi), Tone.now(), velocityForMidi(midi));
        });
      }
      if (currentPlayingYIndicesRef.current.size > 0) {
        currentPlayingYIndicesRef.current.forEach((yIndex) => makeSound(yIndex));
      }
      return;
    }
    isPausedRef.current = true;
    setIsPaused(true);
    Tone.Transport.pause();
    const midis = Array.from(currentMidiSetRef.current);
    if (midis.length > 0) {
      synthRef.current?.triggerRelease(
        midis.map(getFrequencyForMidi),
        Tone.now()
      );
    }
    if (currentPlayingYIndicesRef.current.size > 0) {
      currentPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
    }
  }, [endSound, isPlaying, makeSound, velocityForMidi]);

  const stopPreviewPlayback = useCallback(() => {
    previewTransportRef.current?.dispose();
    previewTransportRef.current = null;
    if (previewMidiSetRef.current.size > 0) {
      synthRef.current?.triggerRelease(
        Array.from(previewMidiSetRef.current).map(getFrequencyForMidi),
        Tone.now()
      );
      previewMidiSetRef.current = new Set();
    }
    if (previewPlayingYIndicesRef.current.size > 0) {
      previewPlayingYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
      previewPlayingYIndicesRef.current = new Set();
    }
    if (!isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
    }
  }, [endSound, isPlaying]);

  useEffect(
    () => () => {
      stopPreviewPlayback();
      stopCursorHoveredNote();
      scalePreviewTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      scalePreviewTimeoutIdsRef.current = [];
      if (scalePreviewYIndicesRef.current.size > 0) {
        scalePreviewYIndicesRef.current.forEach((yIndex) => endSound(yIndex));
        scalePreviewYIndicesRef.current.clear();
      }
      clearLockedNotes();
      transportRef.current?.dispose();
      transportRef.current = null;
      synthRef.current?.dispose();
      synthRef.current = null;
      beatNoiseRef.current?.dispose();
      beatNoiseRef.current = null;
      beatMetalRef.current?.dispose();
      beatMetalRef.current = null;
      beatMembraneRef.current?.dispose();
      beatMembraneRef.current = null;
      lockedDragCueRef.current?.dispose();
      lockedDragCueRef.current = null;
      limiterRef.current?.dispose();
      limiterRef.current = null;
      soundingYCountRef.current.clear();
      setSoundingYIndices(new Set());
    },
    [clearLockedNotes, endSound, stopCursorHoveredNote, stopPreviewPlayback]
  );

  const updateSpeed = useCallback((next: number) => {
    const clamped = Math.max(0.1, Math.min(5, next));
    speedRef.current = clamped;
    setSpeedMultiplier(clamped);
    Tone.Transport.bpm.value = 120 * clamped;
  }, []);

  const updateJoinVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(100, next));
    setSelectedJoinVolume(clamped);
    setJoinEdges((prevEdges) =>
      prevEdges.map((edge) =>
        selectedJoinIds.has(edge.id) ? { ...edge, volume: clamped } : edge
      )
    );
  }, [selectedJoinIds]);

  const handleSpeedDown = useCallback(() => {
    updateSpeed(speedRef.current - 0.1);
  }, [updateSpeed]);

  const handleSpeedUp = useCallback(() => {
    updateSpeed(speedRef.current + 0.1);
  }, [updateSpeed]);

  const handleDragLockChange = useCallback(
    async (noteId: string, locked: boolean) => {
      if (!locked) {
        didDragRef.current = true;
        releaseLockedNote(noteId);
        const createdIds = lockSessionCreatedNoteIdsRef.current.get(noteId) ?? [];
        if (createdIds.length > 1) {
          const noteById = new Map(notes.map((note) => [note.id, note]));
          const joinPairs: Array<[string, string]> = [];
          for (let index = 0; index < createdIds.length - 1; index += 1) {
            const fromId = createdIds[index];
            const toId = createdIds[index + 1];
            const from = noteById.get(fromId);
            const to = noteById.get(toId);
            if (!from || !to) {
              continue;
            }
            if (from.id === to.id) {
              continue;
            }
            joinPairs.push([from.id, to.id]);
          }
          if (joinPairs.length > 0) {
            setJoinEdges((prevEdges) => {
              let nextEdges = prevEdges;
              joinPairs.forEach(([fromId, toId]) => {
                const alreadyExists = nextEdges.some((edge) => edge.fromId === fromId && edge.toId === toId);
                if (alreadyExists) {
                  return;
                }
                const edgeId = `edge-${fromId}-${toId}`;
                nextEdges = [
                  ...nextEdges,
                  {
                    id: edgeId,
                    fromId,
                    toId,
                    type: "step",
                    volume: 50,
                  },
                ];
              });
              return nextEdges;
            });
          }
        }
        lockSessionCreatedNoteIdsRef.current.delete(noteId);
        return;
      }
      lockSessionCreatedNoteIdsRef.current.set(noteId, []);
      const note = notes.find((item) => item.id === noteId);
      if (!note) {
        return;
      }
      await updateLockedNotePitch(noteId, note.yIndex);
    },
    [notes, releaseLockedNote, updateLockedNotePitch]
  );

  const applyPreviewInstrumentConfig = useCallback(
    async (instrumentId: string) => {
      await ensurePreviewSynths();
      if (!previewInstrumentRef.current) {
        return null;
      }
      const configMap: Record<string, PreviewInstrumentConfig> = {
        instr_piano: { type: "triangle", envelope: { attack: 0.01, decay: 0.25, sustain: 0.4, release: 0.4 } },
        instr_epiano: { type: "sine", envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.6 } },
        instr_organ: { type: "square", envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.2 } },
        instr_lead: { type: "sawtooth", envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.3 } },
        instr_bass: { type: "square", envelope: { attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.2 } },
        instr_pad: { type: "sine", envelope: { attack: 0.2, decay: 0.4, sustain: 0.8, release: 0.8 } },
        instr_pluck: { type: "triangle", envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.1 } },
        instr_guitar: { type: "triangle", envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.3 } },
        instr_bell: { type: "sine", envelope: { attack: 0.01, decay: 0.4, sustain: 0.2, release: 0.6 } },
        instr_strings: { type: "sawtooth", envelope: { attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.6 } },
      };
      const config = configMap[instrumentId] ?? configMap.instr_piano;
      previewInstrumentRef.current.set({
        oscillator: { type: config.type },
        envelope: config.envelope,
      });
      return previewInstrumentRef.current;
    },
    [ensurePreviewSynths]
  );

  const handleScaleChange = useCallback(
    async (nextScaleType: ScaleType) => {
      setScaleType(nextScaleType);
      stopScalePreview();
      const instrumentId = selectedInstrumentId ?? "instr_piano";
      const instrument = await applyPreviewInstrumentConfig(instrumentId);
      if (!instrument) {
        return;
      }
      const noteDurationSeconds = 0.125;
      const noteDurationMs = 125;
      const allowedSemitones = new Set(SCALE_ALLOWED_NOTES[nextScaleType]);
      const originMidi = 60;
      const ascendingScaleMidis = d3
        .range(0, 13)
        .filter((offset) => allowedSemitones.has(normalizeSemitoneIndex(offset)))
        .map((offset) => originMidi + offset);
      const descendingScaleMidis = ascendingScaleMidis.slice(0, -1).reverse();
      const scaleMidis = [...ascendingScaleMidis, ...descendingScaleMidis];
      scaleMidis.forEach((midi, index) => {
        const yIndex = getYIndexForMidi(midi);
        const startTimeoutId = window.setTimeout(() => {
          makeSound(yIndex);
          scalePreviewYIndicesRef.current.add(yIndex);
          instrument.triggerAttackRelease(
            getFrequencyForMidi(midi),
            noteDurationSeconds,
            Tone.now(),
            velocityForMidi(midi)
          );
          const endTimeoutId = window.setTimeout(() => {
            endSound(yIndex);
            scalePreviewYIndicesRef.current.delete(yIndex);
            scalePreviewTimeoutIdsRef.current = scalePreviewTimeoutIdsRef.current.filter((id) => id !== endTimeoutId);
          }, noteDurationMs);
          scalePreviewTimeoutIdsRef.current.push(endTimeoutId);
          scalePreviewTimeoutIdsRef.current = scalePreviewTimeoutIdsRef.current.filter((id) => id !== startTimeoutId);
        }, index * noteDurationMs);
        scalePreviewTimeoutIdsRef.current.push(startTimeoutId);
      });
    },
    [
      applyPreviewInstrumentConfig,
      endSound,
      getYIndexForMidi,
      makeSound,
      selectedInstrumentId,
      stopScalePreview,
      velocityForMidi,
    ]
  );

  const handleInstrumentPreview = useCallback(
    async (instrumentId: string) => {
      setSelectedInstrumentId(instrumentId);
      if (longPressNoteIdsRef.current.size > 0) {
        const activeIds = new Set(longPressNoteIdsRef.current);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (activeIds.has(note.id) ? { ...note, instrumentId } : note))
        );
      }
      const instrument = await applyPreviewInstrumentConfig(instrumentId);
      if (!instrument) {
        return;
      }
      instrument.triggerAttackRelease("C4", "8n");
    },
    [applyPreviewInstrumentConfig]
  );

  const handleBeatPreview = useCallback(
    async (beatId: string) => {
      setSelectedBeatId(beatId);
      if (longPressBeatIdsRef.current.size > 0) {
        const activeIds = new Set(longPressBeatIdsRef.current);
        setBeats((prevBeats) => {
          const seriesIds = new Set(
            prevBeats.filter((beat) => activeIds.has(beat.id)).map((beat) => beat.seriesId)
          );
          if (seriesIds.size === 0) {
            return prevBeats;
          }
          return prevBeats.map((beat) =>
            seriesIds.has(beat.seriesId) ? { ...beat, instrumentId: beatId } : beat
          );
        });
      }
      await ensurePreviewSynths();
      const membrane = previewMembraneRef.current;
      const noise = previewNoiseRef.current;
      const metal = previewMetalRef.current;
      if (!membrane || !noise || !metal) {
        return;
      }
      switch (beatId) {
        case "beat_kick":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("C1", "8n");
          break;
        case "beat_snare":
          noise.set({ envelope: { attack: 0.001, decay: 0.18, sustain: 0 } });
          noise.triggerAttackRelease("16n");
          break;
        case "beat_clap":
          noise.set({ envelope: { attack: 0.001, decay: 0.08, sustain: 0 } });
          noise.triggerAttackRelease("32n");
          break;
        case "beat_hat_closed":
          metal.set({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 } });
          metal.triggerAttackRelease(400, "16n");
          break;
        case "beat_hat_open":
          metal.set({ envelope: { attack: 0.001, decay: 0.2, release: 0.05 } });
          metal.triggerAttackRelease(400, "8n");
          break;
        case "beat_tom_low":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("E2", "8n");
          break;
        case "beat_tom_mid":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("A2", "8n");
          break;
        case "beat_tom_high":
          membrane.set({ pitchDecay: 0.01, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 } });
          membrane.triggerAttackRelease("D3", "8n");
          break;
        case "beat_crash":
          metal.set({ envelope: { attack: 0.001, decay: 0.6, release: 0.1 } });
          metal.triggerAttackRelease(200, "4n");
          break;
        case "beat_ride":
          metal.set({ envelope: { attack: 0.001, decay: 0.35, release: 0.08 } });
          metal.triggerAttackRelease(300, "8n");
          break;
        default:
          break;
      }
    },
    [ensurePreviewSynths]
  );
  const handleBeatDragLockChange = useCallback(
    (_beatId: string, locked: boolean) => {
      if (!locked) {
        return;
      }
      const nextBeatId = selectedBeatId ?? BEAT_OPTIONS[0].id;
      void handleBeatPreview(nextBeatId);
    },
    [handleBeatPreview, selectedBeatId]
  );

  const handleCursorSoundToggle = useCallback((value: boolean) => {
    setCursorSoundEnabled(value);
    if (!value) {
      lastHoveredYIndexRef.current = null;
      stopCursorHoveredNote();
    }
  }, [stopCursorHoveredNote]);

  const handleLockedDragEnd = useCallback(
    (noteId: string) => {
      if (!lockedNoteMidisRef.current.has(noteId)) {
        return;
      }
      void playLockedDragCue();
      const duplicateId = createNoteId();
      setNotes((prevNotes) => {
        const sourceIndex = prevNotes.findIndex((note) => note.id === noteId);
        if (sourceIndex === -1) {
          return prevNotes;
        }
        const source = prevNotes[sourceIndex];
        const duplicate: Note = {
          ...source,
          id: duplicateId,
        };
        const existingCreatedIds = lockSessionCreatedNoteIdsRef.current.get(noteId) ?? [];
        lockSessionCreatedNoteIdsRef.current.set(noteId, [...existingCreatedIds, duplicateId]);
        return [
          ...prevNotes.slice(0, sourceIndex),
          duplicate,
          ...prevNotes.slice(sourceIndex),
        ];
      });
    },
    [createNoteId, playLockedDragCue]
  );


  const handleNotePreviewMove = useCallback(
    (noteId: string, _xIndex: number, yIndex: number) => {
      const snappedYIndex = snapYIndexToScale(yIndex);
      if (!lockedNoteMidisRef.current.has(noteId)) {
        return;
      }
      void updateLockedNotePitch(noteId, snappedYIndex);
    },
    [snapYIndexToScale, updateLockedNotePitch]
  );

  const handleJoinClick = useCallback((id: string) => {
    if (!joinSelectionEnabled) {
      return;
    }
    setSelectedJoinIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [joinSelectionEnabled]);

  const handleJoinDelete = useCallback((id: string) => {
    setJoinEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
    setSelectedJoinIds((prev) => {
      if (!prev.has(id)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const applyJoinBehavior = useCallback(
    (nextBehavior: JoinBehaviorDraft) => {
      setJoinBehavior(nextBehavior);
      if (!nextBehavior.action || !nextBehavior.scope) {
        return;
      }
      if (selectedJoinIds.size === 0) {
        return;
      }
      const appliedBehavior: JoinBehavior = {
        action: nextBehavior.action,
        scope: nextBehavior.scope,
        value: nextBehavior.value,
      };
      setJoinEdges((prevEdges) =>
        prevEdges.map((edge) =>
          selectedJoinIds.has(edge.id) ? { ...edge, behavior: appliedBehavior } : edge
        )
      );
    },
    [selectedJoinIds]
  );

  // Grouping disabled for now.
  // const applyGroup = useCallback(() => {
  //   const selectedEdges = joinEdges.filter((edge) => selectedJoinIds.has(edge.id));
  //   if (selectedEdges.some((edge) => edge.groupKey)) {
  //     setToastMessage("Joins already in a group cannot be regrouped.");
  //     setGroupArmed(false);
  //     return;
  //   }
  //   const eligible = selectedEdges.filter((edge) => !edge.groupKey);
  //   if (eligible.length < 2) {
  //     setGroupArmed(false);
  //     return;
  //   }
  //   const groupKey = typeof crypto !== "undefined" && "randomUUID" in crypto
  //     ? crypto.randomUUID()
  //     : `group-${Date.now()}`;
  //   const nextColor = getNextGroupColor(Object.values(groupColorByKey));
  //   setGroupColorByKey((prev) => ({ ...prev, [groupKey]: nextColor }));
  //   const eligibleIds = new Set(eligible.map((edge) => edge.id));
  //   setJoinEdges((prevEdges) =>
  //     prevEdges.map((edge) =>
  //       eligibleIds.has(edge.id) ? { ...edge, groupKey } : edge
  //     )
  //   );
  //   setGroupArmed(false);
  // }, [groupColorByKey, joinEdges, selectedJoinIds]);

  // const handleUngroup = useCallback((groupKey: string) => {
  //   setJoinEdges((prevEdges) =>
  //     prevEdges.map((edge) => (edge.groupKey === groupKey ? { ...edge, groupKey: undefined } : edge))
  //   );
  //   setGroupColorByKey((prev) => {
  //     const next = { ...prev };
  //     delete next[groupKey];
  //     return next;
  //   });
  // }, []);

  // useEffect(() => {
  //   if (groupArmed && selectedJoinIds.size >= 2) {
  //     applyGroup();
  //   }
  // }, [applyGroup, groupArmed, selectedJoinIds]);

  useEffect(() => {
    if (!joinBehavior.action || !joinBehavior.scope || selectedJoinIds.size === 0) {
      return;
    }
    const appliedBehavior: JoinBehavior = {
      action: joinBehavior.action,
      scope: joinBehavior.scope,
      value: joinBehavior.value,
    };
    setJoinEdges((prevEdges) =>
      prevEdges.map((edge) =>
        selectedJoinIds.has(edge.id) ? { ...edge, behavior: appliedBehavior } : edge
      )
    );
  }, [joinBehavior.action, joinBehavior.scope, joinBehavior.value, selectedJoinIds]);

  const cancelJoinBehavior = useCallback(() => {
    if (selectedJoinIds.size > 0) {
      setJoinEdges((prevEdges) =>
        prevEdges.map((edge) => (selectedJoinIds.has(edge.id) ? { ...edge, behavior: undefined } : edge))
      );
    }
    setSelectedJoinIds(new Set());
    setJoinBehavior((current) => ({ ...current, action: null }));
  }, [selectedJoinIds]);

  const chartConfig = useMemo(
    () => ({
      mode,
      notes,
      joinEdges,
      joinEnabled,
      panOffset,
      xCount,
      xOriginIndex,
      yCount,
      allowedSemitoneSet,
      soundingYIndices,
      highlightedIds,
      onNoteMove: moveNote,
      onNoteDelete: deleteNote,
      onNotePreviewMove: handleNotePreviewMove,
      onNoteDragState: handleNoteDragState,
      onDragLockChange: handleDragLockChange,
      onLockedDragEnd: handleLockedDragEnd,
      activeLongPressIds: longPressNoteIds,
      onLongPressAdd: addLongPressNoteId,
      onLongPressClear: clearLongPressNotes,
      onInstrumentAssign: handleNoteInstrumentAssign,
      instrumentLabelById,
      snapYIndex: snapYIndexToScale,
      notesEnabled,
      joinsEnabled,
      selectedJoinIds,
      onJoinClick: handleJoinClick,
      onJoinDelete: handleJoinDelete,
      onJoinBehaviorChange: applyJoinBehavior,
      // Grouping disabled for now.
      // onJoinUngroup: handleUngroup,
      // groupColorByKey,
    }),
    [
      applyJoinBehavior,
      allowedSemitoneSet,
      handleDragLockChange,
      handleLockedDragEnd,
      handleNoteDragState,
      handleNotePreviewMove,
      handleJoinClick,
      handleJoinDelete,
      highlightedIds,
      instrumentLabelById,
      joinEdges,
      joinEnabled,
      joinsEnabled,
      longPressNoteIds,
      mode,
      moveNote,
      addLongPressNoteId,
      clearLongPressNotes,
      handleNoteInstrumentAssign,
      deleteNote,
      snapYIndexToScale,
      notesEnabled,
      notes,
      panOffset,
      selectedJoinIds,
      soundingYIndices,
      xCount,
      xOriginIndex,
      yCount,
    ]
  );

  useEffect(() => {
    if (!joinSelectionEnabled || selectedJoinIds.size === 0 || isPlaying) {
      stopPreviewPlayback();
      return;
    }

    const selectedEdges = joinEdges.filter((edge) => selectedJoinIds.has(edge.id));
    if (selectedEdges.length === 0) {
      stopPreviewPlayback();
      return;
    }

    const noteById = new Map(notes.map((note) => [note.id, note]));
    let minX = xCount;
    let maxX = 0;
    selectedEdges.forEach((edge) => {
      const from = noteById.get(edge.fromId);
      const to = noteById.get(edge.toId);
      if (!from || !to) {
        return;
      }
      const via = edge.viaId ? noteById.get(edge.viaId) : null;
      const via2 = edge.viaId2 ? noteById.get(edge.viaId2) : null;
      const { baseMinX, limit } = getEdgeLimits(edge, from, to, via, via2);
      minX = Math.min(minX, baseMinX);
      maxX = Math.max(maxX, limit);
    });
    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || maxX <= minX) {
      stopPreviewPlayback();
      return;
    }

    void (async () => {
      await ensureSynth();
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      previewTransportRef.current?.dispose();
      previewTransportRef.current = null;

      previewStartRef.current = minX;
      previewEndRef.current = maxX;
      previewTickIndexRef.current = 0;

      const initialNotes = getActiveNotesForEdgesAtX(
        selectedEdges,
        notes,
        previewStartRef.current,
        xCount,
        yCount
      );
      if (initialNotes && initialNotes.length > 0) {
        const yCenterIndex = yCount / 2;
        const midiEntries = initialNotes.map((entry) => ({
          midi: 60 + (yCenterIndex - entry.yIndex),
          volume: entry.volume,
        }));
        midiEntries.forEach((entry) => {
          synthRef.current?.triggerAttack(
            getFrequencyForMidi(entry.midi),
            Tone.now(),
            velocityForMidi(entry.midi) * (entry.volume / 100)
          );
        });
        previewMidiSetRef.current = new Set(midiEntries.map((entry) => entry.midi));
        const ySet = new Set(initialNotes.map((entry) => entry.yIndex));
        ySet.forEach((yIndex) => makeSound(yIndex));
        previewPlayingYIndicesRef.current = ySet;
      } else {
        previewMidiSetRef.current = new Set();
        previewPlayingYIndicesRef.current = new Set();
      }

      const loop = new Tone.Loop((time) => {
        const nextOffset = previewStartRef.current + previewTickIndexRef.current;
        const activeOffset = nextOffset > previewEndRef.current ? previewStartRef.current : nextOffset;
        if (nextOffset > previewEndRef.current) {
          previewTickIndexRef.current = 0;
        }

        const notesAtX = getActiveNotesForEdgesAtX(selectedEdges, notes, activeOffset, xCount, yCount);
        const yCenterIndex = yCount / 2;
        const nextEntries = notesAtX?.map((entry) => ({
          midi: 60 + (yCenterIndex - entry.yIndex),
          yIndex: entry.yIndex,
          volume: entry.volume,
        })) ?? [];
        const nextMidiSet = new Set(nextEntries.map((entry) => entry.midi));
        const nextYSet = new Set(nextEntries.map((entry) => entry.yIndex));
        const currentMidiSet = previewMidiSetRef.current;
        const releases = [...currentMidiSet].filter((midi) => !nextMidiSet.has(midi));
        const attacks = [...nextMidiSet].filter((midi) => !currentMidiSet.has(midi));
        const currentYSet = previewPlayingYIndicesRef.current;
        const yReleases = [...currentYSet].filter((yIndex) => !nextYSet.has(yIndex));
        const yAttacks = [...nextYSet].filter((yIndex) => !currentYSet.has(yIndex));

        if (releases.length > 0) {
          synthRef.current?.triggerRelease(
            releases.map(getFrequencyForMidi),
            time
          );
        }
        if (attacks.length > 0) {
          attacks.forEach((midi) => {
            const entry = nextEntries.find((item) => item.midi === midi);
            const volume = entry?.volume ?? 50;
            synthRef.current?.triggerAttack(
              getFrequencyForMidi(midi),
              time,
              velocityForMidi(midi) * (volume / 100)
            );
          });
        }
        yReleases.forEach((yIndex) => endSound(yIndex));
        yAttacks.forEach((yIndex) => makeSound(yIndex));
        previewMidiSetRef.current = nextMidiSet;
        previewPlayingYIndicesRef.current = nextYSet;
        previewTickIndexRef.current += 1;
      }, "16n");

      previewTransportRef.current = loop;
      loop.start(0);
      Tone.Transport.bpm.value = 120 * speedRef.current;
      Tone.Transport.start("+0.01");
    })();

    return () => {
      stopPreviewPlayback();
    };
  }, [
    ensureSynth,
    getEdgeLimits,
    isPlaying,
    joinSelectionEnabled,
    joinEdges,
    notes,
    selectedJoinIds,
    stopPreviewPlayback,
    endSound,
    makeSound,
    velocityForMidi,
    xCount,
    yCount,
  ]);

  useEffect(() => {
    if (mode !== "notes") {
      clearLockedNotes();
    }
  }, [clearLockedNotes, mode]);

  useEffect(() => {
    if (selectedJoinIds.size === 0) {
      setSelectedJoinVolume(50);
      return;
    }
    const selectedVolumes = joinEdges
      .filter((edge) => selectedJoinIds.has(edge.id))
      .map((edge) => edge.volume ?? 50);
    if (selectedVolumes.length === 0) {
      setSelectedJoinVolume(50);
      return;
    }
    setSelectedJoinVolume(Math.min(...selectedVolumes));
  }, [joinEdges, selectedJoinIds]);

  useEffect(() => {
    sharedZoomRef.current = sharedZoom;
  }, [sharedZoom]);

  useEffect(() => {
    zoomYMainRef.current = zoomYMain;
  }, [zoomYMain]);

  useEffect(() => {
    zoomYPercussionRef.current = zoomYPercussion;
  }, [zoomYPercussion]);

  useEffect(() => {
    selectedZoomPresetRef.current = selectedZoomPreset;
  }, [selectedZoomPreset]);

  useEffect(() => {
    if (didInitPercussionZoomRef.current) {
      return;
    }
    if (percussionWorldHeight <= 0 || percussionViewHeight <= 0) {
      return;
    }
    setZoomYPercussion(-percussionMaxViewY);
    didInitPercussionZoomRef.current = true;
  }, [percussionMaxViewY, percussionViewHeight, percussionWorldHeight]);

  useEffect(() => {
    // Wait for a real measured layout; initial bootstrap can briefly be 1px.
    if (totalGridHeight <= 1) {
      return;
    }
    if (!didInitGridSplitRef.current) {
      didInitGridSplitRef.current = true;
      setPercussionGridHeight(totalGridHeight * 0.5);
      return;
    }
    setPercussionGridHeight((prev) => {
      const fallback = Math.max(minPercussionHeight, Math.min(maxPercussionHeight, desiredPercussionViewHeight));
      const next = Number.isFinite(prev) && prev > 0 ? prev : fallback;
      const clamped = Math.max(minPercussionHeight, Math.min(maxPercussionHeight, next));
      return clamped;
    });
  }, [
    desiredPercussionViewHeight,
    maxPercussionHeight,
    minPercussionHeight,
    outerHeight,
    totalGridHeight,
  ]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || visibleGridWidth < 100 || mainGridHeight < 80) {
      return undefined;
    }

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .filter((event) => {
        const target = event.target as Element | null;
        if (target?.closest?.("circle.note-ring") || target?.closest?.("circle.note") || target?.closest?.("g.note-handle")) {
          return false;
        }
        if (event.type === "wheel") {
          return false;
        }
        return event.button === undefined || event.button === 0;
      })
      .scaleExtent([
        zoomPresetMinK,
        zoomPresetMaxK,
      ])
      .translateExtent([
        [mainMinPanWorldX, -gridWorldHeight],
        [gridWorldWidth * 2, gridWorldHeight * 2],
      ])
      .extent([
        [0, 0],
        [visibleGridWidth, mainGridHeight],
      ])
      .on("zoom", (event) => {
        const nextTransform = event.transform;
        if (
          event.sourceEvent &&
          !isPresetZoomTransitionRef.current &&
          Math.abs(nextTransform.y - zoomYMainRef.current) > 0.001
        ) {
          hasUserAdjustedMainYRef.current = true;
        }
        const targetK = zoomPresetKById[selectedZoomPresetRef.current];
        const clampedX = clampSharedZoomX(nextTransform.x, targetK);
        if (
          sharedZoomRef.current.x !== clampedX ||
          sharedZoomRef.current.k !== targetK
        ) {
          setSharedZoom({ x: clampedX, k: targetK });
        }
        if (isPresetZoomTransitionRef.current) {
          const anchoredY = presetMainAxisScreenYRef.current - targetK * mainAxisWorldY;
          if (Math.abs(zoomYMainRef.current - anchoredY) > 0.001) {
            setZoomYMain(anchoredY);
          }
        } else if (zoomYMainRef.current !== nextTransform.y) {
          setZoomYMain(nextTransform.y);
        }
      });

    if (!didInitMainZoomRef.current) {
      const initialK = zoomPresetKById[selectedZoomPresetRef.current];
      if (Number.isFinite(initialK) && initialK > 0) {
        const nextSharedZoom = { x: clampSharedZoomX(sharedZoomRef.current.x, initialK), k: initialK };
        const centeredZoomYMain = (mainGridHeight / 2) - initialK * mainAxisWorldY;
        sharedZoomRef.current = nextSharedZoom;
        zoomYMainRef.current = centeredZoomYMain;
        setSharedZoom(nextSharedZoom);
        setZoomYMain(centeredZoomYMain);
        didInitMainZoomRef.current = true;
      }
    }

    zoomBehaviorRef.current = zoom;
    const svgSelection = d3.select(svg);
    const centeredZoomYMain = (mainGridHeight / 2) - sharedZoomRef.current.k * mainAxisWorldY;
    const nextZoomYMain = hasUserAdjustedMainYRef.current ? zoomYMainRef.current : centeredZoomYMain;
    zoomYMainRef.current = nextZoomYMain;
    if (!hasUserAdjustedMainYRef.current && Math.abs(zoomYMain - centeredZoomYMain) > 0.001) {
      setZoomYMain(centeredZoomYMain);
    }
    svgSelection.call(zoom);
    svgSelection.call(
      zoom.transform,
      d3.zoomIdentity.translate(sharedZoomRef.current.x, nextZoomYMain).scale(sharedZoomRef.current.k)
    );
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const deltaX = event.deltaX + (Math.abs(event.deltaX) < 0.5 && event.shiftKey ? event.deltaY : 0);
      if (Math.abs(deltaX) > 0) {
        setSharedZoom((prev) => {
          const nextX = prev.x - deltaX * sharedZoomRef.current.k;
          return { ...prev, x: clampSharedZoomX(nextX, sharedZoomRef.current.k) };
        });
      }
      const delta = event.deltaY;
      if (Math.abs(delta) > 0) {
        hasUserAdjustedMainYRef.current = true;
      }
      setZoomYMain((prev) => prev - delta * sharedZoomRef.current.k);
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svgSelection.on(".zoom", null);
      svg.removeEventListener("wheel", handleWheel);
    };
  }, [
    clampSharedZoomX,
    gridWorldHeight,
    gridWorldWidth,
    mainMinPanWorldX,
    mainAxisWorldY,
    mainGridHeight,
    visibleGridWidth,
    zoomPresetKById,
    zoomPresetMaxK,
    zoomPresetMinK,
  ]);

  useEffect(() => {
    const svg = percussionSvgRef.current;
    const container = percussionContainerRef.current;
    if (!svg || visibleGridWidth === 0 || percussionViewHeight === 0) {
      return undefined;
    }
    const handlerTarget = container ?? svg;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .filter((event) => {
        if (event.type === "wheel") {
          return false;
        }
        return event.button === undefined || event.button === 0;
      })
      .scaleExtent([
        zoomPresetMinK,
        zoomPresetMaxK,
      ])
      .translateExtent([
        [percussionMinPanWorldX, -percussionDrawHeight],
        [gridWorldWidth * 2, percussionDrawHeight * 2],
      ])
      .extent([
        [0, 0],
        [visibleGridWidth, percussionViewHeight],
      ])
      .on("zoom", (event) => {
        const nextTransform = event.transform;
        const targetK = zoomPresetKById[selectedZoomPresetRef.current];
        const clampedX = clampSharedZoomX(nextTransform.x, targetK);
        if (
          sharedZoomRef.current.x !== clampedX ||
          sharedZoomRef.current.k !== targetK
        ) {
          setSharedZoom({ x: clampedX, k: targetK });
        }
        if (isPresetZoomTransitionRef.current) {
          const anchoredY = presetPercussionAxisScreenYRef.current - targetK * percussionAxisWorldY;
          if (Math.abs(zoomYPercussionRef.current - anchoredY) > 0.001) {
            setZoomYPercussion(anchoredY);
          }
        } else if (zoomYPercussionRef.current !== nextTransform.y) {
          setZoomYPercussion(nextTransform.y);
        }
      });

    percussionZoomBehaviorRef.current = zoom;
    const svgSelection = d3.select(svg);
    svgSelection.call(zoom);
    svgSelection.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(sharedZoomRef.current.x, zoomYPercussionRef.current)
        .scale(sharedZoomRef.current.k)
    );
    const handleWheel = (event: WheelEvent) => {
      if (event.target && !handlerTarget.contains(event.target as Node)) {
        return;
      }
      if (event.ctrlKey) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const deltaX = event.deltaX + (Math.abs(event.deltaX) < 0.5 && event.shiftKey ? event.deltaY : 0);
      if (Math.abs(deltaX) > 0) {
        setSharedZoom((prev) => {
          const nextX = prev.x - deltaX * sharedZoomRef.current.k;
          return { ...prev, x: clampSharedZoomX(nextX, sharedZoomRef.current.k) };
        });
      }
      const delta = event.deltaY;
      setZoomYPercussion((prev) => prev - delta * sharedZoomRef.current.k);
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });
    container?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svgSelection.on(".zoom", null);
      svg.removeEventListener("wheel", handleWheel);
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [
    clampSharedZoomX,
    gridWorldWidth,
    percussionMinPanWorldX,
    percussionViewHeight,
    percussionWorldHeight,
    visibleGridWidth,
    zoomPresetKById,
    zoomPresetMaxK,
    zoomPresetMinK,
  ]);

  useEffect(() => {
    const svg = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (!svg || !zoom) {
      return;
    }
    const centeredZoomYMain = (mainGridHeight / 2) - sharedZoom.k * mainAxisWorldY;
    const targetZoomYMain = hasUserAdjustedMainYRef.current ? zoomYMain : centeredZoomYMain;
    if (!hasUserAdjustedMainYRef.current && Math.abs(zoomYMain - centeredZoomYMain) > 0.001) {
      zoomYMainRef.current = centeredZoomYMain;
      setZoomYMain(centeredZoomYMain);
    }
    const current = d3.zoomTransform(svg);
    if (
      current.x === sharedZoom.x &&
      current.y === targetZoomYMain &&
      current.k === sharedZoom.k
    ) {
      return;
    }
    d3.select(svg).call(
      zoom.transform,
      d3.zoomIdentity.translate(sharedZoom.x, targetZoomYMain).scale(sharedZoom.k)
    );
  }, [mainAxisWorldY, mainGridHeight, sharedZoom.k, sharedZoom.x, zoomYMain]);

  useEffect(() => {
    if (!needsInitialMainRecenteringRef.current) {
      return;
    }
    const svg = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (!svg || !zoom || !didInitMainZoomRef.current || mainGridHeight < 80) {
      return;
    }
    const currentK = sharedZoomRef.current.k;
    if (!Number.isFinite(currentK) || currentK <= 0) {
      return;
    }
    const centeredZoomYMain = (mainGridHeight / 2) - currentK * mainAxisWorldY;
    const currentTransform = d3.zoomTransform(svg);
    const deltaFromCenter =
      (currentTransform.y + currentK * mainAxisWorldY) - (mainGridHeight / 2);
    if (Math.abs(deltaFromCenter) <= 0.5) {
      needsInitialMainRecenteringRef.current = false;
      return;
    }
    zoomYMainRef.current = centeredZoomYMain;
    setZoomYMain(centeredZoomYMain);
    d3.select(svg).call(
      zoom.transform,
      d3.zoomIdentity.translate(sharedZoomRef.current.x, centeredZoomYMain).scale(currentK)
    );
  }, [mainAxisWorldY, mainGridHeight, sharedZoom.k, sharedZoom.x, zoomYMain]);

  useEffect(() => {
    const svg = percussionSvgRef.current;
    const zoom = percussionZoomBehaviorRef.current;
    if (!svg || !zoom) {
      return;
    }
    const current = d3.zoomTransform(svg);
    if (
      current.x === sharedZoom.x &&
      current.y === zoomYPercussion &&
      current.k === sharedZoom.k
    ) {
      return;
    }
    d3.select(svg).call(
      zoom.transform,
      d3.zoomIdentity.translate(sharedZoom.x, zoomYPercussion).scale(sharedZoom.k)
    );
  }, [sharedZoom.k, sharedZoom.x, zoomYPercussion]);

  const applyZoomPreset = useCallback(
    (presetId: ZoomPresetId, smooth = true) => {
      const targetK = zoomPresetKById[presetId];
      if (!Number.isFinite(targetK) || targetK <= 0) {
        return;
      }
      selectedZoomPresetRef.current = presetId;
      const currentK = sharedZoomRef.current.k;
      const currentX = sharedZoomRef.current.x;
      const leftWorldX = currentK > 0 ? -currentX / currentK : 0;
      const nextX = clampSharedZoomX(-leftWorldX * targetK, targetK);
      const mainAxisScreenY = zoomYMainRef.current + currentK * mainAxisWorldY;
      const nextZoomYMain = mainAxisScreenY - targetK * mainAxisWorldY;
      const percussionAxisScreenY = zoomYPercussionRef.current + currentK * percussionAxisWorldY;
      const nextZoomYPercussion = percussionAxisScreenY - targetK * percussionAxisWorldY;
      isPresetZoomTransitionRef.current = true;
      presetMainAxisScreenYRef.current = mainAxisScreenY;
      presetPercussionAxisScreenYRef.current = percussionAxisScreenY;
      setSelectedZoomPreset(presetId);
      const svg = svgRef.current;
      const zoom = zoomBehaviorRef.current;
      if (svg && zoom) {
        d3.select(svg).interrupt();
        const selection = d3.select(svg);
        const transform = d3.zoomIdentity.translate(nextX, nextZoomYMain).scale(targetK);
        if (smooth) {
          selection.transition().duration(300).call(zoom.transform, transform);
        } else {
          selection.call(zoom.transform, transform);
        }
      }
      const percussionSvg = percussionSvgRef.current;
      const percussionZoom = percussionZoomBehaviorRef.current;
      if (percussionSvg && percussionZoom) {
        d3.select(percussionSvg).interrupt();
        const selection = d3.select(percussionSvg);
        const transform = d3.zoomIdentity.translate(nextX, nextZoomYPercussion).scale(targetK);
        if (smooth) {
          selection.transition().duration(300).call(percussionZoom.transform, transform);
        } else {
          selection.call(percussionZoom.transform, transform);
        }
      }
      setSharedZoom({ x: nextX, k: targetK });
      setZoomYMain(nextZoomYMain);
      setZoomYPercussion(nextZoomYPercussion);
      if (smooth) {
        window.setTimeout(() => {
          isPresetZoomTransitionRef.current = false;
        }, 340);
      } else {
        isPresetZoomTransitionRef.current = false;
      }
    },
    [clampSharedZoomX, mainAxisWorldY, percussionAxisWorldY, zoomPresetKById]
  );

  const handleResetZoom = useCallback(() => {
    const targetK = zoomPresetKById[selectedZoomPreset];
    const targetZoomYMain = (mainGridHeight / 2) - targetK * mainAxisWorldY;
    const identity = d3.zoomIdentity.scale(targetK);
    const svg = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (svg && zoom) {
      d3.select(svg).interrupt();
      d3.select(svg)
        .transition()
        .duration(300)
        .call(zoom.transform, identity);
    }
    const percussionSvg = percussionSvgRef.current;
    const percussionZoom = percussionZoomBehaviorRef.current;
    if (percussionSvg && percussionZoom) {
      d3.select(percussionSvg).interrupt();
      d3.select(percussionSvg)
        .transition()
        .duration(300)
        .call(percussionZoom.transform, identity);
    }
    setSharedZoom({ x: clampSharedZoomX(0, targetK), k: targetK });
    setZoomYMain(targetZoomYMain);
    setZoomYPercussion(-percussionMaxViewY);
  }, [clampSharedZoomX, mainAxisWorldY, mainGridHeight, percussionMaxViewY, selectedZoomPreset, zoomPresetKById]);

  const handleModeChange = useCallback((nextMode: Mode) => {
    if (nextMode === mode) {
      if (mode === "play" && isFinished) {
        void handlePlay();
      }
      return;
    }
    if (mode === "joins" && nextMode !== "joins") {
      setJoinAnchor(null);
      setJoinBuffer([]);
      setJoinSeriesIds([]);
      setJoinSeriesEdgeId(null);
    }
    if (nextMode !== "joins") {
      setSelectedJoinIds(new Set());
    }
    if (nextMode === "play") {
      void handlePlay();
      return;
    }
    if (mode === "play") {
      handleStop();
    }
    if (nextMode === "joins") {
      setJoinsTool("new");
      setJoinAnchor(null);
      setJoinBuffer([]);
      setJoinSeriesIds([]);
      setJoinSeriesEdgeId(null);
      setMode("joins");
      return;
    }
    setMode(nextMode);
  }, [handlePlay, handleStop, isFinished, mode]);

  const handleDeleteAll = useCallback(() => {
    setNotes([]);
    setLongPressNoteIds(new Set());
    setLongPressBeatIds(new Set());
    setJoinEdges([]);
    setJoinAnchor(null);
    setJoinBuffer([]);
    setJoinSeriesIds([]);
    setJoinSeriesEdgeId(null);
    clearLockedNotes();
    setMode("notes");
    setJoinsTool("new");
  }, [clearLockedNotes]);

  const handleSplitterPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    splitterDragRef.current = {
      startY: event.clientY,
      startHeight: percussionGridHeight,
    };
  }, [percussionGridHeight]);

  const handleSplitterPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = splitterDragRef.current;
    if (!drag) {
      return;
    }
    const delta = event.clientY - drag.startY;
    const next = drag.startHeight - delta;
    const clamped = Math.max(minPercussionHeight, Math.min(maxPercussionHeight, next));
    setPercussionGridHeight(clamped);
  }, [maxPercussionHeight, minPercussionHeight]);

  const handleSplitterPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (splitterDragRef.current) {
      splitterDragRef.current = null;
    }
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || gridWorldWidth === 0 || gridWorldHeight === 0) {
      return undefined;
    }

    const chart = chartRef.current ?? beatMathsGridComponent();
    chartRef.current = chart;

    d3
      .select(svg)
      .call(
        chart
          .width(gridWorldWidth)
          .height(gridWorldHeight)
          .viewWidth(visibleGridWidth)
          .viewHeight(mainGridHeight)
          .viewOffsetY(viewOffsetY)
          .xCount(chartConfig.xCount)
          .yCount(chartConfig.yCount)
          .notes(chartConfig.notes)
          .joinEdges(chartConfig.joinEdges)
          .joinEnabled(chartConfig.joinEnabled)
          .panOffset(chartConfig.panOffset)
          .playheadXIndex(playheadXIndex)
          .playheadVisible(isPlaying)
          .zoomX(sharedZoom.x)
          .zoomY(zoomYMain)
          .zoomK(sharedZoom.k)
          .xOriginIndex(chartConfig.xOriginIndex)
          .allowedSemitoneSet(chartConfig.allowedSemitoneSet)
          .soundingYIndices(chartConfig.soundingYIndices)
          .highlightedIds(chartConfig.highlightedIds)
          .mode(chartConfig.mode)
          .notesEnabled(chartConfig.notesEnabled)
          .joinsEnabled(chartConfig.joinsEnabled)
          .selectedJoinIds(chartConfig.selectedJoinIds)
          .onJoinClick(chartConfig.onJoinClick)
          .onJoinDelete(chartConfig.onJoinDelete)
          // .onJoinUngroup(chartConfig.onJoinUngroup)
          // .groupColorByKey(chartConfig.groupColorByKey)
          .onNoteMove(chartConfig.onNoteMove)
          .onNoteDelete(chartConfig.onNoteDelete)
          .onNotePreviewMove(chartConfig.onNotePreviewMove)
          .onNoteDragState(chartConfig.onNoteDragState)
          .onDragLockChange(chartConfig.onDragLockChange)
          .onLockedDragEnd(chartConfig.onLockedDragEnd)
          .activeLongPressIds(chartConfig.activeLongPressIds)
          .onLongPressAdd(chartConfig.onLongPressAdd)
          .onLongPressClear(chartConfig.onLongPressClear)
          .onInstrumentAssign(chartConfig.onInstrumentAssign)
          .instrumentLabelById(chartConfig.instrumentLabelById)
            .snapYIndex(chartConfig.snapYIndex)
      );

    return undefined;
  }, [
    chartConfig,
    gridWorldHeight,
    gridWorldWidth,
    isPlaying,
    mainGridHeight,
    playheadXIndex,
    sharedZoom.k,
    sharedZoom.x,
    visibleGridWidth,
    viewOffsetY,
    zoomYMain,
  ]);

  const showResetZoom =
    Math.abs(sharedZoom.k - zoomPresetKById[selectedZoomPreset]) > 1e-6 ||
    sharedZoom.x !== 0 ||
    zoomYMain !== defaultZoomYMain ||
    zoomYPercussion !== -percussionMaxViewY;

  useEffect(() => {
    const svg = percussionSvgRef.current;
    if (!svg || gridWorldWidth === 0 || percussionDrawHeight === 0) {
      return undefined;
    }

    const chart = percussionChartRef.current ?? beatMathsPercussionGridComponent();
    percussionChartRef.current = chart;

    d3
      .select(svg)
      .call(
        chart
          .width(gridWorldWidth)
          .height(percussionDrawHeight)
          .viewWidth(visibleGridWidth)
          .viewHeight(percussionViewHeight)
          .viewOffsetY(percussionViewOffsetY)
          .xCount(xCount)
          .yCount(percussionYCount)
          .panOffset(panOffset)
          .playheadXIndex(playheadXIndex)
          .playheadVisible(isPlaying)
          .notes(beats)
          .highlightedIds(new Set())
          .notesEnabled(true)
          .mode("notes")
          .onNoteMove((id, xIndex, yIndex) => moveBeat(id, xIndex, yIndex))
          .onNotePreviewMove(null)
          .onNoteDragState(null)
          .onDragLockChange(handleBeatDragLockChange)
          .onNoteDelete((id) => deleteBeat(id))
          .activeLongPressIds(longPressBeatIds)
          .onLongPressAdd(addLongPressBeatId)
          .onLongPressClear(clearLongPressBeats)
          .onInstrumentAssign(handleBeatInstrumentAssign)
          .instrumentLabelById(beatLabelById)
          .zoomX(sharedZoom.x)
          .zoomY(zoomYPercussion)
          .zoomK(sharedZoom.k)
          .xOriginIndex(xOriginIndex)
      );

    return undefined;
  }, [
    gridWorldWidth,
    panOffset,
    percussionViewHeight,
    percussionDrawHeight,
    percussionViewOffsetY,
    beats,
    beatLabelById,
    clearLongPressBeats,
    addLongPressBeatId,
    percussionYCount,
    deleteBeat,
    handleBeatInstrumentAssign,
    longPressBeatIds,
    moveBeat,
    playheadXIndex,
    sharedZoom.k,
    sharedZoom.x,
    visibleGridWidth,
    xCount,
    xOriginIndex,
    zoomYPercussion,
  ]);

  return (
    <div
      className="grid"
      style={{
        width: outerWidth,
        height: outerHeight,
        gridTemplateColumns: `${SIDE_CONTROL_WIDTH}px ${visibleGridWidth}px ${SIDE_CONTROL_WIDTH}px`,
        gridTemplateRows: `${TOP_BOTTOM_CONTROL_HEIGHT}px ${mainGridHeight}px ${GRID_DIVIDER_HEIGHT}px ${percussionGridHeight}px ${TOP_BOTTOM_CONTROL_HEIGHT}px`,
      }}
    >
      <div style={EDGE_PANEL_STYLE} />
      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 12px",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div className="inline-flex min-w-max items-center gap-2">
          <div className="flex items-center rounded-full border border-[#1B2A49]/30 bg-white/70 p-0.5">
            {(["notes", "joins"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleModeChange(value)}
                className={`px-3 py-1 text-xs font-[family-name:var(--font-montserrat)] uppercase tracking-wide transition ${
                  mode === value
                    ? "rounded-full bg-[#1B2A49] text-white"
                    : "text-[#1B2A49]/70 hover:text-[#1B2A49]"
                }`}
              >
                {value === "notes" ? "Notes" : "Joins"}
              </button>
            ))}
          </div>
          <BeatMathsGridControls
            mode={mode}
            onModeChange={handleModeChange}
            joinsTool={joinsTool}
            onJoinsToolChange={(nextTool) => {
              setJoinsTool(nextTool);
              setSelectedJoinIds(new Set());
              setJoinAnchor(null);
              setJoinBuffer([]);
              setJoinSeriesIds([]);
              setJoinSeriesEdgeId(null);
            }}
            onJoinSelectionClear={() => setSelectedJoinIds(new Set())}
            joinVolume={selectedJoinVolume}
            onJoinVolumeChange={updateJoinVolume}
            onJoinSilent={() => updateJoinVolume(0)}
            instrumentOptions={INSTRUMENT_OPTIONS}
            beatOptions={BEAT_OPTIONS}
            onInstrumentPreview={handleInstrumentPreview}
            onBeatPreview={handleBeatPreview}
            selectedInstrumentId={selectedInstrumentId}
            selectedBeatId={selectedBeatId}
            scaleType={scaleType}
            scaleOptions={[...SCALE_OPTIONS]}
            onScaleChange={handleScaleChange}
            selectedJoinCount={selectedJoinIds.size}
            joinBehavior={joinBehavior}
            onJoinBehaviorChange={applyJoinBehavior}
            onJoinBehaviorCancel={cancelJoinBehavior}
            joinType={joinType}
            onJoinTypeChange={(nextJoinType) => {
              setJoinType(nextJoinType);
              setJoinAnchor(null);
              setJoinBuffer([]);
              setJoinSeriesIds([]);
              setJoinSeriesEdgeId(null);
            }}
            onDeleteAll={handleDeleteAll}
            onSpeedDown={handleSpeedDown}
            onSpeedUp={handleSpeedUp}
            onPauseToggle={handlePauseToggle}
            onResetZoom={handleResetZoom}
            showResetZoom={showResetZoom}
            speedLabel={`${speedMultiplier.toFixed(2)}x`}
            elapsedMs={elapsedMs}
            showTimer={showTimer}
            isPaused={isPaused}
            showInlinePlayControls={false}
            showInlineInstrumentBeatControls={false}
            showInlineScaleControl={false}
            showMainMenuBar={false}
            layout="horizontal"
          />
        </div>
      </div>
      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 8px",
          overflow: "hidden",
        }}
      >
        <div className="grid w-full grid-cols-2 gap-2">
          {ZOOM_PRESETS.map((preset) => {
            const active = selectedZoomPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyZoomPreset(preset.id, true)}
                className={`min-w-0 rounded border px-1 py-1 text-[9px] font-[family-name:var(--font-montserrat)] uppercase leading-none tracking-tight transition ${
                  active
                    ? "border-[#1B2A49] bg-[#1B2A49] text-[#FFF8E7]"
                    : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/80 hover:text-[#1B2A49]"
                }`}
              >
                <span className="flex items-center justify-between gap-1">
                  <span className="truncate">{preset.label}</span>
                  <span
                    aria-hidden
                    className="grid h-3 w-4 grid-cols-4 place-items-center gap-[1px]"
                  >
                    {Array.from({ length: preset.bars }).map((_, index) => (
                      <span
                        key={`${preset.id}-icon-${index}`}
                        className={`h-[1px] w-[3px] rounded-[1px] ${active ? "bg-[#FFF8E7]" : "bg-[#1B2A49]/80"}`}
                      />
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 8,
          overflowY: "auto",
          overflowX: "hidden",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setShowInstrumentPanelOptions((current) => !current)}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
            showInstrumentPanelOptions
              ? "border-[#1B2A49] bg-[#1B2A49] text-white"
              : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
          }`}
        >
          Sounds
        </button>
        {showInstrumentPanelOptions && (
          <div className="flex flex-col gap-1">
            {INSTRUMENT_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleInstrumentPreview(id)}
                className={`w-full rounded-full border px-2 py-1 text-[11px] uppercase tracking-wide transition ${
                  selectedInstrumentId === id
                    ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                    : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                }`}
              >
                <span className="inline-flex w-full items-center justify-between gap-2">
                  <span className="truncate text-left">{label}</span>
                  <BeatMathsGridOptionIcon
                    label={label}
                    kind="instrument"
                    tone={selectedInstrumentId === id ? "#C9D3E3" : "#1B2A49"}
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        className="relative"
        style={{ width: visibleGridWidth, height: mainGridHeight }}
      >
        <Toast message={toastMessage} />
        <svg
          ref={svgRef}
          className="block"
          style={{ width: visibleGridWidth, height: mainGridHeight, touchAction: "none" }}
          aria-label="Coordinate grid"
          onPointerMove={handleGridPointerMove}
          onPointerLeave={handleGridPointerLeave}
          onClick={handleGridClick}
        />
      </div>
      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: 8,
          overflowY: "auto",
          overflowX: "hidden",
          gap: 8,
        }}
      >
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setShowScalePanelOptions((current) => !current)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
              showScalePanelOptions
                ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
            }`}
          >
            Scale
          </button>
          {showScalePanelOptions && (
            <div className="flex flex-col gap-1">
              {SCALE_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    void handleScaleChange(id);
                  }}
                  className={`w-full rounded-full border px-2 py-1 text-[11px] uppercase tracking-wide transition ${
                    scaleType === id
                      ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                      : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                  }`}
                >
                  <span className="inline-flex w-full items-center justify-between gap-2">
                    <span className="truncate text-left">{label}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <ControlPanel sound={cursorSoundEnabled} onToggleSound={handleCursorSoundToggle} />
        </div>
      </div>

      <div style={EDGE_PANEL_STYLE} />
      <div
        ref={splitterRef}
        className="w-full cursor-row-resize"
        style={{ ...GRID_DIVIDER_STYLE, height: GRID_DIVIDER_HEIGHT }}
        onPointerDown={handleSplitterPointerDown}
        onPointerMove={handleSplitterPointerMove}
        onPointerUp={handleSplitterPointerUp}
      />
      <div style={EDGE_PANEL_STYLE} />

      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 8,
          overflowY: "auto",
          overflowX: "hidden",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setShowBeatPanelOptions((current) => !current)}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
            showBeatPanelOptions
              ? "border-[#1B2A49] bg-[#1B2A49] text-white"
              : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
          }`}
        >
          Beats
        </button>
        {showBeatPanelOptions && (
          <div className="flex flex-col gap-1">
            {BEAT_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleBeatPreview(id)}
                className={`w-full rounded-full border px-2 py-1 text-[11px] uppercase tracking-wide transition ${
                  selectedBeatId === id
                    ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                    : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                }`}
              >
                <span className="inline-flex w-full items-center justify-between gap-2">
                  <span className="truncate text-left">{label}</span>
                  <BeatMathsGridOptionIcon
                    label={label}
                    kind="beat"
                    tone={selectedBeatId === id ? "#C9D3E3" : "#1B2A49"}
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        ref={percussionContainerRef}
        style={{ width: visibleGridWidth, height: percussionGridHeight }}
      >
        <svg
          ref={percussionSvgRef}
          className="block"
          style={{ width: visibleGridWidth, height: percussionGridHeight, touchAction: "none" }}
          aria-label="Percussion grid"
          onClick={handlePercussionGridClick}
        />
      </div>
      <div style={EDGE_PANEL_STYLE} />

      <div style={EDGE_PANEL_STYLE} />
      <div
        data-beatmaths-controls
        style={{
          ...EDGE_PANEL_STYLE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: 10,
          padding: "0 12px",
        }}
      >
        {mode === "play" ? (
          <div className="inline-flex items-center gap-2 rounded-md border border-[#1B2A49]/20 bg-white/80 px-3 py-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/80 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={handlePauseToggle}
              className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("notes")}
              className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
            >
              Stop
            </button>
            <div className="mx-1 h-4 w-px bg-[#1B2A49]/20" />
            <button
              type="button"
              onClick={handleSpeedDown}
              className="px-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
            >
              Slower
            </button>
            <span className="text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/70">
              {speedMultiplier.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={handleSpeedUp}
              className="px-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
            >
              Faster
            </button>
            {showTimer && (
              <>
                <div className="mx-1 h-4 w-px bg-[#1B2A49]/20" />
                <span className="text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/70">
                  {(elapsedMs / 1000).toFixed(1)}s
                </span>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              handleModeChange("play");
            }}
            className="rounded-full border border-[#1B2A49]/30 bg-white/80 px-4 py-2 text-xs uppercase tracking-wide text-[#1B2A49]/80 shadow-sm backdrop-blur hover:text-[#1B2A49]"
          >
            Play
          </button>
        )}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          className="inline-flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleDeleteAll}
            className="px-2 text-sm font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            disabled={!showResetZoom}
            className={`px-2 text-sm font-[family-name:var(--font-montserrat)] ${
              showResetZoom
                ? "text-[#1B2A49] hover:text-[#0f1a31]"
                : "cursor-not-allowed text-[#1B2A49]/35"
            }`}
          >
            Reset Zoom
          </button>
        </div>
      </div>
      <div style={EDGE_PANEL_STYLE} />
    </div>
  );
}
