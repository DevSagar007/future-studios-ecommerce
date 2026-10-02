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
      <main className="mx-auto my-[120px] max-w-[600px] px-4 text-center">
        <p className="kicker">Something went wrong</p>
        <h1 className="my-2 text-[40px] tracking-[-1px]">We couldn&apos;t load this page</h1>
        <p className="mb-6 leading-[1.6] text-[var(--muted)]">Please check your connection and try again.</p>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </main>
      <StoreFooter />
    </>
  );
}
