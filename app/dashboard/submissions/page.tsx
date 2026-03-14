import Link from "next/link";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { SubmissionList } from "@/components/submissions/submission-list";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserSubmissionsSnapshot } from "@/lib/submissions/service";

export const metadata = {
  title: "My Submissions",
};

export default async function DashboardSubmissionsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <AppShell>
        <PageContainer className="py-10 md:py-14">
          <EmptyState
            eyebrow="My Submissions"
            title="Sign in to track PR-based submissions."
            description="This page stores GitHub PR links, optional notes, and status history for the challenges you are actively working on."
            action={
              <div className="flex flex-wrap gap-3">
                <DemoSessionForm
                  mode="sign-in"
                  redirectTo="/dashboard/submissions"
                  className="button-primary"
                />
                <Link href="/challenges" className="button-secondary">
                  Browse Challenges
                </Link>
              </div>
            }
          />
        </PageContainer>
      </AppShell>
    );
  }

  const submissionSnapshot = await getUserSubmissionsSnapshot(currentUser.id);
  const { counts, submissions } = submissionSnapshot;

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="surface-card-strong p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mono-label">Dashboard / My Submissions</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                PR-linked submission history for the work you actually shipped.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                This first-pass submission layer stores the GitHub links and notes
                needed to connect real verification later without blocking on
                containerized execution today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="button-secondary">
                Back to Dashboard
              </Link>
              <Link href="/challenges" className="button-primary">
                Browse Challenges
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-5">
          <StatCard
            label="Drafts"
            value={counts.draft.toString()}
            detail="Saved but not sent"
          />
          <StatCard
            label="Submitted"
            value={counts.submitted.toString()}
            detail="Waiting for review handoff"
          />
          <StatCard
            label="Under review"
            value={counts.under_review.toString()}
            detail="Ready for future automation"
          />
          <StatCard
            label="Accepted"
            value={counts.accepted.toString()}
            detail="Can map to verified points later"
          />
          <StatCard
            label="Rejected"
            value={counts.rejected.toString()}
            detail="Signals a rescope or retry"
          />
        </section>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Submission History"
            title="Every tracked PR stays tied to its original challenge."
            description="The current MVP does not verify PRs automatically yet, but the record shape is now aligned with the next step: GitHub-backed review and validation."
          />
          <div className="mt-8">
            <SubmissionList submissions={submissions} />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
