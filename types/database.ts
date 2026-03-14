import type {
  Challenge,
  ChallengeEngagement,
  ChallengeSyncRun,
  Prisma,
  Repository,
  Score,
  Submission,
  User,
} from "@prisma/client";

export type UserModel = User;
export type RepositoryModel = Repository;
export type ChallengeModel = Challenge;
export type SubmissionModel = Submission;
export type ScoreModel = Score;
export type ChallengeEngagementModel = ChallengeEngagement;
export type ChallengeSyncRunModel = ChallengeSyncRun;

export type ChallengeWithRepositoryModel = Prisma.ChallengeGetPayload<{
  include: {
    repository: true;
  };
}>;

export type SubmissionWithChallengeModel = Prisma.SubmissionGetPayload<{
  include: {
    challenge: true;
  };
}>;

export type ChallengeEngagementWithChallengeModel =
  Prisma.ChallengeEngagementGetPayload<{
    include: {
      challenge: {
        include: {
          repository: true;
        };
      };
    };
  }>;

export type ChallengeSyncRunWithUserModel = Prisma.ChallengeSyncRunGetPayload<{
  include: {
    triggeredByUser: {
      select: {
        id: true;
        name: true;
        githubUsername: true;
        avatarInitials: true;
      };
    };
  };
}>;
