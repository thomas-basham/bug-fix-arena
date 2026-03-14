import {
  SCORE_DEFAULTS,
  getChallengePointBreakdown,
  getScoreRankLabel,
} from "@/lib/config/challenges";
import type {
  ChallengeActivity,
  ChallengeEngagementRecord,
  ChallengeRecord,
  RepositoryRecord,
  ScoreRecord,
  SubmissionRecord,
  UserRecord,
} from "@/types/domain";

export const mockRepositories: RepositoryRecord[] = [
  {
    id: "repo-nextjs",
    owner: "vercel",
    name: "next.js",
    fullName: "vercel/next.js",
    description: "The React framework for the web.",
    language: "TypeScript",
    stars: 128000,
    openIssues: 3200,
    url: "https://github.com/vercel/next.js",
  },
  {
    id: "repo-prisma",
    owner: "prisma",
    name: "prisma",
    fullName: "prisma/prisma",
    description: "Next-generation ORM for Node.js and TypeScript.",
    language: "TypeScript",
    stars: 42000,
    openIssues: 1800,
    url: "https://github.com/prisma/prisma",
  },
  {
    id: "repo-tailwind",
    owner: "tailwindlabs",
    name: "tailwindcss",
    fullName: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework.",
    language: "TypeScript",
    stars: 84000,
    openIssues: 950,
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
  {
    id: "repo-astro",
    owner: "withastro",
    name: "astro",
    fullName: "withastro/astro",
    description: "The web framework for content-driven sites.",
    language: "TypeScript",
    stars: 49000,
    openIssues: 1500,
    url: "https://github.com/withastro/astro",
  },
  {
    id: "repo-eslint",
    owner: "eslint",
    name: "eslint",
    fullName: "eslint/eslint",
    description: "Find and fix problems in your JavaScript code.",
    language: "JavaScript",
    stars: 26000,
    openIssues: 800,
    url: "https://github.com/eslint/eslint",
  },
  {
    id: "repo-django",
    owner: "django",
    name: "django",
    fullName: "django/django",
    description: "The Web framework for perfectionists with deadlines.",
    language: "Python",
    stars: 82000,
    openIssues: 220,
    url: "https://github.com/django/django",
  },
  {
    id: "repo-rust-analyzer",
    owner: "rust-lang",
    name: "rust-analyzer",
    fullName: "rust-lang/rust-analyzer",
    description: "A Rust compiler front-end for IDEs.",
    language: "Rust",
    stars: 16000,
    openIssues: 2900,
    url: "https://github.com/rust-lang/rust-analyzer",
  },
  {
    id: "repo-gitea",
    owner: "go-gitea",
    name: "gitea",
    fullName: "go-gitea/gitea",
    description: "Git with a cup of tea. A painless self-hosted Git service.",
    language: "Go",
    stars: 45000,
    openIssues: 1700,
    url: "https://github.com/go-gitea/gitea",
  },
];

const repositoryById = new Map(
  mockRepositories.map((repository) => [repository.id, repository]),
);

const recentActivity = (
  entries: Array<[string, string, string]>,
): ChallengeActivity[] =>
  entries.map(([id, author, action]) => ({
    id,
    author,
    action,
    date: new Date(
      Date.now() - (Number.parseInt(id.replace(/\D/g, ""), 10) + 1) * 86_400_000,
    ).toISOString(),
  }));

function getChallengeOpenedAt(activity: ChallengeActivity[]) {
  return (
    [...activity]
      .sort((left, right) => left.date.localeCompare(right.date))[0]?.date ??
    new Date().toISOString()
  );
}

function getChallengeUpdatedAt(activity: ChallengeActivity[]) {
  return (
    [...activity]
      .sort((left, right) => right.date.localeCompare(left.date))[0]?.date ??
    new Date().toISOString()
  );
}

const challengeSeeds: Array<
  Omit<ChallengeRecord, "repository" | "source" | "openedAt" | "updatedAt">
> = [
  {
    id: "challenge-next-loading-boundary",
    slug: "nextjs-loading-boundary",
    title: "Clarify loading UI when a route segment fetch fails",
    summary:
      "Investigate a confusing loading-state edge case in the App Router and outline a safe validation plan.",
    body:
      "The issue describes a route segment that can remain in a loading-looking state after a failed fetch during navigation. For the arena brief, contributors should identify where the fallback UI is selected, how the route segment hands control to the error boundary, and how to prove the behavior is fixed without regressing adjacent loading cases.\n\nA strong submission should call out likely files, a reliable reproduction path, and the minimum regression coverage required before proposing implementation details.",
    difficulty: "beginner",
    status: "open",
    labels: ["good first issue", "app router", "react suspense"],
    techStack: ["Next.js", "React 19", "TypeScript"],
    repositoryId: "repo-nextjs",
    issueNumber: 56321,
    issueUrl: "https://github.com/vercel/next.js/issues/56321",
    estimatedMinutes: 75,
    points: 80,
    acceptanceCriteria: [
      "Reproduction steps are explicit enough for another contributor to follow.",
      "The workflow identifies the rendering boundary where the fallback state is chosen.",
      "The validation plan mentions at least one regression test strategy.",
    ],
    workflowSteps: [
      "Read the issue thread and inspect related loading and error boundaries in the relevant route segment.",
      "Reproduce the failed fetch flow locally and note which component keeps the stale loading state alive.",
      "Draft a fix path, risk notes, and regression coverage before writing code.",
    ],
    learningOutcomes: [
      "Understand App Router loading and error boundary interplay.",
      "Practice turning issue context into a concrete debugging plan.",
      "Think about user-facing regressions before implementation.",
    ],
    recentActivity: recentActivity([
      ["activity-1", "maintainer-jules", "Confirmed the bug and asked for a focused reproduction."],
      ["activity-3", "contributor-lee", "Shared a local repro and narrowed the issue to the route segment handoff."],
    ]),
  },
  {
    id: "challenge-prisma-seed-errors",
    slug: "prisma-seed-error-message",
    title: "Improve the seed example error message for SQLite users",
    summary:
      "Tighten a common developer-experience gap in the seed workflow and propose the cleanest fix path.",
    body:
      "A contributor-friendly Prisma issue points out that the current SQLite seed example can surface an error message that is technically correct but not very actionable. The challenge is to trace the message path, suggest a clearer rewrite, and plan how to validate the new message across the CLI flow.\n\nThe MVP arena still stops at workflow planning rather than full patch editing, so the emphasis is on precision, scope, and verification.",
    difficulty: "beginner",
    status: "open",
    labels: ["good first issue", "dx", "docs"],
    techStack: ["Prisma", "Node.js", "TypeScript"],
    repositoryId: "repo-prisma",
    issueNumber: 21455,
    issueUrl: "https://github.com/prisma/prisma/issues/21455",
    estimatedMinutes: 60,
    points: 80,
    acceptanceCriteria: [
      "The message rewrite explains what went wrong and what the developer should try next.",
      "The plan identifies the command path or helper where the message is composed.",
      "The fix workflow includes a way to verify the message without introducing regressions.",
    ],
    workflowSteps: [
      "Trace the seed command from CLI entrypoint to the error formatting helper.",
      "Write a concise message proposal that stays accurate across common SQLite setups.",
      "Describe a lightweight manual or automated validation plan for the updated copy.",
    ],
    learningOutcomes: [
      "Map CLI behavior through a typed codebase.",
      "Improve developer experience without broad architectural changes.",
      "Practice scoping a small issue so it is easy to review.",
    ],
    recentActivity: recentActivity([
      ["activity-2", "maintainer-rio", "Marked the issue as a strong first contribution and linked the relevant package."],
      ["activity-4", "contributor-ana", "Asked whether snapshot coverage would be acceptable for the revised output."],
    ]),
  },
  {
    id: "challenge-tailwind-parser-tests",
    slug: "tailwind-parser-regression-coverage",
    title: "Add regression coverage for an arbitrary value parser edge case",
    summary:
      "Investigate a parser corner case and propose a minimal test-first workflow that keeps the change easy to review.",
    body:
      "The Tailwind issue centers on an arbitrary-value parser edge case where a valid string is tokenized incorrectly. The arena brief should guide a contributor toward isolating the parser rule, capturing the failing behavior with a regression test, and only then sketching the production fix.\n\nThis is a little closer to framework internals, so the best workflow is small, test-first, and explicit about adjacent parser risk.",
    difficulty: "advanced",
    status: "open",
    labels: ["help wanted", "tests", "parser"],
    techStack: ["Tailwind CSS", "TypeScript", "Node.js"],
    repositoryId: "repo-tailwind",
    issueNumber: 18841,
    issueUrl: "https://github.com/tailwindlabs/tailwindcss/issues/18841",
    estimatedMinutes: 95,
    points: 170,
    acceptanceCriteria: [
      "The failing case is reduced to the smallest useful input.",
      "The workflow adds coverage before describing the production fix.",
      "Potential parser regressions are called out explicitly.",
    ],
    workflowSteps: [
      "Locate the parser and identify the exact tokenization branch involved in the issue.",
      "Write the smallest failing test that reproduces the parsing mismatch.",
      "Outline a guarded fix and describe what adjacent inputs also need coverage.",
    ],
    learningOutcomes: [
      "Work test-first around a framework parsing bug.",
      "Reduce a bug report to a minimal reproduction case.",
      "Identify regression risk in low-level utility code.",
    ],
    recentActivity: recentActivity([
      ["activity-5", "maintainer-dev", "Requested a minimal failing fixture before discussing implementation details."],
      ["activity-6", "contributor-kai", "Confirmed the edge case only appears with a very specific token order."],
    ]),
  },
  {
    id: "challenge-astro-onboarding-copy",
    slug: "astro-onboarding-copy-audit",
    title: "Tighten onboarding copy for a confusing starter command",
    summary:
      "Improve a docs-adjacent issue by auditing the current wording and outlining a low-risk fix path.",
    body:
      "A command in the getting-started flow is technically correct but easy to misread, which leads to avoidable setup confusion. Contributors should identify the docs page or onboarding snippet, explain the mismatch between user expectation and current copy, and propose the cleanest wording adjustment.\n\nA strong arena submission should also mention how to validate the copy across every docs surface where the same instruction appears.",
    difficulty: "beginner",
    status: "open",
    labels: ["help wanted", "documentation", "onboarding"],
    techStack: ["Astro", "MDX", "Documentation"],
    repositoryId: "repo-astro",
    issueNumber: 14592,
    issueUrl: "https://github.com/withastro/astro/issues/14592",
    estimatedMinutes: 45,
    points: 80,
    acceptanceCriteria: [
      "The revised wording addresses the actual point of confusion.",
      "Duplicate docs surfaces are identified before proposing the change.",
      "Validation covers both accuracy and consistency of the updated copy.",
    ],
    workflowSteps: [
      "Locate every docs or onboarding surface that repeats the same instruction.",
      "Describe why the current command wording causes confusion for first-time users.",
      "Propose a wording update and a quick audit checklist for consistency.",
    ],
    learningOutcomes: [
      "Handle documentation issues with the same rigor as code issues.",
      "Think about consistency across multiple product surfaces.",
      "Practice low-risk contribution planning.",
    ],
    recentActivity: recentActivity([
      ["activity-7", "maintainer-sam", "Confirmed the confusion and suggested checking the CLI guide too."],
      ["activity-8", "contributor-mia", "Flagged a second docs page with similar wording."],
    ]),
  },
  {
    id: "challenge-eslint-rule-meta",
    slug: "eslint-rule-meta-doc-link",
    title: "Fix a missing docs link in rule metadata output",
    summary:
      "Audit a small JavaScript issue where a rule references docs metadata inconsistently and plan the narrowest safe fix.",
    body:
      "An ESLint issue reports that one rule's metadata path produces a missing or stale documentation link in generated output. The task is to inspect the rule module, confirm where the docs URL is composed, and propose a validation checklist that ensures the fix does not alter other rules.\n\nThis is the kind of issue that should stay small, reviewable, and easy to verify without broad repo-wide refactors.",
    difficulty: "beginner",
    status: "open",
    labels: ["good first issue", "documentation", "javascript"],
    techStack: ["ESLint", "JavaScript", "Node.js"],
    repositoryId: "repo-eslint",
    issueNumber: 18742,
    issueUrl: "https://github.com/eslint/eslint/issues/18742",
    estimatedMinutes: 55,
    points: 80,
    acceptanceCriteria: [
      "The workflow pinpoints the rule metadata field or helper that produces the link.",
      "The proposed fix avoids broad changes to unrelated rule docs generation.",
      "Validation covers both the targeted rule and at least one unaffected rule.",
    ],
    workflowSteps: [
      "Locate the rule module and inspect how its docs metadata is surfaced in generated output.",
      "Confirm whether the problem lives in the rule definition or a shared link helper.",
      "Draft a small validation plan that compares the updated output against a known good rule.",
    ],
    learningOutcomes: [
      "Navigate a mature JavaScript codebase with minimal changes.",
      "Practice debugging metadata and generation flows.",
      "Keep fixes reviewable by constraining scope early.",
    ],
    recentActivity: recentActivity([
      ["activity-9", "maintainer-nia", "Confirmed the bug and requested a targeted fix rather than a bulk docs sweep."],
      ["activity-10", "contributor-omar", "Found the likely metadata source and asked about existing fixture coverage."],
    ]),
  },
  {
    id: "challenge-django-admin-empty-state",
    slug: "django-admin-empty-related-state",
    title: "Improve the empty state text for a related admin widget",
    summary:
      "Tighten a small Python UX issue in Django admin and outline the safest path to update the copy and tests.",
    body:
      "A related-object admin widget shows generic empty-state text that does not match the action the user can take next. The challenge is to trace the widget template or helper, identify where the current text is defined, and propose a low-risk validation plan that covers both the updated widget and nearby admin flows.\n\nThis should remain a compact change with clear manual verification notes and the smallest reasonable test surface.",
    difficulty: "beginner",
    status: "open",
    labels: ["good first issue", "ui", "admin"],
    techStack: ["Django", "Python", "Templates"],
    repositoryId: "repo-django",
    issueNumber: 19234,
    issueUrl: "https://github.com/django/django/issues/19234",
    estimatedMinutes: 70,
    points: 80,
    acceptanceCriteria: [
      "The relevant template or widget helper is identified clearly.",
      "The revised copy reflects the actual next action available to the user.",
      "Validation includes at least one admin flow that should remain unchanged.",
    ],
    workflowSteps: [
      "Find the widget template or helper that renders the current empty-state copy.",
      "Trace where the admin context determines the available next action.",
      "Outline a concise test and manual verification plan for the changed text.",
    ],
    learningOutcomes: [
      "Navigate a large Python framework through templates and server-side helpers.",
      "Treat copy fixes with the same care as code changes.",
      "Think about localized regressions in older, stable interfaces.",
    ],
    recentActivity: recentActivity([
      ["activity-11", "maintainer-alex", "Pointed to the admin widget stack and asked for a narrow patch."],
      ["activity-12", "contributor-rin", "Verified the wording problem on the latest stable branch."],
    ]),
  },
  {
    id: "challenge-rust-analyzer-diagnostic-wording",
    slug: "rust-analyzer-diagnostic-wording",
    title: "Refine a confusing diagnostic note for an import assist",
    summary:
      "Review a Rust diagnostic wording issue and plan a fix that is easy to validate without touching multiple assists at once.",
    body:
      "A rust-analyzer issue notes that a note attached to an import-related assist reads awkwardly and makes the suggested action less obvious. The contributor should locate the assist or diagnostic builder, identify where the note text is assembled, and describe how to prove the new wording does not weaken test expectations elsewhere.\n\nBecause the issue sits close to compiler-like logic, keeping the wording change isolated and well-tested matters more than moving quickly.",
    difficulty: "advanced",
    status: "open",
    labels: ["help wanted", "diagnostics", "ux"],
    techStack: ["Rust", "rust-analyzer", "Testing"],
    repositoryId: "repo-rust-analyzer",
    issueNumber: 17602,
    issueUrl: "https://github.com/rust-lang/rust-analyzer/issues/17602",
    estimatedMinutes: 90,
    points: 170,
    acceptanceCriteria: [
      "The diagnostic or assist builder owning the note text is identified.",
      "The wording change remains scoped to the reported behavior.",
      "Validation mentions existing fixture or snapshot expectations that need updating.",
    ],
    workflowSteps: [
      "Find the assist or diagnostic module responsible for the note text.",
      "Identify the most isolated wording change that addresses the confusion.",
      "List the fixture or snapshot tests that should validate the update.",
    ],
    learningOutcomes: [
      "Read Rust tooling code with an eye for isolated UX improvements.",
      "Respect snapshot-heavy workflows when planning changes.",
      "Avoid over-scoping a fix in a complex diagnostics codepath.",
    ],
    recentActivity: recentActivity([
      ["activity-13", "maintainer-iva", "Suggested keeping the wording fix isolated to the reported assist."],
      ["activity-14", "contributor-noah", "Found the fixture snapshot that would likely need updating."],
    ]),
  },
  {
    id: "challenge-gitea-template-preview",
    slug: "gitea-issue-template-preview",
    title: "Polish the issue template preview empty state",
    summary:
      "Inspect a Go-backed UI workflow where the template preview looks broken when no template is selected yet.",
    body:
      "A Gitea issue reports that the issue template preview panel appears broken or blank when a user first opens the page without choosing a template. The ideal arena workflow should identify the view or API response involved, capture the current behavior, and propose a safe UI fallback state.\n\nThe goal is not to ship the frontend patch in-browser yet, but to turn the issue into a tightly scoped implementation plan with clear validation notes.",
    difficulty: "intermediate",
    status: "open",
    labels: ["help wanted", "ui", "good first issue"],
    techStack: ["Go", "HTML templates", "Frontend state"],
    repositoryId: "repo-gitea",
    issueNumber: 30219,
    issueUrl: "https://github.com/go-gitea/gitea/issues/30219",
    estimatedMinutes: 65,
    points: 120,
    acceptanceCriteria: [
      "The current blank-state behavior is documented clearly.",
      "The plan identifies the template rendering or API path involved.",
      "Validation covers both the empty state and the selected-template state.",
    ],
    workflowSteps: [
      "Reproduce the preview panel behavior when no issue template is selected.",
      "Trace the view and data flow that drives the preview panel state.",
      "Propose a fallback empty state and the checks needed to validate it.",
    ],
    learningOutcomes: [
      "Map UI behavior across server-rendered and frontend state boundaries.",
      "Design an empty state that clarifies rather than decorates.",
      "Keep bug fixes small even when the user-facing effect is broad.",
    ],
    recentActivity: recentActivity([
      ["activity-15", "maintainer-ben", "Asked for a clearer empty-state treatment instead of leaving the panel blank."],
      ["activity-16", "contributor-zoe", "Tracked the preview panel back to a small template-rendering branch."],
    ]),
  },
];

export const mockChallenges: ChallengeRecord[] = challengeSeeds.map((seed) => ({
  ...seed,
  openedAt: getChallengeOpenedAt(seed.recentActivity),
  updatedAt: getChallengeUpdatedAt(seed.recentActivity),
  repository: repositoryById.get(seed.repositoryId)!,
  source: "mock",
}));

const challengeById = new Map(
  mockChallenges.map((challenge) => [challenge.id, challenge]),
);

function getAwardedPointsForChallenge(challengeId: string) {
  const challenge = challengeById.get(challengeId);

  if (!challenge) {
    return 0;
  }

  return getChallengePointBreakdown(challenge.difficulty, challenge.points).totalPoints;
}

export const mockUsers: UserRecord[] = [
  {
    id: "user-1",
    name: "Morgan Lee",
    email: "morgan@example.com",
    githubUsername: "morganlee",
    bio: "Frontend engineer leveling up through open source bug triage and reviewable fix plans.",
    avatarInitials: "ML",
  },
  {
    id: "user-2",
    name: "Priya Shah",
    email: "priya@example.com",
    githubUsername: "priyashah",
    bio: "Full-stack developer using the arena to turn promising issues into sharper review plans.",
    avatarInitials: "PS",
  },
  {
    id: "user-3",
    name: "Jordan Kim",
    email: "jordan@example.com",
    githubUsername: "jordankim",
    bio: "Open source contributor focused on reproducible bug reports and high-signal validation notes.",
    avatarInitials: "JK",
  },
  {
    id: "user-4",
    name: "Alex Rivera",
    email: "alex@example.com",
    githubUsername: "alexrivera",
    bio: "Product-minded engineer practicing smaller, cleaner OSS contributions across frameworks.",
    avatarInitials: "AR",
  },
];

export const mockSubmissions: SubmissionRecord[] = [
  {
    id: "submission-1",
    title: "Draft workflow for loading boundary issue",
    summary:
      "Scoped the reproduction path, boundary ownership, and a likely regression coverage outline.",
    challengeId: "challenge-next-loading-boundary",
    challengeSlug: "nextjs-loading-boundary",
    challengeTitle: "Clarify loading UI when a route segment fetch fails",
    userId: "user-1",
    status: "draft",
    updatedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    checklist: ["reproduction mapped", "files listed", "validation notes"],
  },
  {
    id: "submission-2",
    title: "Seed command DX proposal",
    summary:
      "Message rewrite drafted with notes on where to patch the CLI output and how to verify it.",
    challengeId: "challenge-prisma-seed-errors",
    challengeSlug: "prisma-seed-error-message",
    challengeTitle: "Improve the seed example error message for SQLite users",
    userId: "user-1",
    status: "submitted",
    updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    checklist: ["copy update", "verification plan", "maintainer questions"],
  },
  {
    id: "submission-3",
    title: "Onboarding docs consistency audit",
    summary:
      "Completed a cross-surface wording audit and captured all duplicate docs references for review.",
    challengeId: "challenge-astro-onboarding-copy",
    challengeSlug: "astro-onboarding-copy-audit",
    challengeTitle: "Tighten onboarding copy for a confusing starter command",
    userId: "user-1",
    status: "accepted",
    updatedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    checklist: ["duplicate pages checked", "copy revised", "review notes addressed"],
  },
];

export const mockChallengeEngagements: ChallengeEngagementRecord[] = [
  {
    id: "engagement-1",
    userId: "user-1",
    challengeId: "challenge-next-loading-boundary",
    status: "saved",
    pointsAwarded: 0,
    savedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-2",
    userId: "user-1",
    challengeId: "challenge-prisma-seed-errors",
    status: "started",
    pointsAwarded: 0,
    savedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-3",
    userId: "user-1",
    challengeId: "challenge-astro-onboarding-copy",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-astro-onboarding-copy"),
    savedAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-4",
    userId: "user-2",
    challengeId: "challenge-tailwind-parser-tests",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-tailwind-parser-tests"),
    savedAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-5",
    userId: "user-2",
    challengeId: "challenge-eslint-rule-meta",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-eslint-rule-meta"),
    savedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-6",
    userId: "user-2",
    challengeId: "challenge-gitea-template-preview",
    status: "started",
    pointsAwarded: 0,
    savedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-7",
    userId: "user-3",
    challengeId: "challenge-django-admin-empty-state",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-django-admin-empty-state"),
    savedAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 11 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-8",
    userId: "user-3",
    challengeId: "challenge-rust-analyzer-diagnostic-wording",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge(
      "challenge-rust-analyzer-diagnostic-wording",
    ),
    savedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-9",
    userId: "user-3",
    challengeId: "challenge-prisma-seed-errors",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-prisma-seed-errors"),
    savedAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 15 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-10",
    userId: "user-3",
    challengeId: "challenge-astro-onboarding-copy",
    status: "saved",
    pointsAwarded: 0,
    savedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-11",
    userId: "user-4",
    challengeId: "challenge-next-loading-boundary",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-next-loading-boundary"),
    savedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-12",
    userId: "user-4",
    challengeId: "challenge-gitea-template-preview",
    status: "completed",
    completionMethod: "manual",
    pointsAwarded: getAwardedPointsForChallenge("challenge-gitea-template-preview"),
    savedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    startedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
  },
  {
    id: "engagement-13",
    userId: "user-4",
    challengeId: "challenge-tailwind-parser-tests",
    status: "saved",
    pointsAwarded: 0,
    savedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
];

export const mockScores: ScoreRecord[] = mockUsers.map((user) => {
  const completedEngagements = mockChallengeEngagements.filter(
    (engagement) =>
      engagement.userId === user.id && engagement.status === "completed",
  );
  const totalPoints = completedEngagements.reduce(
    (sum, engagement) => sum + engagement.pointsAwarded,
    0,
  );

  return {
    id: `score-${user.id}`,
    userId: user.id,
    totalPoints,
    currentStreak: SCORE_DEFAULTS.currentStreak,
    completedChallenges: completedEngagements.length,
    rankLabel: getScoreRankLabel(totalPoints),
  };
});
