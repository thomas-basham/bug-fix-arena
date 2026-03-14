import {
  GITHUB_API_BASE_URL,
  GITHUB_API_TIMEOUT_MS,
  GITHUB_API_VERSION,
  GITHUB_DEFAULT_REVALIDATE_SECONDS,
} from "@/lib/github/constants";
import type {
  GitHubApiResult,
  GitHubIssueSearchItem,
  GitHubRateLimit,
  GitHubRepositoryResponse,
  GitHubSearchResponse,
} from "@/types/github";

type GitHubRequestOptions = {
  revalidate?: number;
};

function getGitHubToken() {
  return process.env.GITHUB_TOKEN?.trim();
}

function buildRateLimit(headers: Headers): GitHubRateLimit {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");
  const resource = headers.get("x-ratelimit-resource");

  return {
    limit: limit ? Number.parseInt(limit, 10) : undefined,
    remaining: remaining ? Number.parseInt(remaining, 10) : undefined,
    resetAt:
      reset && !Number.isNaN(Number.parseInt(reset, 10))
        ? new Date(Number.parseInt(reset, 10) * 1000).toISOString()
        : undefined,
    resource: resource ?? undefined,
  };
}

function getAuthHeaders() {
  const token = getGitHubToken();

  if (!token) {
    return null;
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "open-source-bug-fix-arena",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
}

async function requestGitHub<T>(
  path: string,
  options: GitHubRequestOptions = {},
): Promise<GitHubApiResult<T>> {
  const headers = getAuthHeaders();

  if (!headers) {
    return {
      ok: false,
      error: {
        type: "unconfigured",
        message:
          "GITHUB_TOKEN is not configured, so the app is using the seeded fallback catalog.",
        rateLimit: {},
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_API_TIMEOUT_MS);

  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      headers,
      signal: controller.signal,
      next: {
        revalidate:
          options.revalidate ?? GITHUB_DEFAULT_REVALIDATE_SECONDS,
      },
    });
    const rateLimit = buildRateLimit(response.headers);

    if (!response.ok) {
      const isRateLimited =
        response.status === 403 ||
        response.status === 429 ||
        rateLimit.remaining === 0;

      return {
        ok: false,
        error: {
          type: isRateLimited ? "rate_limited" : "response",
          status: response.status,
          message: isRateLimited
            ? `GitHub rate limits are preventing live fetches${
                rateLimit.resetAt ? ` until ${rateLimit.resetAt}` : ""
              }.`
            : `GitHub responded with status ${response.status} for ${path}.`,
          rateLimit,
        },
      };
    }

    return {
      ok: true,
      data: (await response.json()) as T,
      rateLimit,
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        type: "network",
        message:
          error instanceof Error && error.name === "AbortError"
            ? `GitHub request timed out after ${GITHUB_API_TIMEOUT_MS}ms.`
            : "GitHub could not be reached from the current environment.",
        rateLimit: {},
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchGitHubIssues(
  query: string,
  options: {
    perPage: number;
    page?: number;
  },
) {
  const searchParams = new URLSearchParams({
    order: "desc",
    per_page: String(options.perPage),
    q: query,
    sort: "updated",
  });

  if (options.page && options.page > 1) {
    searchParams.set("page", String(options.page));
  }

  return requestGitHub<GitHubSearchResponse>(
    `/search/issues?${searchParams.toString()}`,
  );
}

export async function fetchGitHubRepository(fullName: string) {
  return requestGitHub<GitHubRepositoryResponse>(`/repos/${fullName}`);
}

export function filterIssueResultsToIssues(items: GitHubIssueSearchItem[]) {
  return items.filter((item) => !item.pull_request);
}
