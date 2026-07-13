import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import type { Project } from "@prisma/client";

const statusLabel: Record<string, string> = {
  LIVE: "Live",
  TESTNET: "Testnet",
  COMING_SOON: "Coming soon",
};

const statusTone = {
  LIVE: "live",
  TESTNET: "warning",
  COMING_SOON: "neutral",
} as const;

/**
 * The atomic card used by the Directory grid, Trending carousel, and
 * "Similar Projects" on the Project Details page — one component so the
 * visual language never drifts between contexts (IA doc design system
 * notes).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card href={`/ecosystem/${project.slug}`} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised">
          {project.logoUrl ? (
            <Image
              src={project.logoUrl}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-mono text-sm text-text-tertiary">
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">
            {project.name}
          </p>
          <div className="flex items-center gap-1.5">
            {project.verificationTier === "VERIFIED" && <VerifiedBadge />}
            <Badge tone={statusTone[project.status]}>
              {statusLabel[project.status]}
            </Badge>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-text-secondary">
        {project.oneLiner}
      </p>

      {project.category.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.category.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="font-mono text-xs uppercase tracking-wide text-text-tertiary"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
