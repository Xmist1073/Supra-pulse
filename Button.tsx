"use client";

import { vettingChecklist, type ProjectInput } from "@/lib/validators/project";

interface ChecklistInputProps {
  values: ProjectInput;
  onChange: (key: keyof ProjectInput, value: boolean) => void;
}

const groupOrder = [
  "Legitimacy & Identity",
  "Ecosystem Relevance",
  "Product Status",
  "Documentation",
  "Red Flags",
] as const;

/**
 * Renders the Section 16 vetting checklist as structured checkboxes
 * inside the Project form. This is what makes verification auditable
 * instead of a single opaque toggle — every editorial decision traces
 * back to which criteria were actually checked.
 */
export function ChecklistInput({ values, onChange }: ChecklistInputProps) {
  const passedCount = vettingChecklist.filter(
    (item) => item.key !== "vcRedFlagged" && values[item.key] === true
  ).length;
  const totalNonRedFlag = vettingChecklist.length - 1;
  const hasRedFlag = values.vcRedFlagged === true;

  const suggestedTier = hasRedFlag
    ? "REJECTED"
    : passedCount === totalNonRedFlag
    ? "VERIFIED"
    : "UNVERIFIED";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[--radius-control] border border-hairline bg-surface-raised px-4 py-3">
        <p className="text-sm text-text-secondary">
          {passedCount}/{totalNonRedFlag} criteria met
          {hasRedFlag && (
            <span className="ml-2 text-signal-hover">— red flag present</span>
          )}
        </p>
        <p className="mt-1 text-sm">
          Suggested tier:{" "}
          <span className="font-mono font-medium text-text-primary">
            {suggestedTier}
          </span>{" "}
          <span className="text-text-tertiary">
            (you confirm the final tier below — this is a suggestion, not
            an automatic decision)
          </span>
        </p>
      </div>

      {groupOrder.map((group) => (
        <fieldset key={group}>
          <legend className="mb-2 text-sm font-medium text-text-primary">
            {group}
          </legend>
          <div className="flex flex-col gap-2">
            {vettingChecklist
              .filter((item) => item.group === group)
              .map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-start gap-2.5 text-sm text-text-secondary"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(values[item.key])}
                    onChange={(e) => onChange(item.key, e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline accent-[color:var(--color-signal)]"
                  />
                  {item.label}
                </label>
              ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
