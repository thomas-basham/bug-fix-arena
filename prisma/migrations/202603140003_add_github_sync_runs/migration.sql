DO $$
BEGIN
  CREATE TYPE "ChallengeSyncRunStatus" AS ENUM ('RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Repository"
ADD COLUMN IF NOT EXISTS "githubRepositoryId" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "Repository_githubRepositoryId_key"
ON "Repository"("githubRepositoryId");

ALTER TABLE "Challenge"
ADD COLUMN IF NOT EXISTS "githubNodeId" TEXT,
ADD COLUMN IF NOT EXISTS "githubIssueId" INTEGER,
ADD COLUMN IF NOT EXISTS "sourceCreatedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "sourceUpdatedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "inactiveReason" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Challenge_githubNodeId_key"
ON "Challenge"("githubNodeId");

CREATE UNIQUE INDEX IF NOT EXISTS "Challenge_githubIssueId_key"
ON "Challenge"("githubIssueId");

CREATE UNIQUE INDEX IF NOT EXISTS "Challenge_repositoryId_issueNumber_key"
ON "Challenge"("repositoryId", "issueNumber");

CREATE INDEX IF NOT EXISTS "Challenge_source_status_idx"
ON "Challenge"("source", "status");

CREATE INDEX IF NOT EXISTS "Challenge_source_lastSyncedAt_idx"
ON "Challenge"("source", "lastSyncedAt");

CREATE TABLE IF NOT EXISTS "ChallengeSyncRun" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'github',
  "status" "ChallengeSyncRunStatus" NOT NULL DEFAULT 'RUNNING',
  "fetchedCount" INTEGER NOT NULL DEFAULT 0,
  "importedCount" INTEGER NOT NULL DEFAULT 0,
  "updatedCount" INTEGER NOT NULL DEFAULT 0,
  "skippedCount" INTEGER NOT NULL DEFAULT 0,
  "archivedCount" INTEGER NOT NULL DEFAULT 0,
  "activeCount" INTEGER NOT NULL DEFAULT 0,
  "message" TEXT,
  "logs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "triggeredByUserId" TEXT,
  CONSTRAINT "ChallengeSyncRun_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ChallengeSyncRun_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ChallengeSyncRun_status_startedAt_idx"
ON "ChallengeSyncRun"("status", "startedAt");

CREATE INDEX IF NOT EXISTS "ChallengeSyncRun_startedAt_idx"
ON "ChallengeSyncRun"("startedAt");
