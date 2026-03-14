import Link from "next/link";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ChallengeFilterForm } from "@/components/challenges/challenge-filter-form";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBanner } from "@/components/ui/status-banner";
import { getChallengeCatalog } from "@/lib/data/catalog";
import { getSearchParamValue } from "@/lib/utils";
import type { ChallengeDifficulty } from "@/types/domain";

export const metadata = {
  title: "Browse Challenges",
};

type ChallengesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ChallengesPage({
  searchParams,
}: ChallengesPageProps) {
  const resolvedSearchParams = await searchParams;
  const catalog = await getChallengeCatalog({
    filters: {
      language: getSearchParamValue(resolvedSearchParams.language),
      difficulty: getSearchParamValue(
        resolvedSearchParams.difficulty,
      ) as ChallengeDifficulty | undefined,
      label: getSearchParamValue(resolvedSearchParams.label),
    },
  });
  const { challenges, labels, source, notice } = catalog;

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="surface-card-strong p-8 md:p-10">
          <SectionHeading
            eyebrow="Challenge Catalog"
            title="Browse real-world issues shaped into structured starter challenges."
            description="This MVP keeps discovery intentionally simple and server-rendered: filter by language, difficulty, and issue label, then open a challenge to inspect the workflow brief."
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge tone={source === "github" ? "success" : "warning"}>
              {source === "github" ? "Live GitHub feed" : "Mock fallback feed"}
            </Badge>
            {labels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
            <Link
              href="/dashboard"
              className="ml-auto inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>

        {notice ? <div className="mt-6"><StatusBanner notice={notice} /></div> : null}

        <div className="mt-6">
          <ChallengeFilterForm
            filters={catalog.filters}
            filterOptions={catalog.filterOptions}
            filteredChallenges={catalog.filteredChallenges}
            totalChallenges={catalog.totalChallenges}
          />
        </div>

        <section className="mt-10">
          {challenges.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="No Matching Challenges"
              title="No issues match the current filter combination."
              description="Try clearing one filter at a time or return to the full catalog. The seeded dataset is intentionally diverse enough to support language, difficulty, and label-based exploration."
              action={
                <Link
                  href="/challenges"
                  className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Reset Filters
                </Link>
              }
            />
          )}
        </section>
      </PageContainer>
    </AppShell>
  );
}
