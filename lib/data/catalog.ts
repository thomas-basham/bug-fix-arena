import {
  normalizeChallengeRecord,
} from "@/lib/challenges/normalize";
import {
  CHALLENGE_CATALOG_DEFAULT_SORT,
  CHALLENGE_CATALOG_PAGE_SIZE,
  CHALLENGE_DIFFICULTIES,
  CHALLENGE_STATUSES,
  isChallengeCatalogSort,
  isChallengeDifficulty,
  isChallengeStatus,
} from "@/lib/config/challenges";
import {
  mockChallenges,
  mockChallengeEngagements,
  mockRepositories,
  mockSubmissions,
} from "@/lib/data/mock-data";
import { DEFAULT_GITHUB_LABELS } from "@/lib/github/constants";
import { fetchGitHubChallenges } from "@/lib/github/service";
import {
  getPersistedGitHubChallengeBySlug,
  getPersistedGitHubChallenges,
  getPersistedRelatedGitHubChallenges,
} from "@/lib/sync/service";
import type {
  ChallengeDetailSnapshot,
  ChallengeCatalogFilters,
  ChallengeCatalogNotice,
  ChallengeCatalogResult,
  ChallengeCatalogSort,
  ChallengeFilterOptions,
  ChallengeRecord,
  ChallengeStatus,
} from "@/types/domain";

type GetChallengeCatalogOptions = {
  filters?: ChallengeCatalogFilters;
  limit?: number;
  page?: number;
  pageSize?: number;
  sort?: ChallengeCatalogSort;
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

function buildFilterOptions(challenges: ChallengeRecord[]): ChallengeFilterOptions {
  return {
    languages: Array.from(
      new Set(challenges.map((challenge) => challenge.repository.language)),
    ).sort((a, b) => a.localeCompare(b)),
    difficulties: CHALLENGE_DIFFICULTIES.filter((difficulty) =>
      challenges.some((challenge) => challenge.difficulty === difficulty),
    ),
    labels: Array.from(
      new Set(challenges.flatMap((challenge) => challenge.labels)),
    ).sort((a, b) => a.localeCompare(b)),
    repositories: Array.from(
      new Set(challenges.map((challenge) => challenge.repository.fullName)),
    ).sort((a, b) => a.localeCompare(b)),
    statuses: CHALLENGE_STATUSES.filter((status) =>
      challenges.some((challenge) => challenge.status === status),
    ) as ChallengeStatus[],
  };
}

function buildChallengeSearchIndex(challenge: ChallengeRecord) {
  return [
    challenge.title,
    challenge.summary,
    challenge.body,
    challenge.repository.name,
    challenge.repository.fullName,
    challenge.repository.owner,
    challenge.repository.description,
    ...challenge.labels,
    ...challenge.techStack,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesSearchQuery(challenge: ChallengeRecord, query?: string) {
  if (!query) {
    return true;
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const searchIndex = buildChallengeSearchIndex(challenge);
  return terms.every((term) => searchIndex.includes(term));
}

function applyFilters(
  challenges: ChallengeRecord[],
  filters: ChallengeCatalogFilters,
) {
  return challenges.filter((challenge) => {
    if (!matchesSearchQuery(challenge, filters.query)) {
      return false;
    }

    if (
      filters.language &&
      challenge.repository.language !== filters.language
    ) {
      return false;
    }

    if (filters.difficulty && challenge.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.label && !challenge.labels.includes(filters.label)) {
      return false;
    }

    if (
      filters.repository &&
      challenge.repository.fullName !== filters.repository
    ) {
      return false;
    }

    if (filters.status && challenge.status !== filters.status) {
      return false;
    }

    return true;
  });
}

function buildNotice(
  status: "ok" | "unconfigured" | "rate_limited" | "error",
  message?: string,
): ChallengeCatalogNotice | undefined {
  if (status === "ok" && !message) {
    return undefined;
  }

  if (status === "unconfigured") {
    return {
      tone: "muted",
      title: "Sample catalog active",
      message:
        message ??
        "GitHub is not configured, so the app is showing the seeded challenge catalog.",
    };
  }

  if (status === "rate_limited") {
    return {
      tone: "warning",
      title: "GitHub rate limit reached",
      message:
        message ??
        "GitHub is temporarily rate limiting live requests, so the app is showing the seeded challenge catalog instead.",
    };
  }

  return {
    tone: "warning",
    title: "Using fallback catalog",
    message:
      message ??
      "Live GitHub issue loading is temporarily unavailable, so the app is showing seeded sample challenges.",
  };
}

const difficultyRank = Object.fromEntries(
  CHALLENGE_DIFFICULTIES.map((difficulty, index) => [difficulty, index]),
) as Record<(typeof CHALLENGE_DIFFICULTIES)[number], number>;

function sortChallenges(
  challenges: ChallengeRecord[],
  sort: ChallengeCatalogSort,
) {
  return [...challenges].sort((left, right) => {
    const leftOpenedAt = new Date(left.openedAt).getTime();
    const rightOpenedAt = new Date(right.openedAt).getTime();

    if (sort === "newest") {
      if (rightOpenedAt !== leftOpenedAt) {
        return rightOpenedAt - leftOpenedAt;
      }
    }

    if (sort === "oldest") {
      if (leftOpenedAt !== rightOpenedAt) {
        return leftOpenedAt - rightOpenedAt;
      }
    }

    if (sort === "easiest") {
      if (difficultyRank[left.difficulty] !== difficultyRank[right.difficulty]) {
        return difficultyRank[left.difficulty] - difficultyRank[right.difficulty];
      }

      if (left.estimatedMinutes !== right.estimatedMinutes) {
        return left.estimatedMinutes - right.estimatedMinutes;
      }

      if (left.points !== right.points) {
        return left.points - right.points;
      }
    }

    if (sort === "highest-reward") {
      if (right.points !== left.points) {
        return right.points - left.points;
      }

      if (left.estimatedMinutes !== right.estimatedMinutes) {
        return left.estimatedMinutes - right.estimatedMinutes;
      }
    }

    if (sort !== "highest-reward" && right.points !== left.points) {
      return right.points - left.points;
    }

    if (right.updatedAt !== left.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    if (right.repository.stars !== left.repository.stars) {
      return right.repository.stars - left.repository.stars;
    }

    return left.title.localeCompare(right.title);
  });
}

function paginateChallenges(
  challenges: ChallengeRecord[],
  page: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(challenges.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedChallenges = challenges.slice(start, start + pageSize);

  return {
    challenges: paginatedChallenges,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: challenges.length === 0 ? 0 : start + 1,
      endIndex:
        challenges.length === 0 ? 0 : start + paginatedChallenges.length,
    },
  };
}

export async function getChallengeCatalog({
  filters = {},
  limit,
  page = 1,
  pageSize = CHALLENGE_CATALOG_PAGE_SIZE,
  sort = CHALLENGE_CATALOG_DEFAULT_SORT,
}: GetChallengeCatalogOptions = {}): Promise<ChallengeCatalogResult> {
  const fetchLimit = Math.max(limit ?? 0, mockChallenges.length, page * pageSize, 24);
  const persistedChallenges = await getPersistedGitHubChallenges();
  // Synced database records are the most stable source for shared challenge URLs.
  const githubResult =
    persistedChallenges.length === 0
      ? await fetchGitHubChallenges({
          labels: DEFAULT_GITHUB_LABELS,
          limit: fetchLimit,
        })
      : null;

  const baseChallenges = (
    persistedChallenges.length > 0
      ? persistedChallenges
      : githubResult && githubResult.challenges.length > 0
        ? githubResult.challenges
        : mockChallenges
  ).map(normalizeChallengeRecord);
  const query = normalizeTextValue(filters.query);
  const difficultyFilter = normalizeSelectValue(filters.difficulty);
  const statusFilter = normalizeSelectValue(filters.status);
  const normalizedSort = isChallengeCatalogSort(sort) ? sort : CHALLENGE_CATALOG_DEFAULT_SORT;
  const normalizedFilters: ChallengeCatalogFilters = {
    query,
    language: normalizeSelectValue(filters.language),
    difficulty: isChallengeDifficulty(difficultyFilter)
      ? difficultyFilter
      : undefined,
    label: normalizeSelectValue(filters.label),
    repository: normalizeSelectValue(filters.repository),
    status: isChallengeStatus(statusFilter) ? statusFilter : undefined,
  };
  const filterOptions = buildFilterOptions(baseChallenges);
  const filteredChallenges = applyFilters(baseChallenges, normalizedFilters);
  const sortedChallenges = sortChallenges(filteredChallenges, normalizedSort);
  const paginatedChallenges = paginateChallenges(sortedChallenges, page, pageSize);
  const challenges = typeof limit === "number"
    ? paginatedChallenges.challenges.slice(0, limit)
    : paginatedChallenges.challenges;

  return {
    source:
      persistedChallenges.length > 0 ||
      (githubResult ? githubResult.challenges.length > 0 : false)
        ? "github"
        : "mock",
    discoveryLabels: DEFAULT_GITHUB_LABELS,
    challenges,
    totalChallenges: baseChallenges.length,
    filteredChallenges: filteredChallenges.length,
    filters: normalizedFilters,
    sort: normalizedSort,
    filterOptions,
    pagination: paginatedChallenges.pagination,
    notice:
      persistedChallenges.length > 0 || !githubResult
        ? undefined
        : buildNotice(githubResult.status, githubResult.message),
  };
}

export async function getFeaturedChallenges(limit = 3) {
  return getChallengeCatalog({ limit, pageSize: limit, sort: "highest-reward" });
}

export async function getRecommendedChallenges(limit = 2) {
  return getChallengeCatalog({ limit, pageSize: limit, sort: "highest-reward" });
}

export async function getChallengeBySlug(
  slug: string,
): Promise<ChallengeRecord | null> {
  const detailSnapshot = await getChallengeDetailSnapshot(slug);

  return detailSnapshot?.challenge ?? null;
}

export async function getChallengeDetailSnapshot(
  slug: string,
  relatedLimit = 3,
): Promise<ChallengeDetailSnapshot | null> {
  const persistedChallenge = await getPersistedGitHubChallengeBySlug(slug);

  if (persistedChallenge) {
    const relatedChallenges = await getPersistedRelatedGitHubChallenges(
      persistedChallenge.repositoryId,
      persistedChallenge.id,
      relatedLimit,
    );

    return {
      challenge: persistedChallenge,
      relatedChallenges,
    };
  }

  const lookupLimit = CHALLENGE_CATALOG_PAGE_SIZE * 8;
  const liveCatalog = await getChallengeCatalog({
    limit: lookupLimit,
    pageSize: lookupLimit,
  });
  const liveMatch = liveCatalog.challenges.find((challenge) => challenge.slug === slug);

  if (liveMatch) {
    const relatedChallenges = liveCatalog.challenges
      .filter(
        (challenge) =>
          challenge.slug !== liveMatch.slug &&
          challenge.repository.fullName === liveMatch.repository.fullName,
      )
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, relatedLimit);

    return {
      challenge: liveMatch,
      relatedChallenges,
    };
  }

  const fallbackChallenge = mockChallenges
    .map(normalizeChallengeRecord)
    .find((challenge) => challenge.slug === slug);

  if (!fallbackChallenge) {
    return null;
  }

  const relatedChallenges = mockChallenges
    .map(normalizeChallengeRecord)
    .filter(
      (challenge) =>
        challenge.slug !== fallbackChallenge.slug &&
        challenge.repository.fullName === fallbackChallenge.repository.fullName,
    )
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, relatedLimit);

  return {
    challenge: fallbackChallenge,
    relatedChallenges,
  };
}

export function getPlatformOverview() {
  return {
    totalRepositories: mockRepositories.length,
    totalChallenges: mockChallenges.length,
    totalEngagements: mockChallengeEngagements.length,
    totalSubmissions: mockSubmissions.length,
    totalPoints: mockChallenges.reduce(
      (sum, challenge) => sum + challenge.points,
      0,
    ),
  };
}
