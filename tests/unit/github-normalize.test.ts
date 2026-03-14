import { describe, expect, it } from "vitest";
import {
  normalizeGitHubIssueToChallenge,
  normalizeGitHubRepository,
} from "@/lib/github/normalize";
import {
  createGitHubIssueSearchItem,
  createGitHubRepositoryResponse,
} from "@/tests/factories/challenges";

describe("GitHub normalization", () => {
  it("normalizes repository metadata into the internal repository shape", () => {
    const repository = normalizeGitHubRepository(
      createGitHubRepositoryResponse({
        language: null,
        description: null,
      }),
    );

    expect(repository).toMatchObject({
      id: "github-repo-42",
      githubRepositoryId: 42,
      fullName: "octo-org/arena-repo",
      description: "Open source repository",
      language: "Unknown",
      stars: 1200,
      openIssues: 17,
    });
  });

  it("normalizes a GitHub issue into a stable challenge record", () => {
    const repository = normalizeGitHubRepository(createGitHubRepositoryResponse());
    const challenge = normalizeGitHubIssueToChallenge(
      createGitHubIssueSearchItem({
        labels: [
          { name: "good first issue" },
          { name: "frontend" },
          { name: "Frontend" },
        ],
      }),
      repository,
    );

    expect(challenge).toMatchObject({
      id: "github-challenge-987",
      githubIssueId: 987,
      repositoryId: repository.id,
      difficulty: "beginner",
      summary: "The dashboard list does not render an empty state correctly.",
      techStack: ["TypeScript", "GitHub workflow"],
      issueNumber: 14,
      source: "github",
      status: "open",
    });
    expect(challenge.slug).toBe("arena-repo-14-fix-empty-state-in-challenge-list");
    expect(challenge.labels).toEqual(["good first issue", "frontend"]);
    expect(challenge.acceptanceCriteria).toHaveLength(3);
    expect(challenge.recentActivity).toEqual([
      expect.objectContaining({
        author: "octocat",
        action: "Opened the issue on GitHub.",
      }),
      expect.objectContaining({
        author: "maintainers",
        action: "Issue remains active with 3 comment(s) and recent maintainer attention.",
      }),
    ]);
  });

  it("uses stable fallbacks when GitHub returns sparse issue content", () => {
    const repository = normalizeGitHubRepository(
      createGitHubRepositoryResponse({ language: "Go" }),
    );
    const challenge = normalizeGitHubIssueToChallenge(
      createGitHubIssueSearchItem({
        body: null,
        labels: [{ name: "performance" }],
      }),
      repository,
    );

    expect(challenge.summary).toBe(
      "GitHub issue imported into the arena challenge catalog.",
    );
    expect(challenge.body).toBe(
      "No issue body was returned from GitHub. Open the original issue for full context.",
    );
    expect(challenge.difficulty).toBe("advanced");
    expect(challenge.techStack).toEqual(["Go", "GitHub workflow"]);
  });
});
