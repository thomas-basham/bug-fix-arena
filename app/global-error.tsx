"use client";

import { useEffect } from "react";
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
      <body className="bg-background font-sans text-foreground antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
          <div className="surface-card-strong w-full p-8 md:p-10">
            <p className="mono-label">Application Error</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              The arena hit an unexpected root-level error.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              The current request could not be completed. Try the action again,
              or return after the runtime issue has been investigated.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
