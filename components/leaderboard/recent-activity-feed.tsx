import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import type { LeaderboardActivityRecord } from "@/types/domain";

type RecentActivityFeedProps = {
  items: LeaderboardActivityRecord[];
};

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-line bg-white/75 p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-semibold text-slate-950">{item.user.name}</p>
            <Badge tone="success">+{item.pointsAwarded} pts</Badge>
            <Badge tone="muted">{formatRelativeDate(item.completedAt)}</Badge>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            <span className="font-medium text-slate-900">
              @{item.user.githubUsername}
            </span>{" "}
            completed{" "}
            <Link
              href={`/challenges/${item.challengeSlug}`}
              className="font-medium text-accent transition hover:text-slate-950"
            >
              {item.challengeTitle}
            </Link>
            .
          </p>
        </article>
      ))}
    </div>
  );
}
