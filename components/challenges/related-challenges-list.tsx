import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import { buildChallengeViewModel } from "@/lib/challenges/view-models";
import type { ChallengeRecord } from "@/types/domain";

type RelatedChallengesListProps = {
  challenges: ChallengeRecord[];
  detailHrefBySlug?: Record<string, string>;
};

export function RelatedChallengesList({
  challenges,
  detailHrefBySlug,
}: RelatedChallengesListProps) {
  if (challenges.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-line bg-white/60 p-6">
        <p className="text-sm leading-7 text-slate-600">
          No additional beginner-friendly issues from this repository are in the
          current discovery window yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => {
        const viewModel = buildChallengeViewModel(challenge);

        return (
          <article
            key={challenge.id}
            className="rounded-[1.75rem] border border-line bg-white/80 p-5 shadow-[0_14px_40px_-30px_var(--shadow)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{viewModel.issueLabel}</Badge>
              <Badge tone="accent">{viewModel.totalPointsLabel}</Badge>
              <Badge tone="muted">{viewModel.difficultyLabel}</Badge>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
              <Link
                href={detailHrefBySlug?.[challenge.slug] ?? `/challenges/${challenge.slug}`}
                className="transition hover:text-accent"
              >
                {challenge.title}
              </Link>
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {challenge.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                updated {formatRelativeDate(challenge.updatedAt)}
              </p>
              <Link
                href={detailHrefBySlug?.[challenge.slug] ?? `/challenges/${challenge.slug}`}
                className="inline-flex items-center rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Review Challenge
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
