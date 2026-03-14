import Link from "next/link";
import { ChallengeGrid } from "@/components/challenges/challenge-grid";
import { ChallengeFilterForm } from "@/components/challenges/challenge-filter-form";
import { ChallengePagination } from "@/components/challenges/challenge-pagination";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBanner } from "@/components/ui/status-banner";
import {
  CHALLENGE_CATALOG_PAGE_SIZE,
  getChallengeSourceMetadata,
} from "@/lib/config/challenges";
import {
  buildChallengeCatalogHref,
  buildChallengeDetailHref,
  parseChallengeCatalogUrlState,
} from "@/lib/challenges/catalog-state";
import { getChallengeCatalog } from "@/lib/data/catalog";

export const metadata = {
  title: "Browse Challenges",
};

type ChallengesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const adjustedStartPage = Math.max(1, endPage - 4);

  return Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, index) => adjustedStartPage + index,
  );
}

export default async function ChallengesPage({
  searchParams,
}: ChallengesPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlState = parseChallengeCatalogUrlState(resolvedSearchParams);
  const catalog = await getChallengeCatalog({
    filters: urlState.filters,
    page: urlState.page,
    pageSize: CHALLENGE_CATALOG_PAGE_SIZE,
    sort: urlState.sort,
  });
  const { challenges, discoveryLabels, notice, pagination, source } = catalog;
  const sourceMetadata = getChallengeSourceMetadata(source);
  const activeUrlState = {
    filters: catalog.filters,
    page: pagination.currentPage,
    sort: catalog.sort,
  };
  const pageLinks = getVisiblePageNumbers(
    pagination.currentPage,
    pagination.totalPages,
  ).map((pageNumber) => ({
    href: buildChallengeCatalogHref(activeUrlState, {
      page: pageNumber,
    }),
    isCurrent: pageNumber === pagination.currentPage,
    page: pageNumber,
  }));
  const detailHrefBySlug = Object.fromEntries(
    challenges.map((challenge) => [
      challenge.slug,
      buildChallengeDetailHref(challenge.slug, activeUrlState),
    ]),
  );

  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="surface-card-strong p-8 md:p-10">
          <SectionHeading
            eyebrow="Challenge Catalog"
            title="Browse real-world issues shaped into structured starter challenges."
            description="Search by keyword, filter by repository or issue shape, sort the feed, and share the exact catalog view through the URL."
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge tone={sourceMetadata.badgeTone}>
              {sourceMetadata.label}
            </Badge>
            {discoveryLabels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
            <Link
              href="/dashboard"
              className="button-secondary-sm ml-auto"
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
            pagination={catalog.pagination}
            sort={catalog.sort}
            totalChallenges={catalog.totalChallenges}
          />
        </div>

        <section className="mt-10">
          <ChallengeGrid
            challenges={challenges}
            detailHrefBySlug={detailHrefBySlug}
            emptyState={{
              eyebrow: "No Matching Challenges",
              title: "No issues match the current filter combination.",
              description:
                "Try clearing one filter at a time or return to the full catalog. The seeded dataset is intentionally diverse enough to support language, difficulty, and label-based exploration.",
              action: (
                <Link
                  href="/challenges"
                  className="button-primary"
                >
                  Reset Filters
                </Link>
              ),
            }}
            footer={
              <ChallengePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                previousHref={
                  pagination.hasPreviousPage
                    ? buildChallengeCatalogHref(activeUrlState, {
                        page: pagination.currentPage - 1,
                      })
                    : undefined
                }
                nextHref={
                  pagination.hasNextPage
                    ? buildChallengeCatalogHref(activeUrlState, {
                        page: pagination.currentPage + 1,
                      })
                    : undefined
                }
                pageLinks={pageLinks}
              />
            }
          />
        </section>
      </PageContainer>
    </AppShell>
  );
}
