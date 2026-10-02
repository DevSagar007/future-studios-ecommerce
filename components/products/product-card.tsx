"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { taka } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductCard({ p }: { p: Product }) {
  const add = useCartStore((s) => s.add);
  const discount = Math.max(0, Math.round((1 - p.price / p.originalPrice) * 100));

  return (
    <article className="product-card">
      <Link href={`/products/${p.id}`} className="product-thumb">
        <Image
          src={p.image}
          alt={p.name}
          width={600}
          height={600}
          sizes="(max-width: 800px) 50vw, (max-width: 1080px) 33vw, 25vw"
        />
        {discount > 0 && <Badge variant="muted">-{discount}%</Badge>}
      </Link>
      <div className="product-card-body">
        <Link href={`/products/${p.id}`}>
          <h3>{p.name}</h3>
        </Link>
        <div className="rating">
          <Star size={14} fill="currentColor" aria-hidden="true" /> {p.rating}{" "}
          <small>({p.reviews.length + 18})</small>
        </div>
        <div className="card-bottom">
          <div>
            <b>{taka(p.price)}</b>
            <del>{taka(p.originalPrice)}</del>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Add ${p.name} to cart`}
            onClick={() => add(p)}
          >
            <ShoppingCart size={17} />
          </Button>
        </div>
      </div>
    </article>
  );
}
