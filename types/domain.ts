import type {
  ChallengeCompletionMethod as PrismaChallengeCompletionMethod,
  ChallengeEngagementStatus as PrismaChallengeEngagementStatus,
  ChallengeSource as PrismaChallengeSource,
  ChallengeStatus as PrismaChallengeStatus,
  SubmissionStatus as PrismaSubmissionStatus,
} from "@prisma/client";
import type {
  ChallengeCatalogSort as ChallengeCatalogSortValue,
  ChallengeDifficulty,
} from "@/lib/config/challenges";

type LowercaseEnum<T extends string> = Lowercase<T>;

export type ChallengeCatalogSort = ChallengeCatalogSortValue;
export type ChallengeSource = LowercaseEnum<PrismaChallengeSource>;
export type ChallengeStatus = LowercaseEnum<PrismaChallengeStatus>;
export type SubmissionStatus = LowercaseEnum<PrismaSubmissionStatus>;
export type ChallengeEngagementStatus =
  LowercaseEnum<PrismaChallengeEngagementStatus>;
export type ChallengeCompletionMethod =
  LowercaseEnum<PrismaChallengeCompletionMethod>;
export type ChallengeCatalogNoticeTone = "muted" | "warning";

export type RepositoryRecord = {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  openIssues: number;
  url: string;
};

export type ChallengeActivity = {
  id: string;
  author: string;
  action: string;
  date: string;
};

export type ChallengeRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  openedAt: string;
  updatedAt: string;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  source: ChallengeSource;
  labels: string[];
  techStack: string[];
  repositoryId: string;
  repository: RepositoryRecord;
  issueNumber: number;
  issueUrl: string;
  estimatedMinutes: number;
  points: number;
  acceptanceCriteria: string[];
  workflowSteps: string[];
  learningOutcomes: string[];
  recentActivity: ChallengeActivity[];
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  bio: string;
  avatarInitials: string | null;
};

export type PublicUserRecord = {
  id: string;
  name: string;
  githubUsername: string;
  avatarInitials: string | null;
};

export type SubmissionRecord = {
  id: string;
  title: string;
  summary: string;
  challengeId: string;
  challengeSlug: string;
  challengeTitle: string;
  userId: string;
  status: SubmissionStatus;
  updatedAt: string;
  checklist: string[];
};

export type ChallengeEngagementRecord = {
  id: string;
  userId: string;
  challengeId: string;
  status: ChallengeEngagementStatus;
  completionMethod?: ChallengeCompletionMethod;
  pointsAwarded: number;
  savedAt: string;
  startedAt?: string;
  completedAt?: string;
};

export type DashboardChallengeRecord = {
  engagement: ChallengeEngagementRecord;
  challenge: ChallengeRecord;
};

export type ScoreRecord = {
  id: string;
  userId: string;
  totalPoints: number;
  currentStreak: number;
  completedChallenges: number;
  rankLabel: string;
};

export type LeaderboardEntryRecord = {
  rank: number;
  user: PublicUserRecord;
  score: ScoreRecord;
  lastScoreUpdateAt: string;
};

export type LeaderboardActivityRecord = {
  id: string;
  challengeSlug: string;
  challengeTitle: string;
  completedAt: string;
  pointsAwarded: number;
  user: PublicUserRecord;
};

export type LeaderboardSnapshot = {
  entries: LeaderboardEntryRecord[];
  recentActivity: LeaderboardActivityRecord[];
};

export type UserDashboardSnapshot = {
  user: UserRecord;
  score: ScoreRecord;
  savedChallenges: DashboardChallengeRecord[];
  startedChallenges: DashboardChallengeRecord[];
  completedChallenges: DashboardChallengeRecord[];
};

export type ChallengeCatalogFilters = {
  query?: string;
  language?: string;
  difficulty?: ChallengeDifficulty;
  label?: string;
  repository?: string;
  status?: ChallengeStatus;
};

export type ChallengeFilterOptions = {
  languages: string[];
  difficulties: ChallengeDifficulty[];
  labels: string[];
  repositories: string[];
  statuses: ChallengeStatus[];
};

export type ChallengeCatalogPagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
};

export type ChallengeCatalogNotice = {
  tone: ChallengeCatalogNoticeTone;
  title: string;
  message: string;
};

export type ChallengeCatalogResult = {
  source: ChallengeSource;
  discoveryLabels: string[];
  challenges: ChallengeRecord[];
  totalChallenges: number;
  filteredChallenges: number;
  filters: ChallengeCatalogFilters;
  sort: ChallengeCatalogSort;
  filterOptions: ChallengeFilterOptions;
  pagination: ChallengeCatalogPagination;
  notice?: ChallengeCatalogNotice;
};
