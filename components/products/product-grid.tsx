import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="products-grid">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
