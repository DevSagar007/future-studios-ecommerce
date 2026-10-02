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
import { Input } from "@/components/ui/input";

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
        <main className="success">
          <h1>Order placed successfully!</h1>
          <p>Thank you for shopping with Falcon.</p>
          <Link href="/products" className="primary-button">
            Continue shopping
          </Link>
        </main>
        <StoreFooter />
      </>
    );
  }

  return (
    <>
      <StoreHeader />
      <main className="checkout">
        <div className="breadcrumb">
          Home <span>›</span> Checkout
        </div>
        <h1>Checkout</h1>
        {items.length === 0 ? (
          <div className="empty">
            <h2>Your cart is empty</h2>
            <p>Add a few products before checking out.</p>
            <Link href="/products" className="primary-button">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <form
              className="checkout-form"
              noValidate
              onSubmit={handleSubmit(() => {
                clear();
                setSuccess(true);
              })}
            >
              <h2>Delivery information</h2>
              {FIELDS.map(([name, label]) => (
                <label key={name}>
                  {label}
                  <Input
                    {...register(name)}
                    placeholder={label}
                    aria-invalid={errors[name] ? "true" : undefined}
                  />
                  {errors[name] && <small role="alert">{errors[name]?.message}</small>}
                </label>
              ))}
              <button className="primary-button" type="submit">
                Place Order
              </button>
            </form>
            <aside className="summary">
              <h2>Order summary</h2>
              {items.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b>{taka(item.price * item.quantity)}</b>
                </div>
              ))}
              <hr />
              <div className="total">
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
