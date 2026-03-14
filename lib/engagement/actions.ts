"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getChallengeBySlug } from "@/lib/data/catalog";
import { getCurrentUser, getSafeRedirectPath } from "@/lib/auth/session";
import { setChallengeEngagementStatus } from "@/lib/engagement/service";
import type { ChallengeEngagementStatus } from "@/types/domain";

async function handleChallengeEngagement(
  formData: FormData,
  status: ChallengeEngagementStatus,
) {
  const redirectTo = getSafeRedirectPath(
    formData.get("redirectTo"),
    "/dashboard",
  );
  const challengeSlug = formData.get("challengeSlug");

  if (typeof challengeSlug !== "string" || challengeSlug.length === 0) {
    throw new Error("A challenge slug is required to track engagement.");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  const challenge = await getChallengeBySlug(challengeSlug);

  if (!challenge) {
    throw new Error("The selected challenge could not be found.");
  }

  await setChallengeEngagementStatus({
    userId: user.id,
    challenge,
    status,
  });

  revalidatePath("/dashboard");
  revalidatePath("/challenges");
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function saveChallengeAction(formData: FormData) {
  await handleChallengeEngagement(formData, "saved");
}

export async function startChallengeAction(formData: FormData) {
  await handleChallengeEngagement(formData, "started");
}

export async function completeChallengeAction(formData: FormData) {
  await handleChallengeEngagement(formData, "completed");
}
