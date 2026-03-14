import "server-only";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import type { UserRecord } from "@/types/domain";

export const AUTH_COOKIE_NAME = "osbfa_session_user_id";

function mapUserToRecord(user: {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  bio: string | null;
  avatarInitials: string | null;
}): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    githubUsername: user.githubUsername,
    bio: user.bio ?? "Open source contributor profile is still being fleshed out.",
    avatarInitials: user.avatarInitials,
  };
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      githubUsername: true,
      bio: true,
      avatarInitials: true,
    },
  });

  return user ? mapUserToRecord(user) : null;
}

export function getSafeRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return fallback;
  }

  return value;
}
