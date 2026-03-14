import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buildSubmissionViewModel } from "@/lib/challenges/view-models";
import { formatRelativeDate } from "@/lib/utils";
import type { SubmissionRecord } from "@/types/domain";

type SubmissionCardProps = {
  submission: SubmissionRecord;
  challengeHref?: string;
};

export function SubmissionCard({
  submission,
  challengeHref,
}: SubmissionCardProps) {
  const viewModel = buildSubmissionViewModel(submission);

  return (
    <article className="surface-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="mono-label">Submission</p>
        <Badge tone={viewModel.statusTone}>{viewModel.statusLabel}</Badge>
        {submission.submittedAt ? (
          <Badge tone="muted">{formatRelativeDate(submission.submittedAt)}</Badge>
        ) : null}
      </div>
      <div className="mt-4">
        {challengeHref ? (
          <Link
            href={challengeHref}
            className="text-xl font-semibold text-slate-950 transition hover:text-accent"
          >
            {submission.challengeTitle}
          </Link>
        ) : (
          <h2 className="text-xl font-semibold text-slate-950">
            {submission.challengeTitle}
          </h2>
        )}
        <p className="mt-2 text-sm text-slate-600">
          {submission.challengeRepositoryFullName}
        </p>
      </div>
      {submission.notes ? (
        <p className="mt-4 text-sm leading-7 text-slate-700">
          {submission.notes}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-7 text-slate-600">
          No notes were attached to this submission yet.
        </p>
      )}
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white/75 p-4">
          <dt className="mono-label">PR Link</dt>
          <dd className="mt-2 text-sm font-medium text-slate-900">
            {submission.githubPrUrl ? (
              <a
                href={submission.githubPrUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent transition hover:opacity-80"
              >
                View Pull Request
              </a>
            ) : (
              "Not submitted yet"
            )}
          </dd>
        </div>
        <div className="rounded-2xl border border-line bg-white/75 p-4">
          <dt className="mono-label">Fork</dt>
          <dd className="mt-2 text-sm font-medium text-slate-900">
            {submission.githubForkUrl ? (
              <a
                href={submission.githubForkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent transition hover:opacity-80"
              >
                Open Fork
              </a>
            ) : (
              "No fork URL added"
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>Created {formatRelativeDate(submission.createdAt)}</span>
        <span>Updated {formatRelativeDate(submission.updatedAt)}</span>
      </div>
    </article>
  );
}
