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
    <div className="my-6.25 flex flex-wrap gap-2.5">
      <div className="inline-flex items-center gap-3.75 rounded-[1.375rem] border border-[var(--line)] px-2 py-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-[1.4375rem] w-[1.4375rem] rounded-full bg-[#f1f5f9]"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        <span className="text-sm">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-[1.4375rem] w-[1.4375rem] rounded-full bg-[#f1f5f9]"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          aria-label="Increase quantity"
          disabled={quantity >= product.stock}
        >
          <Plus size={14} />
        </Button>
      </div>
      <Button className="min-h-11" type="button" onClick={handleAdd}>
        {added ? <Check size={17} /> : <ShoppingCart size={17} />} {added ? "Added" : "Add to Cart"}
      </Button>
    </div>
  );
}
