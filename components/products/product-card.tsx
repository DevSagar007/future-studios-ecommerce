import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { productPath, taka } from "@/lib/utils";
import { discountPercent } from "@/lib/pricing";
import { toCartProduct } from "@/lib/cart";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export function ProductCard({ p }: { p: Product }) {
  const discount = discountPercent(p.price, p.originalPrice);
  const href = productPath(p);

  return (
    <article className="product-card min-w-0">
      <Link href={href} className="product-thumb block aspect-square overflow-hidden" tabIndex={-1} aria-hidden="true">
        <Image
          src={p.image}
          alt=""
          width={600}
          height={600}
          sizes="(max-width: 600px) 50vw, (max-width: 1080px) 33vw, 25vw"
        />
        {discount > 0 && <Badge variant="muted">-{discount}%</Badge>}
      </Link>
      <div className="product-card-body min-w-0">
        <Link href={href} className="block min-w-0">
          <h3 className="line-clamp-2 break-words">{p.name}</h3>
        </Link>
        <div className="rating">
          <Star size={14} fill="currentColor" aria-hidden="true" />
          <span className="sr-only">Rated</span> {p.rating}
          {p.reviews.length > 0 && (
            <small>
              ({p.reviews.length}
              <span className="sr-only"> written {p.reviews.length === 1 ? "review" : "reviews"}</span>)
            </small>
          )}
        </div>
        <div className="card-bottom flex-wrap gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
            <b className="whitespace-nowrap">{taka(p.price)}</b>
            {discount > 0 && (
              <del className="whitespace-nowrap">
                <span className="sr-only">Was </span>
                {taka(p.originalPrice)}
              </del>
            )}
          </div>
          <AddToCartButton product={toCartProduct(p)} />
        </div>
      </div>
    </article>
  );
}
