"use client";

import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <StoreHeader />
      <main className="state-page">
        <p className="kicker">Something went wrong</p>
        <h1>We couldn&apos;t load this page</h1>
        <p>Please check your connection and try again.</p>
        <button type="button" className="primary-button" onClick={reset}>
          Try again
        </button>
      </main>
      <StoreFooter />
    </>
  );
}
