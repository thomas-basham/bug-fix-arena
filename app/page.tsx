import Link from "next/link";
import { ChallengeGrid } from "@/components/challenges/challenge-grid";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBanner } from "@/components/ui/status-banner";
import {
  CHALLENGE_DISCOVERY_LABELS,
  getChallengeSourceMetadata,
} from "@/lib/config/challenges";
import { getFeaturedChallenges, getPlatformOverview } from "@/lib/data/catalog";

export default async function Home() {
  const [{ challenges, source, notice }, overview] = await Promise.all([
    getFeaturedChallenges(4),
    Promise.resolve(getPlatformOverview()),
  ]);
  const sourceMetadata = getChallengeSourceMetadata(source);

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-card-strong relative overflow-hidden p-8 md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="mono-label">MVP foundation for contributor workflows</p>
            <div className="mt-6 max-w-2xl space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Turn real open source issues into focused bug-fix challenges.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-700">
                Open Source Bug Fix Arena helps developers discover
                beginner-friendly GitHub issues, inspect the context, and draft
                a practical fix workflow before opening a pull request.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/challenges"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Browse Challenges
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                Open Dashboard Shell
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Challenge feed"
                value={sourceMetadata.label}
              />
              <StatCard
                label="Primary labels"
                value={CHALLENGE_DISCOVERY_LABELS.join(" + ")}
              />
              <StatCard label="Core flow" value="Inspect -> plan -> submit" />
            </div>
          </div>

          <aside className="surface-card p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-line pb-4">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <p className="ml-3 font-mono text-xs uppercase tracking-[0.22em] text-muted">
                arena.config.ts
              </p>
            </div>
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100">
              <code>{`challenge = {
  source: "${source}",
  labels: ["${CHALLENGE_DISCOVERY_LABELS[0]}", "${CHALLENGE_DISCOVERY_LABELS[1]}"],
  workflow: [
    "review issue context",
    "trace likely fix path",
    "draft validation steps",
  ],
  future: ["patch submission", "test runner"],
};`}</code>
            </pre>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-line bg-white/70 p-4">
                <p className="mono-label">MVP principle</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Keep the foundation server-rendered, typed, and mock-friendly
                  while the GitHub and database layers mature.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white/70 p-4">
                <p className="mono-label">Next milestone</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Add structured workflow submissions and validation hooks
                  without introducing a full in-browser IDE.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {notice ? <div className="mt-8"><StatusBanner notice={notice} /></div> : null}

        <section className="mt-14 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Repositories seeded"
            value={overview.totalRepositories.toString()}
            detail="Curated starter catalog"
          />
          <StatCard
            label="Open challenges"
            value={overview.totalChallenges.toString()}
            detail="Ready for exploration"
          />
          <StatCard
            label="Mock submissions"
            value={overview.totalSubmissions.toString()}
            detail="Used for dashboard scaffolding"
          />
          <StatCard
            label="Points in play"
            value={overview.totalPoints.toString()}
            detail="Scoring model placeholder"
          />
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Featured Challenges"
            title="Starter issues that feel real, not toy examples."
            description="The catalog prefers public issues tagged for newcomers. When a GitHub token is absent, the app falls back to a seeded mock set so the MVP stays usable."
            action={
              <Link
                href="/challenges"
                className="inline-flex items-center rounded-full border border-line bg-white/70 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                View All
              </Link>
            }
          />
          <div className="mt-8">
            <ChallengeGrid
              challenges={challenges}
              className="xl:grid-cols-2 2xl:grid-cols-4"
              emptyState={{
                eyebrow: "No Featured Challenges",
                title: "The featured issue rail is empty right now.",
                description:
                  "Live GitHub issues and the seeded fallback catalog are both unavailable for the homepage spotlight. Open the full catalog to retry the feed.",
                action: (
                  <Link
                    href="/challenges"
                    className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Open Catalog
                  </Link>
                ),
              }}
            />
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="surface-card p-6">
            <p className="mono-label">1. Discover</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Browse issues by contributor-friendly labels.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Surface issues tagged with signals like{" "}
              <code>{CHALLENGE_DISCOVERY_LABELS[0]}</code> and{" "}
              <code>{CHALLENGE_DISCOVERY_LABELS[1]}</code>, then wrap them in a
              consistent arena format.
            </p>
          </div>
          <div className="surface-card p-6">
            <p className="mono-label">2. Plan</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Turn the issue into a practical fix workflow.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Capture scope, validation steps, risk notes, and likely files so
              contributors can move with more confidence.
            </p>
          </div>
          <div className="surface-card p-6">
            <p className="mono-label">3. Grow</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Add scoring and review loops incrementally.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The MVP keeps the scoring, review, and collaboration model simple
              so deeper features can land without a rewrite.
            </p>
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
