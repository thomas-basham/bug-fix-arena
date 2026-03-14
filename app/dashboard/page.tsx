import Link from "next/link";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import { ChallengeGrid } from "@/components/challenges/challenge-grid";
import { ChallengeEngagementSection } from "@/components/dashboard/challenge-engagement-section";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBanner } from "@/components/ui/status-banner";
import { getCurrentUser } from "@/lib/auth/session";
import { getRecommendedChallenges } from "@/lib/data/catalog";
import { getUserDashboardSnapshot } from "@/lib/engagement/service";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const [recommended, dashboard] = await Promise.all([
    getRecommendedChallenges(2),
    currentUser ? getUserDashboardSnapshot(currentUser.id) : Promise.resolve(null),
  ]);

  if (!dashboard) {
    return (
      <AppShell>
        <PageContainer className="py-10 md:py-14">
          <section className="surface-card-strong relative overflow-hidden p-8 md:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <SectionHeading
              eyebrow="Demo Auth"
              title="Sign in to start tracking saved challenges and earned score."
              description="The first auth layer is intentionally lightweight. Sign in as the seeded demo contributor to bookmark issues, move them into progress, log manual completions, and appear on the leaderboard."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoSessionForm
                mode="sign-in"
                redirectTo="/dashboard"
                className="button-primary"
              />
              <Link
                href="/challenges"
                className="button-secondary"
              >
                Browse Challenges
              </Link>
              <Link
                href="/leaderboard"
                className="button-secondary"
              >
                View Leaderboard
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard label="Saved queue" value="Track later" />
              <StatCard label="Started work" value="Continue here" />
              <StatCard label="Submissions" value="PR-linked" />
            </div>
          </section>

          {recommended.notice ? (
            <div className="mt-8">
              <StatusBanner notice={recommended.notice} />
            </div>
          ) : null}

          <section className="mt-12">
            <SectionHeading
              eyebrow="Recommended Next"
              title="You can still browse the arena before signing in."
              description="The public challenge feed remains available. Sign in only when you want to persist progress in the dashboard."
            />
            <div className="mt-6">
              <EmptyState
                eyebrow="No Signed-In Activity"
                title="Your saved and completed challenges will appear here."
                description="Use the challenge detail page after signing in to save an issue, mark it as started, or complete it manually."
                action={
                  <Link
                    href="/challenges"
                    className="button-primary"
                  >
                    Open Challenge Feed
                  </Link>
                }
              />
            </div>
          </section>
        </PageContainer>
      </AppShell>
    );
  }

  const avatarInitials =
    dashboard.user.avatarInitials ??
    dashboard.user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card-strong relative overflow-hidden p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="mono-label">Workspace</p>
              <DemoSessionForm
                mode="sign-out"
                redirectTo="/"
                className="button-secondary-sm"
              />
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-slate-950 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_32px_-20px_rgba(15,23,42,0.65)]">
                {avatarInitials}
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
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/submissions"
                className="button-primary-sm"
              >
                Open My Submissions
              </Link>
              <Link
                href="/leaderboard"
                className="button-secondary-sm"
              >
                View Leaderboard
              </Link>
              <Link
                href="/challenges"
                className="button-secondary-sm"
              >
                Pick Another Challenge
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <StatCard
                label="Total score"
                value={dashboard.score.totalPoints.toString()}
                detail={dashboard.score.rankLabel}
              />
              <StatCard
                label="Saved"
                value={dashboard.savedChallenges.length.toString()}
                detail="Bookmarked for later"
              />
              <StatCard
                label="Completed"
                value={dashboard.score.completedChallenges.toString()}
                detail="Manual completions so far"
              />
              <StatCard
                label="Submissions"
                value={dashboard.submissionCount.toString()}
                detail="Tracked PR-based records"
              />
            </div>
          </div>

          <div className="surface-card p-8 lg:p-10">
            <SectionHeading
              eyebrow="Progress Overview"
              title="The first engagement layer is now persistence-backed."
              description="Saved, started, and completed challenge states are stored against the signed-in demo user, and the same records now power the first leaderboard and score summaries."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Started"
                value={dashboard.startedChallenges.length.toString()}
                detail="Challenges currently in progress"
              />
              <StatCard
                label="Completion mode"
                value="Manual"
                detail="Automated scoring can layer on later"
              />
              <StatCard
                label="Submission flow"
                value={dashboard.submissionCount.toString()}
                detail="PR links and notes now persist"
              />
            </div>
            <div className="surface-panel mt-6 p-5">
              <p className="mono-label">How this works</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Saving creates a lightweight engagement record, starting moves it
                into active work, and manual completion snapshots the awarded points
                so leaderboard logic can be automated later without changing the
                relationship model. Separate submission records now hold PR links
                and notes without pretending verification already exists.
              </p>
            </div>
          </div>
        </section>

        {recommended.notice ? (
          <div className="mt-8">
            <StatusBanner notice={recommended.notice} />
          </div>
        ) : null}

        <div className="mt-12 space-y-12">
          <ChallengeEngagementSection
            eyebrow="Saved Challenges"
            title="Bookmarked issues waiting for a first pass."
            description="These are the issues you saved without starting yet."
            items={dashboard.savedChallenges}
            emptyTitle="No challenges are saved yet."
            emptyDescription="Bookmark a challenge from its detail page to keep it in your queue."
          />
          <ChallengeEngagementSection
            eyebrow="Started Challenges"
            title="Active work you already pulled into motion."
            description="These challenges are currently in progress and ready to resume."
            items={dashboard.startedChallenges}
            emptyTitle="No challenges are started yet."
            emptyDescription="Use the challenge detail page to move a saved issue into active work."
          />
          <ChallengeEngagementSection
            eyebrow="Completed Challenges"
            title="Manual completions already earning points."
            description="Each completed item snapshots points now so automated scoring can evolve later."
            items={dashboard.completedChallenges}
            emptyTitle="No challenges are completed yet."
            emptyDescription="Complete a challenge manually from its detail page to start building your score."
          />
        </div>

        <section className="mt-12 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="surface-card p-8 lg:p-10">
            <p className="mono-label">Roadmap Anchors</p>
            <div className="mt-6 space-y-4">
              <div className="surface-panel p-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  What comes next
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  The dashboard now has a real persistence layer for engagement.
                  Structured submissions now live alongside engagement state.
                  The next layer is tying review and score updates to verified
                  GitHub pull request signals.
                </p>
              </div>
              <div className="surface-panel p-5">
                {/* TODO: Replace manual completion with review-backed scoring once validation signals exist. */}
                <p className="text-sm leading-7 text-slate-700">
                  Manual completion is intentionally lightweight for the MVP, but
                  the engagement model now stores the state transitions and awarded
                  points needed for deeper scoring later.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/challenges"
                className="button-secondary-sm"
              >
                Pick Another Challenge
              </Link>
              <Link
                href="/leaderboard"
                className="button-primary-sm"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Recommended Next"
              title="Suggested follow-up issues for the signed-in contributor."
              description="The recommendation rail still reuses the public challenge catalog so engagement features do not change discovery behavior."
            />
            <div className="mt-6">
              <ChallengeGrid
                challenges={recommended.challenges}
                emptyState={{
                  eyebrow: "No Recommendations",
                  title: "Fresh recommendations will appear here.",
                  description:
                    "The recommendation rail uses the same challenge catalog service as the browse page, so it will populate as the discovery feed grows.",
                }}
              />
            </div>
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
