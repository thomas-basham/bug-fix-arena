"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, getSafeRedirectPath } from "@/lib/auth/session";
import { mockUsers } from "@/lib/data/mock-data";
import { prisma } from "@/lib/db/client";

export async function signInDemoUserAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(formData.get("redirectTo"), "/dashboard");
  const demoUserId = mockUsers[0]?.id;
  const seededUser = demoUserId
    ? await prisma.user.findUnique({
        where: {
          id: demoUserId,
        },
        select: {
          id: true,
        },
      })
    : null;
  const user = seededUser ?? (await prisma.user.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }));

  if (!user) {
    throw new Error("No demo user is available for the auth scaffold.");
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  revalidatePath("/dashboard");
  redirect(redirectTo);
}

export async function signOutAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(formData.get("redirectTo"), "/");
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);

  revalidatePath("/dashboard");
  redirect(redirectTo);
}
