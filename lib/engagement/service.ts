import "server-only";

import type {
  ChallengeEngagementRecord,
  ChallengeEngagementStatus,
  ChallengeRecord,
  DashboardChallengeRecord,
  LeaderboardActivityRecord,
  LeaderboardEntryRecord,
  LeaderboardSnapshot,
  PublicUserRecord,
  ScoreRecord,
  UserDashboardSnapshot,
} from "@/types/domain";
import { mockUsers } from "@/lib/data/mock-data";
import {
  mapChallengeModelToRecord,
  toDomainChallengeCompletionMethod,
  toDomainChallengeEngagementStatus,
  toPrismaChallengeCompletionMethod,
  toPrismaChallengeEngagementStatus,
  toPrismaChallengeSource,
  toPrismaChallengeStatus,
} from "@/lib/db/mappers";
import { prisma } from "@/lib/db/client";
import {
  SCORE_STREAK_SETTINGS,
  getChallengePointBreakdown,
  getScoreRankLabel,
} from "@/lib/config/challenges";

function mapPublicUserRecord(user: {
  id: string;
  name: string;
  githubUsername: string;
  avatarInitials: string | null;
}): PublicUserRecord {
  return {
    id: user.id,
    name: user.name,
    githubUsername: user.githubUsername,
    avatarInitials: user.avatarInitials,
  };
}

function mapEngagementRecord(engagement: {
  id: string;
  userId: string;
  challengeId: string;
  status: Parameters<typeof toDomainChallengeEngagementStatus>[0];
  completionMethod: Parameters<typeof toDomainChallengeCompletionMethod>[0];
  pointsAwarded: number;
  savedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}): ChallengeEngagementRecord {
  return {
    id: engagement.id,
    userId: engagement.userId,
    challengeId: engagement.challengeId,
    status: toDomainChallengeEngagementStatus(engagement.status),
    completionMethod: toDomainChallengeCompletionMethod(engagement.completionMethod),
    pointsAwarded: engagement.pointsAwarded,
    savedAt: engagement.savedAt.toISOString(),
    startedAt: engagement.startedAt?.toISOString(),
    completedAt: engagement.completedAt?.toISOString(),
  };
}

function mapDashboardChallengeRecord(engagement: {
  id: string;
  userId: string;
  challengeId: string;
  status: Parameters<typeof toDomainChallengeEngagementStatus>[0];
  completionMethod: Parameters<typeof toDomainChallengeCompletionMethod>[0];
  pointsAwarded: number;
  savedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  challenge: Parameters<typeof mapChallengeModelToRecord>[0];
}): DashboardChallengeRecord {
  return {
    engagement: mapEngagementRecord(engagement),
    challenge: mapChallengeModelToRecord(engagement.challenge),
  };
}

function getAwardedPointsForChallenge(challenge: ChallengeRecord) {
  return getChallengePointBreakdown(challenge.difficulty, challenge.points).totalPoints;
}

function buildScoreSummary(
  completedEngagements: Array<{
    pointsAwarded: number;
  }>,
) {
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

async function syncUserScore(userId: string) {
  const completedEngagements = await prisma.challengeEngagement.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    select: {
      pointsAwarded: true,
      completedAt: true,
    },
    orderBy: {
      completedAt: "desc",
    },
  });
  const scoreSummary = buildScoreSummary(completedEngagements);

  return prisma.score.upsert({
    where: {
      userId,
    },
    update: {
      totalPoints: scoreSummary.totalPoints,
      currentStreak: scoreSummary.currentStreak,
      completedChallenges: scoreSummary.completedChallenges,
      rankLabel: scoreSummary.rankLabel,
    },
    create: {
      userId,
      totalPoints: scoreSummary.totalPoints,
      currentStreak: scoreSummary.currentStreak,
      completedChallenges: scoreSummary.completedChallenges,
      rankLabel: scoreSummary.rankLabel,
    },
  });
}

async function ensureChallengeSnapshot(challenge: ChallengeRecord) {
  await prisma.repository.upsert({
    where: {
      id: challenge.repository.id,
    },
    update: {
      owner: challenge.repository.owner,
      name: challenge.repository.name,
      fullName: challenge.repository.fullName,
      description: challenge.repository.description,
      language: challenge.repository.language,
      stars: challenge.repository.stars,
      openIssues: challenge.repository.openIssues,
      url: challenge.repository.url,
    },
    create: {
      id: challenge.repository.id,
      owner: challenge.repository.owner,
      name: challenge.repository.name,
      fullName: challenge.repository.fullName,
      description: challenge.repository.description,
      language: challenge.repository.language,
      stars: challenge.repository.stars,
      openIssues: challenge.repository.openIssues,
      url: challenge.repository.url,
    },
  });

  await prisma.challenge.upsert({
    where: {
      id: challenge.id,
    },
    update: {
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      body: challenge.body,
      difficulty: challenge.difficulty,
      status: toPrismaChallengeStatus(challenge.status),
      source: toPrismaChallengeSource(challenge.source),
      labels: challenge.labels,
      techStack: challenge.techStack,
      issueNumber: challenge.issueNumber,
      issueUrl: challenge.issueUrl,
      estimatedMinutes: challenge.estimatedMinutes,
      points: challenge.points,
      acceptanceCriteria: challenge.acceptanceCriteria,
      workflowSteps: challenge.workflowSteps,
      learningOutcomes: challenge.learningOutcomes,
      repositoryId: challenge.repository.id,
    },
    create: {
      id: challenge.id,
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      body: challenge.body,
      difficulty: challenge.difficulty,
      status: toPrismaChallengeStatus(challenge.status),
      source: toPrismaChallengeSource(challenge.source),
      labels: challenge.labels,
      techStack: challenge.techStack,
      issueNumber: challenge.issueNumber,
      issueUrl: challenge.issueUrl,
      estimatedMinutes: challenge.estimatedMinutes,
      points: challenge.points,
      acceptanceCriteria: challenge.acceptanceCriteria,
      workflowSteps: challenge.workflowSteps,
      learningOutcomes: challenge.learningOutcomes,
      repositoryId: challenge.repository.id,
    },
  });
}

export async function getChallengeEngagementForUser(
  userId: string,
  challengeId: string,
) {
  const engagement = await prisma.challengeEngagement.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  return engagement ? mapEngagementRecord(engagement) : null;
}

export async function setChallengeEngagementStatus(options: {
  userId: string;
  challenge: ChallengeRecord;
  status: ChallengeEngagementStatus;
}) {
  const { userId, challenge, status } = options;
  const now = new Date();

  await ensureChallengeSnapshot(challenge);
  const existingEngagement = await prisma.challengeEngagement.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
  });

  const engagement = await prisma.challengeEngagement.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
    update: {
      status: toPrismaChallengeEngagementStatus(status),
      pointsAwarded: status === "completed" ? getAwardedPointsForChallenge(challenge) : 0,
      completionMethod:
        status === "completed"
          ? toPrismaChallengeCompletionMethod("manual")
          : null,
      startedAt:
        status === "started" || status === "completed"
          ? existingEngagement?.startedAt ?? now
          : null,
      completedAt:
        status === "completed"
          ? existingEngagement?.completedAt ?? now
          : null,
    },
    create: {
      userId,
      challengeId: challenge.id,
      status: toPrismaChallengeEngagementStatus(status),
      pointsAwarded: status === "completed" ? getAwardedPointsForChallenge(challenge) : 0,
      completionMethod:
        status === "completed"
          ? toPrismaChallengeCompletionMethod("manual")
          : null,
      savedAt: now,
      startedAt:
        status === "started" || status === "completed"
          ? now
          : null,
      completedAt: status === "completed" ? now : null,
    },
  });

  await syncUserScore(userId);

  return mapEngagementRecord(engagement);
}

export async function getUserDashboardSnapshot(
  userId: string,
): Promise<UserDashboardSnapshot | null> {
  const [user, score, engagements] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        githubUsername: true,
        bio: true,
        avatarInitials: true,
      },
    }),
    prisma.score.findUnique({
      where: {
        userId,
      },
    }),
    prisma.challengeEngagement.findMany({
      where: {
        userId,
      },
      include: {
        challenge: {
          include: {
            repository: true,
          },
        },
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }),
  ]);

  if (!user) {
    return null;
  }

  const mappedEngagements = engagements.map(mapDashboardChallengeRecord);
  const completedChallenges = mappedEngagements.filter(
    (entry) => entry.engagement.status === "completed",
  );
  const scoreSummary = buildScoreSummary(
    completedChallenges.map((entry) => ({
      pointsAwarded: entry.engagement.pointsAwarded,
    })),
  );
  const fallbackScore: ScoreRecord = {
    id: `score-${user.id}`,
    userId: user.id,
    totalPoints: scoreSummary.totalPoints,
    currentStreak: scoreSummary.currentStreak,
    completedChallenges: scoreSummary.completedChallenges,
    rankLabel: scoreSummary.rankLabel,
  };

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      bio:
        user.bio ??
        mockUsers[0]?.bio ??
        "Open source contributor profile is still being fleshed out.",
      avatarInitials: user.avatarInitials,
    },
    score: score
      ? {
          id: score.id,
          userId: score.userId,
          totalPoints: score.totalPoints,
          currentStreak: score.currentStreak,
          completedChallenges: score.completedChallenges,
          rankLabel: score.rankLabel,
        }
      : fallbackScore,
    savedChallenges: mappedEngagements.filter(
      (entry) => entry.engagement.status === "saved",
    ),
    startedChallenges: mappedEngagements.filter(
      (entry) => entry.engagement.status === "started",
    ),
    completedChallenges,
  };
}

function mapLeaderboardEntry(
  score: {
    id: string;
    userId: string;
    totalPoints: number;
    currentStreak: number;
    completedChallenges: number;
    rankLabel: string;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      githubUsername: string;
      avatarInitials: string | null;
    };
  },
  rank: number,
): LeaderboardEntryRecord {
  return {
    rank,
    user: mapPublicUserRecord(score.user),
    score: {
      id: score.id,
      userId: score.userId,
      totalPoints: score.totalPoints,
      currentStreak: score.currentStreak,
      completedChallenges: score.completedChallenges,
      rankLabel: score.rankLabel,
    },
    lastScoreUpdateAt: score.updatedAt.toISOString(),
  };
}

function mapLeaderboardActivity(
  engagement: {
    id: string;
    completedAt: Date | null;
    pointsAwarded: number;
    user: {
      id: string;
      name: string;
      githubUsername: string;
      avatarInitials: string | null;
    };
    challenge: {
      slug: string;
      title: string;
    };
  },
): LeaderboardActivityRecord {
  return {
    id: engagement.id,
    challengeSlug: engagement.challenge.slug,
    challengeTitle: engagement.challenge.title,
    completedAt: (engagement.completedAt ?? new Date()).toISOString(),
    pointsAwarded: engagement.pointsAwarded,
    user: mapPublicUserRecord(engagement.user),
  };
}

export async function getLeaderboardSnapshot(
  limit = 10,
): Promise<LeaderboardSnapshot> {
  const [scores, recentActivity] = await Promise.all([
    prisma.score.findMany({
      take: limit,
      orderBy: [
        {
          totalPoints: "desc",
        },
        {
          completedChallenges: "desc",
        },
        {
          updatedAt: "asc",
        },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarInitials: true,
          },
        },
      },
    }),
    prisma.challengeEngagement.findMany({
      where: {
        status: "COMPLETED",
        completedAt: {
          not: null,
        },
      },
      take: 8,
      orderBy: {
        completedAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarInitials: true,
          },
        },
        challenge: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
    }),
  ]);

  return {
    entries: scores.map((score, index) => mapLeaderboardEntry(score, index + 1)),
    recentActivity: recentActivity.map(mapLeaderboardActivity),
  };
}
