"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type AdminSyncErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminSyncError({
  error,
  reset,
}: AdminSyncErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Admin Sync Error"
      title="The GitHub sync controls could not be loaded."
      description="The admin sync page hit an unexpected problem while loading sync status or challenge counts. Retry the request or return to the challenge feed."
      secondaryHref="/challenges"
      secondaryLabel="Browse Challenges"
    />
  );
}
