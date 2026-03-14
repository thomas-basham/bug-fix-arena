"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <AppShell>
          <PageContainer className="py-16">
            <EmptyState
              eyebrow="Application Error"
              title="The arena hit an unexpected runtime error."
              description="The current request could not be completed. Try the action again, or return to the challenge catalog while the issue is investigated."
              action={
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Try Again
                </button>
              }
            />
          </PageContainer>
        </AppShell>
      </body>
    </html>
  );
}
