import { slugify } from "@/lib/utils";
import type { ChallengeRecord, RepositoryRecord } from "@/types/domain";
import type {
  GitHubIssueSearchItem,
  GitHubRepositoryResponse,
} from "@/types/github";

export function normalizeGitHubRepository(
  repository: GitHubRepositoryResponse,
): RepositoryRecord {
  return {
    id: `github-repo-${repository.id}`,
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description ?? "Open source repository",
    language: repository.language ?? "Unknown",
    stars: repository.stargazers_count,
    openIssues: repository.open_issues_count,
    url: repository.html_url,
  };
}

export function normalizeGitHubIssueToChallenge(
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
    source: "github",
    labels,
    techStack: [repository.language, "GitHub workflow"],
    repositoryId: repository.id,
    repository,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
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
