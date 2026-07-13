@import "tailwindcss";

/*
 * Supra Pulse Design Tokens
 * ─────────────────────────
 * Palette: near-black void with a single disciplined red signal.
 * The red is reserved for "live/urgent" meaning (pulse dot, deadlines,
 * primary actions) — it is a signal color, not a decoration, so it
 * should read as sparse and intentional across the product.
 *
 * Type: Space Grotesk (display, used only for headlines) + Inter
 * (body/UI workhorse, tuned for data density) + IBM Plex Mono
 * (numerals, stats, countdowns — the "terminal pulse" signature).
 */

:root {
  /* Surfaces */
  --color-void: #08090b;          /* page background */
  --color-surface: #121317;        /* card / panel background */
  --color-surface-raised: #1a1c21; /* hover / elevated surface */
  --color-hairline: #232529;       /* borders, dividers */

  /* Text */
  --color-text-primary: #f5f5f7;
  --color-text-secondary: #9a9ca3;
  --color-text-tertiary: #616469;

  /* Signal (Supra red — used sparingly, for live/primary/urgent only) */
  --color-signal: #e8384a;
  --color-signal-dim: #4a1820;
  --color-signal-hover: #ff4d5e;

  /* Data semantics */
  --color-positive: #34d399;
  --color-warning: #f5a623;
  --color-neutral-tag: #3b82f6;

  --radius-card: 12px;
  --radius-control: 8px;
}

@theme inline {
  --color-void: var(--color-void);
  --color-surface: var(--color-surface);
  --color-surface-raised: var(--color-surface-raised);
  --color-hairline: var(--color-hairline);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-tertiary: var(--color-text-tertiary);
  --color-signal: var(--color-signal);
  --color-signal-dim: var(--color-signal-dim);
  --color-signal-hover: var(--color-signal-hover);
  --color-positive: var(--color-positive);
  --color-warning: var(--color-warning);
  --color-neutral-tag: var(--color-neutral-tag);

  --font-display: var(--font-space-grotesk);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-plex-mono);
}

body {
  background: var(--color-void);
  color: var(--color-text-primary);
  font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}

/* Signature motif: the pulse. Used only for "live" status dots and
   the stats-strip indicator — never decoratively, per the design brief's
   instruction to spend boldness in one place. */
@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(232, 56, 74, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(232, 56, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(232, 56, 74, 0); }
}

.signal-pulse {
  animation: pulse-dot 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .signal-pulse {
    animation: none;
  }
}

/* Visible keyboard focus everywhere — quality floor per design brief */
:focus-visible {
  outline: 2px solid var(--color-signal);
  outline-offset: 2px;
}
