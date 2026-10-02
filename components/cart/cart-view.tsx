"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cartCount, cartSubtotal, taka } from "@/lib/utils";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const dec = useCartStore((s) => s.dec);
  const inc = useCartStore((s) => s.inc);
  const remove = useCartStore((s) => s.remove);

  const subtotal = cartSubtotal(items);

  return (
    <main className="cart-page">
      <div className="breadcrumb">
        Home <span>›</span> My Cart
      </div>
      <h1>My Cart</h1>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Your cart is empty</h2>
          <Link className="primary-button" href="/products">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section>
            {items.map((item) => (
              <div className="cart-row" key={item.id}>
                <Image src={item.image} alt={item.name} width={100} height={100} />
                <div>
                  <Link href={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.category}</p>
                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => dec(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{String(item.quantity).padStart(2, "0")}</span>
                    <button
                      type="button"
                      onClick={() => inc(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                  <b>{taka(item.price * item.quantity)}</b>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>
          <aside className="summary">
            <h2>Order summary</h2>
            <div>
              <span>Price ({cartCount(items)} items)</span>
              <b>{taka(subtotal)}</b>
            </div>
            <div>
              <span>Shipping fee</span>
              <em>To be added</em>
            </div>
            <hr />
            <div className="total">
              <span>Sub Total</span>
              <b>{taka(subtotal)}</b>
            </div>
            <Link href="/checkout" className="primary-button">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <p className="terms">
              I have read and agree to the Terms and Conditions, Privacy Policy and Refund Policy.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
