import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <AppShell>
      <PageContainer className="py-16">
        <EmptyState
          eyebrow="Not Found"
          title="That page is not in the arena."
          description="The challenge or route you requested does not exist in the current MVP catalog. Return to the browse page to pick another issue."
          action={
            <Link
              href="/challenges"
              className="button-primary"
            >
              Browse Challenges
            </Link>
          }
        />
      </PageContainer>
    </AppShell>
  );
}
