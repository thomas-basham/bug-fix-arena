import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function LeaderboardLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="surface-card-strong animate-pulse p-8 md:p-10">
          <div className="h-3 w-28 rounded-full bg-slate-200" />
          <div className="mt-6 h-12 w-full max-w-3xl rounded-3xl bg-slate-200" />
          <div className="mt-4 h-6 w-full max-w-2xl rounded-full bg-slate-200" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-[1.5rem] border border-line bg-white/70"
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
