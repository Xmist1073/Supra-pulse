"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChecklistInput } from "@/components/admin/ChecklistInput";
import { projectSchema, type ProjectInput } from "@/lib/validators/project";

const emptyProject: ProjectInput = {
  name: "",
  slug: "",
  oneLiner: "",
  description: "",
  logoUrl: "",
  coverImageUrl: "",
  whyItMatters: "",
  websiteUrl: "",
  xUrl: "",
  discordUrl: "",
  telegramUrl: "",
  docsUrl: "",
  githubUrl: "",
  category: [],
  chainType: "MOVE",
  status: "LIVE",
  hasToken: false,
  tokenTicker: "",
  contractAddrs: [],
  vcWebsiteLive: false,
  vcSocialsActive: false,
  vcTeamIdentified: false,
  vcNoScamHistory: false,
  vcConfirmedOnSupra: false,
  vcClearDescription: false,
  vcProductStatusAccurate: false,
  vcMetricsVerifiable: false,
  vcDocsAvailable: false,
  vcTokenomicsDisclosed: false,
  vcContractsPublished: false,
  vcRedFlagged: false,
  verificationTier: "UNVERIFIED",
  verificationNote: "",
  featured: false,
};

const categoryOptions = [
  "DEFI",
  "INFRA",
  "GAMING",
  "NFT",
  "TOOLS",
  "ORACLE",
  "DAO",
  "OTHER",
] as const;

interface ProjectFormProps {
  projectId?: string;
  initialValues?: ProjectInput;
}

/**
 * Shared create/edit form for the Projects Manager (IA doc Section 8).
 * Slugifies the name automatically, surfaces validation errors inline,
 * and embeds the vetting checklist directly so verification happens in
 * the same place the project is entered — not a separate workflow step.
 */
export function ProjectForm({ projectId, initialValues }: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectInput>(
    initialValues ?? emptyProject
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(projectId);

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update("name", name);
    if (!isEditing) {
      update(
        "slug",
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  }

  function toggleCategory(cat: (typeof categoryOptions)[number]) {
    const current = values.category;
    update(
      "category",
      current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const parsed = projectSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setFormError("Fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    const res = await fetch(
      isEditing ? `/api/projects/${projectId}` : "/api/projects",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      }
    );
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error ?? "Something went wrong saving this project.");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-text-primary">Basics</h2>

        <Field label="Project name" error={errors.name?.[0]}>
          <input
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Slug" error={errors.slug?.[0]} hint="Used in the URL: /ecosystem/[slug]">
          <input
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="One-liner" error={errors.oneLiner?.[0]} hint="Shown on cards — keep it under 140 characters">
          <input
            value={values.oneLiner}
            onChange={(e) => update("oneLiner", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Description" error={errors.description?.[0]}>
          <textarea
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className={inputClasses}
          />
        </Field>

        <Field label="Logo URL" error={errors.logoUrl?.[0]}>
          <input
            value={values.logoUrl}
            onChange={(e) => update("logoUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Cover banner URL" error={errors.coverImageUrl?.[0]} hint="Wide image shown at the top of the Project Details page">
          <input
            value={values.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Why it matters" error={errors.whyItMatters?.[0]} hint="One or two sentences on the project's significance to the ecosystem">
          <textarea
            value={values.whyItMatters}
            onChange={(e) => update("whyItMatters", e.target.value)}
            rows={2}
            className={inputClasses}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-text-primary">Links</h2>
        <Field label="Website" error={errors.websiteUrl?.[0]}>
          <input
            value={values.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="X (Twitter)">
          <input
            value={values.xUrl}
            onChange={(e) => update("xUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Discord">
          <input
            value={values.discordUrl}
            onChange={(e) => update("discordUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Docs">
          <input
            value={values.docsUrl}
            onChange={(e) => update("docsUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="GitHub" hint="Leave blank if not public">
          <input
            value={values.githubUrl}
            onChange={(e) => update("githubUrl", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-text-primary">Classification</h2>

        <Field label="Categories" error={errors.category?.[0]}>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
                  values.category.includes(cat)
                    ? "border-signal/40 bg-signal-dim text-signal-hover"
                    : "border-hairline text-text-secondary hover:border-text-tertiary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Chain type">
          <select
            value={values.chainType}
            onChange={(e) => update("chainType", e.target.value as ProjectInput["chainType"])}
            className={inputClasses}
          >
            <option value="MOVE">Move</option>
            <option value="EVM">EVM</option>
            <option value="ORACLE">Oracle</option>
            <option value="MULTI">Multi</option>
          </select>
        </Field>

        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value as ProjectInput["status"])}
            className={inputClasses}
          >
            <option value="LIVE">Live</option>
            <option value="TESTNET">Testnet</option>
            <option value="COMING_SOON">Coming soon</option>
          </select>
        </Field>

        <label className="flex items-center gap-2.5 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.hasToken}
            onChange={(e) => update("hasToken", e.target.checked)}
            className="h-4 w-4 rounded border-hairline accent-[color:var(--color-signal)]"
          />
          Has a token
        </label>

        {values.hasToken && (
          <Field label="Token ticker">
            <input
              value={values.tokenTicker}
              onChange={(e) => update("tokenTicker", e.target.value)}
              className={inputClasses}
            />
          </Field>
        )}

        <label className="flex items-center gap-2.5 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 rounded border-hairline accent-[color:var(--color-signal)]"
          />
          Feature on homepage
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-text-primary">
          Verification checklist
        </h2>
        <p className="-mt-2 text-sm text-text-tertiary">
          Basis for the &ldquo;Verified by Supra Pulse&rdquo; badge — see How
          We Verify.
        </p>
        <ChecklistInput values={values} onChange={update} />

        <Field label="Final verification tier" hint="Confirm manually — the checklist above only suggests a tier">
          <select
            value={values.verificationTier}
            onChange={(e) =>
              update("verificationTier", e.target.value as ProjectInput["verificationTier"])
            }
            className={inputClasses}
          >
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Listed (Unverified)</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </Field>

        <Field label="Verification note (internal)">
          <textarea
            value={values.verificationNote}
            onChange={(e) => update("verificationNote", e.target.value)}
            rows={2}
            className={inputClasses}
          />
        </Field>
      </section>

      {formError && (
        <p role="alert" className="text-sm text-signal-hover">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-[--radius-control] border border-hairline bg-surface px-3 py-2 text-sm text-text-primary focus:border-signal";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-text-secondary">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-text-tertiary">{hint}</p>}
      {error && <p className="text-xs text-signal-hover">{error}</p>}
    </div>
  );
}
