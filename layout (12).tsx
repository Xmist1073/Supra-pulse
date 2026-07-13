import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const tierTone = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  REJECTED: "warning",
} as const;

/**
 * Projects Manager (IA doc Section 8): table view + "+ Add Project".
 * Single-editor MVP — no bulk actions, row click goes straight to edit.
 */
export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects.length} project{projects.length === 1 ? "" : "s"} in the
            Directory.
          </p>
        </div>
        <Button href="/admin/projects/new">+ Add Project</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 overflow-hidden rounded-[--radius-card] border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-text-tertiary">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
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
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {project.category.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {project.status}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={tierTone[project.verificationTier]}>
                      {project.verificationTier}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary">
                    {project.updatedAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center rounded-[--radius-card] border border-dashed border-hairline py-16 text-center">
      <p className="text-text-secondary">No projects yet.</p>
      <p className="mt-1 text-sm text-text-tertiary">
        Add your first project to start building the Directory.
      </p>
      <Button href="/admin/projects/new" className="mt-4">
        + Add Project
      </Button>
    </div>
  );
}
