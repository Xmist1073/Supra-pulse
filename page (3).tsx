import Link from "next/link";

const navItems = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/news", label: "News" },
  { href: "/learn", label: "Learn" },
];

/**
 * Sticky top nav (IA doc Section 1). Mobile collapses primary links out
 * of view in favor of the bottom tab bar — see MobileBottomBar.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-void/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Supra Pulse
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[--radius-control] px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="hidden rounded-[--radius-control] border border-hairline px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-signal/40 hover:text-text-primary sm:inline-flex"
          >
            Submit a project
          </Link>
        </div>
      </div>
    </header>
  );
}
