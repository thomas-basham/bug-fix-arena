import "server-only";

import { getCurrentUser } from "@/lib/auth/session";
import type { UserRecord } from "@/types/domain";

function getConfiguredAdminUsernames() {
  return (process.env.ADMIN_GITHUB_USERNAMES ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: UserRecord | null) {
  if (!user) {
    return false;
  }

  const configuredUsernames = getConfiguredAdminUsernames();

  if (configuredUsernames.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  return configuredUsernames.includes(user.githubUsername.toLowerCase());
}

export function isAdminConfigurationMissing() {
  return getConfiguredAdminUsernames().length === 0;
}

export async function getAdminAccessState() {
  const user = await getCurrentUser();

  return {
    user,
    isAdmin: isAdminUser(user),
    isConfigurationMissing: isAdminConfigurationMissing(),
  };
}

export async function requireAdminUser() {
  const accessState = await getAdminAccessState();

  if (!accessState.user || !accessState.isAdmin) {
    throw new Error("Admin access is required to run GitHub challenge sync.");
  }

  return accessState.user;
}
