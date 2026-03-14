# Open Source Bug Fix Arena

Open Source Bug Fix Arena is a developer-focused MVP for discovering
beginner-friendly open source issues, turning them into structured challenge
briefs, and drafting a practical fix workflow before a pull request exists.

## What The App Does

- Surfaces beginner-friendly GitHub issues using labels like `good first issue`
  and `help wanted`
- Falls back to a realistic seeded catalog when GitHub is unavailable or not
  configured
- Lets developers browse a challenge feed, filter it, inspect a challenge in
  detail, and view a lightweight dashboard shell
- Frames each issue as a bug-fix workflow instead of trying to ship a full
  in-browser IDE too early

## Current MVP Scope

The current MVP includes:

- Home page with featured challenges and product framing
- Browse challenges page with filtering by language, difficulty, and label
- Challenge detail page with issue context, activity, acceptance criteria, and
  workflow guidance
- Dashboard shell with mock submission and scoring data
- Prisma schema for `User`, `Repository`, `Challenge`, `Submission`, and `Score`
- Seeded mock data reused by both the UI and database seed flow
- GitHub service layer with graceful fallback notices and empty-state handling
- Route-level loading states, global error handling, and not-found UX

## Architecture

The project keeps the architecture simple and intentionally production-shaped:

- `app/` contains route-level pages, loading states, and error boundaries
- `components/` holds reusable layout, UI, and challenge-specific modules
- `lib/config/` centralizes challenge labels, difficulty rules, language labels,
  and score defaults
- `lib/challenges/` holds normalization helpers and UI-facing view models for
  challenge data
- `lib/data/` contains mock-backed catalog logic and filtering
- `lib/db/` contains Prisma-to-domain mapping helpers for enum-safe writes
- `lib/github/` contains the GitHub API integration layer
- `types/` defines the shared domain, database, and GitHub response types
- `prisma/` contains the schema and seed script

Two decisions drive the MVP:

1. GitHub fetching is optional. If `GITHUB_TOKEN` is absent or GitHub fails, the
   app stays usable by switching to seeded sample issues.
2. The product stops at workflow planning for now. Auth depth, patch editing,
   automated validation, and PR export are all intentionally deferred.

## Future Roadmap

Planned next steps after this MVP:

- Persist challenge discovery and submissions through database-backed queries
- Add a real submission flow for saved drafts and structured fix plans
- Introduce authentication beyond the current shell-level assumptions
- Add leaderboard, AI hints, test runner integration, and PR export flow
- Replace `db push`-only setup with tracked Prisma migrations for schema history

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure your environment:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bug_fix_arena
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/bug_fix_arena
GITHUB_TOKEN=github_pat_replace_me
```

- `DATABASE_URL` is the pooled app connection used by the runtime and seed flow
- `DIRECT_URL` is the direct database connection used for Prisma CLI commands,
  which is especially important for providers like Supabase
- `GITHUB_TOKEN` enables authenticated GitHub API access for live issue and
  repository fetching
- `GITHUB_API_TIMEOUT_MS` controls how long the server waits on GitHub before
  falling back to the seeded mock catalog

3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Push the schema and seed the database:

```bash
npx prisma db push
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

- `npm run dev` starts the app locally
- `npm run lint` runs ESLint across the workspace
- `npm run build` creates a production build using Webpack
- `npm run db:generate` generates the Prisma client
- `npm run db:seed` loads the seeded MVP catalog into the database

## GitHub Integration

The GitHub integration is intentionally layered:

- `lib/github/client.ts` handles authenticated GitHub API requests, timeouts,
  and rate-limit-aware error classification
- `lib/github/normalize.ts` converts raw GitHub repository and issue payloads
  into the internal `RepositoryRecord` and `ChallengeRecord` models
- `lib/github/service.ts` orchestrates label-based issue search, repository
  hydration, and challenge feed assembly
- `lib/data/catalog.ts` decides whether the UI should render live GitHub-backed
  challenges or fall back to the seeded mock catalog

This keeps live GitHub usage reusable while preserving the mock fallback path
for local development, rate limits, or temporary API failures.
