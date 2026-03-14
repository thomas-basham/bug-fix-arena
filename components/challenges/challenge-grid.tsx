import type { ReactNode } from "react";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import {
  EmptyState,
  type EmptyStateProps,
} from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { ChallengeRecord } from "@/types/domain";

type ChallengeGridProps = {
  challenges: ChallengeRecord[];
  className?: string;
  detailHrefBySlug?: Record<string, string>;
  emptyState?: EmptyStateProps;
  footer?: ReactNode;
};

export function ChallengeGrid({
  challenges,
  className,
  detailHrefBySlug,
  emptyState,
  footer,
}: ChallengeGridProps) {
  if (challenges.length === 0) {
    return emptyState ? <EmptyState {...emptyState} /> : null;
  }

  return (
    <div>
      <div className={cn("grid gap-5 xl:grid-cols-2", className)}>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            href={detailHrefBySlug?.[challenge.slug]}
          />
        ))}
      </div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}
