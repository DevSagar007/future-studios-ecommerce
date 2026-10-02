import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <StoreHeader />
      <main className="mx-auto my-[120px] max-w-[600px] px-4 text-center">
        <p className="kicker">404</p>
        <h1 className="my-2 text-[40px] tracking-[-1px]">Product not found</h1>
        <p className="mb-6 leading-[1.6] text-[var(--muted)]">The product you are looking for does not exist or is no longer available.</p>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
      <StoreFooter />
    </>
  );
}
