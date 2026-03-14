import {
  getChallengeDefaults,
  inferChallengeDifficulty,
} from "@/lib/config/challenges";

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

export function inferChallengeDefaultsFromLabels(labels: readonly string[]) {
  const difficulty = inferChallengeDifficulty(labels);

  return {
    difficulty,
    ...getChallengeDefaults(difficulty),
  };
}
