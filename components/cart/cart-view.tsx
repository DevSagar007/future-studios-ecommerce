"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cartCount, cartSubtotal, taka } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => dec(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={14} />
                    </Button>
                    <span>{String(item.quantity).padStart(2, "0")}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => inc(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
                <div className="cart-price">
                  <b>{taka(item.price * item.quantity)}</b>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </Button>
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
            <Button asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </Button>
            <p className="terms">
              I have read and agree to the Terms and Conditions, Privacy Policy and Refund Policy.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
