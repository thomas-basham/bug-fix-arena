import {
  mockChallenges,
  mockRepositories,
  mockScores,
  mockSubmissions,
  mockUsers,
} from "@/lib/data/mock-data";
import { DEFAULT_GITHUB_LABELS } from "@/lib/github/constants";
import { fetchGitHubChallenges } from "@/lib/github/service";
import type {
  ChallengeCatalogFilters,
  ChallengeCatalogNotice,
  ChallengeCatalogResult,
  ChallengeDifficulty,
  ChallengeFilterOptions,
  ChallengeRecord,
  DashboardSnapshot,
} from "@/types/domain";

type GetChallengeCatalogOptions = {
  limit?: number;
  filters?: ChallengeCatalogFilters;
};

const difficultyOrder: ChallengeDifficulty[] = ["beginner", "intermediate"];

function normalizeFilterValue(value?: string) {
  if (!value || value === "all") {
    return undefined;
  }

  return value;
}

function buildFilterOptions(challenges: ChallengeRecord[]): ChallengeFilterOptions {
  return {
    languages: Array.from(
      new Set(challenges.map((challenge) => challenge.repository.language)),
    ).sort((a, b) => a.localeCompare(b)),
    difficulties: difficultyOrder.filter((difficulty) =>
      challenges.some((challenge) => challenge.difficulty === difficulty),
    ),
    labels: Array.from(
      new Set(challenges.flatMap((challenge) => challenge.labels)),
    ).sort((a, b) => a.localeCompare(b)),
  };
}

function applyFilters(
  challenges: ChallengeRecord[],
  filters: ChallengeCatalogFilters,
) {
  return challenges.filter((challenge) => {
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

    return true;
  });
}

function buildNotice(
  status: "ok" | "unconfigured" | "error",
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

  return {
    tone: "warning",
    title: "Using fallback catalog",
    message:
      message ??
      "Live GitHub issue loading is temporarily unavailable, so the app is showing seeded sample challenges.",
  };
}

function sortChallenges(challenges: ChallengeRecord[]) {
  return [...challenges].sort((left, right) => {
    if (right.points !== left.points) {
      return right.points - left.points;
    }

    if (right.repository.stars !== left.repository.stars) {
      return right.repository.stars - left.repository.stars;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getChallengeCatalog({
  limit,
  filters = {},
}: GetChallengeCatalogOptions = {}): Promise<ChallengeCatalogResult> {
  const githubResult = await fetchGitHubChallenges({
    labels: DEFAULT_GITHUB_LABELS,
    limit: Math.max(limit ?? mockChallenges.length, mockChallenges.length),
  });

  const baseChallenges =
    githubResult.challenges.length > 0 ? githubResult.challenges : mockChallenges;
  const normalizedFilters: ChallengeCatalogFilters = {
    language: normalizeFilterValue(filters.language),
    difficulty: normalizeFilterValue(filters.difficulty) as
      | ChallengeDifficulty
      | undefined,
    label: normalizeFilterValue(filters.label),
  };
  const sortedChallenges = sortChallenges(baseChallenges);
  const filteredChallenges = applyFilters(sortedChallenges, normalizedFilters);
  const challenges =
    typeof limit === "number"
      ? filteredChallenges.slice(0, limit)
      : filteredChallenges;

  return {
    source: githubResult.challenges.length > 0 ? "github" : "mock",
    labels: DEFAULT_GITHUB_LABELS,
    challenges,
    totalChallenges: sortedChallenges.length,
    filteredChallenges: filteredChallenges.length,
    filters: normalizedFilters,
    filterOptions: buildFilterOptions(sortedChallenges),
    notice: buildNotice(githubResult.status, githubResult.message),
  };
}

export async function getFeaturedChallenges(limit = 3) {
  return getChallengeCatalog({ limit });
}

export async function getRecommendedChallenges(limit = 2) {
  return getChallengeCatalog({ limit });
}

export async function getChallengeBySlug(
  slug: string,
): Promise<ChallengeRecord | null> {
  const liveCatalog = await getChallengeCatalog({ limit: 20 });
  const liveMatch = liveCatalog.challenges.find(
    (challenge) => challenge.slug === slug,
  );

  if (liveMatch) {
    return liveMatch;
  }

  return mockChallenges.find((challenge) => challenge.slug === slug) ?? null;
}

export function getDashboardSnapshot(): DashboardSnapshot {
  return {
    user: mockUsers[0],
    score: mockScores[0],
    submissions: mockSubmissions,
  };
}

export function getPlatformOverview() {
  return {
    totalRepositories: mockRepositories.length,
    totalChallenges: mockChallenges.length,
    totalSubmissions: mockSubmissions.length,
    totalPoints: mockChallenges.reduce(
      (sum, challenge) => sum + challenge.points,
      0,
    ),
  };
}
