export type GitHubLabel = {
  id: number;
  name: string;
  color: string;
  description?: string | null;
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
  user: {
    login: string;
  };
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
  owner: {
    login: string;
  };
};

export type GitHubChallengeFetchResult = {
  challenges: import("./domain").ChallengeRecord[];
  status: "ok" | "unconfigured" | "error";
  message?: string;
};
