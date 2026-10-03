import { describe, expect, it } from "vitest";
import { addItem, changeQuantity, sanitizeCartItems, syncWithCatalog, type CartProduct } from "@/lib/cart";
import { cartTotals, discountPercent, SHIPPING_FEE } from "@/lib/pricing";

const product = (overrides: Partial<CartProduct> = {}): CartProduct => ({
  id: "prod-001",
  slug: "aurora-wireless-headphones-1",
  name: "Aurora Wireless Headphones",
  image: "https://images.unsplash.com/photo.jpg",
  category: "Audio",
  price: 3290,
  stock: 3,
  ...overrides,
});

describe("cart operations", () => {
  it("merges repeated adds of the same product and caps at stock", () => {
    let items = addItem([], product());
    items = addItem(items, product());
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    items = addItem(items, product(), 10);
    expect(items[0].quantity).toBe(3);
  });

  it("keeps quantity between 1 and stock", () => {
    const items = addItem([], product(), 2);
    expect(changeQuantity(items, "prod-001", -5)[0].quantity).toBe(1);
    expect(changeQuantity(items, "prod-001", 5)[0].quantity).toBe(3);
  });

  it("does not add out-of-stock products", () => {
    expect(addItem([], product({ stock: 0 }))).toEqual([]);
  });
});

describe("sanitizeCartItems (persisted data)", () => {
  it("returns an empty cart for non-array data", () => {
    expect(sanitizeCartItems(null)).toEqual([]);
    expect(sanitizeCartItems("garbage")).toEqual([]);
  });

  it("drops malformed and duplicate entries and re-clamps quantities", () => {
    const items = sanitizeCartItems([
      { ...product(), quantity: 99 },
      { ...product(), quantity: 1 },
      { id: "x", name: "No price", image: "a.jpg", stock: 2, quantity: 1 },
      { ...product({ id: "prod-002" }), quantity: -1 },
      { ...product({ id: "prod-003" }), quantity: 2.7 },
    ]);
    expect(items.map((i) => [i.id, i.quantity])).toEqual([
      ["prod-001", 3],
      ["prod-003", 2],
    ]);
  });

  it("strips extra fields from the old full-Product format", () => {
    const [item] = sanitizeCartItems([{ ...product(), quantity: 1, reviews: [{}], description: "long text" }]);
    expect(item).not.toHaveProperty("reviews");
    expect(item).not.toHaveProperty("description");
  });
});

describe("syncWithCatalog", () => {
  it("updates prices, clamps to new stock and removes discontinued items", () => {
    const items = [
      { ...product(), quantity: 3 },
      { ...product({ id: "prod-002" }), quantity: 1 },
      { ...product({ id: "prod-003" }), quantity: 1 },
    ];
    const synced = syncWithCatalog(items, {
      "prod-001": product({ price: 3000, stock: 2 }),
      "prod-002": null,
    });
    expect(synced.map((i) => [i.id, i.price, i.quantity])).toEqual([
      ["prod-001", 3000, 2],
      ["prod-003", 3290, 1],
    ]);
  });
});

describe("pricing", () => {
  it("computes line totals, subtotal, shipping and total", () => {
    const totals = cartTotals([
      { price: 1000, quantity: 2 },
      { price: 450, quantity: 3 },
    ]);
    expect(totals).toEqual({ count: 5, subtotal: 3350, shipping: SHIPPING_FEE, total: 3350 + SHIPPING_FEE });
  });

  it("charges nothing for an empty cart", () => {
    expect(cartTotals([])).toEqual({ count: 0, subtotal: 0, shipping: 0, total: 0 });
  });

  it("only reports a discount when the old price is higher", () => {
    expect(discountPercent(3109, 3087)).toBe(0);
    expect(discountPercent(1000, 1000)).toBe(0);
    expect(discountPercent(800, 1000)).toBe(20);
  });
});
