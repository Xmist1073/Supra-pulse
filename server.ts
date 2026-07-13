import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * Admin Overview (IA doc Section 8): the "what needs my attention today"
 * view — pending submissions, expiring opportunities, verification gaps.
 */
export default async function AdminOverviewPage() {
  const [
    totalProjects,
    pendingSubmissions,
    expiringOpportunities,
    unverifiedProjects,
    latestArticle,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.submission.count({ where: { status: "PENDING" } }),
    prisma.opportunity.count({
      where: {
        status: "ACTIVE",
        deadline: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
    }),
    prisma.project.count({ where: { verificationTier: "UNVERIFIED" } }),
    prisma.article.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: { title: true, publishedAt: true },
    }),
  ]);

  const stats = [
    { label: "Total projects", value: totalProjects, href: "/admin/projects" },
    {
      label: "Pending submissions",
      value: pendingSubmissions,
      href: "/admin/submissions",
      highlight: pendingSubmissions > 0,
    },
    {
      label: "Opportunities expiring this week",
      value: expiringOpportunities,
      href: "/admin/opportunities",
      highlight: expiringOpportunities > 0,
    },
    {
      label: "Unverified projects",
      value: unverifiedProjects,
      href: "/admin/verification",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-text-secondary">
        What needs your attention today.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-[--radius-card] border border-hairline bg-surface p-4 transition-colors hover:border-signal/30"
          >
            <p className="font-mono text-3xl font-semibold text-text-primary">
              {stat.value}
            </p>
            <p
              className={`mt-1 text-sm ${
                stat.highlight ? "text-signal-hover" : "text-text-secondary"
              }`}
            >
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[--radius-card] border border-hairline bg-surface p-4">
        <p className="text-sm text-text-secondary">Last published article</p>
        <p className="mt-1 text-text-primary">
          {latestArticle
            ? latestArticle.title
            : "Nothing published yet — head to News to write your first piece."}
        </p>
      </div>
    </div>
  );
}
