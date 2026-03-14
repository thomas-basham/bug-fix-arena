"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Dashboard Error"
      title="The contributor dashboard could not be loaded."
      description="The dashboard hit an unexpected problem while loading engagement history or recommendations. Retry the request or return to the challenge catalog."
      secondaryHref="/challenges"
      secondaryLabel="Browse Challenges"
    />
  );
}
