import type { ChallengeRecord, RepositoryRecord } from "@/types/domain";
import type {
  GitHubIssueSearchItem,
  GitHubRepositoryResponse,
} from "@/types/github";

type RepositoryOverrides = Partial<RepositoryRecord>;

type ChallengeOverrides = Partial<Omit<ChallengeRecord, "repository">> & {
  repository?: RepositoryOverrides;
};

type GitHubRepositoryOverrides = Partial<GitHubRepositoryResponse> & {
  owner?: Partial<GitHubRepositoryResponse["owner"]>;
};

type GitHubIssueOverrides = Partial<Omit<GitHubIssueSearchItem, "labels" | "user">> & {
  labels?: Partial<GitHubIssueSearchItem["labels"][number]>[];
  user?: Partial<GitHubIssueSearchItem["user"]>;
};

export function createRepositoryRecord(
  overrides: RepositoryOverrides = {},
): RepositoryRecord {
  return {
    id: "repo-1",
    githubRepositoryId: 42,
    owner: "octo-org",
    name: "arena-repo",
    fullName: "octo-org/arena-repo",
    description: "Repository for challenge fixtures.",
    language: "TypeScript",
    stars: 1200,
    openIssues: 17,
    url: "https://github.com/octo-org/arena-repo",
    ...overrides,
  };
}

export function createChallengeRecord(
  overrides: ChallengeOverrides = {},
): ChallengeRecord {
  const repository = createRepositoryRecord(overrides.repository);

  return {
    id: "challenge-1",
    githubNodeId: "MDU6SXNzdWUx",
    githubIssueId: 987,
    slug: "arena-repo-14-fix-empty-state",
    title: "Fix empty state in challenge list",
    summary: "The dashboard list does not render an empty state correctly.",
    body: "The dashboard list does not render an empty state correctly.\n\nAdd a fallback state for empty lists.",
    openedAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-03T14:00:00.000Z",
    difficulty: "beginner",
    status: "open",
    source: "github",
    labels: ["good first issue", "frontend"],
    techStack: ["TypeScript", "React"],
    issueNumber: 14,
    issueUrl: "https://github.com/octo-org/arena-repo/issues/14",
    estimatedMinutes: 60,
    points: 80,
    acceptanceCriteria: ["Empty state renders when there are no items."],
    workflowSteps: ["Inspect the empty state branch.", "Add the missing fallback."],
    learningOutcomes: ["Understand dashboard empty states."],
    recentActivity: [
      {
        id: "activity-1",
        author: "octocat",
        action: "Requested a fix for the empty state.",
        date: "2026-03-02T09:00:00.000Z",
      },
    ],
    ...overrides,
    repositoryId: repository.id,
    repository,
  };
}

export function createGitHubRepositoryResponse(
  overrides: GitHubRepositoryOverrides = {},
): GitHubRepositoryResponse {
  const { owner, ...repositoryOverrides } = overrides;

  return {
    id: 42,
    name: "arena-repo",
    full_name: "octo-org/arena-repo",
    html_url: "https://github.com/octo-org/arena-repo",
    description: "Repository for challenge fixtures.",
    language: "TypeScript",
    stargazers_count: 1200,
    open_issues_count: 17,
    owner: {
      login: "octo-org",
      ...owner,
    },
    ...repositoryOverrides,
  };
}

export function createGitHubIssueSearchItem(
  overrides: GitHubIssueOverrides = {},
): GitHubIssueSearchItem {
  const { labels: labelOverrides, user, ...issueOverrides } = overrides;
  const labels =
    labelOverrides?.map((label, index) => ({
      id: 100 + index,
      name: label.name ?? `label-${index + 1}`,
      color: label.color ?? "ededed",
      description: label.description ?? null,
    })) ?? [
      { id: 1, name: "good first issue", color: "7057ff", description: null },
      { id: 2, name: "frontend", color: "0e8a16", description: null },
    ];

  return {
    id: 987,
    node_id: "MDU6SXNzdWU5ODc=",
    number: 14,
    title: "Fix empty state in challenge list",
    state: "open",
    body: "The dashboard list does not render an empty state correctly.\n\nAdd a fallback state for empty lists.",
    html_url: "https://github.com/octo-org/arena-repo/issues/14",
    comments: 3,
    created_at: "2026-03-01T10:00:00.000Z",
    updated_at: "2026-03-03T14:00:00.000Z",
    repository_url: "https://api.github.com/repos/octo-org/arena-repo",
    labels,
    user: {
      login: "octocat",
      ...user,
    },
    ...issueOverrides,
  };
}
