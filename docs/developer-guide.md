# Developer Guide

This guide is for collaborators working on Open Source Bug Fix Arena after the
initial MVP.

## Product Shape

The current product loop is:

1. ingest or fetch GitHub issues
2. normalize them into internal challenge records
3. let users browse and inspect those challenges
4. let users save, start, complete, and submit work
5. reflect that engagement in the dashboard and leaderboard

The codebase is intentionally server-first. Most pages render from server-side
queries and pure domain helpers, with client components used only where user
interaction requires them.

## Directory Map

- `app/`
  route entry points, loading states, and error boundaries
- `components/`
  reusable interface modules grouped by domain
- `lib/auth/`
  demo session auth and admin access checks
- `lib/challenges/`
  normalization helpers, persistence helpers, catalog URL state, and view
  models
- `lib/config/`
  shared constants and product rules
- `lib/data/`
  catalog shaping, filtering, sorting, mock data, and recommendations
- `lib/db/`
  Prisma client setup and mappers between Prisma and domain types
- `lib/engagement/`
  dashboard reads, engagement mutations, scoring, and leaderboard queries
- `lib/github/`
  GitHub client, normalization, and live discovery
- `lib/submissions/`
  submission normalization, lifecycle, persistence, and actions
- `lib/sync/`
  GitHub ingestion and sync audit logic
- `prisma/`
  schema, migrations, and seed flow
- `tests/`
  high-value unit and integration-style tests

## Core Runtime Flows

## 1. Catalog Discovery

- `lib/data/catalog.ts` is the main catalog orchestrator
- it prefers persisted synced GitHub challenges first
- if there are no persisted GitHub challenges, it attempts a live GitHub fetch
- if GitHub is unavailable or incomplete, it falls back to seeded mock data
- all challenge data is normalized into internal `ChallengeRecord` types before
  rendering

This fallback behavior is a product requirement, not just a developer
convenience. Do not remove it casually.

## 2. GitHub Sync

- `/admin/sync` triggers a manual sync action
- `lib/sync/service.ts` fetches qualifying GitHub issues and normalizes them
- repository and challenge records are upserted into Postgres
- existing GitHub-sourced challenges can be marked inactive when a sync window
  is complete enough to trust archival
- each run creates a `ChallengeSyncRun` audit record

If you change sync behavior, preserve:

- deduplication by GitHub identity and repository issue number
- explicit sync logs
- safe archival behavior
- clear failure states

## 3. Engagement and Scoring

- engagement state lives in `ChallengeEngagement`
- score summaries live in `Score`
- `lib/engagement/service.ts` owns the main read/write behavior
- `lib/engagement/scoring.ts` holds point calculations and rank derivation

Current scoring is intentionally simple and manually triggered. Future verified
submissions should build on this rather than bypass it.

## 4. Submission Flow

- submissions are stored separately from engagement state
- one user currently has one submission record per challenge
- `lib/submissions/service.ts` owns persistence
- `lib/submissions/lifecycle.ts` holds pure lifecycle rules
- the challenge page exposes the current submission form

This separation is deliberate:

- engagement answers “what is the user doing with the challenge?”
- submission answers “what artifact did the user submit?”

## Contribution Guidelines

## Normalize At The Boundary

When external data enters the app, normalize it once and keep the rest of the
app working with internal domain types. Avoid letting raw GitHub or Prisma
shapes spread through page components.

## Prefer Central Rules

If you need to change:

- labels
- difficulty mapping
- language metadata
- score thresholds

put the rule in `lib/config/` or another narrow domain module instead of
repeating literals across the app.

## Keep Server And Client Responsibilities Clear

Prefer:

- server components for data reads
- server actions for mutations that belong to a page flow
- small client components only where form state or browser interactivity is
  needed

Avoid moving catalog shaping or persistence behavior into client code.

## Test The Risky Parts

When you touch:

- normalization
- catalog filtering/sorting/state helpers
- scoring
- sync logic
- submission lifecycle

add or update tests. These are the areas most likely to cause product-level
regressions.

## Common Commands

```bash
npm install
npm run db:generate
npx prisma db push
npm run db:seed
npm run dev
```

Quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Notes For Future Work

## Verified Submissions

When implementing verified submissions, do not couple score awarding directly to
the raw PR URL field. Introduce a verification step or score event layer so
leaderboard totals can be audited and recomputed.

## AI Hints

If AI hints are added, keep them advisory. They should enrich the challenge
brief, not replace repository context or hide the source issue.

## Sandbox Execution

If sandbox execution is introduced later, keep it outside the main page request
path. Validation jobs should be asynchronous and explicitly tied to submission
state.

## Maintainer Workflows

If maintainer tooling lands, keep the contributor-facing experience separate
from internal review operations. The current admin sync page is intentionally
minimal and should not become a dumping ground for unrelated admin features.
