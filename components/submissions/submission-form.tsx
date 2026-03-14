"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  initialSubmissionActionState,
  upsertChallengeSubmissionAction,
} from "@/lib/submissions/actions";
import type { SubmissionRecord } from "@/types/domain";

type SubmissionFormProps = {
  challengeSlug: string;
  redirectTo: string;
  submission?: SubmissionRecord | null;
};

function SubmissionButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="submit"
        name="intent"
        value="draft"
        disabled={pending}
        className="button-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Draft"}
      </button>
      <button
        type="submit"
        name="intent"
        value="submit"
        disabled={pending}
        className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit PR"}
      </button>
    </div>
  );
}

export function SubmissionForm({
  challengeSlug,
  redirectTo,
  submission,
}: SubmissionFormProps) {
  const [state, formAction] = useActionState(
    upsertChallengeSubmissionAction,
    initialSubmissionActionState,
  );

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="challengeSlug" value={challengeSlug} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="mono-label">GitHub PR URL</span>
          <input
            type="url"
            name="githubPrUrl"
            defaultValue={submission?.githubPrUrl}
            placeholder="https://github.com/owner/repo/pull/123"
            className="w-full rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent/35 focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="grid gap-2">
          <span className="mono-label">Fork URL</span>
          <input
            type="url"
            name="githubForkUrl"
            defaultValue={submission?.githubForkUrl}
            placeholder="https://github.com/your-handle/repo"
            className="w-full rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent/35 focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="grid gap-2">
          <span className="mono-label">Notes</span>
          <textarea
            name="notes"
            rows={5}
            defaultValue={submission?.notes}
            placeholder="Capture context, test notes, or maintainer questions for this PR."
            className="w-full rounded-[1.5rem] border border-line bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent/35 focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        Drafts can be saved with notes alone. Submitting requires a valid GitHub
        pull request link.
      </p>
      {state.status !== "idle" ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-7 ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-800"
              : "border-amber-200 bg-amber-50/90 text-amber-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}
      <SubmissionButtons />
    </form>
  );
}
