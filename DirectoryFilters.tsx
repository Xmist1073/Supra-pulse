import { ReactNode } from "react";

type BadgeTone =
  | "neutral"
  | "verified"
  | "unverified"
  | "live"
  | "warning"
  | "signal";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-raised text-text-secondary border-hairline",
  verified: "bg-positive/10 text-positive border-positive/25",
  unverified: "bg-surface-raised text-text-tertiary border-hairline",
  live: "bg-positive/10 text-positive border-positive/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  signal: "bg-signal-dim text-signal-hover border-signal/30",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/**
 * Used identically across Directory, Opportunities, and Project Details
 * for verification/status/category tags — per the IA doc, this consistency
 * is itself a trust signal and must not visually drift between pages.
 */
export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono tracking-tight ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** The verified checkmark badge — same markup everywhere it appears. */
export function VerifiedBadge() {
  return (
    <Badge tone="verified">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M10 3.5L4.5 9L2 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
    </Badge>
  );
}
