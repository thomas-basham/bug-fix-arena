import { ChallengeGridSkeleton } from "@/components/challenges/challenge-grid-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function ChallengesLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="surface-card-strong animate-pulse p-8 md:p-10">
          <div className="h-4 w-40 rounded-full bg-slate-200/70" />
          <div className="mt-5 h-12 w-2/3 rounded-[24px] bg-slate-200/70" />
          <div className="mt-4 h-5 w-1/2 rounded-full bg-slate-200/70" />
        </div>
        <div className="surface-card mt-6 animate-pulse p-6 md:p-8">
          <div className="h-4 w-36 rounded-full bg-slate-200/70" />
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="h-12 rounded-2xl bg-slate-200/70" />
            <div className="h-12 rounded-2xl bg-slate-200/70" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="h-12 rounded-2xl bg-slate-200/70" />
            <div className="h-12 rounded-2xl bg-slate-200/70" />
            <div className="h-12 rounded-2xl bg-slate-200/70" />
            <div className="h-12 rounded-2xl bg-slate-200/70" />
          </div>
        </div>
        <div className="mt-10">
          <ChallengeGridSkeleton count={6} />
        </div>
      </PageContainer>
    </AppShell>
  );
}
