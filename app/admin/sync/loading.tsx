import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";

export default function AdminSyncLoading() {
  return (
    <AppShell>
      <PageContainer className="py-10 md:py-14">
        <div className="surface-card-strong animate-pulse p-8 md:p-10">
          <div className="h-3 w-28 rounded-full bg-slate-200" />
          <div className="mt-6 h-12 max-w-3xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-6 max-w-2xl rounded-2xl bg-slate-200" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-40 rounded-full bg-slate-200" />
            <div className="h-12 w-36 rounded-full bg-slate-200" />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
