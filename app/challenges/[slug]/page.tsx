import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeSidebar } from "@/components/challenges/challenge-sidebar";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import {
  buildChallengeCatalogHref,
  parseChallengeCatalogUrlState,
} from "@/lib/challenges/catalog-state";
import { buildChallengeViewModel } from "@/lib/challenges/view-models";
import { getChallengeBySlug } from "@/lib/data/catalog";
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

export default async function ChallengeDetailPage({
  params,
  searchParams,
}: ChallengeDetailPageProps) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  const viewModel = buildChallengeViewModel(challenge);
  const backHref = buildChallengeCatalogHref(
    parseChallengeCatalogUrlState(await searchParams),
  );

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Back to Challenges
          </Link>
          <Badge tone={viewModel.sourceTone}>{viewModel.sourceLabel}</Badge>
          <Badge>{challenge.repository.fullName}</Badge>
        </div>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-6">
            <div className="surface-card-strong p-8 md:p-10">
              <p className="mono-label">
                Issue {viewModel.issueLabel} · {viewModel.difficultyLabel}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                {challenge.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                {challenge.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {challenge.labels.map((label) => (
                  <Badge key={label}>{label}</Badge>
                ))}
                {challenge.techStack.map((tag) => (
                  <Badge key={tag} tone="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="surface-card p-8">
              <p className="mono-label">Issue Context</p>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {challenge.body}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="surface-card p-8">
                <p className="mono-label">Acceptance Criteria</p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  {challenge.acceptanceCriteria.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="surface-card p-8">
                <p className="mono-label">Learning Outcomes</p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  {challenge.learningOutcomes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-signal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="surface-card p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mono-label">Recent Activity</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    Signals from maintainers and other contributors.
                  </h2>
                </div>
                <a
                  href={challenge.issueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
                >
                  Open Original Issue
                </a>
              </div>
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
            </section>
          </article>

          <ChallengeSidebar challenge={challenge} />
        </section>
      </PageContainer>
    </AppShell>
  );
}
