"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type DashboardSubmissionsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardSubmissionsError({
  error,
  reset,
}: DashboardSubmissionsErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Submissions Error"
      title="The submissions dashboard could not be loaded."
      description="The app hit an unexpected problem while loading your tracked PR links and submission states. Retry or return to the main dashboard."
      secondaryHref="/dashboard"
      secondaryLabel="Open Dashboard"
    />
  );
}
