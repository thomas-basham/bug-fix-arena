import type {
  ChallengeCatalogSort as ChallengeCatalogSortValue,
  ChallengeDifficulty,
} from "@/lib/config/challenges";

export type ChallengeCatalogSort = ChallengeCatalogSortValue;
export type ChallengeSource = "github" | "mock";
export type ChallengeStatus = "open" | "review" | "archived";
export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";
export type ChallengeEngagementStatus =
  | "saved"
  | "started"
  | "completed";
export type ChallengeCompletionMethod = "manual" | "automated";
export type ChallengeSyncRunStatus =
  | "running"
  | "success"
  | "partial"
  | "failed";
export type ChallengeCatalogNoticeTone = "muted" | "warning";

export type RepositoryRecord = {
  id: string;
  githubRepositoryId?: number;
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
  githubNodeId?: string;
  githubIssueId?: number;
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
  lastSyncedAt?: string;
  inactiveReason?: string;
  acceptanceCriteria: string[];
  workflowSteps: string[];
  learningOutcomes: string[];
  recentActivity: ChallengeActivity[];
};

export type ChallengeDetailSnapshot = {
  challenge: ChallengeRecord;
  relatedChallenges: ChallengeRecord[];
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
  challengeId: string;
  challengeSlug: string;
  challengeTitle: string;
  challengeRepositoryFullName: string;
  userId: string;
  status: SubmissionStatus;
  notes?: string;
  githubPrUrl?: string;
  githubForkUrl?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
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

export type ChallengeSyncRunRecord = {
  id: string;
  source: string;
  status: ChallengeSyncRunStatus;
  fetchedCount: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  archivedCount: number;
  activeCount: number;
  message?: string;
  logs: string[];
  startedAt: string;
  completedAt?: string;
  triggeredByUser?: PublicUserRecord;
};

export type ChallengeSyncOverviewRecord = {
  lastRun: ChallengeSyncRunRecord | null;
  recentRuns: ChallengeSyncRunRecord[];
  totalSyncedChallenges: number;
  activeSyncedChallenges: number;
  archivedSyncedChallenges: number;
};

export type SubmissionStatusSummaryRecord = {
  draft: number;
  submitted: number;
  under_review: number;
  accepted: number;
  rejected: number;
};

export type UserSubmissionsSnapshot = {
  submissions: SubmissionRecord[];
  counts: SubmissionStatusSummaryRecord;
};

export type UserDashboardSnapshot = {
  user: UserRecord;
  score: ScoreRecord;
  submissionCount: number;
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
