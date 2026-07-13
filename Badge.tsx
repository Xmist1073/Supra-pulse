"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/learn", label: "Learning Center" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/verification", label: "Verification" },
];

/**
 * Sidebar nav for the Admin Dashboard (IA doc Section 8). Single-editor
 * model — no role switching, just sign-out. Collapses to a top dropdown
 * on mobile per the IA doc's responsive behavior note for Admin.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-hairline bg-surface px-3 py-6">
      <Link href="/admin" className="px-2 font-display text-lg font-semibold">
        Supra Pulse
        <span className="ml-1.5 font-mono text-xs font-normal text-signal">
          admin
        </span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[--radius-control] px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-signal-dim text-signal-hover"
                  : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="rounded-[--radius-control] px-2.5 py-2 text-left text-sm text-text-tertiary hover:bg-surface-raised hover:text-text-primary"
      >
        Sign out
      </button>
    </aside>
  );
}
