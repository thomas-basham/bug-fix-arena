import {
  filterIssueResultsToIssues,
  fetchGitHubRepository,
  searchGitHubIssues,
} from "@/lib/github/client";
import {
  DEFAULT_GITHUB_LABELS,
  GITHUB_DEFAULT_RESULTS_PER_LABEL,
} from "@/lib/github/constants";
import {
  normalizeGitHubIssueToChallenge,
  normalizeGitHubRepository,
} from "@/lib/github/normalize";
import type { ChallengeRecord, RepositoryRecord } from "@/types/domain";
import type {
  GitHubApiErrorType,
  GitHubChallengeFetchResult,
  GitHubChallengeFetchStatus,
  GitHubIssueSearchItem,
} from "@/types/github";

type FetchGitHubChallengesOptions = {
  labels?: readonly string[];
  limit: number;
  perPage?: number;
  maxPages?: number;
};

type FetchIssueDiscoveryResult = {
  issues: GitHubIssueSearchItem[];
  status: GitHubChallengeFetchStatus;
  message?: string;
  fetchedCount: number;
  isTruncated: boolean;
};

function getRepositoryFullNameFromIssue(issue: GitHubIssueSearchItem) {
  return issue.repository_url.replace("https://api.github.com/repos/", "");
}

function toChallengeStatus(type: GitHubApiErrorType): GitHubChallengeFetchStatus {
  switch (type) {
    case "unconfigured":
      return "unconfigured";
    case "rate_limited":
      return "rate_limited";
    default:
      return "error";
  }
}

async function fetchIssuesByLabels(
  labels: readonly string[],
  options: {
    perPage: number;
    maxPages: number;
    limit: number;
  },
): Promise<FetchIssueDiscoveryResult> {
  const issues = new Map<string, GitHubIssueSearchItem>();
  const messages: string[] = [];
  let status: GitHubChallengeFetchStatus = "ok";
  let fetchedCount = 0;
  let isTruncated = false;

  for (const label of labels) {
    for (let page = 1; page <= options.maxPages; page += 1) {
      if (issues.size >= options.limit) {
        isTruncated = true;
        break;
      }

      const result = await searchGitHubIssues(
        `label:"${label}" is:issue is:open archived:false no:assignee`,
        {
          perPage: options.perPage,
          page,
        },
      );

      if (!result.ok) {
        status = toChallengeStatus(result.error.type);
        messages.push(result.error.message);
        break;
      }

      const pageIssues = filterIssueResultsToIssues(result.data.items);

      if (pageIssues.length === 0) {
        break;
      }

      fetchedCount += pageIssues.length;

      for (const issue of pageIssues) {
        issues.set(issue.node_id, issue);

        if (issues.size >= options.limit) {
          isTruncated = true;
          break;
        }
      }

      if (issues.size >= options.limit) {
        break;
      }

      if (pageIssues.length < options.perPage) {
        break;
      }

      if (page === options.maxPages) {
        isTruncated = true;
      }
    }
  }

  return {
    issues: Array.from(issues.values()).slice(0, options.limit),
    status,
    message: messages[0],
    fetchedCount,
    isTruncated,
  };
}

async function fetchRepositoriesForIssues(issues: GitHubIssueSearchItem[]) {
  return fetchGitHubRepositories(issues.map(getRepositoryFullNameFromIssue));
}

export async function fetchGitHubRepositories(fullNames: string[]) {
  const repositories: Array<{ fullName: string; repository: RepositoryRecord }> =
    [];
  let status: GitHubChallengeFetchResult["status"] = "ok";
  let message: string | undefined;

  for (const fullName of new Set(fullNames)) {
    const result = await fetchGitHubRepository(fullName);

    if (!result.ok) {
      if (status === "ok") {
        status = toChallengeStatus(result.error.type);
        message = result.error.message;
      }

      continue;
    }

    repositories.push({
      fullName,
      repository: normalizeGitHubRepository(result.data),
    });
  }

  return {
    repositories,
    status,
    message,
  };
}

function buildChallengesFromIssues(
  issues: GitHubIssueSearchItem[],
  repositories: Map<string, RepositoryRecord>,
) {
  return issues
    .map((issue) => {
      const fullName = getRepositoryFullNameFromIssue(issue);
      const repository = repositories.get(fullName);

      if (!repository) {
        return null;
      }

      return normalizeGitHubIssueToChallenge(issue, repository);
    })
    .filter((challenge): challenge is ChallengeRecord => challenge !== null);
}

function mapRepositoriesByFullName(
  repositories: Array<{ fullName: string; repository: RepositoryRecord }>,
) {
  return new Map(
    repositories.map(({ fullName, repository }) => [fullName, repository]),
  );
}

export async function fetchGitHubChallenges({
  labels = DEFAULT_GITHUB_LABELS,
  limit,
  perPage,
  maxPages = 1,
}: FetchGitHubChallengesOptions): Promise<GitHubChallengeFetchResult> {
  const resolvedPerPage =
    perPage ??
    Math.max(
      1,
      Math.min(
        GITHUB_DEFAULT_RESULTS_PER_LABEL,
        Math.ceil(limit / labels.length),
      ),
    );
  const issueResult = await fetchIssuesByLabels(labels, {
    perPage: resolvedPerPage,
    maxPages,
    limit,
  });

  if (issueResult.status === "unconfigured") {
    return {
      challenges: [],
      status: "unconfigured",
      message:
        issueResult.message ??
        "GitHub is not configured, so the app is using seeded sample issues.",
      fetchedCount: issueResult.fetchedCount,
      isTruncated: issueResult.isTruncated,
    };
  }

  const issues = issueResult.issues.slice(0, limit);

  if (issues.length === 0) {
    return {
      challenges: [],
      status: issueResult.status === "ok" ? "error" : issueResult.status,
      message:
        issueResult.message ??
        "GitHub did not return any usable beginner-friendly issues for the current query.",
      fetchedCount: issueResult.fetchedCount,
      isTruncated: issueResult.isTruncated,
    };
  }

  const repositoryResult = await fetchRepositoriesForIssues(issues);
  const challenges = buildChallengesFromIssues(
    issues,
    mapRepositoriesByFullName(repositoryResult.repositories),
  );

  if (challenges.length === 0) {
    return {
      challenges: [],
      status:
        repositoryResult.status === "ok"
          ? issueResult.status === "ok"
            ? "error"
            : issueResult.status
          : repositoryResult.status,
      message:
        repositoryResult.message ??
        issueResult.message ??
        "GitHub returned issues, but repository enrichment failed before the challenges could be shown.",
      fetchedCount: issueResult.fetchedCount,
      isTruncated: issueResult.isTruncated,
    };
  }

  if (issueResult.status !== "ok") {
    return {
      challenges,
      status: issueResult.status,
      message: issueResult.message,
      fetchedCount: issueResult.fetchedCount,
      isTruncated: issueResult.isTruncated,
    };
  }

  if (repositoryResult.status !== "ok") {
    return {
      challenges,
      status: repositoryResult.status,
      message: repositoryResult.message,
      fetchedCount: issueResult.fetchedCount,
      isTruncated: issueResult.isTruncated,
    };
  }

  return {
    challenges,
    status: "ok",
    fetchedCount: issueResult.fetchedCount,
    isTruncated: issueResult.isTruncated,
  };
}
