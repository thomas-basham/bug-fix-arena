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
    <article className="surface-card group relative overflow-hidden p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_var(--shadow)]">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={viewModel.sourceTone}>{viewModel.sourceLabel}</Badge>
        <Badge tone="accent">{viewModel.languageLabel}</Badge>
        <Badge>{viewModel.difficultyLabel}</Badge>
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          {viewModel.issueLabel}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 transition group-hover:text-accent">
        {challenge.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-slate-700">{challenge.summary}</p>
      <div className="mt-4 rounded-2xl border border-line bg-white/60 px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          {challenge.repository.fullName}
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          {challenge.repository.description}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {challenge.labels.map((label) => (
          <Badge key={label}>{label}</Badge>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
        <div className="rounded-2xl border border-line bg-white/70 p-4">
          <p className="mono-label">Estimated</p>
          <p className="mt-2 font-medium">{viewModel.estimatedMinutesLabel}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/70 p-4">
          <p className="mono-label">Stars</p>
          <p className="mt-2 font-medium">
            {formatNumber(challenge.repository.stars)}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
            {viewModel.totalPointsLabel} total
          </p>
          <p className="text-xs text-slate-500">{viewModel.rewardBreakdownLabel}</p>
          <p className="text-xs text-slate-500">
            updated {formatRelativeDate(challenge.updatedAt)}
          </p>
        </div>
        <Link
          href={href ?? `/challenges/${challenge.slug}`}
          className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Open Challenge
        </Link>
      </div>
    </article>
  );
}
