import type { Metadata } from "next";
import Link from "next/link";
import { DemoSessionForm } from "@/components/auth/demo-session-form";
import { SyncSubmitButton } from "@/components/admin/sync-submit-button";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminAccessState } from "@/lib/auth/admin";
import { runGitHubChallengeSyncAction } from "@/lib/sync/actions";
import { getChallengeSyncOverview } from "@/lib/sync/service";
import { formatRelativeDate } from "@/lib/utils";
import type { ChallengeSyncRunRecord } from "@/types/domain";

export const metadata: Metadata = {
  title: "Admin Sync",
  description:
    "Internal GitHub challenge ingestion controls for Open Source Bug Fix Arena.",
};

function getSyncStatusMetadata(status: ChallengeSyncRunRecord["status"]) {
  switch (status) {
    case "failed":
      return {
        label: "Failed",
        tone: "warning" as const,
      };
    case "partial":
      return {
        label: "Partial",
        tone: "accent" as const,
      };
    case "running":
      return {
        label: "Running",
        tone: "accent" as const,
      };
    case "success":
      return {
        label: "Success",
        tone: "success" as const,
      };
    default:
      return {
        label: "Unknown",
        tone: "warning" as const,
      };
  }
}

function formatRunDate(date?: string) {
  if (!date) {
    return "Not finished yet";
  }

  return `${new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })} (${formatRelativeDate(date)})`;
}

function SyncRunSummary({ run }: { run: ChallengeSyncRunRecord }) {
  const statusMetadata = getSyncStatusMetadata(run.status);

  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={statusMetadata.tone}>{statusMetadata.label}</Badge>
        <p className="mono-label">Run {run.id.slice(0, 8)}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700">
        {run.message ?? "This sync run finished without a status message."}
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white/80 p-4">
          <dt className="mono-label">Started</dt>
          <dd className="mt-2 text-sm font-medium text-slate-900">
            {formatRunDate(run.startedAt)}
          </dd>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-4">
          <dt className="mono-label">Completed</dt>
          <dd className="mt-2 text-sm font-medium text-slate-900">
            {formatRunDate(run.completedAt)}
          </dd>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-4">
          <dt className="mono-label">Triggered By</dt>
          <dd className="mt-2 text-sm font-medium text-slate-900">
            {run.triggeredByUser
              ? `@${run.triggeredByUser.githubUsername}`
              : "System / unknown"}
          </dd>
        </div>
      </dl>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Fetched"
          value={run.fetchedCount.toString()}
          detail="Candidate GitHub issues"
        />
        <StatCard
          label="Imported"
          value={run.importedCount.toString()}
          detail="New challenges inserted"
        />
        <StatCard
          label="Updated"
          value={run.updatedCount.toString()}
          detail="Existing challenges refreshed"
        />
        <StatCard
          label="Skipped"
          value={run.skippedCount.toString()}
          detail="No effective change"
        />
        <StatCard
          label="Archived"
          value={run.archivedCount.toString()}
          detail="Marked inactive"
        />
      </div>
      {run.logs.length > 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-slate-900/10 bg-slate-950 p-5 text-slate-100">
          <p className="mono-label text-slate-400">Sync Logs</p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
            {run.logs.slice(-6).map((line) => (
              <p key={line} className="font-mono">
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default async function AdminSyncPage() {
  const accessState = await getAdminAccessState();

  if (!accessState.user) {
    return (
      <AppShell>
        <PageContainer className="py-10 md:py-14">
          <EmptyState
            eyebrow="Internal Admin"
            title="Sign in to access challenge sync controls."
            description="This page is reserved for internal GitHub ingestion workflows. Use the demo session to inspect the admin sync surface locally."
            action={
              <DemoSessionForm
                mode="sign-in"
                redirectTo="/admin/sync"
                className="button-primary"
              />
            }
          />
        </PageContainer>
      </AppShell>
    );
  }

  if (!accessState.isAdmin) {
    return (
      <AppShell>
        <PageContainer className="py-10 md:py-14">
          <EmptyState
            eyebrow="Internal Admin"
            title="This account is not allowed to run ingestion syncs."
            description="Add the current GitHub username to ADMIN_GITHUB_USERNAMES if you want this session to manage GitHub imports."
            action={
              <Link href="/dashboard" className="button-secondary">
                Back to Dashboard
              </Link>
            }
          />
        </PageContainer>
      </AppShell>
    );
  }

  const overview = await getChallengeSyncOverview();
  const lastRun = overview.lastRun;
  const lastRunStatusMetadata = lastRun
    ? getSyncStatusMetadata(lastRun.status)
    : null;

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="surface-card-strong relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">Internal Admin</Badge>
            <Badge tone="muted">GitHub Ingestion</Badge>
            {lastRun && lastRunStatusMetadata ? (
              <Badge tone={lastRunStatusMetadata.tone}>
                {lastRunStatusMetadata.label}
              </Badge>
            ) : null}
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mono-label">Challenge Sync Workflow</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Control GitHub challenge ingestion without touching the feed architecture.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                Run a manual GitHub sync, persist normalized issue snapshots,
                and review exactly how many challenges were imported, updated,
                skipped, or archived.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <form action={runGitHubChallengeSyncAction}>
                  <SyncSubmitButton />
                </form>
                <Link href="/challenges" className="button-secondary">
                  View Challenge Feed
                </Link>
              </div>
              {accessState.isConfigurationMissing ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  `ADMIN_GITHUB_USERNAMES` is not configured, so non-production
                  signed-in users can access this page by default.
                </p>
              ) : null}
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.85)]">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                Last Sync Status
              </p>
              {lastRun ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="mono-label text-slate-400">Latest Result</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {lastRunStatusMetadata?.label ?? "Unknown"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="mono-label text-slate-400">Completed</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatRunDate(lastRun.completedAt)}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    {lastRun.message}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm leading-7 text-slate-300">
                  No sync has been recorded yet. Run the first manual import to
                  populate the catalog from GitHub.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Synced Challenges"
            value={overview.totalSyncedChallenges.toString()}
            detail="Persisted GitHub-backed challenge rows"
          />
          <StatCard
            label="Active Challenges"
            value={overview.activeSyncedChallenges.toString()}
            detail="Currently eligible for the feed"
          />
          <StatCard
            label="Archived Challenges"
            value={overview.archivedSyncedChallenges.toString()}
            detail="Closed or no longer qualifying"
          />
          <StatCard
            label="Recent Runs"
            value={overview.recentRuns.length.toString()}
            detail="Stored sync audit entries"
          />
        </section>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Latest Run"
            title="Manual sync results and diagnostics."
            description="Each run stores counts and short logs so you can tell whether GitHub discovery was complete enough to archive stale issues safely."
          />
          <div className="mt-8">
            {lastRun ? (
              <SyncRunSummary run={lastRun} />
            ) : (
              <EmptyState
                eyebrow="No Sync History"
                title="The database does not have a recorded GitHub sync yet."
                description="Use the manual sync button above to fetch qualifying GitHub issues, normalize them, and upsert them into the persisted challenge catalog."
              />
            )}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Recent History"
            title="Previous sync runs stay visible for quick auditing."
            description="This is intentionally lightweight: enough history to spot ingestion drift without building a full admin platform."
          />
          <div className="mt-8 overflow-hidden rounded-[28px] border border-line bg-white/80">
            {overview.recentRuns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-line text-left text-sm text-slate-700">
                  <thead className="bg-slate-950 text-slate-100">
                    <tr>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Started</th>
                      <th className="px-5 py-4 font-medium">Imported</th>
                      <th className="px-5 py-4 font-medium">Updated</th>
                      <th className="px-5 py-4 font-medium">Skipped</th>
                      <th className="px-5 py-4 font-medium">Archived</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {overview.recentRuns.map((run) => {
                      const statusMetadata = getSyncStatusMetadata(run.status);

                      return (
                        <tr key={run.id}>
                          <td className="px-5 py-4">
                            <Badge tone={statusMetadata.tone}>
                              {statusMetadata.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            {formatRunDate(run.startedAt)}
                          </td>
                          <td className="px-5 py-4">{run.importedCount}</td>
                          <td className="px-5 py-4">{run.updatedCount}</td>
                          <td className="px-5 py-4">{run.skippedCount}</td>
                          <td className="px-5 py-4">{run.archivedCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-sm leading-7 text-slate-700">
                No sync runs have been recorded yet.
              </div>
            )}
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
