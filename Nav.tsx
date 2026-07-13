import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-signal text-white hover:bg-signal-hover active:bg-signal disabled:bg-surface-raised disabled:text-text-tertiary",
  secondary:
    "bg-surface-raised text-text-primary border border-hairline hover:border-signal/40 hover:bg-surface disabled:text-text-tertiary",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface disabled:text-text-tertiary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-[--radius-control] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap";

type ButtonAsButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLinkProps = BaseProps & {
  href: string;
  external?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * Shared button primitive used across the entire product — every CTA
 * (homepage hero, opportunity cards, admin forms) should render through
 * this component so variant/size/focus behavior stays consistent site-wide.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = "primary", size = "md", className = "", ...rest } =
      props as BaseProps & { className?: string };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if ("href" in props && props.href) {
      const { href, external, children } = props as ButtonAsLinkProps;
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {children}
            <ExternalLinkGlyph />
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return <button ref={ref} className={classes} {...buttonProps} />;
  }
);

/** Small external-link glyph — used consistently anywhere a click leaves
 * Supra Pulse, per the IA doc's cross-page design system notes. */
function ExternalLinkGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M4 2.5H2.5C1.94772 2.5 1.5 2.94772 1.5 3.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H8.5C9.05228 10.5 9.5 10.0523 9.5 9.5V8M7 1.5H10.5V5M10.5 1.5L5.5 6.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
