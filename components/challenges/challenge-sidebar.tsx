import { buildChallengeDetailViewModel } from "@/lib/challenges/view-models";
import { formatNumber } from "@/lib/utils";
import type { ChallengeRecord } from "@/types/domain";

type ChallengeSidebarProps = {
  challenge: ChallengeRecord;
};

export function ChallengeSidebar({ challenge }: ChallengeSidebarProps) {
  const viewModel = buildChallengeDetailViewModel(challenge);

  return (
    <aside className="space-y-6">
      <div className="surface-card-strong p-8">
        <p className="mono-label">Repository Metadata</p>
        <div className="mt-6 space-y-4">
          <div className="surface-panel p-4">
            <p className="mono-label">Repository</p>
            <p className="mt-2 font-medium text-slate-900">
              {challenge.repository.fullName}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {challenge.repository.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="surface-panel p-4">
              <p className="mono-label">Primary language</p>
              <p className="mt-2 font-medium text-slate-900">
                {viewModel.languageLabel}
              </p>
            </div>
            <div className="surface-panel p-4">
              <p className="mono-label">Stars</p>
              <p className="mt-2 font-medium text-slate-900">
                {formatNumber(challenge.repository.stars)}
              </p>
            </div>
            <div className="surface-panel p-4">
              <p className="mono-label">Open issues</p>
              <p className="mt-2 font-medium text-slate-900">
                {formatNumber(challenge.repository.openIssues)}
              </p>
            </div>
            <div className="surface-panel p-4">
              <p className="mono-label">Issue state</p>
              <p className="mt-2 font-medium text-slate-900">{viewModel.statusLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card p-8">
        <p className="mono-label">Difficulty And Reward</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="surface-panel p-4">
            <p className="mono-label">Estimated time</p>
            <p className="mt-2 font-medium text-slate-900">
              {viewModel.estimatedMinutesLabel}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="mono-label">Reward points</p>
            <p className="mt-2 font-medium text-slate-900">
              {viewModel.rewardPointsLabel}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="mono-label">Completion bonus</p>
            <p className="mt-2 font-medium text-slate-900">
              {viewModel.completionPointsLabel}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="mono-label">Total available</p>
            <p className="mt-2 font-medium text-slate-900">
              {viewModel.totalPointsLabel}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="mono-label">Difficulty</p>
            <p className="mt-2 font-medium text-slate-900">
              {viewModel.difficultyLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {viewModel.scoreTierLabel} scoring tier
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card p-8">
        <p className="mono-label">What Success Looks Like</p>
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
          {challenge.acceptanceCriteria.length > 0 ? (
            challenge.acceptanceCriteria.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-600">
              No explicit acceptance criteria were published for this issue yet.
              Use the issue summary and workflow guidance to define a narrow
              validation plan.
            </li>
          )}
        </ul>
      </div>

      <div className="surface-card p-8">
        <p className="mono-label">Before You Start</p>
        {/* TODO: Replace this checklist with repo-specific setup validation once verified submissions are introduced. */}
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
          {viewModel.beforeStartChecklist.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-semibold text-slate-600">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
