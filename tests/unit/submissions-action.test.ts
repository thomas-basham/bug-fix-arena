import { beforeEach, describe, expect, it, vi } from "vitest";
import { createChallengeRecord } from "@/tests/factories/challenges";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  getCurrentUser: vi.fn(),
  getSafeRedirectPath: vi.fn(),
  getChallengeBySlug: vi.fn(),
  getChallengeEngagementForUser: vi.fn(),
  setChallengeEngagementStatus: vi.fn(),
  upsertChallengeSubmission: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
  getSafeRedirectPath: mocks.getSafeRedirectPath,
}));

vi.mock("@/lib/data/catalog", () => ({
  getChallengeBySlug: mocks.getChallengeBySlug,
}));

vi.mock("@/lib/engagement/service", () => ({
  getChallengeEngagementForUser: mocks.getChallengeEngagementForUser,
  setChallengeEngagementStatus: mocks.setChallengeEngagementStatus,
}));

vi.mock("@/lib/submissions/service", () => ({
  upsertChallengeSubmission: mocks.upsertChallengeSubmission,
}));

describe("upsertChallengeSubmissionAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSafeRedirectPath.mockImplementation((value, fallback) =>
      typeof value === "string" ? value : fallback,
    );
  });

  it("returns an error when the submission intent is missing or invalid", async () => {
    const { initialSubmissionActionState, upsertChallengeSubmissionAction } =
      await import("@/lib/submissions/actions");

    const formData = new FormData();
    formData.set("challengeSlug", "arena-repo-14-fix-empty-state");

    await expect(
      upsertChallengeSubmissionAction(initialSubmissionActionState, formData),
    ).resolves.toEqual({
      status: "error",
      message: "Choose whether to save a draft or submit the PR.",
    });
  });

  it("submits a PR and starts the challenge when the user has not started yet", async () => {
    const challenge = createChallengeRecord();
    const { initialSubmissionActionState, upsertChallengeSubmissionAction } =
      await import("@/lib/submissions/actions");

    mocks.getCurrentUser.mockResolvedValue({
      id: "user-1",
      name: "Morgan Lee",
    });
    mocks.getChallengeBySlug.mockResolvedValue(challenge);
    mocks.upsertChallengeSubmission.mockResolvedValue({
      id: "submission-1",
      status: "submitted",
    });
    mocks.getChallengeEngagementForUser.mockResolvedValue({
      id: "engagement-1",
      status: "saved",
    });

    const formData = new FormData();
    formData.set("intent", "submit");
    formData.set("challengeSlug", challenge.slug);
    formData.set("redirectTo", `/challenges/${challenge.slug}`);
    formData.set("githubPrUrl", "https://github.com/octo-org/arena-repo/pull/14");
    formData.set("notes", "Ready for review.");

    const result = await upsertChallengeSubmissionAction(
      initialSubmissionActionState,
      formData,
    );

    expect(mocks.upsertChallengeSubmission).toHaveBeenCalledWith({
      userId: "user-1",
      challenge,
      notes: "Ready for review.",
      githubPrUrl: "https://github.com/octo-org/arena-repo/pull/14",
      githubForkUrl: undefined,
      intent: "submit",
    });
    expect(mocks.setChallengeEngagementStatus).toHaveBeenCalledWith({
      userId: "user-1",
      challenge,
      status: "started",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/submissions");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/challenges");
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      `/challenges/${challenge.slug}`,
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      `/challenges/${challenge.slug}`,
    );
    expect(result).toEqual({
      status: "success",
      message:
        "PR link submitted. Review status can be connected to GitHub checks later.",
    });
  });
});
