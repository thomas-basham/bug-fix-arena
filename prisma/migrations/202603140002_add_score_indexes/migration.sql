CREATE INDEX IF NOT EXISTS "Score_totalPoints_completedChallenges_idx"
ON "Score"("totalPoints", "completedChallenges");

CREATE INDEX IF NOT EXISTS "ChallengeEngagement_status_completedAt_idx"
ON "ChallengeEngagement"("status", "completedAt");
