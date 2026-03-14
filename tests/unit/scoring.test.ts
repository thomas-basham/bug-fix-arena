import { describe, expect, it } from "vitest";
import { getChallengePointBreakdown, getScoreRankLabel } from "@/lib/config/challenges";
import {
  buildScoreSummary,
  getAwardedPointsForChallenge,
} from "@/lib/engagement/scoring";
import { createChallengeRecord } from "@/tests/factories/challenges";

describe("challenge scoring", () => {
  it("calculates reward, completion, and total points from difficulty defaults", () => {
    expect(getChallengePointBreakdown("beginner")).toEqual({
      rewardPoints: 80,
      completionPoints: 20,
      totalPoints: 100,
      scoreTierLabel: "Easy",
    });
    expect(getChallengePointBreakdown("advanced", 200)).toEqual({
      rewardPoints: 200,
      completionPoints: 40,
      totalPoints: 240,
      scoreTierLabel: "Hard",
    });
  });

  it("derives awarded challenge points from the challenge difficulty and reward", () => {
    const beginnerChallenge = createChallengeRecord({
      difficulty: "beginner",
      points: 80,
    });
    const advancedChallenge = createChallengeRecord({
      difficulty: "advanced",
      points: 170,
    });

    expect(getAwardedPointsForChallenge(beginnerChallenge)).toBe(100);
    expect(getAwardedPointsForChallenge(advancedChallenge)).toBe(210);
  });

  it("builds a score summary with totals, completion count, and rank label", () => {
    expect(
      buildScoreSummary([
        { pointsAwarded: 100 },
        { pointsAwarded: 150 },
        { pointsAwarded: 210 },
      ]),
    ).toEqual({
      totalPoints: 460,
      completedChallenges: 3,
      currentStreak: 0,
      rankLabel: "Arena Regular",
    });
  });

  it("maps rank thresholds consistently", () => {
    expect(getScoreRankLabel(0)).toBe("Arena Rookie");
    expect(getScoreRankLabel(100)).toBe("Arena Contender");
    expect(getScoreRankLabel(600)).toBe("Arena Veteran");
    expect(getScoreRankLabel(1200)).toBe("Arena Legend");
  });
});
