import { Badge } from "@/components/ui/badge";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import {
  completeChallengeAction,
  saveChallengeAction,
  startChallengeAction,
} from "@/lib/engagement/actions";
import { buildChallengeViewModel } from "@/lib/challenges/view-models";
import { getChallengeEngagementStatusMetadata } from "@/lib/config/challenges";
import type {
  ChallengeEngagementRecord,
  ChallengeRecord,
  UserRecord,
} from "@/types/domain";

type ChallengeEngagementPanelProps = {
  challenge: ChallengeRecord;
  engagement: ChallengeEngagementRecord | null;
  redirectTo: string;
  user: UserRecord | null;
};

function EngagementActionButton({
  action,
  challengeSlug,
  label,
  redirectTo,
  tone = "dark",
}: {
  action: (formData: FormData) => Promise<void>;
  challengeSlug: string;
  label: string;
  redirectTo: string;
  tone?: "dark" | "light";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="challengeSlug" value={challengeSlug} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button
        type="submit"
        className={
          tone === "dark"
            ? "inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            : "inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
        }
      >
        {label}
      </button>
    </form>
  );
}

export function ChallengeEngagementPanel({
  challenge,
  engagement,
  redirectTo,
  user,
}: ChallengeEngagementPanelProps) {
  const viewModel = buildChallengeViewModel(challenge);

  if (!user) {
    return (
      <section className="surface-card-strong p-8">
        <p className="mono-label">Progress Tracking</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          Sign in to save or complete this challenge.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          The auth layer is intentionally lightweight for the MVP. Sign in as the
          seeded demo user to bookmark this issue, mark it in progress, or log a
          manual completion.
        </p>
        <DemoSessionForm
          mode="sign-in"
          redirectTo={redirectTo}
          className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        />
      </section>
    );
  }

  const statusMetadata = engagement
    ? getChallengeEngagementStatusMetadata(engagement.status)
    : null;

  return (
    <section className="surface-card-strong p-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="mono-label">Your Arena Status</p>
        {statusMetadata ? (
          <Badge tone={statusMetadata.badgeTone}>{statusMetadata.label}</Badge>
        ) : null}
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-slate-950">
        Track your progress on this challenge.
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">
        Save it for later, mark it as started, or complete it manually while the
        MVP still uses lightweight contributor workflows.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white/75 p-4">
          <p className="mono-label">Reward</p>
          <p className="mt-2 font-medium text-slate-900">
            {viewModel.rewardPointsLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/75 p-4">
          <p className="mono-label">Completion bonus</p>
          <p className="mt-2 font-medium text-slate-900">
            {viewModel.completionPointsLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/75 p-4">
          <p className="mono-label">Total available</p>
          <p className="mt-2 font-medium text-slate-900">
            {viewModel.totalPointsLabel}
          </p>
        </div>
      </div>
      {engagement?.status === "completed" ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-800">
          You already completed this challenge manually and earned{" "}
          <span className="font-semibold">{engagement.pointsAwarded} points</span>.
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {engagement?.status !== "saved" && engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={saveChallengeAction}
            challengeSlug={challenge.slug}
            label="Save For Later"
            redirectTo={redirectTo}
            tone="light"
          />
        ) : null}
        {engagement?.status !== "started" && engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={startChallengeAction}
            challengeSlug={challenge.slug}
            label="Mark As Started"
            redirectTo={redirectTo}
          />
        ) : null}
        {engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={completeChallengeAction}
            challengeSlug={challenge.slug}
            label={`Complete For ${viewModel.totalPointsLabel}`}
            redirectTo={redirectTo}
            tone="light"
          />
        ) : null}
      </div>
    </section>
  );
}
