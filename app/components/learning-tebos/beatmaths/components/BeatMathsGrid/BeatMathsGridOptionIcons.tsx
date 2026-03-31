"use client";

type OptionKind = "instrument" | "beat";

type OptionIconProps = {
  label: string;
  kind: OptionKind;
  tone?: string;
};

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 14 14",
  "aria-hidden": true,
};

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const fillProps = {
  fill: "currentColor",
};

const beatIcon = (label: string) => {
  switch (label) {
    case "Kick":
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="7" r="4.5" {...fillProps} />
        </svg>
      );
    case "Low Tom":
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="5" width="9" height="5.5" rx="1.5" {...fillProps} />
        </svg>
      );
    case "Mid Tom":
      return (
        <svg {...iconProps}>
          <rect x="3" y="4" width="8" height="6" rx="1.5" {...fillProps} />
        </svg>
      );
    case "High Tom":
      return (
        <svg {...iconProps}>
          <rect x="3.5" y="3.5" width="7" height="6.5" rx="1.5" {...fillProps} />
        </svg>
      );
    case "Snare":
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="7" r="4.5" {...strokeProps} />
        </svg>
      );
    case "Clap":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" {...strokeProps} />
        </svg>
      );
    case "Closed Hat":
      return (
        <svg {...iconProps}>
          <polygon points="3,10 7,4 11,10" {...strokeProps} />
        </svg>
      );
    case "Open Hat":
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="6" r="3.5" {...strokeProps} />
          <line x1="3" y1="11" x2="11" y2="11" {...strokeProps} />
        </svg>
      );
    case "Crash":
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="7" r="5" {...strokeProps} />
          <circle cx="7" cy="7" r="1.5" {...strokeProps} />
        </svg>
      );
    case "Ride":
      return (
        <svg {...iconProps}>
          <ellipse cx="7" cy="7" rx="5" ry="3.5" {...strokeProps} />
          <circle cx="7" cy="7" r="1.25" {...strokeProps} />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="7" r="4" {...strokeProps} />
        </svg>
      );
  }
};

const instrumentIcon = (label: string) => {
  switch (label) {
    case "Piano":
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="3" width="9" height="8" rx="1.2" {...strokeProps} />
          <line x1="5" y1="3.5" x2="5" y2="10.5" {...strokeProps} />
          <line x1="7" y1="3.5" x2="7" y2="10.5" {...strokeProps} />
          <line x1="9" y1="3.5" x2="9" y2="10.5" {...strokeProps} />
        </svg>
      );
    case "E Piano":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3.5" width="8" height="7" rx="1.4" {...strokeProps} />
          <circle cx="5" cy="7" r="1" {...strokeProps} />
          <circle cx="9" cy="7" r="1" {...strokeProps} />
        </svg>
      );
    case "Organ":
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="4" width="9" height="6" rx="1.2" {...strokeProps} />
          <line x1="4" y1="5" x2="4" y2="10" {...strokeProps} />
          <line x1="7" y1="5" x2="7" y2="10" {...strokeProps} />
          <line x1="10" y1="5" x2="10" y2="10" {...strokeProps} />
        </svg>
      );
    case "Synth Lead":
      return (
        <svg {...iconProps}>
          <polyline points="2,10 5,4 7,8 9,3 12,8" {...strokeProps} />
        </svg>
      );
    case "Synth Bass":
      return (
        <svg {...iconProps}>
          <rect x="3" y="7" width="8" height="4" rx="1" {...strokeProps} />
          <line x1="3" y1="7" x2="11" y2="7" {...strokeProps} />
        </svg>
      );
    case "Pad":
      return (
        <svg {...iconProps}>
          <rect x="2.5" y="3.5" width="9" height="7" rx="3.5" {...strokeProps} />
        </svg>
      );
    case "Pluck":
      return (
        <svg {...iconProps}>
          <line x1="3" y1="10" x2="11" y2="4" {...strokeProps} />
          <circle cx="11" cy="4" r="1.2" {...strokeProps} />
        </svg>
      );
    case "Guitar":
      return (
        <svg {...iconProps}>
          <circle cx="5" cy="8.5" r="2.2" {...strokeProps} />
          <line x1="6.5" y1="7" x2="11" y2="3.5" {...strokeProps} />
          <circle cx="11" cy="3.5" r="1" {...strokeProps} />
        </svg>
      );
    case "Bell":
      return (
        <svg {...iconProps}>
          <path d="M4 6a3 3 0 0 1 6 0v3H4V6Z" {...strokeProps} />
          <circle cx="7" cy="10" r="0.9" {...strokeProps} />
        </svg>
      );
    case "Strings":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="8" height="8" rx="2" {...strokeProps} />
          <line x1="5" y1="3.5" x2="5" y2="10.5" {...strokeProps} />
          <line x1="7" y1="3.5" x2="7" y2="10.5" {...strokeProps} />
          <line x1="9" y1="3.5" x2="9" y2="10.5" {...strokeProps} />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="7" cy="7" r="4" {...strokeProps} />
        </svg>
      );
  }
};

export default function BeatMathsGridOptionIcon({ label, kind, tone }: OptionIconProps) {
  const icon = kind === "beat" ? beatIcon(label) : instrumentIcon(label);
  return <span style={{ color: tone ?? "currentColor" }}>{icon}</span>;
}
