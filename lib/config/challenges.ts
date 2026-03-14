export const CHALLENGE_DISCOVERY_LABELS = [
  "good first issue",
  "help wanted",
] as const;

export type ChallengeDiscoveryLabel =
  (typeof CHALLENGE_DISCOVERY_LABELS)[number];

export const CHALLENGE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type ChallengeDifficulty = (typeof CHALLENGE_DIFFICULTIES)[number];

export const CHALLENGE_STATUSES = [
  "open",
  "review",
  "archived",
] as const;

export type ChallengeStatusValue = (typeof CHALLENGE_STATUSES)[number];

export const CHALLENGE_CATALOG_SORTS = [
  "newest",
  "oldest",
  "easiest",
  "highest-reward",
] as const;

export type ChallengeCatalogSort = (typeof CHALLENGE_CATALOG_SORTS)[number];

export const CHALLENGE_CATALOG_DEFAULT_SORT: ChallengeCatalogSort = "newest";
export const CHALLENGE_CATALOG_PAGE_SIZE = 6;

type ChallengeDifficultyMetadata = {
  label: string;
  description: string;
  defaultEstimatedMinutes: number;
  rewardPoints: number;
  completionPoints: number;
  scoreTierLabel: "Easy" | "Medium" | "Hard";
};

export const CHALLENGE_DIFFICULTY_METADATA = {
  beginner: {
    label: "Beginner",
    description: "Clear scope with a smaller validation surface.",
    defaultEstimatedMinutes: 60,
    rewardPoints: 80,
    completionPoints: 20,
    scoreTierLabel: "Easy",
  },
  intermediate: {
    label: "Intermediate",
    description: "Needs more repo context and regression planning.",
    defaultEstimatedMinutes: 90,
    rewardPoints: 120,
    completionPoints: 30,
    scoreTierLabel: "Medium",
  },
  advanced: {
    label: "Advanced",
    description: "Requires deeper repo context and a wider validation surface.",
    defaultEstimatedMinutes: 120,
    rewardPoints: 170,
    completionPoints: 40,
    scoreTierLabel: "Hard",
  },
} as const satisfies Record<ChallengeDifficulty, ChallengeDifficultyMetadata>;

type ChallengeStatusMetadata = {
  label: string;
};

export const CHALLENGE_STATUS_METADATA = {
  open: {
    label: "Open",
  },
  review: {
    label: "In Review",
  },
  archived: {
    label: "Archived",
  },
} as const satisfies Record<ChallengeStatusValue, ChallengeStatusMetadata>;

type ChallengeCatalogSortMetadata = {
  label: string;
};

export const CHALLENGE_CATALOG_SORT_METADATA = {
  newest: {
    label: "Newest",
  },
  oldest: {
    label: "Oldest",
  },
  easiest: {
    label: "Easiest",
  },
  "highest-reward": {
    label: "Highest reward",
  },
} as const satisfies Record<ChallengeCatalogSort, ChallengeCatalogSortMetadata>;

type ChallengeSourceMetadata = {
  label: string;
  description: string;
  badgeTone: "success" | "warning";
};

export const CHALLENGE_SOURCE_METADATA = {
  github: {
    label: "GitHub Live",
    description: "Live GitHub issue feed",
    badgeTone: "success",
  },
  mock: {
    label: "Mock Fallback",
    description: "Seeded challenge catalog",
    badgeTone: "warning",
  },
} as const satisfies Record<"github" | "mock", ChallengeSourceMetadata>;

type SubmissionStatusMetadata = {
  label: string;
  badgeTone: "muted" | "accent" | "success" | "warning";
};

type ChallengeEngagementStatusMetadata = {
  label: string;
  badgeTone: "muted" | "accent" | "success";
};

export const SUBMISSION_STATUS_METADATA = {
  draft: {
    label: "Draft",
    badgeTone: "muted",
  },
  submitted: {
    label: "Submitted",
    badgeTone: "accent",
  },
  accepted: {
    label: "Accepted",
    badgeTone: "success",
  },
  rejected: {
    label: "Rejected",
    badgeTone: "warning",
  },
} as const satisfies Record<
  "draft" | "submitted" | "accepted" | "rejected",
  SubmissionStatusMetadata
>;

export const CHALLENGE_ENGAGEMENT_STATUS_METADATA = {
  saved: {
    label: "Saved",
    badgeTone: "muted",
  },
  started: {
    label: "Started",
    badgeTone: "accent",
  },
  completed: {
    label: "Completed",
    badgeTone: "success",
  },
} as const satisfies Record<
  "saved" | "started" | "completed",
  ChallengeEngagementStatusMetadata
>;

export const CHALLENGE_LANGUAGE_METADATA = {
  TypeScript: {
    label: "TypeScript",
    shortLabel: "TS",
  },
  JavaScript: {
    label: "JavaScript",
    shortLabel: "JS",
  },
  Python: {
    label: "Python",
    shortLabel: "PY",
  },
  Rust: {
    label: "Rust",
    shortLabel: "RS",
  },
  Go: {
    label: "Go",
    shortLabel: "GO",
  },
  Unknown: {
    label: "Unknown",
    shortLabel: "N/A",
  },
} as const;

const CHALLENGE_LANGUAGE_ALIASES: Record<
  string,
  keyof typeof CHALLENGE_LANGUAGE_METADATA
> = {
  go: "Go",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  typescript: "TypeScript",
  unknown: "Unknown",
};

export const SCORE_DEFAULTS = {
  totalPoints: 0,
  currentStreak: 0,
  completedChallenges: 0,
  rankLabel: "Arena Rookie",
} as const;

export const SCORE_STREAK_SETTINGS = {
  enabled: false,
  placeholderValue: 0,
} as const;

export const SCORE_RANK_THRESHOLDS = [
  {
    label: "Arena Legend",
    minimumPoints: 1000,
  },
  {
    label: "Arena Veteran",
    minimumPoints: 600,
  },
  {
    label: "Arena Regular",
    minimumPoints: 250,
  },
  {
    label: "Arena Contender",
    minimumPoints: 100,
  },
  {
    label: SCORE_DEFAULTS.rankLabel,
    minimumPoints: 0,
  },
] as const;

export function isChallengeDifficulty(
  value: string | undefined,
): value is ChallengeDifficulty {
  return CHALLENGE_DIFFICULTIES.some((difficulty) => difficulty === value);
}

export function getChallengeDifficultyMetadata(difficulty: ChallengeDifficulty) {
  return CHALLENGE_DIFFICULTY_METADATA[difficulty];
}

export function getChallengeDefaults(difficulty: ChallengeDifficulty) {
  const { defaultEstimatedMinutes, rewardPoints } =
    getChallengeDifficultyMetadata(difficulty);

  return {
    estimatedMinutes: defaultEstimatedMinutes,
    points: rewardPoints,
  };
}

export function getChallengePointBreakdown(
  difficulty: ChallengeDifficulty,
  rewardPointsOverride?: number,
) {
  const metadata = getChallengeDifficultyMetadata(difficulty);
  const rewardPoints = rewardPointsOverride ?? metadata.rewardPoints;
  const completionPoints = metadata.completionPoints;

  return {
    rewardPoints,
    completionPoints,
    totalPoints: rewardPoints + completionPoints,
    scoreTierLabel: metadata.scoreTierLabel,
  };
}

export function inferChallengeDifficulty(
  labels: readonly string[],
): ChallengeDifficulty {
  const normalizedLabels = labels.map((label) => label.trim().toLowerCase());

  if (normalizedLabels.includes(CHALLENGE_DISCOVERY_LABELS[0])) {
    return "beginner";
  }

  if (
    normalizedLabels.some((label) =>
      ["architecture", "compiler", "diagnostics", "parser", "performance"].includes(
        label,
      ),
    )
  ) {
    return "advanced";
  }

  return "intermediate";
}

export function getChallengeStatusMetadata(status: "open" | "review" | "archived") {
  return CHALLENGE_STATUS_METADATA[status];
}

export function isChallengeStatus(
  value: string | undefined,
): value is ChallengeStatusValue {
  return CHALLENGE_STATUSES.some((status) => status === value);
}

export function getChallengeSourceMetadata(source: "github" | "mock") {
  return CHALLENGE_SOURCE_METADATA[source];
}

export function getSubmissionStatusMetadata(
  status: "draft" | "submitted" | "accepted" | "rejected",
) {
  return SUBMISSION_STATUS_METADATA[status];
}

export function getChallengeEngagementStatusMetadata(
  status: "saved" | "started" | "completed",
) {
  return CHALLENGE_ENGAGEMENT_STATUS_METADATA[status];
}

export function normalizeChallengeLanguage(language: string | null | undefined) {
  const value = language?.trim();

  if (!value) {
    return "Unknown";
  }

  const alias = CHALLENGE_LANGUAGE_ALIASES[value.toLowerCase()];
  return alias ?? value;
}

export function isChallengeCatalogSort(
  value: string | undefined,
): value is ChallengeCatalogSort {
  return CHALLENGE_CATALOG_SORTS.some((sort) => sort === value);
}

export function getChallengeCatalogSortMetadata(sort: ChallengeCatalogSort) {
  return CHALLENGE_CATALOG_SORT_METADATA[sort];
}

export function getChallengeLanguageMetadata(language: string | null | undefined) {
  const normalizedLanguage = normalizeChallengeLanguage(language);

  if (normalizedLanguage in CHALLENGE_LANGUAGE_METADATA) {
    return CHALLENGE_LANGUAGE_METADATA[
      normalizedLanguage as keyof typeof CHALLENGE_LANGUAGE_METADATA
    ];
  }

  return {
    label: normalizedLanguage,
    shortLabel: normalizedLanguage.slice(0, 3).toUpperCase(),
  };
}

export function getScoreRankLabel(totalPoints: number) {
  return (
    SCORE_RANK_THRESHOLDS.find((rank) => totalPoints >= rank.minimumPoints)?.label ??
    SCORE_DEFAULTS.rankLabel
  );
}
