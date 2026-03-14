import {
  normalizeChallengeLanguage,
} from "@/lib/config/challenges";
import {
  extractChallengeBody,
  extractChallengeSummary,
  inferChallengeDefaultsFromLabels,
  normalizeChallengeLabels,
  normalizeChallengeTechStack,
} from "@/lib/challenges/normalize";
import { slugify } from "@/lib/utils";
import type { ChallengeRecord, RepositoryRecord } from "@/types/domain";
import type {
  GitHubIssueSearchItem,
  GitHubRepositoryResponse,
} from "@/types/github";

function buildRecentActivity(issue: GitHubIssueSearchItem) {
  return [
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
  ];
}

export function normalizeGitHubRepository(
  repository: GitHubRepositoryResponse,
): RepositoryRecord {
  return {
    id: `github-repo-${repository.id}`,
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description ?? "Open source repository",
    language: normalizeChallengeLanguage(repository.language),
    stars: repository.stargazers_count,
    openIssues: repository.open_issues_count,
    url: repository.html_url,
  };
}

export function normalizeGitHubIssueToChallenge(
  issue: GitHubIssueSearchItem,
  repository: RepositoryRecord,
): ChallengeRecord {
  const labels = normalizeChallengeLabels(
    issue.labels.map((label) => label.name),
  );
  const { difficulty, estimatedMinutes, points } =
    inferChallengeDefaultsFromLabels(labels);
  const summaryFallback =
    "GitHub issue imported into the arena challenge catalog.";
  const bodyFallback =
    "No issue body was returned from GitHub. Open the original issue for full context.";

  return {
    id: `github-challenge-${issue.id}`,
    slug: slugify(`${repository.name}-${issue.number}-${issue.title}`),
    title: issue.title.trim(),
    summary: extractChallengeSummary(issue.body, summaryFallback),
    body: extractChallengeBody(issue.body, bodyFallback),
    openedAt: issue.created_at,
    updatedAt: issue.updated_at,
    difficulty,
    status: "open",
    source: "github",
    labels,
    techStack: normalizeChallengeTechStack([
      repository.language,
      "GitHub workflow",
    ]),
    repositoryId: repository.id,
    repository,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    estimatedMinutes,
    points,
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
    recentActivity: buildRecentActivity(issue),
  };
}
