"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { runGitHubChallengeSync } from "@/lib/sync/service";

export async function runGitHubChallengeSyncAction() {
  const adminUser = await requireAdminUser();

  await runGitHubChallengeSync({
    triggeredByUserId: adminUser.id,
  });

  revalidatePath("/");
  revalidatePath("/challenges");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  revalidatePath("/admin/sync");
}
