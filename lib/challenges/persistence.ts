import "server-only";

import { prisma } from "@/lib/db/client";
import {
  toPrismaChallengeSource,
  toPrismaChallengeStatus,
} from "@/lib/db/mappers";
import type { ChallengeRecord } from "@/types/domain";

export async function ensureChallengeSnapshot(challenge: ChallengeRecord) {
  await prisma.repository.upsert({
    where: {
      id: challenge.repository.id,
    },
    update: {
      githubRepositoryId: challenge.repository.githubRepositoryId,
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
      githubRepositoryId: challenge.repository.githubRepositoryId,
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
      githubNodeId: challenge.githubNodeId,
      githubIssueId: challenge.githubIssueId,
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      body: challenge.body,
      difficulty: challenge.difficulty,
      status: toPrismaChallengeStatus(challenge.status),
      source: toPrismaChallengeSource(challenge.source),
      sourceCreatedAt: new Date(challenge.openedAt),
      sourceUpdatedAt: new Date(challenge.updatedAt),
      lastSyncedAt: challenge.lastSyncedAt
        ? new Date(challenge.lastSyncedAt)
        : undefined,
      inactiveReason: challenge.inactiveReason ?? null,
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
      githubNodeId: challenge.githubNodeId,
      githubIssueId: challenge.githubIssueId,
      slug: challenge.slug,
      title: challenge.title,
      summary: challenge.summary,
      body: challenge.body,
      difficulty: challenge.difficulty,
      status: toPrismaChallengeStatus(challenge.status),
      source: toPrismaChallengeSource(challenge.source),
      sourceCreatedAt: new Date(challenge.openedAt),
      sourceUpdatedAt: new Date(challenge.updatedAt),
      lastSyncedAt: challenge.lastSyncedAt
        ? new Date(challenge.lastSyncedAt)
        : undefined,
      inactiveReason: challenge.inactiveReason ?? null,
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
