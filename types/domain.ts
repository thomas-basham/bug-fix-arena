export type ChallengeSource = "github" | "mock";
export type ChallengeDifficulty = "beginner" | "intermediate";
export type ChallengeStatus = "open" | "review" | "archived";
export type SubmissionStatus = "draft" | "submitted" | "accepted" | "rejected";
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
  avatarInitials: string;
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

export type ScoreRecord = {
  id: string;
  userId: string;
  totalPoints: number;
  currentStreak: number;
  completedChallenges: number;
  rankLabel: string;
};

export type DashboardSnapshot = {
  user: UserRecord;
  score: ScoreRecord;
  submissions: SubmissionRecord[];
};

export type ChallengeCatalogFilters = {
  language?: string;
  difficulty?: ChallengeDifficulty;
  label?: string;
};

export type ChallengeFilterOptions = {
  languages: string[];
  difficulties: ChallengeDifficulty[];
  labels: string[];
};

export type ChallengeCatalogNotice = {
  tone: ChallengeCatalogNoticeTone;
  title: string;
  message: string;
};

export type ChallengeCatalogResult = {
  source: ChallengeSource;
  labels: string[];
  challenges: ChallengeRecord[];
  totalChallenges: number;
  filteredChallenges: number;
  filters: ChallengeCatalogFilters;
  filterOptions: ChallengeFilterOptions;
  notice?: ChallengeCatalogNotice;
};
