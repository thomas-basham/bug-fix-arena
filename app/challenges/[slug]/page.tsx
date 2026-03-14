import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeEngagementPanel } from "@/components/challenges/challenge-engagement-panel";
import { RelatedChallengesList } from "@/components/challenges/related-challenges-list";
import { ChallengeSidebar } from "@/components/challenges/challenge-sidebar";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  buildChallengeCatalogHref,
  buildChallengeDetailHref,
  parseChallengeCatalogUrlState,
} from "@/lib/challenges/catalog-state";
import { getCurrentUser } from "@/lib/auth/session";
import { buildChallengeDetailViewModel } from "@/lib/challenges/view-models";
import { getChallengeBySlug, getChallengeDetailSnapshot } from "@/lib/data/catalog";
import { getChallengeEngagementForUser } from "@/lib/engagement/service";
import { formatRelativeDate } from "@/lib/utils";

type ChallengeDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ChallengeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    return {
      title: "Challenge Not Found",
    };
  }

  return {
    title: challenge.title,
    description: challenge.summary,
  };
}

function splitIntoParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function ChallengeDetailPage({
  params,
  searchParams,
}: ChallengeDetailPageProps) {
  const { slug } = await params;
  const detailSnapshot = await getChallengeDetailSnapshot(slug);

  if (!detailSnapshot) {
    notFound();
  }

  const { challenge, relatedChallenges } = detailSnapshot;

  const catalogState = parseChallengeCatalogUrlState(await searchParams);
  const [user, viewModel] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(buildChallengeDetailViewModel(challenge)),
  ]);
  const engagement = user
    ? await getChallengeEngagementForUser(user.id, challenge.id)
    : null;
  const backHref = buildChallengeCatalogHref(catalogState);
  const currentDetailHref = buildChallengeDetailHref(challenge.slug, catalogState);
  const relatedHrefBySlug = Object.fromEntries(
    relatedChallenges.map((relatedChallenge) => [
      relatedChallenge.slug,
      buildChallengeDetailHref(relatedChallenge.slug, catalogState),
    ]),
  );
  const issueContextParagraphs = splitIntoParagraphs(challenge.body);

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <header className="surface-card-strong relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
            >
              Back to Challenges
            </Link>
            <Badge tone={viewModel.sourceTone}>{viewModel.sourceLabel}</Badge>
            <Badge tone="accent">{viewModel.totalPointsLabel} total</Badge>
            <Badge>{viewModel.difficultyLabel}</Badge>
            <Badge>{challenge.repository.fullName}</Badge>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mono-label">Challenge Details</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {challenge.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                {challenge.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>{viewModel.issueLabel}</Badge>
                <Badge tone="accent">{viewModel.rewardBreakdownLabel}</Badge>
                <Badge tone="muted">{viewModel.languageLabel}</Badge>
                <Badge tone="muted">{viewModel.scoreTierLabel}</Badge>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.85)]">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                Issue Snapshot
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mono-label text-slate-400">Issue</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {viewModel.issueLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mono-label text-slate-400">Estimated</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {viewModel.estimatedMinutesLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mono-label text-slate-400">Scoring</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {viewModel.totalPointsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mono-label text-slate-400">Repository</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {challenge.repository.owner}/{challenge.repository.name}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                This page normalizes live GitHub issue data into a reviewable
                challenge brief, so you can decide quickly whether the scope,
                reward, and validation surface are worth taking on.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
          <article className="space-y-6">
            <div className="surface-card-strong p-8 md:p-10">
              <SectionHeading
                eyebrow="Issue Summary"
                title="What the maintainer is asking for."
                description="Start with the normalized brief below, then read the full context before deciding on a fix strategy."
              />
              <div className="mt-6 rounded-[1.75rem] border border-slate-900/10 bg-slate-950 px-6 py-5 text-slate-100">
                <p className="text-base leading-8 text-slate-100">
                  {challenge.summary}
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {issueContextParagraphs.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 20)}`}
                    className="text-base leading-8 text-slate-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="surface-card p-8">
                <p className="mono-label">Labels</p>
                {challenge.labels.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {challenge.labels.map((label) => (
                      <Badge key={label}>{label}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-7 text-slate-700">
                    No GitHub labels were returned for this issue in the current
                    feed.
                  </p>
                )}
              </section>
              <section className="surface-card p-8">
                <p className="mono-label">Suggested Skills / Language</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {viewModel.skillTags.map((tag) => (
                    <Badge key={tag} tone="accent">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  These skills are inferred from repository language, challenge
                  tags, and the current issue brief to keep the page consistent
                  even when GitHub metadata is thin.
                </p>
              </section>
            </div>

            <section className="surface-card-strong p-8 md:p-10">
              <SectionHeading
                eyebrow="How To Approach This Bug"
                title="Start with scope, then move to validation."
                description={viewModel.approachGuidance}
              />
              <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                {viewModel.approachSteps.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 font-mono text-xs text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="surface-card p-8">
              <SectionHeading
                eyebrow="Recent Activity"
                title="Signals from maintainers and other contributors."
                description="Recent thread movement can help you judge whether the issue is active, clarified, or likely to need follow-up questions."
              />
              {challenge.recentActivity.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {challenge.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-line bg-white/70 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-medium text-slate-900">
                          {activity.author}
                        </p>
                        <Badge tone="muted">{formatRelativeDate(activity.date)}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        {activity.action}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] border border-dashed border-line bg-white/60 p-6">
                  <p className="text-sm leading-7 text-slate-600">
                    No recent maintainer or contributor activity was available in
                    the current feed. Open the GitHub issue for the freshest
                    discussion context.
                  </p>
                </div>
              )}
            </section>

            <section className="surface-card p-8">
              <SectionHeading
                eyebrow="Related Issues"
                title={`More challenges from ${challenge.repository.fullName}.`}
                description="If this issue is not quite right, these nearby challenges help you stay in the same repository context."
              />
              <div className="mt-6">
                <RelatedChallengesList
                  challenges={relatedChallenges}
                  detailHrefBySlug={relatedHrefBySlug}
                />
              </div>
            </section>
          </article>

          <div className="space-y-6">
            <ChallengeEngagementPanel
              challenge={challenge}
              engagement={engagement}
              redirectTo={currentDetailHref}
              user={user}
            />
            <ChallengeSidebar challenge={challenge} />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
