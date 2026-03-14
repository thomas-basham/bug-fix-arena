import { ChallengeGridSkeleton } from "@/components/challenges/challenge-grid-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function DashboardLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card-strong animate-pulse p-8">
            <div className="h-4 w-28 rounded-full bg-slate-200/70" />
            <div className="mt-5 flex gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-200/70" />
              <div className="flex-1">
                <div className="h-8 w-48 rounded-full bg-slate-200/70" />
                <div className="mt-3 h-4 w-32 rounded-full bg-slate-200/70" />
                <div className="mt-4 h-4 w-full rounded-full bg-slate-200/70" />
                <div className="mt-3 h-4 w-5/6 rounded-full bg-slate-200/70" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-[24px] bg-slate-200/70" />
              <div className="h-28 rounded-[24px] bg-slate-200/70" />
              <div className="h-28 rounded-[24px] bg-slate-200/70" />
            </div>
          </div>

          <div className="surface-card animate-pulse p-8">
            <div className="h-4 w-32 rounded-full bg-slate-200/70" />
            <div className="mt-5 h-10 w-4/5 rounded-[24px] bg-slate-200/70" />
            <div className="mt-4 h-4 w-full rounded-full bg-slate-200/70" />
            <div className="mt-3 h-4 w-5/6 rounded-full bg-slate-200/70" />
            <div className="mt-6 space-y-4">
              <div className="h-32 rounded-2xl bg-slate-200/70" />
              <div className="h-32 rounded-2xl bg-slate-200/70" />
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card animate-pulse p-8">
            <div className="h-4 w-36 rounded-full bg-slate-200/70" />
            <div className="mt-6 h-28 rounded-2xl bg-slate-200/70" />
            <div className="mt-4 h-28 rounded-2xl bg-slate-200/70" />
          </div>
          <div>
            <div className="surface-card animate-pulse p-8">
              <div className="h-4 w-36 rounded-full bg-slate-200/70" />
              <div className="mt-5 h-10 w-3/4 rounded-[24px] bg-slate-200/70" />
              <div className="mt-4 h-4 w-full rounded-full bg-slate-200/70" />
            </div>
            <div className="mt-6">
              <ChallengeGridSkeleton count={2} />
            </div>
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}
