"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";

export function ProductActions({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleAdd = () => {
    add(product, quantity);
    setAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-actions">
      <div className="quantity">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        <span>{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          aria-label="Increase quantity"
          disabled={quantity >= product.stock}
        >
          <Plus size={14} />
        </Button>
      </div>
      <Button type="button" onClick={handleAdd}>
        {added ? <Check size={17} /> : <ShoppingCart size={17} />} {added ? "Added" : "Add to Cart"}
      </Button>
    </div>
  );
}
