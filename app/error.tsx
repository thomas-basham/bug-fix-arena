"use client";

import { RouteErrorState } from "@/components/ui/route-error-state";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      eyebrow="Application Error"
      title="The arena hit an unexpected runtime error."
      description="The current request could not be completed. Try the action again, or return to the challenge catalog while the issue is investigated."
      secondaryHref="/challenges"
      secondaryLabel="Browse Challenges"
    />
  );
}
