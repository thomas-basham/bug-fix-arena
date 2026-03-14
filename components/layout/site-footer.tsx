import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/80 py-8">
      <PageContainer className="flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>
          Open Source Bug Fix Arena MVP. Mock data keeps the product usable
          until GitHub and Prisma are fully wired.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/challenges">Challenges</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </PageContainer>
    </footer>
  );
}
