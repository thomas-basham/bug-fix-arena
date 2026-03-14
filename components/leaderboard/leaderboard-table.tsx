import { Badge } from "@/components/ui/badge";
import { cn, formatNumber, formatRelativeDate } from "@/lib/utils";
import type { LeaderboardEntryRecord } from "@/types/domain";

type LeaderboardTableProps = {
  currentUserId?: string;
  entries: LeaderboardEntryRecord[];
};

export function LeaderboardTable({
  currentUserId,
  entries,
}: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-white/82 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur">
      <div className="grid grid-cols-[0.7fr_1.8fr_1fr_1fr] gap-4 border-b border-line bg-slate-950 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200 md:grid-cols-[0.7fr_2fr_1.1fr_1fr_1.1fr]">
        <span>Rank</span>
        <span>Contributor</span>
        <span>Score</span>
        <span>Completed</span>
        <span className="hidden md:block">Last Update</span>
      </div>
      <div className="divide-y divide-line">
        {entries.map((entry) => {
          const isCurrentUser = currentUserId === entry.user.id;

          return (
            <article
              key={entry.user.id}
              className={cn(
                "grid grid-cols-[0.7fr_1.8fr_1fr_1fr] gap-4 px-5 py-5 text-sm text-slate-700 transition-colors md:grid-cols-[0.7fr_2fr_1.1fr_1fr_1.1fr]",
                isCurrentUser ? "bg-amber-50/75" : "bg-white/60",
              )}
            >
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-mono text-sm font-semibold text-white">
                  #{entry.rank}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="truncate text-base font-semibold text-slate-950">
                    {entry.user.name}
                  </p>
                  <Badge tone={isCurrentUser ? "accent" : "muted"}>
                    {entry.score.rankLabel}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-slate-600">
                  @{entry.user.githubUsername}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">
                  {formatNumber(entry.score.totalPoints)}
                </p>
                <p className="mt-1 text-xs text-slate-500">arena points</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">
                  {entry.score.completedChallenges}
                </p>
                <p className="mt-1 text-xs text-slate-500">completed</p>
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-slate-900">
                  {formatRelativeDate(entry.lastScoreUpdateAt)}
                </p>
                <p className="mt-1 text-xs text-slate-500">score updated</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
