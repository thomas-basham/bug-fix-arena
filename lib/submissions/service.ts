import "server-only";

import { prisma } from "@/lib/db/client";
import { ensureChallengeSnapshot } from "@/lib/challenges/persistence";
import {
  mapSubmissionModelToRecord,
  toPrismaSubmissionStatus,
} from "@/lib/db/mappers";
import {
  createEmptySubmissionCounts,
  normalizeSubmissionForkUrl,
  normalizeSubmissionNotes,
  normalizeSubmissionPrUrl,
} from "@/lib/submissions/normalize";
import { resolveNextSubmissionStatus, type SubmissionIntent } from "@/lib/submissions/lifecycle";
import type {
  ChallengeRecord,
  SubmissionRecord,
  UserSubmissionsSnapshot,
} from "@/types/domain";

export async function getSubmissionForUserAndChallenge(
  userId: string,
  challengeId: string,
): Promise<SubmissionRecord | null> {
  const submission = await prisma.submission.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
    include: {
      challenge: {
        include: {
          repository: true,
        },
      },
    },
  });

  return submission ? mapSubmissionModelToRecord(submission) : null;
}

export async function getUserSubmissionsSnapshot(
  userId: string,
): Promise<UserSubmissionsSnapshot> {
  const submissions = await prisma.submission.findMany({
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
        submittedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });
  const mappedSubmissions = submissions.map(mapSubmissionModelToRecord);
  const counts = createEmptySubmissionCounts();

  for (const submission of mappedSubmissions) {
    counts[submission.status] += 1;
  }

  return {
    submissions: mappedSubmissions,
    counts,
  };
}

export async function upsertChallengeSubmission(options: {
  userId: string;
  challenge: ChallengeRecord;
  notes?: string | null;
  githubPrUrl?: string | null;
  githubForkUrl?: string | null;
  intent: SubmissionIntent;
}) {
  const { userId, challenge, intent } = options;
  const notes = normalizeSubmissionNotes(options.notes);
  const githubPrUrl = normalizeSubmissionPrUrl(options.githubPrUrl);
  const githubForkUrl = normalizeSubmissionForkUrl(options.githubForkUrl);

  await ensureChallengeSnapshot(challenge);

  const existingSubmission = await prisma.submission.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
    include: {
      challenge: {
        include: {
          repository: true,
        },
      },
    },
  });
  const currentStatus = existingSubmission
    ? mapSubmissionModelToRecord(existingSubmission).status
    : undefined;
  const nextStatus = resolveNextSubmissionStatus(currentStatus, intent);
  const resolvedNotes = notes ?? existingSubmission?.notes ?? null;
  const resolvedGitHubPrUrl = githubPrUrl ?? existingSubmission?.githubPrUrl ?? null;
  const resolvedGitHubForkUrl =
    githubForkUrl ?? existingSubmission?.githubForkUrl ?? null;

  if (
    intent === "draft" &&
    !resolvedNotes &&
    !resolvedGitHubPrUrl &&
    !resolvedGitHubForkUrl
  ) {
    throw new Error(
      "Add notes, a fork URL, or a PR URL before saving a submission draft.",
    );
  }

  if (intent === "submit" && !resolvedGitHubPrUrl) {
    throw new Error("A GitHub pull request URL is required before submitting.");
  }

  const now = new Date();

  const submission = await prisma.submission.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
    update: {
      status: toPrismaSubmissionStatus(nextStatus),
      notes: resolvedNotes,
      githubPrUrl: resolvedGitHubPrUrl,
      githubForkUrl: resolvedGitHubForkUrl,
      submittedAt:
        nextStatus === "draft"
          ? existingSubmission?.submittedAt ?? null
          : existingSubmission?.submittedAt ?? now,
      // TODO: Trigger GitHub PR verification and status updates from here once automated checks exist.
    },
    create: {
      userId,
      challengeId: challenge.id,
      status: toPrismaSubmissionStatus(nextStatus),
      notes: resolvedNotes,
      githubPrUrl: resolvedGitHubPrUrl,
      githubForkUrl: resolvedGitHubForkUrl,
      submittedAt: nextStatus === "draft" ? null : now,
    },
    include: {
      challenge: {
        include: {
          repository: true,
        },
      },
    },
  });

  return mapSubmissionModelToRecord(submission);
}
