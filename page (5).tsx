"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

const categories = [
  "DEFI",
  "INFRA",
  "GAMING",
  "NFT",
  "TOOLS",
  "ORACLE",
  "DAO",
  "OTHER",
] as const;

const statuses = [
  { value: "LIVE", label: "Live" },
  { value: "TESTNET", label: "Testnet" },
  { value: "COMING_SOON", label: "Coming soon" },
] as const;

/**
 * Drives filtering through URL search params rather than client-side
 * array filtering — this is what lets the Directory stay fast at
 * hundreds of projects, since Prisma does the filtering server-side and
 * the grid never has to hold more than one page in memory.
 */
export function DirectoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const activeCategories = searchParams.getAll("category");
  const activeStatus = searchParams.get("status");
  const verifiedOnly = searchParams.get("verified") === "true";

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page"); // any filter change resets pagination
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function toggleCategory(cat: string) {
    updateParams((params) => {
      const current = params.getAll("category");
      params.delete("category");
      if (current.includes(cat)) {
        current.filter((c) => c !== cat).forEach((c) => params.append("category", c));
      } else {
        [...current, cat].forEach((c) => params.append("category", c));
      }
    });
  }

  function setStatus(status: string | null) {
    updateParams((params) => {
      if (status) params.set("status", status);
      else params.delete("status");
    });
  }

  function toggleVerified() {
    updateParams((params) => {
      if (verifiedOnly) params.delete("verified");
      else params.set("verified", "true");
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams((params) => {
      if (query) params.set("q", query);
      else params.delete("q");
    });
  }

  return (
    <div className={`flex flex-col gap-4 ${isPending ? "opacity-70" : ""}`}>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="w-full rounded-[--radius-control] border border-hairline bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-signal sm:max-w-sm"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              activeCategories.includes(cat)
                ? "border-signal/40 bg-signal-dim text-signal-hover"
                : "border-hairline text-text-secondary hover:border-text-tertiary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatus(null)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            !activeStatus
              ? "border-signal/40 bg-signal-dim text-signal-hover"
              : "border-hairline text-text-secondary hover:border-text-tertiary"
          }`}
        >
          All statuses
        </button>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              activeStatus === s.value
                ? "border-signal/40 bg-signal-dim text-signal-hover"
                : "border-hairline text-text-secondary hover:border-text-tertiary"
            }`}
          >
            {s.label}
          </button>
        ))}

        <label className="ml-2 flex items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={toggleVerified}
            className="h-3.5 w-3.5 rounded border-hairline accent-[color:var(--color-signal)]"
          />
          Verified only
        </label>
      </div>
    </div>
  );
}
