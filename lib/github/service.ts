import { GITHUB_API_BASE_URL } from "@/lib/github/constants";
import { slugify } from "@/lib/utils";
import type { ChallengeRecord, RepositoryRecord } from "@/types/domain";
import type {
  GitHubChallengeFetchResult,
  GitHubIssueSearchItem,
  GitHubRepositoryResponse,
  GitHubSearchResponse,
} from "@/types/github";

type FetchGitHubChallengesOptions = {
  labels: string[];
  limit: number;
};

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "open-source-bug-fix-arena",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function fetchFromGitHub<T>(path: string, headers: HeadersInit) {

  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers,
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

async function fetchIssuesForLabel(label: string, perLabel: number) {
  const headers = getGitHubHeaders();

  if (!headers) {
    return null;
  }

  const query = encodeURIComponent(
    `label:"${label}" is:issue is:open archived:false no:assignee`,
  );

  const data = await fetchFromGitHub<GitHubSearchResponse>(
    `/search/issues?q=${query}&sort=updated&order=desc&per_page=${perLabel}`,
    headers,
  );

  return data?.items ?? null;
}

async function fetchRepositoryByFullName(fullName: string) {
  const headers = getGitHubHeaders();

  if (!headers) {
    return null;
  }

  const data = await fetchFromGitHub<GitHubRepositoryResponse>(
    `/repos/${fullName}`,
    headers,
  );

  if (!data) {
    return null;
  }

  const repository: RepositoryRecord = {
    id: `github-repo-${data.id}`,
    owner: data.owner.login,
    name: data.name,
    fullName: data.full_name,
    description: data.description ?? "Open source repository",
    language: data.language ?? "Unknown",
    stars: data.stargazers_count,
    openIssues: data.open_issues_count,
    url: data.html_url,
  };

  return repository;
}

function toChallengeRecord(
  issue: GitHubIssueSearchItem,
  repository: RepositoryRecord,
): ChallengeRecord {
  const labels = issue.labels.map((label) => label.name);
  const difficulty = labels.includes("good first issue")
    ? "beginner"
    : "intermediate";

  return {
    id: `github-challenge-${issue.id}`,
    slug: slugify(`${repository.name}-${issue.number}-${issue.title}`),
    title: issue.title,
    summary:
      issue.body?.split("\n").find((line) => line.trim())?.trim() ??
      "GitHub issue imported into the arena challenge catalog.",
    body:
      issue.body?.trim() ??
      "No issue body was returned from GitHub. Open the original issue for full context.",
    difficulty,
    status: "open",
    labels,
    techStack: [repository.language, "GitHub workflow"],
    repositoryId: repository.id,
    repository,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    source: "github",
    estimatedMinutes: difficulty === "beginner" ? 60 : 90,
    points: difficulty === "beginner" ? 120 : 160,
    acceptanceCriteria: [
      "Summarize the issue clearly enough for another contributor to act on it.",
      "Identify likely files, modules, or docs surfaces before implementation.",
      "Describe how the fix should be validated before opening a pull request.",
    ],
    workflowSteps: [
      "Review the issue thread and inspect the likely source area in the repository.",
      "Draft a scoped fix plan with risks, dependencies, and validation notes.",
      "Prepare a reviewable workflow before converting the work into a code patch.",
    ],
    learningOutcomes: [
      "Translate public issue context into a practical contribution plan.",
      "Spot the difference between problem framing and implementation detail.",
      "Practice writing validation notes before a PR exists.",
    ],
    recentActivity: [
      {
        id: `${issue.node_id}-opened`,
        author: issue.user.login,
        action: "Opened the issue on GitHub.",
        date: issue.created_at,
      },
      {
        id: `${issue.node_id}-updated`,
        author: "maintainers",
        action: `Issue remains active with ${issue.comments} comment(s) and recent maintainer attention.`,
        date: issue.updated_at,
      },
    ],
  };
}

export async function fetchGitHubChallenges({
  labels,
  limit,
}: FetchGitHubChallengesOptions): Promise<GitHubChallengeFetchResult> {
  if (!getGitHubHeaders()) {
    return {
      challenges: [],
      status: "unconfigured",
      message:
        "GitHub integration is not configured, so the catalog is using the seeded sample issues.",
    };
  }

  try {
    const perLabel = Math.max(1, Math.ceil(limit / labels.length));
    const issueGroups = await Promise.all(
      labels.map((label) => fetchIssuesForLabel(label, perLabel)),
    );
    const failedLookups = issueGroups.some((issues) => issues === null);
    const uniqueIssues = new Map<string, GitHubIssueSearchItem>();

    for (const issues of issueGroups) {
      if (!issues) {
        continue;
      }

      for (const issue of issues) {
        uniqueIssues.set(issue.node_id, issue);
      }
    }

    const issues = Array.from(uniqueIssues.values()).slice(0, limit);
    const repositories = await Promise.all(
      issues.map((issue) =>
        fetchRepositoryByFullName(
          issue.repository_url.replace(`${GITHUB_API_BASE_URL}/repos/`, ""),
        ),
      ),
    );

    const challenges = issues
      .map((issue, index) => {
        const repository = repositories[index];

        if (!repository) {
          return null;
        }

        return toChallengeRecord(issue, repository);
      })
      .filter((challenge): challenge is ChallengeRecord => challenge !== null);

    if (challenges.length === 0) {
      return {
        challenges: [],
        status: "error",
        message:
          "GitHub did not return usable issues for the current label query, so the catalog is falling back to sample data.",
      };
    }

    return {
      challenges,
      status: failedLookups ? "error" : "ok",
      message: failedLookups
        ? "Some GitHub issue details could not be loaded, so the live catalog may be incomplete."
        : undefined,
    };
  } catch {
    return {
      challenges: [],
      status: "error",
      message:
        "GitHub could not be reached right now, so the catalog is using the seeded sample issues.",
    };
  }
}
