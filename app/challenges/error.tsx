"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type ChallengesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ChallengesError({
  error,
  reset,
}: ChallengesErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Catalog Error"
      title="The challenge catalog could not be loaded."
      description="The browse view failed while assembling the current challenge feed. Retry the request or return to the home page while the data layer recovers."
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}
