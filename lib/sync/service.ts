import "server-only";

import type { Prisma } from "@prisma/client";
import { ChallengeSource, ChallengeStatus, ChallengeSyncRunStatus } from "@prisma/client";
import { normalizeChallengeRecord } from "@/lib/challenges/normalize";
import { prisma } from "@/lib/db/client";
import {
  mapChallengeModelToRecord,
  toPrismaChallengeSource,
  toPrismaChallengeStatus,
} from "@/lib/db/mappers";
import {
  DEFAULT_GITHUB_LABELS,
  GITHUB_SYNC_MAX_CHALLENGES,
  GITHUB_SYNC_MAX_PAGES_PER_LABEL,
  GITHUB_SYNC_RESULTS_PER_PAGE,
} from "@/lib/github/constants";
import { fetchGitHubChallenges } from "@/lib/github/service";
import type {
  ChallengeRecord,
  ChallengeSyncOverviewRecord,
  ChallengeSyncRunRecord,
  PublicUserRecord,
  RepositoryRecord,
} from "@/types/domain";
import type {
  ChallengeSyncRunWithUserModel,
  ChallengeWithRepositoryModel,
} from "@/types/database";

type RunGitHubChallengeSyncOptions = {
  triggeredByUserId?: string;
};

type ChallengeSnapshotRecord = {
  id: string;
  githubNodeId: string | null;
  githubIssueId: number | null;
  slug: string;
  title: string;
  summary: string;
  body: string;
  difficulty: string;
  status: ChallengeStatus;
  sourceCreatedAt: Date | null;
  sourceUpdatedAt: Date | null;
  inactiveReason: string | null;
  labels: string[];
  techStack: string[];
  issueNumber: number;
  issueUrl: string;
  estimatedMinutes: number;
  points: number;
  acceptanceCriteria: string[];
  workflowSteps: string[];
  learningOutcomes: string[];
  repositoryId: string;
};

function mapPublicUserRecord(user: ChallengeSyncRunWithUserModel["triggeredByUser"]): PublicUserRecord | undefined {
  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    name: user.name,
    githubUsername: user.githubUsername,
    avatarInitials: user.avatarInitials,
  };
}

function mapSyncRunRecord(run: ChallengeSyncRunWithUserModel): ChallengeSyncRunRecord {
  return {
    id: run.id,
    source: run.source,
    status: run.status.toLowerCase() as ChallengeSyncRunRecord["status"],
    fetchedCount: run.fetchedCount,
    importedCount: run.importedCount,
    updatedCount: run.updatedCount,
    skippedCount: run.skippedCount,
    archivedCount: run.archivedCount,
    activeCount: run.activeCount,
    message: run.message ?? undefined,
    logs: [...run.logs],
    startedAt: run.startedAt.toISOString(),
    completedAt: run.completedAt?.toISOString(),
    triggeredByUser: mapPublicUserRecord(run.triggeredByUser),
  };
}

function logSyncMessage(logs: string[], message: string, level: "info" | "warn" | "error" = "info") {
  const entry = `${new Date().toISOString()} ${message}`;
  logs.push(entry);

  const logger = level === "warn" ? console.warn : level === "error" ? console.error : console.info;
  logger(`[github-sync] ${message}`);
}

function buildRepositoryWhereInput(repository: RepositoryRecord): Prisma.RepositoryWhereInput[] {
  const conditions: Prisma.RepositoryWhereInput[] = [
    { fullName: repository.fullName },
    { id: repository.id },
  ];

  if (typeof repository.githubRepositoryId === "number") {
    conditions.unshift({ githubRepositoryId: repository.githubRepositoryId });
  }

  return conditions;
}

async function upsertRepositorySnapshot(repository: RepositoryRecord) {
  const existingRepository = await prisma.repository.findFirst({
    where: {
      OR: buildRepositoryWhereInput(repository),
    },
    select: {
      id: true,
    },
  });

  const repositoryData = {
    githubRepositoryId: repository.githubRepositoryId,
    owner: repository.owner,
    name: repository.name,
    fullName: repository.fullName,
    description: repository.description,
    language: repository.language,
    stars: repository.stars,
    openIssues: repository.openIssues,
    url: repository.url,
  };

  if (existingRepository) {
    await prisma.repository.update({
      where: {
        id: existingRepository.id,
      },
      data: repositoryData,
    });

    return existingRepository.id;
  }

  const createdRepository = await prisma.repository.create({
    data: {
      id: repository.id,
      ...repositoryData,
    },
    select: {
      id: true,
    },
  });

  return createdRepository.id;
}

function buildChallengeWhereInput(challenge: ChallengeRecord, repositoryId: string) {
  const conditions: Prisma.ChallengeWhereInput[] = [
    { id: challenge.id },
    { repositoryId, issueNumber: challenge.issueNumber },
  ];

  if (challenge.githubNodeId) {
    conditions.unshift({ githubNodeId: challenge.githubNodeId });
  }

  if (typeof challenge.githubIssueId === "number") {
    conditions.unshift({ githubIssueId: challenge.githubIssueId });
  }

  return conditions;
}

function areStringArraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function hasChallengeSnapshotChanged(
  existingChallenge: ChallengeSnapshotRecord,
  incomingChallenge: ChallengeRecord,
  repositoryId: string,
) {
  return (
    existingChallenge.githubNodeId !== (incomingChallenge.githubNodeId ?? null) ||
    existingChallenge.githubIssueId !== (incomingChallenge.githubIssueId ?? null) ||
    existingChallenge.slug !== incomingChallenge.slug ||
    existingChallenge.title !== incomingChallenge.title ||
    existingChallenge.summary !== incomingChallenge.summary ||
    existingChallenge.body !== incomingChallenge.body ||
    existingChallenge.difficulty !== incomingChallenge.difficulty ||
    existingChallenge.status !== ChallengeStatus.OPEN ||
    existingChallenge.sourceCreatedAt?.toISOString() !==
      new Date(incomingChallenge.openedAt).toISOString() ||
    existingChallenge.sourceUpdatedAt?.toISOString() !==
      new Date(incomingChallenge.updatedAt).toISOString() ||
    existingChallenge.inactiveReason !== null ||
    existingChallenge.repositoryId !== repositoryId ||
    existingChallenge.issueNumber !== incomingChallenge.issueNumber ||
    existingChallenge.issueUrl !== incomingChallenge.issueUrl ||
    existingChallenge.estimatedMinutes !== incomingChallenge.estimatedMinutes ||
    existingChallenge.points !== incomingChallenge.points ||
    !areStringArraysEqual(existingChallenge.labels, incomingChallenge.labels) ||
    !areStringArraysEqual(existingChallenge.techStack, incomingChallenge.techStack) ||
    !areStringArraysEqual(
      existingChallenge.acceptanceCriteria,
      incomingChallenge.acceptanceCriteria,
    ) ||
    !areStringArraysEqual(existingChallenge.workflowSteps, incomingChallenge.workflowSteps) ||
    !areStringArraysEqual(
      existingChallenge.learningOutcomes,
      incomingChallenge.learningOutcomes,
    )
  );
}

function buildChallengeWriteData(challenge: ChallengeRecord, repositoryId: string, syncedAt: Date) {
  return {
    githubNodeId: challenge.githubNodeId,
    githubIssueId: challenge.githubIssueId,
    slug: challenge.slug,
    title: challenge.title,
    summary: challenge.summary,
    body: challenge.body,
    difficulty: challenge.difficulty,
    status: toPrismaChallengeStatus("open"),
    source: toPrismaChallengeSource("github"),
    sourceCreatedAt: new Date(challenge.openedAt),
    sourceUpdatedAt: new Date(challenge.updatedAt),
    lastSyncedAt: syncedAt,
    inactiveReason: null,
    labels: challenge.labels,
    techStack: challenge.techStack,
    issueNumber: challenge.issueNumber,
    issueUrl: challenge.issueUrl,
    estimatedMinutes: challenge.estimatedMinutes,
    points: challenge.points,
    acceptanceCriteria: challenge.acceptanceCriteria,
    workflowSteps: challenge.workflowSteps,
    learningOutcomes: challenge.learningOutcomes,
    repositoryId,
  };
}

function shouldTreatAsNoResults(options: {
  status: string;
  fetchedCount?: number;
  message?: string;
}) {
  return (
    options.status === "error" &&
    (options.fetchedCount ?? 0) === 0 &&
    options.message?.includes("did not return any usable beginner-friendly issues") === true
  );
}

function buildSyncResultMessage(options: {
  fetchedCount: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  archivedCount: number;
  upstreamMessage?: string;
  isTruncated: boolean;
  archivalSkipped: boolean;
}) {
  const summary = `Fetched ${options.fetchedCount} candidate issue(s). Imported ${options.importedCount}, updated ${options.updatedCount}, skipped ${options.skippedCount}, archived ${options.archivedCount}.`;

  if (options.archivalSkipped) {
    return `${summary} Skipped archival because the sync window was incomplete.`;
  }

  if (options.upstreamMessage) {
    return `${summary} ${options.upstreamMessage}`;
  }

  if (options.isTruncated) {
    return `${summary} Discovery hit the configured sync window limit.`;
  }

  return summary;
}

export async function runGitHubChallengeSync({
  triggeredByUserId,
}: RunGitHubChallengeSyncOptions = {}) {
  const syncLogs: string[] = [];
  const syncRun = await prisma.challengeSyncRun.create({
    data: {
      source: "github",
      status: ChallengeSyncRunStatus.RUNNING,
      triggeredByUserId,
      logs: [],
    },
    include: {
      triggeredByUser: {
        select: {
          id: true,
          name: true,
          githubUsername: true,
          avatarInitials: true,
        },
      },
    },
  });

  logSyncMessage(
    syncLogs,
    `Started manual GitHub challenge sync for labels: ${DEFAULT_GITHUB_LABELS.join(", ")}.`,
  );

  try {
    const githubResult = await fetchGitHubChallenges({
      labels: DEFAULT_GITHUB_LABELS,
      limit: GITHUB_SYNC_MAX_CHALLENGES,
      perPage: GITHUB_SYNC_RESULTS_PER_PAGE,
      maxPages: GITHUB_SYNC_MAX_PAGES_PER_LABEL,
    });

    const noResultDiscovery = shouldTreatAsNoResults({
      status: githubResult.status,
      fetchedCount: githubResult.fetchedCount,
      message: githubResult.message,
    });
    const normalizedChallenges = githubResult.challenges.map(normalizeChallengeRecord);
    const syncedAt = new Date();

    logSyncMessage(
      syncLogs,
      `GitHub returned ${normalizedChallenges.length} normalized challenge(s) from ${githubResult.fetchedCount ?? normalizedChallenges.length} fetched candidate issue(s).`,
    );

    if (!noResultDiscovery && githubResult.status !== "ok" && normalizedChallenges.length === 0) {
      const failedRun = await prisma.challengeSyncRun.update({
        where: {
          id: syncRun.id,
        },
        data: {
          status: ChallengeSyncRunStatus.FAILED,
          fetchedCount: githubResult.fetchedCount ?? 0,
          message: githubResult.message ?? "GitHub sync failed before any challenges could be imported.",
          logs: syncLogs,
          completedAt: new Date(),
        },
        include: {
          triggeredByUser: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              avatarInitials: true,
            },
          },
        },
      });

      return mapSyncRunRecord(failedRun);
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const activeChallengeIds: string[] = [];

    for (const challenge of normalizedChallenges) {
      const repositoryId = await upsertRepositorySnapshot(challenge.repository);
      const existingChallenge = await prisma.challenge.findFirst({
        where: {
          OR: buildChallengeWhereInput(challenge, repositoryId),
        },
        select: {
          id: true,
          githubNodeId: true,
          githubIssueId: true,
          slug: true,
          title: true,
          summary: true,
          body: true,
          difficulty: true,
          status: true,
          sourceCreatedAt: true,
          sourceUpdatedAt: true,
          inactiveReason: true,
          labels: true,
          techStack: true,
          issueNumber: true,
          issueUrl: true,
          estimatedMinutes: true,
          points: true,
          acceptanceCriteria: true,
          workflowSteps: true,
          learningOutcomes: true,
          repositoryId: true,
        },
      });
      const challengeData = buildChallengeWriteData(challenge, repositoryId, syncedAt);

      if (!existingChallenge) {
        await prisma.challenge.create({
          data: {
            id: challenge.id,
            ...challengeData,
          },
        });
        importedCount += 1;
        activeChallengeIds.push(challenge.id);
        continue;
      }

      await prisma.challenge.update({
        where: {
          id: existingChallenge.id,
        },
        data: challengeData,
      });
      activeChallengeIds.push(existingChallenge.id);

      if (hasChallengeSnapshotChanged(existingChallenge, challenge, repositoryId)) {
        updatedCount += 1;
      } else {
        skippedCount += 1;
      }
    }

    let archivedCount = 0;
    let archivalSkipped = false;

    if (githubResult.status === "ok" && !githubResult.isTruncated) {
      const staleChallengeWhere: Prisma.ChallengeWhereInput = {
        source: ChallengeSource.GITHUB,
        status: {
          not: ChallengeStatus.ARCHIVED,
        },
      };

      if (activeChallengeIds.length > 0) {
        staleChallengeWhere.id = {
          notIn: activeChallengeIds,
        };
      }

      const staleChallenges = await prisma.challenge.findMany({
        where: staleChallengeWhere,
        select: {
          id: true,
        },
      });

      archivedCount = staleChallenges.length;

      if (staleChallenges.length > 0) {
        await prisma.challenge.updateMany({
          where: {
            id: {
              in: staleChallenges.map((challenge) => challenge.id),
            },
          },
          data: {
            status: ChallengeStatus.ARCHIVED,
            inactiveReason:
              "GitHub issue is closed or no longer matches the current beginner-friendly discovery rules.",
            lastSyncedAt: syncedAt,
          },
        });
      }
    } else if (normalizedChallenges.length > 0 || githubResult.isTruncated) {
      archivalSkipped = true;
      logSyncMessage(
        syncLogs,
        "Skipped archival because GitHub discovery was partial or hit the configured sync window limit.",
        "warn",
      );
    }

    const activeCount = await prisma.challenge.count({
      where: {
        source: ChallengeSource.GITHUB,
        status: {
          not: ChallengeStatus.ARCHIVED,
        },
      },
    });

    const resolvedStatus =
      (githubResult.status === "ok" || noResultDiscovery) && !archivalSkipped
        ? ChallengeSyncRunStatus.SUCCESS
        : githubResult.status === "ok" || normalizedChallenges.length > 0 || noResultDiscovery
          ? ChallengeSyncRunStatus.PARTIAL
          : ChallengeSyncRunStatus.FAILED;

    const syncMessage = buildSyncResultMessage({
      fetchedCount: githubResult.fetchedCount ?? normalizedChallenges.length,
      importedCount,
      updatedCount,
      skippedCount,
      archivedCount,
      upstreamMessage:
        noResultDiscovery
          ? "No qualifying issues are currently available from GitHub."
          : githubResult.message,
      isTruncated: githubResult.isTruncated === true,
      archivalSkipped,
    });

    logSyncMessage(syncLogs, syncMessage, resolvedStatus === ChallengeSyncRunStatus.PARTIAL ? "warn" : "info");

    const completedRun = await prisma.challengeSyncRun.update({
      where: {
        id: syncRun.id,
      },
      data: {
        status: resolvedStatus,
        fetchedCount: githubResult.fetchedCount ?? normalizedChallenges.length,
        importedCount,
        updatedCount,
        skippedCount,
        archivedCount,
        activeCount,
        message: syncMessage,
        logs: syncLogs,
        completedAt: new Date(),
      },
      include: {
        triggeredByUser: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarInitials: true,
          },
        },
      },
    });

    return mapSyncRunRecord(completedRun);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unexpected sync failure while importing GitHub challenges.";

    logSyncMessage(syncLogs, errorMessage, "error");

    const failedRun = await prisma.challengeSyncRun.update({
      where: {
        id: syncRun.id,
      },
      data: {
        status: ChallengeSyncRunStatus.FAILED,
        message: errorMessage,
        logs: syncLogs,
        completedAt: new Date(),
      },
      include: {
        triggeredByUser: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarInitials: true,
          },
        },
      },
    });

    return mapSyncRunRecord(failedRun);
  }
}

export async function getChallengeSyncOverview(): Promise<ChallengeSyncOverviewRecord> {
  const [recentRuns, totalSyncedChallenges, activeSyncedChallenges] = await Promise.all([
    prisma.challengeSyncRun.findMany({
      include: {
        triggeredByUser: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarInitials: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 5,
    }),
    prisma.challenge.count({
      where: {
        source: ChallengeSource.GITHUB,
      },
    }),
    prisma.challenge.count({
      where: {
        source: ChallengeSource.GITHUB,
        status: {
          not: ChallengeStatus.ARCHIVED,
        },
      },
    }),
  ]);

  return {
    lastRun: recentRuns[0] ? mapSyncRunRecord(recentRuns[0]) : null,
    recentRuns: recentRuns.map(mapSyncRunRecord),
    totalSyncedChallenges,
    activeSyncedChallenges,
    archivedSyncedChallenges: totalSyncedChallenges - activeSyncedChallenges,
  };
}

export async function getPersistedGitHubChallenges() {
  const challenges = await prisma.challenge.findMany({
    where: {
      source: ChallengeSource.GITHUB,
      status: {
        not: ChallengeStatus.ARCHIVED,
      },
    },
    include: {
      repository: true,
    },
    orderBy: [
      {
        sourceUpdatedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return challenges.map((challenge) =>
    mapChallengeModelToRecord(challenge as ChallengeWithRepositoryModel),
  );
}

export async function getPersistedGitHubChallengeBySlug(slug: string) {
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug,
      source: ChallengeSource.GITHUB,
    },
    include: {
      repository: true,
    },
  });

  return challenge
    ? mapChallengeModelToRecord(challenge as ChallengeWithRepositoryModel)
    : null;
}

export async function getPersistedRelatedGitHubChallenges(
  repositoryId: string,
  challengeId: string,
  limit: number,
) {
  const relatedChallenges = await prisma.challenge.findMany({
    where: {
      repositoryId,
      source: ChallengeSource.GITHUB,
      status: {
        not: ChallengeStatus.ARCHIVED,
      },
      id: {
        not: challengeId,
      },
    },
    include: {
      repository: true,
    },
    orderBy: [
      {
        sourceUpdatedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
    take: limit,
  });

  return relatedChallenges.map((challenge) =>
    mapChallengeModelToRecord(challenge as ChallengeWithRepositoryModel),
  );
}
