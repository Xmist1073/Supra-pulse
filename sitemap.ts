import { prisma } from "@/lib/prisma";

/**
 * Full approve/reject workflow lands in Step 8 (Submission flow). This
 * first pass shows the real pending count so Overview's link isn't dead.
 */
export default async function AdminSubmissionsPage() {
  const pending = await prisma.submission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Submissions</h1>
      <p className="mt-1 text-sm text-text-secondary">
        {pending.length === 0
          ? "No pending submissions — you're all caught up."
          : `${pending.length} submission${pending.length === 1 ? "" : "s"} waiting for review.`}
      </p>
      <p className="mt-4 text-sm text-text-tertiary">
        Full approve/reject workflow lands in the Submission flow build step.
      </p>
    </div>
  );
}
