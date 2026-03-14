import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buildChallengeViewModel } from "@/lib/challenges/view-models";
import { formatNumber, formatRelativeDate } from "@/lib/utils";
import type { ChallengeRecord } from "@/types/domain";

type ChallengeCardProps = {
  challenge: ChallengeRecord;
  href?: string;
};

export function ChallengeCard({ challenge, href }: ChallengeCardProps) {
  const viewModel = buildChallengeViewModel(challenge);

  return (
    <article className="surface-card group relative overflow-hidden p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_32px_80px_-40px_var(--shadow)] md:p-7">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone={viewModel.sourceTone}>{viewModel.sourceLabel}</Badge>
          <Badge tone="accent">{viewModel.languageLabel}</Badge>
          <Badge>{viewModel.difficultyLabel}</Badge>
        </div>
        <span className="mono-label">updated {formatRelativeDate(challenge.updatedAt)}</span>
      </div>

      <div className="mt-5">
        <p className="mono-label">{challenge.repository.fullName}</p>
        <h3 className="mt-3 text-[1.7rem] font-semibold tracking-tight text-slate-950 transition group-hover:text-accent">
          {challenge.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-slate-700">{challenge.summary}</p>
      </div>

      <div className="surface-panel mt-5 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="mono-label">{viewModel.issueLabel}</p>
          <Badge tone="muted">{viewModel.rewardBreakdownLabel}</Badge>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          {challenge.repository.description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {challenge.labels.slice(0, 4).map((label) => (
          <Badge key={label}>{label}</Badge>
        ))}
        {challenge.labels.length > 4 ? (
          <Badge tone="muted">+{challenge.labels.length - 4} more</Badge>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700 xl:grid-cols-3">
        <div className="surface-panel p-4">
          <p className="mono-label">Estimated</p>
          <p className="mt-2 font-medium">{viewModel.estimatedMinutesLabel}</p>
        </div>
        <div className="surface-panel p-4">
          <p className="mono-label">Stars</p>
          <p className="mt-2 font-medium">
            {formatNumber(challenge.repository.stars)}
          </p>
        </div>
        <div className="surface-panel col-span-2 p-4 xl:col-span-1">
          <p className="mono-label">Reward</p>
          <p className="mt-2 font-medium text-slate-950">
            {viewModel.totalPointsLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line/80 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="mono-label">Repository context</p>
          <p className="text-sm font-medium text-slate-900">
            {challenge.repository.owner}/{challenge.repository.name}
          </p>
          <p className="text-sm leading-6 text-slate-600">
            {viewModel.totalPointsLabel} total available
          </p>
        </div>
        <Link
          href={href ?? `/challenges/${challenge.slug}`}
          className="button-primary-sm sm:min-w-[9.5rem]"
        >
          Open Challenge
        </Link>
      </div>
    </article>
  );
}
