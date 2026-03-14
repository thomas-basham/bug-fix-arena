import { ChallengeGrid } from "@/components/challenges/challenge-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DashboardChallengeRecord } from "@/types/domain";

type ChallengeEngagementSectionProps = {
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  eyebrow: string;
  title: string;
  items: DashboardChallengeRecord[];
};

export function ChallengeEngagementSection({
  description,
  emptyDescription,
  emptyTitle,
  eyebrow,
  title,
  items,
}: ChallengeEngagementSectionProps) {
  return (
    <section>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="mt-6">
        <ChallengeGrid
          challenges={items.map((item) => item.challenge)}
          emptyState={{
            eyebrow,
            title: emptyTitle,
            description: emptyDescription,
          }}
        />
      </div>
    </section>
  );
}
