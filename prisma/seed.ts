import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import {
  toPrismaChallengeCompletionMethod,
  toPrismaChallengeEngagementStatus,
  toPrismaChallengeSource,
  toPrismaChallengeStatus,
  toPrismaSubmissionStatus,
} from "../lib/db/mappers";
import {
  mockChallenges,
  mockChallengeEngagements,
  mockRepositories,
  mockScores,
  mockSubmissions,
  mockUsers,
} from "../lib/data/mock-data";

loadEnv({ path: ".env.local" });
loadEnv();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL must be set before running the seed script.",
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.submission.deleteMany();
  await prisma.challengeEngagement.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.challengeSyncRun.deleteMany();
  await prisma.score.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.user.deleteMany();

  for (const user of mockUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        bio: user.bio,
        avatarInitials: user.avatarInitials,
      },
    });
  }

  for (const repository of mockRepositories) {
    await prisma.repository.create({
      data: {
        id: repository.id,
        githubRepositoryId: repository.githubRepositoryId,
        owner: repository.owner,
        name: repository.name,
        fullName: repository.fullName,
        description: repository.description,
        language: repository.language,
        stars: repository.stars,
        openIssues: repository.openIssues,
        url: repository.url,
      },
    });
  }

  for (const challenge of mockChallenges) {
    await prisma.challenge.create({
      data: {
        id: challenge.id,
        githubNodeId: challenge.githubNodeId,
        githubIssueId: challenge.githubIssueId,
        slug: challenge.slug,
        title: challenge.title,
        summary: challenge.summary,
        body: challenge.body,
        difficulty: challenge.difficulty,
        status: toPrismaChallengeStatus(challenge.status),
        source: toPrismaChallengeSource("mock"),
        sourceCreatedAt: new Date(challenge.openedAt),
        sourceUpdatedAt: new Date(challenge.updatedAt),
        lastSyncedAt: challenge.lastSyncedAt
          ? new Date(challenge.lastSyncedAt)
          : undefined,
        inactiveReason: challenge.inactiveReason,
        labels: challenge.labels,
        techStack: challenge.techStack,
        issueNumber: challenge.issueNumber,
        issueUrl: challenge.issueUrl,
        estimatedMinutes: challenge.estimatedMinutes,
        points: challenge.points,
        acceptanceCriteria: challenge.acceptanceCriteria,
        workflowSteps: challenge.workflowSteps,
        learningOutcomes: challenge.learningOutcomes,
        repositoryId: challenge.repositoryId,
      },
    });
  }

  for (const submission of mockSubmissions) {
    await prisma.submission.create({
      data: {
        id: submission.id,
        title: submission.title,
        summary: submission.summary,
        checklist: submission.checklist,
        status: toPrismaSubmissionStatus(submission.status),
        challengeId: submission.challengeId,
        userId: submission.userId,
      },
    });
  }

  for (const engagement of mockChallengeEngagements) {
    await prisma.challengeEngagement.create({
      data: {
        id: engagement.id,
        userId: engagement.userId,
        challengeId: engagement.challengeId,
        status: toPrismaChallengeEngagementStatus(engagement.status),
        completionMethod: engagement.completionMethod
          ? toPrismaChallengeCompletionMethod(engagement.completionMethod)
          : undefined,
        pointsAwarded: engagement.pointsAwarded,
        savedAt: new Date(engagement.savedAt),
        startedAt: engagement.startedAt
          ? new Date(engagement.startedAt)
          : undefined,
        completedAt: engagement.completedAt
          ? new Date(engagement.completedAt)
          : undefined,
      },
    });
  }

  for (const score of mockScores) {
    await prisma.score.create({
      data: {
        id: score.id,
        totalPoints: score.totalPoints,
        currentStreak: score.currentStreak,
        completedChallenges: score.completedChallenges,
        rankLabel: score.rankLabel,
        userId: score.userId,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
