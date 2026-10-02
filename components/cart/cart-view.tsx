"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cartCount, cartSubtotal, taka } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const dec = useCartStore((s) => s.dec);
  const inc = useCartStore((s) => s.inc);
  const remove = useCartStore((s) => s.remove);

  const subtotal = cartSubtotal(items);

  return (
    <main className="mx-auto mt-[70px] w-[calc(100%-32px)] max-w-[1270px]">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Cart" }]} />
      <h1 className="mb-8 text-4xl tracking-[-1px]">My Cart</h1>
      {items.length === 0 ? (
        <div className="rounded-lg bg-white px-5 py-20 text-center">
          <h2 className="mb-6 text-2xl">Your cart is empty</h2>
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-7 min-[901px]:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-4">
            {items.map((item) => (
              <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-lg bg-white p-4 min-[601px]:grid-cols-[100px_minmax(0,1fr)_auto]" key={item.id}>
                <div className="overflow-hidden rounded-md bg-[#f1f5f9]">
                  <Image className="aspect-square h-auto w-full object-cover" src={item.image} alt={item.name} width={100} height={100} />
                </div>
                <div className="min-w-0">
                  <Link href={`/products/${item.id}`} className="block min-w-0">
                    <h3 className="line-clamp-2 break-words text-base font-semibold">{item.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.category}</p>
                  <div className="mt-4 inline-flex h-9 items-center overflow-hidden rounded border border-[var(--line)]">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => dec(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="min-w-9 text-center text-sm">{String(item.quantity).padStart(2, "0")}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => inc(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-3 min-[601px]:col-span-1 min-[601px]:flex-col min-[601px]:items-end min-[601px]:justify-between">
                  <b className="whitespace-nowrap text-base">{taka(item.price * item.quantity)}</b>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:bg-red-50"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </section>
          <aside className="rounded-lg bg-white p-5 min-[901px]:sticky min-[901px]:top-6">
            <h2 className="mb-5 text-xl">Order summary</h2>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span>Price ({cartCount(items)} items)</span><b>{taka(subtotal)}</b>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span>Shipping fee</span><em className="not-italic text-[var(--muted)]">To be added</em>
            </div>
            <hr className="my-5 border-[var(--line)]" />
            <div className="flex items-center justify-between gap-4 text-base">
              <span>Sub Total</span><b>{taka(subtotal)}</b>
            </div>
            <Button className="mt-5 w-full" asChild>
              <Link className="w-full" href="/checkout">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </Button>
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
              I have read and agree to the Terms and Conditions, Privacy Policy and Refund Policy.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
