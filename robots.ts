import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { vettingChecklist } from "@/lib/validators/project";

const tierTone = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  REJECTED: "warning",
} as const;

const checklistKeys = vettingChecklist
  .filter((item) => item.key !== "vcRedFlagged")
  .map((item) => item.key);

/**
 * Verification Panel (IA doc Section 8): keeps the trust model from
 * decaying as the Directory grows by surfacing checklist completion %
 * for every project, sorted so the least-verified projects surface first.
 */
export default async function AdminVerificationPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const withCompletion = projects
    .map((project) => {
      const completed = checklistKeys.filter(
        (key) => project[key as keyof typeof project] === true
      ).length;
      return {
        ...project,
        completionPct: Math.round((completed / checklistKeys.length) * 100),
      };
    })
    .sort((a, b) => a.completionPct - b.completionPct);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Verification</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Checklist completion across the Directory — lowest first, so gaps
        surface before they become trust problems.
      </p>

      <div className="mt-8 overflow-hidden rounded-[--radius-card] border border-hairline">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-text-tertiary">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Checklist</th>
            </tr>
          </thead>
          <tbody>
            {withCompletion.map((project) => (
              <tr
                key={project.id}
                className="border-t border-hairline hover:bg-surface-raised"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium text-text-primary hover:text-signal-hover"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={tierTone[project.verificationTier]}>
                    {project.verificationTier}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-raised">
                      <div
                        className="h-full bg-signal"
                        style={{ width: `${project.completionPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-tertiary">
                      {project.completionPct}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
