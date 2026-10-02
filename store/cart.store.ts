"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export type CartItem = Product & { quantity: number };

type State = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<State>()(
  persist(
    (set) => ({
      items: [],

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.stock,
                        item.quantity + quantity,
                      ),
                    }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...product, quantity: Math.min(product.stock, quantity) },
            ],
          };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      inc: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
              : item,
          ),
        })),

      dec: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item,
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "ecommerce-task-cart" },
  ),
);