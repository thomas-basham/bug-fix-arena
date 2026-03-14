import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmissionStatus } from "@prisma/client";
import { createChallengeRecord } from "@/tests/factories/challenges";

const mocks = vi.hoisted(() => ({
  ensureChallengeSnapshot: vi.fn(),
  prisma: {
    submission: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/challenges/persistence", () => ({
  ensureChallengeSnapshot: mocks.ensureChallengeSnapshot,
}));

vi.mock("@/lib/db/client", () => ({
  prisma: mocks.prisma,
}));

describe("submission service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects empty draft submissions before any database write", async () => {
    const { upsertChallengeSubmission } = await import("@/lib/submissions/service");

    await expect(
      upsertChallengeSubmission({
        userId: "user-1",
        challenge: createChallengeRecord(),
        notes: "   ",
        githubPrUrl: "",
        githubForkUrl: " ",
        intent: "draft",
      }),
    ).rejects.toThrow(
      "Add notes, a fork URL, or a PR URL before saving a submission draft.",
    );

    expect(mocks.ensureChallengeSnapshot).toHaveBeenCalledTimes(1);
    expect(mocks.prisma.submission.upsert).not.toHaveBeenCalled();
  });

  it("upgrades a draft into a submitted PR record and normalizes GitHub URLs", async () => {
    const challenge = createChallengeRecord();
    const now = new Date("2026-03-14T18:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const existingSubmission = {
      id: "submission-1",
      challengeId: challenge.id,
      userId: "user-1",
      status: SubmissionStatus.DRAFT,
      notes: "Keep the current form behavior.",
      githubPrUrl: null,
      githubForkUrl: null,
      submittedAt: null,
      createdAt: new Date("2026-03-12T11:00:00.000Z"),
      updatedAt: new Date("2026-03-12T11:00:00.000Z"),
      challenge: {
        slug: challenge.slug,
        title: challenge.title,
        repository: {
          fullName: challenge.repository.fullName,
        },
      },
    };

    mocks.prisma.submission.findUnique.mockResolvedValue(existingSubmission);
    mocks.prisma.submission.upsert.mockResolvedValue({
      ...existingSubmission,
      status: SubmissionStatus.SUBMITTED,
      githubPrUrl: "https://github.com/octo-org/arena-repo/pull/14",
      githubForkUrl: "https://github.com/morganlee/arena-repo",
      submittedAt: now,
      updatedAt: now,
    });

    const { upsertChallengeSubmission } = await import("@/lib/submissions/service");
    const submission = await upsertChallengeSubmission({
      userId: "user-1",
      challenge,
      githubPrUrl:
        "https://github.com/octo-org/arena-repo/pull/14?tab=conversation#discussion",
      githubForkUrl: "https://github.com/morganlee/arena-repo/",
      intent: "submit",
    });

    expect(mocks.prisma.submission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          status: SubmissionStatus.SUBMITTED,
          notes: "Keep the current form behavior.",
          githubPrUrl: "https://github.com/octo-org/arena-repo/pull/14",
          githubForkUrl: "https://github.com/morganlee/arena-repo",
          submittedAt: now,
        }),
      }),
    );
    expect(submission).toMatchObject({
      status: "submitted",
      githubPrUrl: "https://github.com/octo-org/arena-repo/pull/14",
      githubForkUrl: "https://github.com/morganlee/arena-repo",
      notes: "Keep the current form behavior.",
    });

    vi.useRealTimers();
  });
});
