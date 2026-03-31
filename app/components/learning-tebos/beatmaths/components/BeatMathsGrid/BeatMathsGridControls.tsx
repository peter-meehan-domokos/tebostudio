"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import BeatMathsGridOptionIcon from "./BeatMathsGridOptionIcons";
import type { ScaleType } from "./beatMathsScaleConstants";

type BeatMathsGridControlsProps = {
  mode: "notes" | "joins" | "play";
  onModeChange: (mode: "notes" | "joins" | "play") => void;
  joinsTool: "new" | "repeat" | "sound";
  onJoinsToolChange: (tool: "new" | "repeat" | "sound") => void;
  selectedJoinCount: number;
  onJoinSelectionClear: () => void;
  // Grouping disabled for now.
  // groupArmed: boolean;
  // onGroupToggle: () => void;
  joinBehavior: {
    action: "continue" | "repeat" | null;
    scope: "indefinitely" | "for" | "until" | null;
    value: number;
  };
  onJoinBehaviorChange: (next: {
    action: "continue" | "repeat" | null;
    scope: "indefinitely" | "for" | "until" | null;
    value: number;
  }) => void;
  onJoinBehaviorCancel: () => void;
  joinType: "step" | "linear" | "quadratic" | "cubic" | "sine";
  onJoinTypeChange: (type: "step" | "linear" | "quadratic" | "cubic" | "sine") => void;
  joinVolume: number;
  onJoinVolumeChange: (volume: number) => void;
  onJoinSilent: () => void;
  instrumentOptions: Array<{ id: string; label: string }>;
  beatOptions: Array<{ id: string; label: string }>;
  onInstrumentPreview: (id: string) => void;
  onBeatPreview: (id: string) => void;
  selectedInstrumentId: string | null;
  selectedBeatId: string | null;
  scaleType: ScaleType;
  scaleOptions: Array<{ id: ScaleType; label: string }>;
  onScaleChange: (scaleType: ScaleType) => void;
  onDeleteAll: () => void;
  onSpeedDown: () => void;
  onSpeedUp: () => void;
  onPauseToggle: () => void;
  onResetZoom: () => void;
  showResetZoom: boolean;
  speedLabel: string;
  elapsedMs: number;
  showTimer: boolean;
  isPaused: boolean;
  showInlinePlayControls?: boolean;
  showInlineInstrumentBeatControls?: boolean;
  showInlineScaleControl?: boolean;
  showMainMenuBar?: boolean;
  layout?: "stacked" | "horizontal";
};

type SubmenuProps = {
  children: ReactNode;
  className?: string;
  offsetTop?: boolean;
};

const Submenu = ({ children, className, offsetTop = true }: SubmenuProps) => (
  <div className={`${offsetTop ? "mt-2" : ""} inline-flex pointer-events-auto relative z-10`}>
    <div
      className={`inline-flex items-center gap-2 rounded-md border border-[#1B2A49]/20 bg-white/80 px-3 py-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/80 shadow-sm backdrop-blur ${className ?? ""}`}
    >
      {children}
    </div>
  </div>
);

export default function BeatMathsGridControls({
  mode,
  onModeChange,
  joinsTool,
  onJoinsToolChange,
  selectedJoinCount,
  onJoinSelectionClear,
  // groupArmed,
  // onGroupToggle,
  joinBehavior,
  onJoinBehaviorChange,
  onJoinBehaviorCancel,
  joinType,
  onJoinTypeChange,
  joinVolume,
  onJoinVolumeChange,
  onJoinSilent,
  instrumentOptions,
  beatOptions,
  onInstrumentPreview,
  onBeatPreview,
  selectedInstrumentId,
  selectedBeatId,
  scaleType,
  scaleOptions,
  onScaleChange,
  onDeleteAll,
  onSpeedDown,
  onSpeedUp,
  onPauseToggle,
  onResetZoom,
  showResetZoom,
  speedLabel,
  elapsedMs,
  showTimer,
  isPaused,
  showInlinePlayControls = true,
  showInlineInstrumentBeatControls = true,
  showInlineScaleControl = true,
  showMainMenuBar = true,
  layout = "stacked",
}: BeatMathsGridControlsProps) {
  const seconds = (elapsedMs / 1000).toFixed(1);
  const [showRepeat, setShowRepeat] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const [showInstruments, setShowInstruments] = useState(false);
  const [showBeats, setShowBeats] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!showRepeat && !showSounds && !showInstruments && !showBeats && !showScale) {
      return undefined;
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) {
        return;
      }
      if (containerRef.current?.contains(target)) {
        return;
      }
      const svg = target.closest("svg");
      if (svg?.getAttribute("data-suppress-grid-click") === "true") {
        return;
      }
      if (
        target.closest("path.join-hit") ||
        target.closest("path.join-line") ||
        target.closest("path.join-line-vertical") ||
        target.closest("path.join-repeat") ||
        target.closest("path.join-repeat-step-horizontal") ||
        target.closest("path.join-repeat-step-vertical") ||
        target.closest("g.note-delete") ||
        target.closest("g.note-instrument") ||
        target.closest("circle.note-ring") ||
        target.closest("circle.note") ||
        target.closest("g.note-group")
      ) {
        return;
      }
      setShowRepeat(false);
      setShowSounds(false);
      setShowInstruments(false);
      setShowBeats(false);
      setShowScale(false);
    };
    window.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
    };
  }, [showBeats, showRepeat, showInstruments, showScale, showSounds, onJoinSelectionClear]);

  const isHorizontal = layout === "horizontal";
  const showMainMenu = mode !== "play";
  const renderMainMenuBar = showMainMenu && showMainMenuBar;
  const baseTop = showMainMenu ? 44 : 0;
  const secondaryTop = baseTop;

  return (
    <div
      ref={containerRef}
      data-beatmaths-controls
      className={
        isHorizontal
          ? "relative z-10 inline-flex items-center gap-2 overflow-x-auto whitespace-nowrap"
          : "absolute left-3 top-3 z-10"
      }
    >
      {renderMainMenuBar && (
        <div
          className="inline-flex items-center gap-3 rounded-md border border-[#1B2A49]/20 bg-white/80 px-3 py-2 shadow-sm backdrop-blur"
        >
          <div className="flex items-center rounded-full border border-[#1B2A49]/30 bg-white/70 p-0.5">
            {(["notes", "joins"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onModeChange(value)}
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
          <button
            type="button"
            onClick={onDeleteAll}
            className="px-2 text-sm font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
          >
            Clear
          </button>
          {showResetZoom && (
            <button
              type="button"
              onClick={onResetZoom}
              className="px-2 text-sm font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
            >
              Reset Zoom
            </button>
          )}
        </div>
      )}

      <div
        className={isHorizontal ? "inline-flex flex-row items-center gap-2" : "absolute left-0 inline-flex flex-col items-start"}
        style={isHorizontal ? undefined : { top: secondaryTop }}
      >
        {mode === "joins" && (
          <div className={isHorizontal ? "inline-flex items-center gap-2" : "inline-flex flex-col items-start gap-2"}>
            {/* Grouping disabled for now. */}
            <button
              type="button"
              onClick={() => {
                onJoinsToolChange("new");
                setShowRepeat(false);
                setShowSounds(false);
              }}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                joinsTool === "new"
                  ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                  : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => {
                onJoinsToolChange("repeat");
                setShowRepeat((current) => {
                  const next = !current;
                  if (next) {
                    onJoinBehaviorChange({
                      ...joinBehavior,
                      action: "repeat",
                      scope: joinBehavior.scope ?? "indefinitely",
                    });
                    setShowSounds(false);
                  }
                  return next;
                });
              }}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                joinsTool === "repeat"
                  ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                  : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
              }`}
            >
              Repeat
            </button>
            <button
              type="button"
              onClick={() => {
                onJoinsToolChange("sound");
                setShowSounds((current) => {
                  const next = !current;
                  if (next) {
                    setShowRepeat(false);
                  }
                  return next;
                });
              }}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                joinsTool === "sound"
                  ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                  : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
              }`}
            >
              Sound
            </button>
          </div>
        )}
        {mode === "notes" && (
          <div className={isHorizontal ? "inline-flex items-center gap-2" : "inline-flex flex-col items-start gap-2"}>
            {showInlineInstrumentBeatControls && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowInstruments((current) => !current);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                    showInstruments
                      ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                      : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                  }`}
                >
                  Instruments
                </button>
                {showInstruments && (
                  <Submenu offsetTop={!isHorizontal} className="gap-1 px-1 py-1">
                    <div className="w-fit">
                      <div
                        className={`grid gap-1 ${
                          showBeats
                            ? "grid-flow-col grid-rows-5 [grid-auto-columns:minmax(0,max-content)]"
                            : "grid-flow-row grid-rows-10"
                        }`}
                      >
                        {instrumentOptions.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => onInstrumentPreview(id)}
                            className={`min-w-[12ch] rounded-full border px-1 py-0.5 text-[11px] uppercase tracking-wide transition ${
                              selectedInstrumentId === id
                                ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                                : "border-[#1B2A49]/30 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1">
                              <span>{label}</span>
                              <BeatMathsGridOptionIcon
                                label={label}
                                kind="instrument"
                                tone={selectedInstrumentId === id ? "#C9D3E3" : "#1B2A49"}
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Submenu>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowBeats((current) => !current);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                    showBeats
                      ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                      : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                  }`}
                >
                  Beats
                </button>
                {showBeats && (
                  <Submenu offsetTop={!isHorizontal} className="gap-1 px-1 py-1">
                    <div className="w-fit">
                      <div
                        className={`grid gap-1 ${
                          showInstruments
                            ? "grid-flow-col grid-rows-5 [grid-auto-columns:minmax(0,max-content)]"
                            : "grid-flow-row grid-rows-10"
                        }`}
                      >
                        {beatOptions.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => onBeatPreview(id)}
                            className={`min-w-[12ch] rounded-full border px-1 py-0.5 text-[11px] uppercase tracking-wide transition ${
                              selectedBeatId === id
                                ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                                : "border-[#1B2A49]/30 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1">
                              <span>{label}</span>
                              <BeatMathsGridOptionIcon
                                label={label}
                                kind="beat"
                                tone={selectedBeatId === id ? "#C9D3E3" : "#1B2A49"}
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Submenu>
                )}
              </>
            )}
            {showInlineScaleControl && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowScale((current) => !current);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide shadow-sm backdrop-blur transition ${
                    showScale
                      ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                      : "border-[#1B2A49]/30 bg-white/80 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                  }`}
                >
                  Scale
                </button>
                {showScale && (
                  <Submenu offsetTop={!isHorizontal} className="gap-1 px-1 py-1">
                    <div className="flex flex-col gap-1">
                      {scaleOptions.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            onScaleChange(id);
                            setShowScale(false);
                          }}
                          className={`min-w-[12ch] rounded-full border px-1 py-0.5 text-[11px] uppercase tracking-wide transition ${
                            scaleType === id
                              ? "border-[#1B2A49] bg-[#1B2A49] text-[#C9D3E3]"
                              : "border-[#1B2A49]/30 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Submenu>
                )}
              </>
            )}
          </div>
        )}
        {mode === "joins" && joinsTool === "repeat" && showRepeat && (
          <Submenu
            offsetTop={!isHorizontal}
            className={isHorizontal ? "items-center gap-3" : undefined}
          >
            <div className={isHorizontal ? "inline-flex items-center gap-3" : "flex flex-col gap-2"}>
              <div className="text-[11px] uppercase tracking-wide text-[#1B2A49]/60 whitespace-nowrap">
                {selectedJoinCount} join{selectedJoinCount === 1 ? "" : "s"} selected
              </div>
              <div className={`flex items-center gap-2 text-xs ${isHorizontal ? "whitespace-nowrap" : "flex-wrap"}`}>
                {(["indefinitely", "for", "until"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      onJoinBehaviorChange({
                        ...joinBehavior,
                        action: "repeat",
                        scope: value,
                      })
                    }
                    className={`px-3 py-1 text-xs uppercase tracking-wide transition ${
                      joinBehavior.scope === value
                        ? "rounded-full bg-[#1B2A49] text-white"
                        : "rounded-full border border-[#1B2A49]/30 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
                {(joinBehavior.scope === "for" || joinBehavior.scope === "until") && (
                  <label className="flex items-center gap-2 text-xs text-[#1B2A49]/70">
                    <span>{joinBehavior.scope === "for" ? "Steps" : "Step"}</span>
                    <input
                      type="number"
                      min={1}
                        value={joinBehavior.value}
                        onChange={(event) =>
                          onJoinBehaviorChange({
                            ...joinBehavior,
                            action: "repeat",
                            value: Math.max(1, Number(event.target.value || 1)),
                          })
                        }
                      className="w-16 rounded-md border border-[#1B2A49]/30 bg-white/80 px-2 py-1 text-xs text-[#1B2A49]"
                    />
                  </label>
                )}
              </div>
              <div className="flex items-center whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    onJoinBehaviorCancel();
                    onJoinSelectionClear();
                    setShowRepeat(false);
                    setShowSounds(false);
                  }}
                  className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onJoinSelectionClear();
                    setShowRepeat(false);
                    setShowSounds(false);
                  }}
                  className="ml-2 rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
                >
                  Close
                </button>
              </div>
            </div>
          </Submenu>
        )}
        {mode === "joins" && joinsTool === "sound" && showSounds && (
          <Submenu
            offsetTop={!isHorizontal}
            className={isHorizontal ? "items-center gap-3" : undefined}
          >
            <div className={isHorizontal ? "inline-flex items-center gap-3" : "flex flex-col gap-3"}>
              <div className="text-[11px] uppercase tracking-wide text-[#1B2A49]/60 whitespace-nowrap">Join Sounds</div>
              <label className="flex items-center gap-3 text-xs text-[#1B2A49]/70 whitespace-nowrap">
                <span>Volume</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={joinVolume}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    onJoinVolumeChange(next);
                  }}
                  className="w-32"
                />
                <span className="w-8 text-right">{joinVolume}</span>
              </label>
              <div className="flex items-center whitespace-nowrap">
                <button
                  type="button"
                  onClick={onJoinSilent}
                  className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
                >
                  Silent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onJoinSelectionClear();
                    setShowSounds(false);
                  }}
                  className="ml-2 rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
                >
                  Close
                </button>
              </div>
            </div>
          </Submenu>
        )}
        {mode === "joins" && joinsTool === "new" && (
          <Submenu
            offsetTop={!isHorizontal}
            className={isHorizontal ? "items-center gap-2" : "flex-col items-start gap-2"}
          >
            <span className="uppercase tracking-wide text-[#1B2A49]/60">Join Type</span>
            <div className={isHorizontal ? "flex items-center gap-2" : "flex flex-col gap-2"}>
              {(
                [
                  { value: "step", label: "step", minPoints: 2 },
                  { value: "linear", label: "linear", minPoints: 2 },
                  { value: "quadratic", label: "quad", minPoints: 3 },
                  { value: "cubic", label: "cubic", minPoints: 4 },
                  { value: "sine", label: "sine", minPoints: 3 },
                ] as const
              ).map(({ value, label, minPoints }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onJoinTypeChange(value)}
                  className={`pointer-events-auto min-h-12 rounded-full border px-3 py-2 text-xs uppercase tracking-wide transition ${
                    joinType === value
                      ? "border-[#1B2A49] bg-[#1B2A49] text-white"
                      : "border-[#1B2A49]/30 text-[#1B2A49]/70 hover:text-[#1B2A49]"
                  }`}
                >
                  <span className="inline-flex flex-col items-center justify-center gap-0.5">
                    <span>{label} ({minPoints})</span>
                    <svg viewBox="0 0 24 16" className="h-3.5 w-6">
                      {value === "linear" && (
                        <path d="M2 13 L22 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                      )}
                      {value === "step" && (
                        <path d="M2 13 L2 6 L22 6 L22 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                      )}
                      {value === "quadratic" && (
                        <path d="M2 13 Q12 2 22 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                      )}
                      {value === "cubic" && (
                        <path d="M2 13 C7 2 17 14 22 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                      )}
                      {value === "sine" && (
                        <path d="M2 8 C6 2 10 14 14 8 C18 2 22 14 22 8" stroke="currentColor" strokeWidth="1.6" fill="none" />
                      )}
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </Submenu>
        )}
        {mode === "play" && showInlinePlayControls && (
          <Submenu offsetTop={!isHorizontal}>
            <button
              type="button"
              onClick={onPauseToggle}
              className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => onModeChange("notes")}
              className="rounded-full border border-[#1B2A49]/30 px-3 py-1 text-xs uppercase tracking-wide text-[#1B2A49]/70 hover:text-[#1B2A49]"
            >
              Stop
            </button>
            <div className="mx-1 h-4 w-px bg-[#1B2A49]/20" />
            <button
              type="button"
              onClick={onSpeedDown}
              className="px-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
            >
              Slower
            </button>
            <span className="text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/70">
              {speedLabel}
            </span>
            <button
              type="button"
              onClick={onSpeedUp}
              className="px-2 text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49] hover:text-[#0f1a31]"
            >
              Faster
            </button>
            {showTimer && (
              <>
                <div className="mx-1 h-4 w-px bg-[#1B2A49]/20" />
                <span className="text-xs font-[family-name:var(--font-montserrat)] text-[#1B2A49]/70">
                  {seconds}s
                </span>
              </>
            )}
          </Submenu>
        )}
      </div>
    </div>
  );
}
