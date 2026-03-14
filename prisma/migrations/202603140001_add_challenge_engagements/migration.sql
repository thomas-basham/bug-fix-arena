DO $$
BEGIN
  CREATE TYPE "ChallengeEngagementStatus" AS ENUM ('SAVED', 'STARTED', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "ChallengeCompletionMethod" AS ENUM ('MANUAL', 'AUTOMATED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ChallengeEngagement" (
  "id" TEXT NOT NULL,
  "status" "ChallengeEngagementStatus" NOT NULL DEFAULT 'SAVED',
  "completionMethod" "ChallengeCompletionMethod",
  "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
  "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "challengeId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "ChallengeEngagement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ChallengeEngagement_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ChallengeEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ChallengeEngagement_userId_challengeId_key"
ON "ChallengeEngagement"("userId", "challengeId");

CREATE INDEX IF NOT EXISTS "ChallengeEngagement_userId_status_idx"
ON "ChallengeEngagement"("userId", "status");

CREATE INDEX IF NOT EXISTS "ChallengeEngagement_challengeId_idx"
ON "ChallengeEngagement"("challengeId");
