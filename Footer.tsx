import { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  href?: string;
}

/**
 * Atomic card surface used by ProjectCard, OpportunityCard, ArticleCard,
 * and GuideCard (see IA doc "Cross-Page Design System Notes"). Keeping the
 * radius/border/hover treatment defined once here is what makes the four
 * card types feel like one system instead of four separate components.
 */
export function Card({ children, href, className = "", ...rest }: CardProps) {
  const classes = `group block rounded-[--radius-card] border border-hairline bg-surface p-4 transition-colors duration-150 hover:border-signal/30 hover:bg-surface-raised ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

/**
 * The pulse — Supra Pulse's signature element. A live/status indicator
 * used only for genuinely "live" states (stats strip, live testnets,
 * active opportunities) so it retains meaning rather than becoming
 * decoration. See globals.css `.signal-pulse` for the animation.
 */
export function PulseDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-text-secondary">
      <span className="relative flex h-1.5 w-1.5">
        <span className="signal-pulse absolute inline-flex h-full w-full rounded-full bg-signal" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      {label}
    </span>
  );
}
