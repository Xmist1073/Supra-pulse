import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/ecosystem", label: "Ecosystem Directory" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/news", label: "News" },
      { href: "/learn", label: "Learning Center" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/how-we-verify", label: "How We Verify" },
      { href: "/submit", label: "Submit a Project" },
      { href: "/about", label: "About" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-2">
            <p className="font-display text-lg font-semibold">Supra Pulse</p>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Everything happening on Supra, in one place.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                {col.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-hairline pt-6">
          <p className="text-xs text-text-tertiary">
            Supra Pulse is an independent, community-driven platform and is
            not an official product of the Supra Foundation.
          </p>
        </div>
      </div>
    </footer>
  );
}
