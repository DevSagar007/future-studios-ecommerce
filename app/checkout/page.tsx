"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutValues } from "@/schemas/checkout.schema";
import { useCartStore } from "@/store/cart.store";
import { cartSubtotal, taka } from "@/lib/utils";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const FIELDS = [
  ["fullName", "Full Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["city", "City"],
  ["postalCode", "Postal Code"],
] as const;

export default function Page() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });

  const total = cartSubtotal(items);

  if (success) {
    return (
      <>
        <StoreHeader />
        <main className="px-5 py-[120px] mt-[70px] text-center">
          <h1 className="mb-4 text-4xl">Order placed successfully!</h1>
          <p className="mb-6 text-(--muted)">Thank you for shopping with Falcon.</p>
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </main>
        <StoreFooter />
      </>
    );
  }

  return (
    <>
      <StoreHeader />
      <main className="mx-auto mt-[70px] w-[calc(100%_-_32px)] max-w-[1270px]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
        <h1 className="mb-[30px] text-[40px] tracking-[-1px]">Checkout</h1>
        {items.length === 0 ? (
          <div className="rounded-lg bg-white px-5 py-20 text-center">
            <h2 className="mb-3 text-2xl">Your cart is empty</h2>
            <p className="mb-6 text-(--muted)">Add a few products before checking out.</p>
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-[35px] min-[801px]:grid-cols-[1.5fr_1fr]">
            <form
              className="grid gap-[18px] bg-white p-7 min-[801px]:grid-cols-2 rounded-[6px]"
              noValidate
              onSubmit={handleSubmit(() => {
                clear();
                setSuccess(true);
              })}
            >
              <h2 className="text-[22px] min-[801px]:col-span-2">Delivery information</h2>
              {FIELDS.map(([name, label]) => (
                <label className="block text-xs text-[#475569]" key={name}>
                  {label}
                  <Input
                    {...register(name)}
                    className="mt-2"
                    placeholder={label}
                    aria-invalid={errors[name] ? "true" : undefined}
                  />
                  {errors[name] && <small className="mt-1 block text-red-500" role="alert">{errors[name]?.message}</small>}
                </label>
              ))}
              <Button className="min-[801px]:col-span-2" type="submit">Place Order</Button>
            </form>
            <aside className="h-max rounded-[6px] bg-white p-[25px]">
              <h2 className="text-[22px]">Order summary</h2>
              {items.map((item) => (
                <div className="my-[15px] flex items-center justify-between gap-4 text-sm" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b className="whitespace-nowrap">{taka(item.price * item.quantity)}</b>
                </div>
              ))}
              <hr className="border-0 border-t border-dashed border-[var(--line)]" />
              <div className="mt-[15px] flex items-center justify-between text-lg">
                <span>Total</span>
                <b>{taka(total)}</b>
              </div>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </>
  );
}
