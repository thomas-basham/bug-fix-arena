import type { SubmissionStatusSummaryRecord } from "@/types/domain";

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function parseGitHubUrl(value: string, errorMessage: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(errorMessage);
  }

  const hostname = url.hostname.toLowerCase();

  if (hostname !== "github.com" && hostname !== "www.github.com") {
    throw new Error(errorMessage);
  }

  return url;
}

export function normalizeSubmissionNotes(value: string | null | undefined) {
  return normalizeOptionalText(value);
}

export function normalizeSubmissionForkUrl(value: string | null | undefined) {
  const normalizedValue = normalizeOptionalText(value);

  if (!normalizedValue) {
    return undefined;
  }

  const url = parseGitHubUrl(
    normalizedValue,
    "Fork URL must be a valid GitHub repository URL.",
  );
  const pathSegments = url.pathname.split("/").filter(Boolean);

  if (pathSegments.length < 2 || pathSegments.some((segment) => segment === "pull")) {
    throw new Error("Fork URL must point to a GitHub repository.");
  }

  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

export function normalizeSubmissionPrUrl(value: string | null | undefined) {
  const normalizedValue = normalizeOptionalText(value);

  if (!normalizedValue) {
    return undefined;
  }

  const url = parseGitHubUrl(
    normalizedValue,
    "PR URL must be a valid GitHub pull request URL.",
  );
  const pathSegments = url.pathname.split("/").filter(Boolean);

  if (
    pathSegments.length < 4 ||
    pathSegments[2] !== "pull" ||
    Number.isNaN(Number.parseInt(pathSegments[3] ?? "", 10))
  ) {
    throw new Error("PR URL must point to a GitHub pull request.");
  }

  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

export function createEmptySubmissionCounts(): SubmissionStatusSummaryRecord {
  return {
    draft: 0,
    submitted: 0,
    under_review: 0,
    accepted: 0,
    rejected: 0,
  };
}
