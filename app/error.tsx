"use client";

import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Button } from "@/components/ui/button";

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
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </main>
      <StoreFooter />
    </>
  );
}
