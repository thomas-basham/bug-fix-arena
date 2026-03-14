"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type LeaderboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LeaderboardError({
  error,
  reset,
}: LeaderboardErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Leaderboard Error"
      title="The leaderboard could not be loaded."
      description="The score table or recent completion feed hit an unexpected error. Retry the request or return to the challenge catalog."
      secondaryHref="/challenges"
      secondaryLabel="Browse Challenges"
    />
  );
}
