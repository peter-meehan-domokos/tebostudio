"use client";

type ControlPanelProps = {
  sound: boolean;
  onToggleSound: (value: boolean) => void;
};

export default function ControlPanel({ sound, onToggleSound }: ControlPanelProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-[#1B2A49]/20 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
      <label className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-[#1B2A49]/80">
        <span>Sound</span>
        <button
          type="button"
          role="switch"
          aria-checked={sound}
          onClick={() => onToggleSound(!sound)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
            sound
              ? "border-[#1B2A49] bg-[#1B2A49]"
              : "border-[#1B2A49]/30 bg-white/70"
          }`}
        >
          <span
            className={`h-3.5 w-3.5 rounded-full transition ${
              sound ? "translate-x-4 bg-white" : "translate-x-0.5 bg-[#1B2A49]/60"
            }`}
          />
        </button>
      </label>
    </div>
  );
}
