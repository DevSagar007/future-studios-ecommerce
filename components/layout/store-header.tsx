"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, X, UserRound } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { cartCount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((s) => cartCount(s.items));
  return (
    <>
      <div className="topbar">
        Super offers up to 50% off <span>Shop Now</span>
      </div>
      <header className="header">
        <div className="header-inner">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
          <Link href="/" className="logo">
            FALCON<span>.</span>
          </Link>
          <nav className={open ? "nav open" : "nav"}>
            <Link href="/products" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link href="/products?category=Electronics" onClick={() => setOpen(false)}>
              Electronics
            </Link>
            <Link href="/products?category=Audio" onClick={() => setOpen(false)}>
              Audio
            </Link>
            <Link href="/products?category=Lifestyle" onClick={() => setOpen(false)}>
              Lifestyle
            </Link>
          </nav>
          <div className="header-actions">
            <Link href="/products" aria-label="Search products">
              <Search size={20} />
            </Link>
            <Link href="/cart" className="cart-icon" aria-label={`Cart, ${count} items`}>
              <ShoppingCart size={20} />
              {count > 0 && <Badge>{count}</Badge>}
            </Link>
            <UserRound size={20} aria-hidden="true" />
          </div>
        </div>
      </header>
    </>
  );
}
