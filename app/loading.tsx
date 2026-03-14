import { ChallengeGridSkeleton } from "@/components/challenges/challenge-grid-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function Loading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="surface-card-strong animate-pulse p-8 md:p-10">
          <div className="h-4 w-48 rounded-full bg-slate-200/70" />
          <div className="mt-6 h-14 w-3/4 rounded-[24px] bg-slate-200/70" />
          <div className="mt-4 h-6 w-2/3 rounded-full bg-slate-200/70" />
          <div className="mt-8 flex gap-3">
            <div className="h-11 w-40 rounded-full bg-slate-200/70" />
            <div className="h-11 w-40 rounded-full bg-slate-200/70" />
          </div>
        </div>
        <div className="mt-12">
          <ChallengeGridSkeleton count={4} />
        </div>
      </PageContainer>
    </AppShell>
  );
}
