import { CHALLENGE_DISCOVERY_LABELS } from "@/lib/config/challenges";

export const GITHUB_API_BASE_URL = "https://api.github.com";

export const DEFAULT_GITHUB_LABELS = [...CHALLENGE_DISCOVERY_LABELS];

export const GITHUB_API_VERSION = "2022-11-28";
export const GITHUB_API_TIMEOUT_MS = Number.parseInt(
  process.env.GITHUB_API_TIMEOUT_MS ?? "8000",
  10,
);
export const GITHUB_DEFAULT_REVALIDATE_SECONDS = 1800;
export const GITHUB_DEFAULT_RESULTS_PER_LABEL = 12;
