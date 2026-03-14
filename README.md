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
  detail, sign in with a lightweight demo session, and track saved or completed
  work in a persistence-backed dashboard
- Frames each issue as a bug-fix workflow instead of trying to ship a full
  in-browser IDE too early

## Current MVP Scope

The current MVP includes:

- Home page with featured challenges and product framing
- Browse challenges page with filtering by language, difficulty, and label
- Challenge detail page with issue context, activity, acceptance criteria, and
  workflow guidance
- Lightweight cookie-based demo auth scaffold
- Persistence-backed dashboard for saved, started, and manually completed
  challenges
- First-pass scoring and leaderboard pages backed by persisted score records
- Prisma schema for `User`, `Repository`, `Challenge`, `Submission`, and `Score`
- Prisma schema support for `ChallengeEngagement` so progress state can evolve
  into automated scoring later
- Internal admin sync page for manually importing and auditing GitHub challenge
  ingestion runs
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
- `lib/sync/` contains the manual GitHub ingestion workflow and sync audit
  queries
- `types/` defines the shared domain, database, and GitHub response types
- `prisma/` contains the schema and seed script

Two decisions drive the MVP:

1. GitHub fetching is optional. If `GITHUB_TOKEN` is absent or GitHub fails, the
   app stays usable by switching to seeded sample issues.
2. Authentication is intentionally lightweight. A demo session cookie unlocks
   progress tracking without adding OAuth complexity before the rest of the
   product loop is proven.
3. The product still stops at workflow planning for now. Patch editing,
   automated validation, and PR export are intentionally deferred.

## Future Roadmap

Planned next steps after this MVP:

- Persist challenge discovery and submissions through database-backed queries
- Add a real submission flow for saved drafts and structured fix plans
- Move manual GitHub sync into a scheduled background job with retry support
- Replace the demo session cookie with GitHub-backed authentication when the
  contribution workflow is ready for real identity
- Add verified submission review, AI hints, test runner integration, and PR
  export flow
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
ADMIN_GITHUB_USERNAMES=morganlee
```

- `DATABASE_URL` is the pooled app connection used by the runtime
- `DIRECT_URL` is the direct database connection used for Prisma CLI commands,
  migrations, and the seed flow, which is especially important for providers
  like Supabase
- `GITHUB_TOKEN` enables authenticated GitHub API access for live issue and
  repository fetching
- `GITHUB_API_TIMEOUT_MS` controls how long the server waits on GitHub before
  falling back to the seeded mock catalog
- `ADMIN_GITHUB_USERNAMES` is a comma-separated allowlist for the internal
  `/admin/sync` page. In non-production environments, any signed-in user can
  access that page if the variable is left blank.

The auth scaffold does not currently require extra environment variables. The
app uses a simple HTTP-only cookie to sign into the seeded demo contributor.

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

To use the engagement features, click `Demo Sign In` in the header or sign in
from the dashboard or any challenge detail page.

To run the ingestion workflow manually, sign in and open
`http://localhost:3000/admin/sync`.

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
- `lib/sync/service.ts` pages the qualifying GitHub issue feed, normalizes it,
  upserts it into Postgres, and archives stale GitHub challenges when the sync
  window is complete enough to do that safely
- `lib/data/catalog.ts` prefers persisted synced GitHub challenges when they
  exist, otherwise falls back to live GitHub and then to the seeded mock
  catalog

This keeps live GitHub usage reusable while preserving the mock fallback path
for local development, rate limits, or temporary API failures.
