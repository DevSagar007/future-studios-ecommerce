import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <StoreHeader />
      <main className="state-page">
        <p className="kicker">404</p>
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist or is no longer available.</p>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
      <StoreFooter />
    </>
  );
}
