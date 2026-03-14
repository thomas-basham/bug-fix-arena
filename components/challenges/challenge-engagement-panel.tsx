import { Badge } from "@/components/ui/badge";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import {
  completeChallengeAction,
  saveChallengeAction,
  startChallengeAction,
} from "@/lib/engagement/actions";
import { buildChallengeViewModel } from "@/lib/challenges/view-models";
import { getChallengeEngagementStatusMetadata } from "@/lib/config/challenges";
import { cn } from "@/lib/utils";
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

const actionButtonBaseClass =
  "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold appearance-none transition focus-visible:outline-none focus-visible:ring-2";

const primaryActionButtonClass = `${actionButtonBaseClass} bg-accent text-white shadow-[0_14px_32px_-20px_rgba(15,118,110,0.65)] hover:brightness-95 focus-visible:ring-accent/35`;

const secondaryActionButtonClass = `${actionButtonBaseClass} border border-slate-300 bg-white/95 text-slate-950 hover:bg-white focus-visible:ring-slate-900/10`;

function EngagementActionButton({
  action,
  challengeSlug,
  label,
  redirectTo,
  fullWidth = false,
  tone = "dark",
}: {
  action: (formData: FormData) => Promise<void>;
  challengeSlug: string;
  label: string;
  redirectTo: string;
  fullWidth?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="challengeSlug" value={challengeSlug} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button
        type="submit"
        className={cn(
          tone === "dark"
            ? primaryActionButtonClass
            : secondaryActionButtonClass,
          fullWidth && "w-full",
        )}
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
          className={cn("mt-6", primaryActionButtonClass)}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={challenge.issueUrl}
            target="_blank"
            rel="noreferrer"
            className={secondaryActionButtonClass}
          >
            Visit GitHub Issue
          </a>
          <a
            href={challenge.repository.url}
            target="_blank"
            rel="noreferrer"
            className={secondaryActionButtonClass}
          >
            View Repository
          </a>
        </div>
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
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={challenge.issueUrl}
          target="_blank"
          rel="noreferrer"
          className={secondaryActionButtonClass}
        >
          Visit GitHub Issue
        </a>
        <a
          href={challenge.repository.url}
          target="_blank"
          rel="noreferrer"
          className={secondaryActionButtonClass}
        >
          View Repository
        </a>
      </div>
      {engagement?.status === "completed" ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-800">
          You already completed this challenge manually and earned{" "}
          <span className="font-semibold">{engagement.pointsAwarded} points</span>.
        </div>
      ) : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {engagement?.status !== "saved" && engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={saveChallengeAction}
            challengeSlug={challenge.slug}
            label="Save Challenge"
            redirectTo={redirectTo}
            tone="light"
            fullWidth
          />
        ) : null}
        {engagement?.status !== "started" && engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={startChallengeAction}
            challengeSlug={challenge.slug}
            label="Start Challenge"
            redirectTo={redirectTo}
            fullWidth
          />
        ) : null}
      </div>
      <div className="mt-3">
        {engagement?.status !== "completed" ? (
          <EngagementActionButton
            action={completeChallengeAction}
            challengeSlug={challenge.slug}
            label={`Complete For ${viewModel.totalPointsLabel}`}
            redirectTo={redirectTo}
            tone="light"
            fullWidth
          />
        ) : null}
      </div>
    </section>
  );
}
