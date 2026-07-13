import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Add Project</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Run through the vetting checklist before setting a verification tier.
      </p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
