"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

type RouteErrorStateProps = {
  description: string;
  error: Error & { digest?: string };
  eyebrow: string;
  reset: () => void;
  secondaryHref?: string;
  secondaryLabel?: string;
  title: string;
};

export function RouteErrorState({
  description,
  error,
  eyebrow,
  reset,
  secondaryHref,
  secondaryLabel,
  title,
}: RouteErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell>
      <PageContainer className="py-16">
        <EmptyState
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={reset}
                className="button-primary"
              >
                Try Again
              </button>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="button-secondary"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          }
        />
      </PageContainer>
    </AppShell>
  );
}
