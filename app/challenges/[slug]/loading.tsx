import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function ChallengeDetailLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200/70" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="surface-card-strong animate-pulse p-8 md:p-10">
              <div className="h-4 w-40 rounded-full bg-slate-200/70" />
              <div className="mt-5 h-12 w-3/4 rounded-[24px] bg-slate-200/70" />
              <div className="mt-4 h-5 w-2/3 rounded-full bg-slate-200/70" />
              <div className="mt-6 flex gap-2">
                <div className="h-8 w-24 rounded-full bg-slate-200/70" />
                <div className="h-8 w-28 rounded-full bg-slate-200/70" />
              </div>
            </div>
            <div className="surface-card animate-pulse p-8">
              <div className="h-4 w-28 rounded-full bg-slate-200/70" />
              <div className="mt-5 h-4 w-full rounded-full bg-slate-200/70" />
              <div className="mt-3 h-4 w-11/12 rounded-full bg-slate-200/70" />
              <div className="mt-3 h-4 w-5/6 rounded-full bg-slate-200/70" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="surface-card-strong h-72 animate-pulse" />
            <div className="surface-card h-72 animate-pulse" />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
