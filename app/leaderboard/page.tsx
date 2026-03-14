import Link from "next/link";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { RecentActivityFeed } from "@/components/leaderboard/recent-activity-feed";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getLeaderboardSnapshot } from "@/lib/engagement/service";

export const metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const [currentUser, leaderboard] = await Promise.all([
    getCurrentUser(),
    getLeaderboardSnapshot(),
  ]);
  const totalPoints = leaderboard.entries.reduce(
    (sum, entry) => sum + entry.score.totalPoints,
    0,
  );
  const totalCompletedChallenges = leaderboard.entries.reduce(
    (sum, entry) => sum + entry.score.completedChallenges,
    0,
  );

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="surface-card-strong relative overflow-hidden p-8 md:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <SectionHeading
            eyebrow="Arena Standings"
            title="See who is stacking the most signal through completed challenges."
            description="This first-pass leaderboard stays intentionally simple. Scores are driven by challenge reward points plus a completion bonus, and recent completions show the latest movement across the arena."
            action={
              <Link
                href="/dashboard"
                className="button-secondary"
              >
                Open Dashboard
              </Link>
            }
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Ranked contributors"
              value={leaderboard.entries.length.toString()}
              detail="Users with a persisted score"
            />
            <StatCard
              label="Leaderboard points"
              value={totalPoints.toString()}
              detail="Across the ranked table"
            />
            <StatCard
              label="Completed challenges"
              value={totalCompletedChallenges.toString()}
              detail="Across the ranked table"
            />
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHeading
              eyebrow="Top Contributors"
              title="Current scoreboard"
              description="Scores are sorted by total points first, then completed challenge count."
            />
            <div className="mt-6">
              {leaderboard.entries.length > 0 ? (
                <LeaderboardTable
                  currentUserId={currentUser?.id}
                  entries={leaderboard.entries}
                />
              ) : (
                <EmptyState
                  eyebrow="No Scores Yet"
                  title="The leaderboard is waiting for the first completed challenge."
                  description="Complete a challenge from its detail page to generate the first score entry."
                  action={
                    <Link
                      href="/challenges"
                      className="button-primary"
                    >
                      Browse Challenges
                    </Link>
                  }
                />
              )}
            </div>
          </div>

          <div className="surface-card p-8 lg:p-10">
            <SectionHeading
              eyebrow="Recent Movement"
              title="Latest completed challenges"
              description="Recent activity is pulled from completed engagement records, so it reflects the same data that powers score totals."
            />
            <div className="mt-6">
              {leaderboard.recentActivity.length > 0 ? (
                <RecentActivityFeed items={leaderboard.recentActivity} />
              ) : (
                <EmptyState
                  eyebrow="No Activity"
                  title="Recent completions will show up here."
                  description="Once contributors mark challenges complete, the leaderboard activity feed will reflect the latest point changes."
                />
              )}
            </div>
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
