"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type ChallengeDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ChallengeDetailError({
  error,
  reset,
}: ChallengeDetailErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Challenge Error"
      title="This challenge could not be rendered."
      description="The issue brief or supporting challenge metadata failed to load. Retry the request or return to the catalog to choose another issue."
      secondaryHref="/challenges"
      secondaryLabel="Back to Challenges"
    />
  );
}
