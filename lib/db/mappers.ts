import {
  ChallengeSource as PrismaChallengeSource,
  ChallengeStatus as PrismaChallengeStatus,
  SubmissionStatus as PrismaSubmissionStatus,
} from "@prisma/client";
import type {
  ChallengeSource,
  ChallengeStatus,
  SubmissionStatus,
} from "@/types/domain";

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

export function toPrismaChallengeStatus(status: ChallengeStatus) {
  return challengeStatusMap[status];
}

export function toPrismaChallengeSource(source: ChallengeSource) {
  return challengeSourceMap[source];
}

export function toPrismaSubmissionStatus(status: SubmissionStatus) {
  return submissionStatusMap[status];
}
