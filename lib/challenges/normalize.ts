import {
  getChallengeDefaults,
  inferChallengeDifficulty,
} from "@/lib/config/challenges";
import type {
  ChallengeActivity,
  ChallengeRecord,
} from "@/types/domain";

export function normalizeChallengeLabels(labels: Iterable<string>) {
  const normalizedLabels: string[] = [];
  const seenLabels = new Set<string>();

  for (const label of labels) {
    const value = label.trim();

    if (!value) {
      continue;
    }

    const key = value.toLowerCase();

    if (seenLabels.has(key)) {
      continue;
    }

    seenLabels.add(key);
    normalizedLabels.push(value);
  }

  return normalizedLabels;
}

export function normalizeChallengeTechStack(values: Iterable<string>) {
  return normalizeChallengeLabels(values);
}

export function extractChallengeSummary(
  body: string | null | undefined,
  fallback: string,
) {
  return (
    body?.split("\n").find((line) => line.trim())?.trim() ??
    fallback
  );
}

export function extractChallengeBody(
  body: string | null | undefined,
  fallback: string,
) {
  return body?.trim() ?? fallback;
}

function normalizeChallengeText(
  value: string | null | undefined,
  fallback: string,
) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : fallback;
}

function normalizeChallengeList(values: Iterable<string>) {
  return normalizeChallengeLabels(
    Array.from(values, (value) => value.trim()).filter(Boolean),
  );
}

function normalizeRecentActivity(
  activity: ChallengeActivity[],
): ChallengeActivity[] {
  return activity
    .map((entry) => ({
      ...entry,
      author: normalizeChallengeText(entry.author, "maintainers"),
      action: normalizeChallengeText(
        entry.action,
        "Shared an update on the issue thread.",
      ),
      date: entry.date,
    }))
    .filter((entry) => entry.date.trim().length > 0);
}

export function inferChallengeDefaultsFromLabels(labels: readonly string[]) {
  const difficulty = inferChallengeDifficulty(labels);

  return {
    difficulty,
    ...getChallengeDefaults(difficulty),
  };
}

export function normalizeChallengeRecord(
  challenge: ChallengeRecord,
): ChallengeRecord {
  const labels = normalizeChallengeList(challenge.labels);
  const normalizedTechStack = normalizeChallengeTechStack(
    challenge.techStack.length > 0
      ? challenge.techStack
      : [challenge.repository.language],
  );
  const summary = normalizeChallengeText(
    challenge.summary,
    "Issue imported into the arena without a maintainer summary yet.",
  );
  const body = normalizeChallengeText(
    challenge.body,
    "Full issue context is not available in the current feed. Open the GitHub issue for the original report.",
  );

  return {
    ...challenge,
    title: normalizeChallengeText(
      challenge.title,
      `Untitled issue #${challenge.issueNumber}`,
    ),
    summary,
    body,
    labels,
    techStack: normalizedTechStack,
    acceptanceCriteria: normalizeChallengeList(challenge.acceptanceCriteria),
    workflowSteps: normalizeChallengeList(challenge.workflowSteps),
    learningOutcomes: normalizeChallengeList(challenge.learningOutcomes),
    recentActivity: normalizeRecentActivity(challenge.recentActivity),
    repository: {
      ...challenge.repository,
      description: normalizeChallengeText(
        challenge.repository.description,
        "This repository does not expose a description in the current feed.",
      ),
    },
  };
}
