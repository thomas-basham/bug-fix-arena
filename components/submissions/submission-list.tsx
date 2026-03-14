import { EmptyState } from "@/components/ui/empty-state";
import { SubmissionCard } from "@/components/submissions/submission-card";
import type { SubmissionRecord } from "@/types/domain";

type SubmissionListProps = {
  submissions: SubmissionRecord[];
};

export function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        eyebrow="My Submissions"
        title="No submission records yet."
        description="Submit a GitHub pull request link from any challenge page to start building a real contribution history."
      />
    );
  }

  return (
    <div className="grid gap-6">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          challengeHref={`/challenges/${submission.challengeSlug}`}
        />
      ))}
    </div>
  );
}
