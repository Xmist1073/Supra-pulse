import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { ProjectInput } from "@/lib/validators/project";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  // Prisma returns nulls for optional strings; the form expects "" so
  // controlled inputs don't warn about switching from uncontrolled.
  const initialValues: ProjectInput = {
    ...project,
    logoUrl: project.logoUrl ?? "",
    coverImageUrl: project.coverImageUrl ?? "",
    whyItMatters: project.whyItMatters ?? "",
    xUrl: project.xUrl ?? "",
    discordUrl: project.discordUrl ?? "",
    telegramUrl: project.telegramUrl ?? "",
    docsUrl: project.docsUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    tokenTicker: project.tokenTicker ?? "",
    verificationNote: project.verificationNote ?? "",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{project.name}</h1>
      <p className="mt-1 text-sm text-text-secondary">Edit project details.</p>
      <div className="mt-8">
        <ProjectForm projectId={project.id} initialValues={initialValues} />
      </div>
    </div>
  );
}
