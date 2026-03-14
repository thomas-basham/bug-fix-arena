import type { ChallengeRecord } from "@/types/domain";

export type GitHubLabel = {
  id: number;
  name: string;
  color: string;
  description?: string | null;
};

export type GitHubIssueAuthor = {
  login: string;
};

export type GitHubRepositoryOwner = {
  login: string;
};

export type GitHubRateLimit = {
  limit?: number;
  remaining?: number;
  resetAt?: string;
  resource?: string;
};

export type GitHubIssueSearchItem = {
  id: number;
  node_id: string;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  comments: number;
  created_at: string;
  updated_at: string;
  repository_url: string;
  labels: GitHubLabel[];
  user: GitHubIssueAuthor;
  pull_request?: {
    url: string;
  } | null;
};

export type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssueSearchItem[];
};

export type GitHubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  open_issues_count: number;
  owner: GitHubRepositoryOwner;
};

export type GitHubChallengeFetchStatus =
  | "ok"
  | "unconfigured"
  | "rate_limited"
  | "error";

export type GitHubChallengeFetchResult = {
  challenges: ChallengeRecord[];
  status: GitHubChallengeFetchStatus;
  message?: string;
};

export type GitHubApiErrorType =
  | "unconfigured"
  | "rate_limited"
  | "network"
  | "response";

export type GitHubApiResult<T> =
  | {
      ok: true;
      data: T;
      rateLimit: GitHubRateLimit;
    }
  | {
      ok: false;
      error: {
        type: GitHubApiErrorType;
        message: string;
        status?: number;
        rateLimit: GitHubRateLimit;
      };
    };
