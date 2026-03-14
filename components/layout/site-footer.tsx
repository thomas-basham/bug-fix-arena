import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/80 py-10">
      <PageContainer className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <p className="mono-label">Arena Foundation</p>
          <p className="max-w-2xl text-sm leading-7 text-slate-700">
            Open Source Bug Fix Arena turns live GitHub issues into structured
            starter challenges, then layers in engagement, scoring, sync, and
            submission workflows without losing the clarity of the original issue.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-start sm:justify-end sm:gap-8">
          <div className="space-y-3">
            <p className="mono-label">Explore</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/challenges" className="transition hover:text-accent">
                Challenges
              </Link>
              <Link href="/leaderboard" className="transition hover:text-accent">
                Leaderboard
              </Link>
              <Link href="/dashboard" className="transition hover:text-accent">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="mono-label">Runtime</p>
            <p className="max-w-xs text-sm leading-7 text-slate-600">
              The app prefers persisted GitHub-backed challenge data and falls
              back to seeded mock challenges when the external feed is unavailable.
            </p>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
