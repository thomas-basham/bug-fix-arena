import {
  CHALLENGE_CATALOG_DEFAULT_SORT,
  isChallengeCatalogSort,
  isChallengeDifficulty,
  isChallengeStatus,
} from "@/lib/config/challenges";
import {
  buildPathWithQuery,
  getSearchParamValue,
  parsePositiveInteger,
} from "@/lib/utils";
import type {
  ChallengeCatalogFilters,
  ChallengeCatalogSort,
} from "@/types/domain";

export type ChallengeCatalogSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type ChallengeCatalogUrlState = {
  filters: ChallengeCatalogFilters;
  page: number;
  sort: ChallengeCatalogSort;
};

function normalizeTextValue(value?: string) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return undefined;
  }

  return normalizedValue;
}

function normalizeSelectValue(value?: string) {
  const normalizedValue = normalizeTextValue(value);

  if (!normalizedValue || normalizedValue === "all") {
    return undefined;
  }

  return normalizedValue;
}

export function parseChallengeCatalogUrlState(
  searchParams: ChallengeCatalogSearchParams,
): ChallengeCatalogUrlState {
  const difficulty = normalizeSelectValue(
    getSearchParamValue(searchParams.difficulty),
  );
  const status = normalizeSelectValue(getSearchParamValue(searchParams.status));
  const sort = normalizeSelectValue(getSearchParamValue(searchParams.sort));

  return {
    filters: {
      query: normalizeTextValue(getSearchParamValue(searchParams.query)),
      language: normalizeSelectValue(getSearchParamValue(searchParams.language)),
      difficulty: isChallengeDifficulty(difficulty) ? difficulty : undefined,
      label: normalizeSelectValue(getSearchParamValue(searchParams.label)),
      repository: normalizeSelectValue(
        getSearchParamValue(searchParams.repository),
      ),
      status: isChallengeStatus(status) ? status : undefined,
    },
    page: parsePositiveInteger(getSearchParamValue(searchParams.page), 1),
    sort: isChallengeCatalogSort(sort)
      ? sort
      : CHALLENGE_CATALOG_DEFAULT_SORT,
  };
}

function toChallengeCatalogQuery(
  state: ChallengeCatalogUrlState,
  overrides?: Partial<ChallengeCatalogUrlState>,
) {
  const nextFilters = {
    ...state.filters,
    ...overrides?.filters,
  };
  const nextSort = overrides?.sort ?? state.sort;
  const nextPage = overrides?.page ?? state.page;

  return {
    query: nextFilters.query,
    language: nextFilters.language,
    difficulty: nextFilters.difficulty,
    label: nextFilters.label,
    repository: nextFilters.repository,
    status: nextFilters.status,
    sort:
      nextSort === CHALLENGE_CATALOG_DEFAULT_SORT ? undefined : nextSort,
    page: nextPage > 1 ? nextPage : undefined,
  };
}

export function buildChallengeCatalogHref(
  state: ChallengeCatalogUrlState,
  overrides?: Partial<ChallengeCatalogUrlState>,
) {
  return buildPathWithQuery("/challenges", toChallengeCatalogQuery(state, overrides));
}

export function buildChallengeDetailHref(
  slug: string,
  state: ChallengeCatalogUrlState,
) {
  return buildPathWithQuery(
    `/challenges/${slug}`,
    toChallengeCatalogQuery(state, undefined),
  );
}
