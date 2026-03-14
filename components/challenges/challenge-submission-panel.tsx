import Link from "next/link";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import { SubmissionForm } from "@/components/submissions/submission-form";
import { SubmissionCard } from "@/components/submissions/submission-card";
import { Badge } from "@/components/ui/badge";
import { buildSubmissionViewModel } from "@/lib/challenges/view-models";
import type {
  SubmissionRecord,
  UserRecord,
} from "@/types/domain";

type ChallengeSubmissionPanelProps = {
  challengeSlug: string;
  redirectTo: string;
  submission: SubmissionRecord | null;
  user: UserRecord | null;
};

export function ChallengeSubmissionPanel({
  challengeSlug,
  redirectTo,
  submission,
  user,
}: ChallengeSubmissionPanelProps) {
  if (!user) {
    return (
      <section className="surface-card p-8">
        <p className="mono-label">Submission Workspace</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          Sign in to attach a real PR submission to this challenge.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          The MVP does not run containerized verification yet, but you can
          already save draft notes, attach a GitHub PR link, and keep your
          submission history in the dashboard.
        </p>
        <DemoSessionForm
          mode="sign-in"
          redirectTo={redirectTo}
          className="button-primary mt-6"
        />
      </section>
    );
  }

  if (submission && submission.status !== "draft") {
    const viewModel = buildSubmissionViewModel(submission);

    return (
      <section className="surface-card p-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="mono-label">Submission Workspace</p>
          <Badge tone={viewModel.statusTone}>{viewModel.statusLabel}</Badge>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          Your current submission is already in the review flow.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Review automation is not wired yet, so this status is still a manual
          placeholder. The structure is ready for GitHub checks and richer
          reviewer signals later.
        </p>
        <div className="mt-6">
          <SubmissionCard submission={submission} />
        </div>
        <Link href="/dashboard/submissions" className="button-secondary-sm mt-6">
          Open My Submissions
        </Link>
      </section>
    );
  }

  return (
    <section className="surface-card p-8">
      <p className="mono-label">Submission Workspace</p>
      <h2 className="mt-4 text-2xl font-semibold text-slate-950">
        Attach the pull request you want this challenge to track.
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">
        Save a draft if you are still working, or submit the PR URL when you
        want this challenge to carry a real contribution record.
      </p>
      <SubmissionForm
        challengeSlug={challengeSlug}
        redirectTo={redirectTo}
        submission={submission}
      />
    </section>
  );
}
