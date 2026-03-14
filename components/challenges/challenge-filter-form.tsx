import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CHALLENGE_CATALOG_DEFAULT_SORT,
  CHALLENGE_CATALOG_SORTS,
  getChallengeCatalogSortMetadata,
  getChallengeDifficultyMetadata,
  getChallengeStatusMetadata,
} from "@/lib/config/challenges";
import type {
  ChallengeCatalogPagination,
  ChallengeCatalogSort,
  ChallengeCatalogFilters,
  ChallengeFilterOptions,
} from "@/types/domain";

type ChallengeFilterFormProps = {
  filters: ChallengeCatalogFilters;
  filterOptions: ChallengeFilterOptions;
  filteredChallenges: number;
  pagination: ChallengeCatalogPagination;
  sort: ChallengeCatalogSort;
  totalChallenges: number;
};

function hasActiveFilters(
  filters: ChallengeCatalogFilters,
  sort: ChallengeCatalogSort,
) {
  return Boolean(
    filters.query ||
      filters.language ||
      filters.difficulty ||
      filters.label ||
      filters.repository ||
      filters.status ||
      sort !== CHALLENGE_CATALOG_DEFAULT_SORT,
  );
}

export function ChallengeFilterForm({
  filters,
  filterOptions,
  filteredChallenges,
  pagination,
  sort,
  totalChallenges,
}: ChallengeFilterFormProps) {
  const showingCount =
    pagination.endIndex === 0
      ? 0
      : pagination.endIndex - pagination.startIndex + 1;

  return (
    <section className="surface-card p-6 md:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mono-label">Search And Filter</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Search by issue, repository, or keyword and refine the feed.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Showing {showingCount} challenge{showingCount === 1 ? "" : "s"} on
            this page, {filteredChallenges} matching challenge
            {filteredChallenges === 1 ? "" : "s"} overall, and {totalChallenges} in
            the current source feed.
          </p>
        </div>
        {hasActiveFilters(filters, sort) ? (
          <Link
            href="/challenges"
            className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Clear All Filters
          </Link>
        ) : null}
      </div>

      <form className="mt-6 space-y-4">
        <input type="hidden" name="page" value="1" />
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <label className="space-y-2">
            <span className="mono-label">Search</span>
            <input
              type="search"
              name="query"
              defaultValue={filters.query ?? ""}
              placeholder="Search titles, repos, labels, or keywords"
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
            />
          </label>
          <label className="space-y-2">
            <span className="mono-label">Sort</span>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
            >
              {CHALLENGE_CATALOG_SORTS.map((sortOption) => (
                <option key={sortOption} value={sortOption}>
                  {getChallengeCatalogSortMetadata(sortOption).label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2">
          <span className="mono-label">Language</span>
          <select
            name="language"
            defaultValue={filters.language ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All languages</option>
            {filterOptions.languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="mono-label">Repository</span>
          <select
            name="repository"
            defaultValue={filters.repository ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All repositories</option>
            {filterOptions.repositories.map((repository) => (
              <option key={repository} value={repository}>
                {repository}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="mono-label">Difficulty</span>
          <select
            name="difficulty"
            defaultValue={filters.difficulty ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All difficulty levels</option>
            {filterOptions.difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {getChallengeDifficultyMetadata(difficulty).label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="mono-label">GitHub label</span>
          <select
            name="label"
            defaultValue={filters.label ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All labels</option>
            {filterOptions.labels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="mono-label">State</span>
          <select
            name="status"
            defaultValue={filters.status ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All states</option>
            {filterOptions.statuses.map((status) => (
              <option key={status} value={status}>
                {getChallengeStatusMetadata(status).label}
              </option>
            ))}
          </select>
        </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {hasActiveFilters(filters, sort) ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.query ? <Badge tone="accent">search: {filters.query}</Badge> : null}
          {filters.language ? <Badge tone="accent">{filters.language}</Badge> : null}
          {filters.repository ? (
            <Badge tone="accent">{filters.repository}</Badge>
          ) : null}
          {filters.difficulty ? (
            <Badge tone="accent">
              {getChallengeDifficultyMetadata(filters.difficulty).label}
            </Badge>
          ) : null}
          {filters.label ? <Badge tone="accent">{filters.label}</Badge> : null}
          {filters.status ? (
            <Badge tone="accent">
              {getChallengeStatusMetadata(filters.status).label}
            </Badge>
          ) : null}
          {sort !== CHALLENGE_CATALOG_DEFAULT_SORT ? (
            <Badge tone="accent">
              sort: {getChallengeCatalogSortMetadata(sort).label}
            </Badge>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
