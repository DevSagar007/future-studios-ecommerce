import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";

export default function NotFound() {
  return (
    <>
      <StoreHeader />
      <main className="state-page">
        <p className="kicker">404</p>
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist or is no longer available.</p>
        <Link href="/products" className="primary-button">
          Browse products
        </Link>
      </main>
      <StoreFooter />
    </>
  );
}
