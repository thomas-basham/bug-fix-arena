import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type {
  ChallengeCatalogFilters,
  ChallengeFilterOptions,
} from "@/types/domain";

type ChallengeFilterFormProps = {
  filters: ChallengeCatalogFilters;
  filterOptions: ChallengeFilterOptions;
  filteredChallenges: number;
  totalChallenges: number;
};

function hasActiveFilters(filters: ChallengeCatalogFilters) {
  return Boolean(filters.language || filters.difficulty || filters.label);
}

export function ChallengeFilterForm({
  filters,
  filterOptions,
  filteredChallenges,
  totalChallenges,
}: ChallengeFilterFormProps) {
  return (
    <section className="surface-card p-6 md:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mono-label">Filter Challenges</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Narrow the arena by language, difficulty, or issue label.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Showing {filteredChallenges} of {totalChallenges} challenge
            {totalChallenges === 1 ? "" : "s"} in the current catalog.
          </p>
        </div>
        {hasActiveFilters(filters) ? (
          <Link
            href="/challenges"
            className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Clear All Filters
          </Link>
        ) : null}
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-4">
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
          <span className="mono-label">Difficulty</span>
          <select
            name="difficulty"
            defaultValue={filters.difficulty ?? "all"}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
          >
            <option value="all">All difficulty levels</option>
            {filterOptions.difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="mono-label">Label</span>
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
        <button
          type="submit"
          className="inline-flex items-center justify-center self-end rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Apply Filters
        </button>
      </form>

      {hasActiveFilters(filters) ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.language ? <Badge tone="accent">{filters.language}</Badge> : null}
          {filters.difficulty ? (
            <Badge tone="accent">{filters.difficulty}</Badge>
          ) : null}
          {filters.label ? <Badge tone="accent">{filters.label}</Badge> : null}
        </div>
      ) : null}
    </section>
  );
}
