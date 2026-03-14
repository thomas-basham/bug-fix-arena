"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, getSafeRedirectPath } from "@/lib/auth/session";
import { getChallengeBySlug } from "@/lib/data/catalog";
import {
  getChallengeEngagementForUser,
  setChallengeEngagementStatus,
} from "@/lib/engagement/service";
import { upsertChallengeSubmission } from "@/lib/submissions/service";

export type SubmissionActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialSubmissionActionState: SubmissionActionState = {
  status: "idle",
};

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

async function handleSubmissionAction(
  formData: FormData,
  intent: "draft" | "submit",
): Promise<SubmissionActionState> {
  const redirectTo = getSafeRedirectPath(formData.get("redirectTo"), "/dashboard");
  const challengeSlug = formData.get("challengeSlug");

  if (typeof challengeSlug !== "string" || challengeSlug.length === 0) {
    return {
      status: "error",
      message: "The selected challenge could not be identified.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "Sign in before saving or submitting work for this challenge.",
    };
  }

  const challenge = await getChallengeBySlug(challengeSlug);

  if (!challenge) {
    return {
      status: "error",
      message: "The selected challenge could not be loaded.",
    };
  }

  try {
    await upsertChallengeSubmission({
      userId: user.id,
      challenge,
      notes: getStringField(formData, "notes"),
      githubPrUrl: getStringField(formData, "githubPrUrl"),
      githubForkUrl: getStringField(formData, "githubForkUrl"),
      intent,
    });

    if (intent === "submit") {
      const engagement = await getChallengeEngagementForUser(user.id, challenge.id);

      if (engagement?.status !== "completed" && engagement?.status !== "started") {
        await setChallengeEngagementStatus({
          userId: user.id,
          challenge,
          status: "started",
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/submissions");
    revalidatePath("/challenges");
    revalidatePath(`/challenges/${challenge.slug}`);
    revalidatePath(redirectTo);

    return {
      status: "success",
      message:
        intent === "draft"
          ? "Submission draft saved."
          : "PR link submitted. Review status can be connected to GitHub checks later.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "The submission could not be saved right now.",
    };
  }
}

export async function upsertChallengeSubmissionAction(
  _previousState: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const intent = formData.get("intent");

  if (intent !== "draft" && intent !== "submit") {
    return {
      status: "error",
      message: "Choose whether to save a draft or submit the PR.",
    };
  }

  return handleSubmissionAction(formData, intent);
}

export { initialSubmissionActionState };
