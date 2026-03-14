import Link from "next/link";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBanner } from "@/components/ui/status-banner";
import {
  getDashboardSnapshot,
  getRecommendedChallenges,
} from "@/lib/data/catalog";
import { formatRelativeDate } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const dashboard = getDashboardSnapshot();
  const recommended = await getRecommendedChallenges(2);

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card-strong p-8">
            <p className="mono-label">Workspace</p>
            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {dashboard.user.avatarInitials}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-950">
                  {dashboard.user.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  @{dashboard.user.githubUsername}
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-700">
                  {dashboard.user.bio}
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Total score"
                value={dashboard.score.totalPoints.toString()}
                detail={dashboard.score.rankLabel}
              />
              <StatCard
                label="Current streak"
                value={`${dashboard.score.currentStreak} days`}
                detail="Activity placeholder"
              />
              <StatCard
                label="Completed"
                value={dashboard.score.completedChallenges.toString()}
                detail="Accepted arena workflows"
              />
            </div>
          </div>

          <div className="surface-card p-8">
            <SectionHeading
              eyebrow="Draft Pipeline"
              title="Basic dashboard shell for an authenticated contributor view."
              description="Auth is intentionally shallow in the MVP. This shell demonstrates the information architecture without implementing deep account flows yet."
            />
            {dashboard.submissions.length > 0 ? (
              <div className="mt-6 space-y-4">
                {dashboard.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-2xl border border-line bg-white/70 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-950">
                        {submission.title}
                      </h2>
                      <Badge tone={submission.status === "accepted" ? "success" : "muted"}>
                        {submission.status}
                      </Badge>
                      <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                        updated {formatRelativeDate(submission.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {submission.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {submission.checklist.map((item) => (
                        <Badge key={item}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  eyebrow="No Drafts Yet"
                  title="The workflow queue is empty."
                  description="Saved workflow drafts and submitted challenge plans will appear here once the submission flow is wired beyond the current MVP shell."
                />
              </div>
            )}
          </div>
        </section>

        {recommended.notice ? (
          <div className="mt-8">
            <StatusBanner notice={recommended.notice} />
          </div>
        ) : null}

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-8">
            <p className="mono-label">Roadmap Anchors</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-line bg-white/70 p-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  What comes next
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  The dashboard is where collaboration-grade features can land
                  once the persistence and auth layers are real.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white/70 p-5">
                {/* TODO: Replace the static score panel with a real leaderboard once scoring is persisted. */}
                {/* TODO: Surface contextual AI hints here after repository context and submission data are available. */}
                <p className="text-sm leading-7 text-slate-700">
                  Leaderboard, AI hints, saved workflows, and review queues are
                  intentionally deferred so the MVP stays focused on challenge
                  discovery and structure.
                </p>
              </div>
            </div>
            <Link
              href="/challenges"
              className="mt-6 inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
            >
              Pick Another Challenge
            </Link>
          </div>

          <div>
            <SectionHeading
              eyebrow="Recommended Next"
              title="Suggested follow-up issues for this contributor profile."
              description="These cards reuse the same challenge building blocks the public catalog uses, which keeps the MVP architecture aligned."
            />
            {recommended.challenges.length > 0 ? (
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {recommended.challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  eyebrow="No Recommendations"
                  title="Fresh recommendations will appear here."
                  description="The recommendation rail is using the same challenge catalog service as the browse page. If the catalog is empty, this panel stays intentionally explicit."
                />
              </div>
            )}
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
