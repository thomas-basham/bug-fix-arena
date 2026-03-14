ALTER TYPE "SubmissionStatus" ADD VALUE IF NOT EXISTS 'UNDER_REVIEW';

ALTER TABLE "Submission"
ADD COLUMN IF NOT EXISTS "notes" TEXT,
ADD COLUMN IF NOT EXISTS "githubPrUrl" TEXT,
ADD COLUMN IF NOT EXISTS "githubForkUrl" TEXT,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP(3);

ALTER TABLE "Submission"
DROP COLUMN IF EXISTS "title",
DROP COLUMN IF EXISTS "summary",
DROP COLUMN IF EXISTS "checklist";

CREATE UNIQUE INDEX IF NOT EXISTS "Submission_userId_challengeId_key"
ON "Submission"("userId", "challengeId");

CREATE INDEX IF NOT EXISTS "Submission_userId_status_idx"
ON "Submission"("userId", "status");

CREATE INDEX IF NOT EXISTS "Submission_status_submittedAt_idx"
ON "Submission"("status", "submittedAt");
