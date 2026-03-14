import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function ChallengeDetailLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="surface-card-strong animate-pulse p-8 md:p-10">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-40 rounded-full bg-slate-200/70" />
            <div className="h-10 w-28 rounded-full bg-slate-200/70" />
            <div className="h-10 w-32 rounded-full bg-slate-200/70" />
          </div>
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="h-4 w-36 rounded-full bg-slate-200/70" />
              <div className="mt-5 h-14 w-full max-w-3xl rounded-[28px] bg-slate-200/70" />
              <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-slate-200/70" />
              <div className="mt-6 flex gap-2">
                <div className="h-8 w-24 rounded-full bg-slate-200/70" />
                <div className="h-8 w-32 rounded-full bg-slate-200/70" />
                <div className="h-8 w-24 rounded-full bg-slate-200/70" />
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-200/70 p-6">
              <div className="h-4 w-28 rounded-full bg-slate-300/80" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-2xl bg-slate-300/80"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
          <div className="space-y-6">
            <div className="surface-card-strong animate-pulse p-8 md:p-10">
              <div className="h-4 w-32 rounded-full bg-slate-200/70" />
              <div className="mt-5 h-10 w-72 rounded-[24px] bg-slate-200/70" />
              <div className="mt-6 h-24 rounded-[28px] bg-slate-200/70" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-full bg-slate-200/70" />
                <div className="h-4 w-11/12 rounded-full bg-slate-200/70" />
                <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="surface-card h-48 animate-pulse" />
              ))}
            </div>
            <div className="surface-card-strong h-72 animate-pulse" />
            <div className="surface-card h-72 animate-pulse" />
            <div className="surface-card h-60 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="surface-card-strong h-[28rem] animate-pulse" />
            <div className="surface-card h-[42rem] animate-pulse" />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
