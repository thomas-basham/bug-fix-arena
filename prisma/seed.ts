import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import {
  mockChallenges,
  mockRepositories,
  mockScores,
  mockSubmissions,
  mockUsers,
} from "../lib/data/mock-data";

loadEnv({ path: ".env.local" });
loadEnv();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set before running the seed script.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.submission.deleteMany();
  await prisma.challenge.deleteMany();
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
        slug: challenge.slug,
        title: challenge.title,
        summary: challenge.summary,
        body: challenge.body,
        difficulty: challenge.difficulty,
        status: challenge.status.toUpperCase() as "OPEN" | "REVIEW" | "ARCHIVED",
        source: "MOCK",
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
        status: submission.status.toUpperCase() as
          | "DRAFT"
          | "SUBMITTED"
          | "ACCEPTED"
          | "REJECTED",
        challengeId: submission.challengeId,
        userId: submission.userId,
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
