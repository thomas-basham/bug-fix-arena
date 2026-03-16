# Open Source Bug Fix Arena

**Live Demo:** [https://main.d3it84bzc6jetr.amplifyapp.com](https://main.d3it84bzc6jetr.amplifyapp.com)

Open Source Bug Fix Arena is a developer-focused web app for discovering
beginner-friendly open source issues, turning them into structured challenges,
and building the workflow needed to ship a real fix. The current product stops
short of full in-browser code execution on purpose. The MVP focuses on issue
discovery, challenge shaping, progress tracking, submissions, scoring, and
GitHub ingestion.

This README is written for three audiences:

- Recruiters who need to understand the product and why it is interesting
- Developers who want to run the project locally
- Collaborators who want to contribute without reverse-engineering the repo

## Product Overview

Open Source Bug Fix Arena takes noisy raw GitHub issue data and turns it into a
more intentional contributor experience:

- discover real issues tagged with `good first issue` or `help wanted`
- inspect a normalized challenge detail page with repository context and
  suggested approach guidance
- save, start, complete, and submit work against a challenge
- track points, leaderboard position, and submission history
- sync live GitHub issues into Postgres with manual admin control

The product direction is not “build another issue board.” It is “make bug-fix
work feel structured, game-like, and easier to start.”

## Core MVP Features

- Home page with product framing and featured challenges
- Browse page with search, filtering, sorting, pagination, and shareable URLs
- Challenge details page with:
  - issue summary
  - labels
  - repository metadata
  - reward and difficulty
  - suggested skills
  - related issues from the same repository
  - practical workflow guidance
- Lightweight demo auth scaffold using an HTTP-only cookie
- Dashboard for saved, started, completed challenges, and submission history
- Manual PR-based submission flow with draft and review-ready statuses
- First-pass scoring and leaderboard
- Internal admin sync page for GitHub ingestion
- Mock fallback catalog so the product still works when GitHub is unavailable
- High-value automated tests around normalization, catalog state, scoring, and
  server-side workflows

## Current Architecture

The codebase stays intentionally simple and production-shaped:

- `app/`
  Next.js App Router routes, route-level loading states, and error boundaries
- `components/`
  reusable UI, layout, challenge, dashboard, leaderboard, and submission
  modules
- `lib/auth/`
  lightweight demo session handling and admin gating
- `lib/challenges/`
  normalization, catalog URL state, persistence helpers, and view models
- `lib/config/`
  challenge labels, scoring rules, language metadata, and other centralized
  constants
- `lib/data/`
  catalog assembly, filtering, sorting, recommendations, and mock fallback data
- `lib/db/`
  Prisma client setup and enum-safe domain/database mappers
- `lib/engagement/`
  save/start/complete flows, dashboard queries, scoring logic, leaderboard
  queries
- `lib/github/`
  GitHub API client, normalization, constants, and live challenge discovery
- `lib/submissions/`
  submission lifecycle, URL normalization, persistence, and server actions
- `lib/sync/`
  manual ingestion workflow, deduplication, archival, and sync audit queries
- `prisma/`
  database schema, migrations, and seed script
- `tests/`
  Vitest fixtures and high-value unit/integration-style coverage

The main runtime pattern is:

1. fetch or read challenge data
2. normalize it into internal domain records
3. render server-first pages from stable internal types
4. mutate state through server actions or server-only services

## Tech Stack

- Next.js 16 App Router
- TypeScript
- React 19
- Tailwind CSS 4
- PostgreSQL
- Prisma ORM
- Vitest for focused automated tests
- GitHub REST API

## Database Overview

The current Prisma schema models the first real product loop:

- `User`
  contributor profile, demo-auth identity, related scores, engagements,
  submissions, and sync runs
- `Repository`
  normalized GitHub repository metadata
- `Challenge`
  normalized GitHub issue or mock challenge, plus sync metadata and repository
  relationship
- `ChallengeEngagement`
  one record per user per challenge for saved, started, and completed states
- `Submission`
  one record per user per challenge for PR-based submission state
- `Score`
  persisted score summary for leaderboard reads
- `ChallengeSyncRun`
  audit log for manual GitHub ingestion jobs

Relationship summary:

- one `Repository` has many `Challenge` records
- one `User` can have many `ChallengeEngagement` and `Submission` records
- one `Challenge` can have many `ChallengeEngagement` and `Submission` records
- one `User` has one `Score`

This structure is intentionally ready for verified submissions later without
needing to redesign the core tables.

## GitHub Integration Overview

The GitHub layer is split so each concern stays reusable:

- `lib/github/client.ts`
  low-level API requests, auth headers, timeout handling, and rate-limit-aware
  errors
- `lib/github/normalize.ts`
  maps GitHub repositories and issues into internal `RepositoryRecord` and
  `ChallengeRecord` shapes
- `lib/github/service.ts`
  searches GitHub for qualifying issues and enriches them with repository data
- `lib/sync/service.ts`
  upserts normalized GitHub challenges into Postgres, deduplicates by GitHub
  identity and `(repositoryId, issueNumber)`, and archives stale issues when it
  is safe to do so
- `lib/data/catalog.ts`
  prefers persisted synced GitHub challenges, then falls back to live GitHub,
  then falls back to mock data

The integration is deliberately resilient:

- missing token -> use mock fallback
- GitHub failure -> use mock fallback
- rate limit -> use mock fallback with a user-facing notice
- partial repository enrichment -> keep usable data without silently losing the
  whole catalog

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values.

### 3. Generate Prisma client

```bash
npm run db:generate
```

### 4. Apply schema and seed data

```bash
npx prisma db push
npm run db:seed
```

### 5. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful local flows:

- sign in through the demo auth button to unlock dashboard features
- visit `/admin/sync` to trigger a manual GitHub ingestion run
- use the leaderboard and submissions pages to inspect score and workflow state

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Primary runtime database connection string |
| `DIRECT_URL` | Recommended | Direct database connection for Prisma CLI operations |
| `GITHUB_TOKEN` | Recommended | Authenticated GitHub API access for live challenge discovery |
| `GITHUB_API_TIMEOUT_MS` | Optional | Timeout for GitHub requests before falling back |
| `ADMIN_GITHUB_USERNAMES` | Optional | Comma-separated allowlist for `/admin/sync` |

Example:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bug_fix_arena
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/bug_fix_arena
GITHUB_TOKEN=github_pat_replace_me
GITHUB_API_TIMEOUT_MS=8000
ADMIN_GITHUB_USERNAMES=morganlee
```

Notes:

- `DIRECT_URL` is especially useful for hosted Postgres providers such as
  Supabase where pooled runtime access and direct migration access differ
- if `GITHUB_TOKEN` is missing, the app still runs with the seeded mock catalog
- in non-production environments, the admin sync page can fall back to any
  signed-in user if `ADMIN_GITHUB_USERNAMES` is left blank

## Useful Scripts

- `npm run dev`
  start the development server
- `npm run build`
  create a production build using Webpack
- `npm run start`
  run the production server
- `npm run lint`
  run ESLint
- `npm run test`
  run Vitest once
- `npm run test:watch`
  run Vitest in watch mode
- `npm run db:generate`
  generate the Prisma client
- `npm run db:seed`
  seed the database with mock MVP data

## Testing Strategy

The current test suite is intentionally concentrated on the logic with the
highest product risk:

- GitHub normalization
- catalog URL parsing and link generation
- score calculation and rank thresholds
- submission action behavior
- engagement and submission service flows

Run tests with:

```bash
npm run test
```

What is still intentionally light:

- presentational component coverage
- full route rendering tests
- real database-backed integration tests
- live GitHub networking tests

Those areas are lower leverage right now than the normalization and
state-transition layer.

## Collaboration Notes

If you want to contribute:

1. start with the internal domain types in `types/`
2. keep external data normalized at the boundary
3. prefer server-rendered flows unless interactivity clearly requires client
   state
4. update tests when touching catalog shaping, scoring, sync, or submission
   logic
5. preserve the fallback path so the app stays usable without GitHub

Additional contributor-oriented documentation lives in
[docs/developer-guide.md](docs/developer-guide.md).

## Roadmap

Near-term roadmap:

- move GitHub sync from manual admin action to scheduled background execution
- replace manual completion with verified submission review
- add richer maintainer context to challenge details
- improve submission review states and score event history
- expand catalog persistence and search depth

## Known Limitations

- authentication is a lightweight demo scaffold, not production identity
- challenge completion is still partly manual
- PR verification is not implemented yet
- GitHub discovery still depends on public issue quality and API rate limits
- there is no sandboxed execution or automated patch validation yet
- the scoring model is intentionally simple and not anti-cheat hardened
- search and filtering are still optimized for MVP-scale catalogs

## Future Vision

The long-term product direction is a more serious contribution workflow:

- **Verified submissions**
  accept and score work based on real PR state, review outcomes, and repository
  matching
- **AI hints**
  offer scoped debugging guidance, onboarding help, and repository-specific
  learning support without replacing the contributor’s judgment
- **Sandbox execution**
  run validation workflows or lightweight test execution in a safe isolated
  environment
- **Tournaments**
  package groups of issues into time-boxed competitions or themed events
- **Maintainer workflows**
  let maintainers curate issues, review submissions, and use the product as a
  structured contributor funnel

## Developer Guide

For deeper implementation notes, contribution patterns, and key runtime flows,
see [docs/developer-guide.md](docs/developer-guide.md).
