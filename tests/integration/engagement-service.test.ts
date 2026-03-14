import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ChallengeCompletionMethod,
  ChallengeEngagementStatus,
} from "@prisma/client";
import { createChallengeRecord } from "@/tests/factories/challenges";

const mocks = vi.hoisted(() => ({
  ensureChallengeSnapshot: vi.fn(),
  prisma: {
    challengeEngagement: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    score: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/challenges/persistence", () => ({
  ensureChallengeSnapshot: mocks.ensureChallengeSnapshot,
}));

vi.mock("@/lib/db/client", () => ({
  prisma: mocks.prisma,
}));

describe("engagement service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes a challenge, awards points, and syncs the user score summary", async () => {
    const now = new Date("2026-03-14T18:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const challenge = createChallengeRecord({
      difficulty: "beginner",
      points: 80,
    });
    const existingEngagement = {
      id: "engagement-1",
      userId: "user-1",
      challengeId: challenge.id,
      status: ChallengeEngagementStatus.SAVED,
      completionMethod: null,
      pointsAwarded: 0,
      savedAt: new Date("2026-03-10T09:00:00.000Z"),
      startedAt: null,
      completedAt: null,
    };

    mocks.prisma.challengeEngagement.findUnique.mockResolvedValue(existingEngagement);
    mocks.prisma.challengeEngagement.upsert.mockResolvedValue({
      ...existingEngagement,
      status: ChallengeEngagementStatus.COMPLETED,
      completionMethod: ChallengeCompletionMethod.MANUAL,
      pointsAwarded: 100,
      startedAt: now,
      completedAt: now,
    });
    mocks.prisma.challengeEngagement.findMany.mockResolvedValue([
      { pointsAwarded: 100, completedAt: now },
      { pointsAwarded: 170, completedAt: new Date("2026-03-12T10:00:00.000Z") },
    ]);
    mocks.prisma.score.upsert.mockResolvedValue({
      id: "score-1",
      userId: "user-1",
      totalPoints: 270,
      currentStreak: 0,
      completedChallenges: 2,
      rankLabel: "Arena Regular",
    });

    const { setChallengeEngagementStatus } = await import("@/lib/engagement/service");
    const engagement = await setChallengeEngagementStatus({
      userId: "user-1",
      challenge,
      status: "completed",
    });

    expect(mocks.ensureChallengeSnapshot).toHaveBeenCalledWith(challenge);
    expect(mocks.prisma.challengeEngagement.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          status: ChallengeEngagementStatus.COMPLETED,
          pointsAwarded: 100,
          completionMethod: ChallengeCompletionMethod.MANUAL,
          completedAt: now,
        }),
      }),
    );
    expect(mocks.prisma.score.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          totalPoints: 270,
          completedChallenges: 2,
          currentStreak: 0,
          rankLabel: "Arena Regular",
        }),
      }),
    );
    expect(engagement).toMatchObject({
      status: "completed",
      pointsAwarded: 100,
      completionMethod: "manual",
    });

    vi.useRealTimers();
  });
});
