import {
  SCORE_STREAK_SETTINGS,
  getChallengePointBreakdown,
  getScoreRankLabel,
} from "@/lib/config/challenges";
import type { ChallengeRecord } from "@/types/domain";

type CompletedEngagementPoints = {
  pointsAwarded: number;
};

export type ScoreSummary = {
  totalPoints: number;
  completedChallenges: number;
  currentStreak: number;
  rankLabel: string;
};

export function getAwardedPointsForChallenge(
  challenge: Pick<ChallengeRecord, "difficulty" | "points">,
) {
  return getChallengePointBreakdown(
    challenge.difficulty,
    challenge.points,
  ).totalPoints;
}

export function buildScoreSummary(
  completedEngagements: CompletedEngagementPoints[],
): ScoreSummary {
  const totalPoints = completedEngagements.reduce(
    (sum, engagement) => sum + engagement.pointsAwarded,
    0,
  );
  const completedChallenges = completedEngagements.length;

  return {
    totalPoints,
    completedChallenges,
    currentStreak: SCORE_STREAK_SETTINGS.enabled
      ? completedChallenges > 0
        ? Math.max(1, SCORE_STREAK_SETTINGS.placeholderValue)
        : SCORE_STREAK_SETTINGS.placeholderValue
      : SCORE_STREAK_SETTINGS.placeholderValue,
    rankLabel: getScoreRankLabel(totalPoints),
  };
}

