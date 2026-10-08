"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught client-side error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md border border-rule-light bg-white p-8 shadow-xl">
        <span className="inline-block rounded-full bg-orange-deep/10 px-3 py-1 text-micro font-bold uppercase tracking-wider text-orange-deep">
          Temporary Issue
        </span>
        <h2 className="mt-4 font-display text-h2 text-ink">Something went wrong</h2>
        <p className="mt-2 text-small text-muted">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-full bg-accent px-6 py-2.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full border border-rule bg-white px-6 py-2.5 text-small font-semibold text-ink hover:bg-surface-sunk"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
