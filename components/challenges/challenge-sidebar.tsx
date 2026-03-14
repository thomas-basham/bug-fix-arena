import { Badge } from "@/components/ui/badge";
import type { ChallengeRecord } from "@/types/domain";

type ChallengeSidebarProps = {
  challenge: ChallengeRecord;
};

export function ChallengeSidebar({ challenge }: ChallengeSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="surface-card-strong p-8">
        <p className="mono-label">Challenge Brief</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-line bg-white/70 p-4">
            <p className="mono-label">Estimated time</p>
            <p className="mt-2 font-medium text-slate-900">
              {challenge.estimatedMinutes} minutes
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white/70 p-4">
            <p className="mono-label">Points</p>
            <p className="mt-2 font-medium text-slate-900">{challenge.points}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white/70 p-4">
            <p className="mono-label">Repository</p>
            <p className="mt-2 font-medium text-slate-900">
              {challenge.repository.fullName}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white/70 p-4">
            <p className="mono-label">Status</p>
            <p className="mt-2 font-medium capitalize text-slate-900">
              {challenge.status}
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card p-8">
        <p className="mono-label">Suggested Workflow</p>
        <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
          {challenge.workflowSteps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 font-mono text-xs text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="surface-card p-8">
        <p className="mono-label">Arena Extensions</p>
        {/* TODO: Add structured patch submission beside this workflow panel once the editor flow exists. */}
        {/* TODO: Run the test runner after a workflow becomes a concrete patch draft. */}
        {/* TODO: Export validated workflows into a PR export flow when repository write access is introduced. */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="accent">workflow planning</Badge>
          <Badge>review scaffolding</Badge>
          <Badge>future PR handoff</Badge>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          This sidebar is intentionally plan-first. The MVP stops before code
          patch creation so the app can prove discovery and workflow value
          without an in-browser IDE.
        </p>
      </div>
    </aside>
  );
}
