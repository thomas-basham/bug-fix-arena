import {
  ChallengeCompletionMethod as PrismaChallengeCompletionMethod,
  ChallengeEngagementStatus as PrismaChallengeEngagementStatus,
  ChallengeSource as PrismaChallengeSource,
  ChallengeStatus as PrismaChallengeStatus,
  SubmissionStatus as PrismaSubmissionStatus,
} from "@prisma/client";
import { isChallengeDifficulty, normalizeChallengeLanguage } from "@/lib/config/challenges";
import type {
  ChallengeCompletionMethod,
  ChallengeEngagementStatus,
  ChallengeRecord,
  ChallengeSource,
  ChallengeStatus,
  RepositoryRecord,
  SubmissionStatus,
} from "@/types/domain";
import type {
  ChallengeWithRepositoryModel,
  RepositoryModel,
} from "@/types/database";

const challengeStatusMap = {
  archived: PrismaChallengeStatus.ARCHIVED,
  open: PrismaChallengeStatus.OPEN,
  review: PrismaChallengeStatus.REVIEW,
} as const satisfies Record<ChallengeStatus, PrismaChallengeStatus>;

const challengeSourceMap = {
  github: PrismaChallengeSource.GITHUB,
  mock: PrismaChallengeSource.MOCK,
} as const satisfies Record<ChallengeSource, PrismaChallengeSource>;

const submissionStatusMap = {
  accepted: PrismaSubmissionStatus.ACCEPTED,
  draft: PrismaSubmissionStatus.DRAFT,
  rejected: PrismaSubmissionStatus.REJECTED,
  submitted: PrismaSubmissionStatus.SUBMITTED,
} as const satisfies Record<SubmissionStatus, PrismaSubmissionStatus>;

const challengeEngagementStatusMap = {
  completed: PrismaChallengeEngagementStatus.COMPLETED,
  saved: PrismaChallengeEngagementStatus.SAVED,
  started: PrismaChallengeEngagementStatus.STARTED,
} as const satisfies Record<
  ChallengeEngagementStatus,
  PrismaChallengeEngagementStatus
>;

const challengeCompletionMethodMap = {
  automated: PrismaChallengeCompletionMethod.AUTOMATED,
  manual: PrismaChallengeCompletionMethod.MANUAL,
} as const satisfies Record<
  ChallengeCompletionMethod,
  PrismaChallengeCompletionMethod
>;

export function toPrismaChallengeStatus(status: ChallengeStatus) {
  return challengeStatusMap[status];
}

export function toPrismaChallengeSource(source: ChallengeSource) {
  return challengeSourceMap[source];
}

export function toPrismaSubmissionStatus(status: SubmissionStatus) {
  return submissionStatusMap[status];
}

export function toPrismaChallengeEngagementStatus(
  status: ChallengeEngagementStatus,
) {
  return challengeEngagementStatusMap[status];
}

export function toPrismaChallengeCompletionMethod(
  method: ChallengeCompletionMethod,
) {
  return challengeCompletionMethodMap[method];
}

export function toDomainChallengeStatus(
  status: PrismaChallengeStatus,
): ChallengeStatus {
  return status.toLowerCase() as ChallengeStatus;
}

export function toDomainChallengeSource(
  source: PrismaChallengeSource,
): ChallengeSource {
  return source.toLowerCase() as ChallengeSource;
}

export function toDomainChallengeEngagementStatus(
  status: PrismaChallengeEngagementStatus,
): ChallengeEngagementStatus {
  return status.toLowerCase() as ChallengeEngagementStatus;
}

export function toDomainChallengeCompletionMethod(
  method: PrismaChallengeCompletionMethod | null,
): ChallengeCompletionMethod | undefined {
  return method
    ? (method.toLowerCase() as ChallengeCompletionMethod)
    : undefined;
}

export function mapRepositoryModelToRecord(
  repository: RepositoryModel,
): RepositoryRecord {
  return {
    id: repository.id,
    owner: repository.owner,
    name: repository.name,
    fullName: repository.fullName,
    description: repository.description ?? "Open source repository",
    language: normalizeChallengeLanguage(repository.language),
    stars: repository.stars,
    openIssues: repository.openIssues,
    url: repository.url,
  };
}

export function mapChallengeModelToRecord(
  challenge: ChallengeWithRepositoryModel,
): ChallengeRecord {
  const difficulty = isChallengeDifficulty(challenge.difficulty)
    ? challenge.difficulty
    : "beginner";

  return {
    id: challenge.id,
    slug: challenge.slug,
    title: challenge.title,
    summary: challenge.summary,
    body: challenge.body,
    openedAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    difficulty,
    status: toDomainChallengeStatus(challenge.status),
    source: toDomainChallengeSource(challenge.source),
    labels: [...challenge.labels],
    techStack: [...challenge.techStack],
    repositoryId: challenge.repositoryId,
    repository: mapRepositoryModelToRecord(challenge.repository),
    issueNumber: challenge.issueNumber,
    issueUrl: challenge.issueUrl,
    estimatedMinutes: challenge.estimatedMinutes,
    points: challenge.points,
    acceptanceCriteria: [...challenge.acceptanceCriteria],
    workflowSteps: [...challenge.workflowSteps],
    learningOutcomes: [...challenge.learningOutcomes],
    recentActivity: [],
  };
}
