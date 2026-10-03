import { describe, expect, it } from "vitest";
import { parseProductQuery } from "@/lib/product-query";
import {
  categories,
  getAllProductSlugs,
  getProductById,
  getProducts,
  getRelatedProducts,
} from "@/services/product.service";

const all = async () => (await getProducts({ limit: 48, page: 1 })).total;

describe("catalog data", () => {
  it("contains at least 500 products with unique ids and slugs", async () => {
    const slugs = await getAllProductSlugs();
    expect(slugs.length).toBeGreaterThanOrEqual(500);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(await all()).toBe(slugs.length);
  });

  it("never shows an old price that is not above the current price", async () => {
    for (const slug of await getAllProductSlugs()) {
      const product = (await getProductById(slug))!;
      expect(product.price).toBeGreaterThan(0);
      expect(product.originalPrice).toBeGreaterThanOrEqual(product.price);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    }
  });

  it("fixes the reported Swift USB-C Charger 65W Edition 3 pricing", async () => {
    const product = (await getProductById("prod-108"))!;
    expect(product.name).toBe("Swift USB-C Charger 65W Edition 3");
    expect(product.originalPrice).toBeGreaterThan(product.price);
  });

  it("does not copy one product's reviews onto its editions", async () => {
    const original = (await getProductById("prod-001"))!;
    const edition = (await getProductById("prod-049"))!;
    expect(original.reviews.length).toBe(1);
    expect(edition.name).toContain("Edition 2");
    expect(edition.reviews).toEqual([]);
  });
});

describe("getProducts", () => {
  it("filters before paginating", async () => {
    const result = await getProducts({ category: "Audio", limit: 12, page: 2 });
    expect(result.items.every((p) => p.category === "Audio")).toBe(true);
    expect(result.totalPages).toBe(Math.ceil(result.total / 12));
    expect(result.total).toBeLessThan(await all());
  });

  it("combines search, price and rating filters", async () => {
    const result = await getProducts(parseProductQuery(new URLSearchParams("search=wireless&minPrice=2000&maxPrice=4000&rating=4.5&limit=48")));
    expect(result.total).toBeGreaterThan(0);
    for (const p of result.items) {
      expect(`${p.name} ${p.description}`.toLowerCase()).toContain("wireless");
      expect(p.price).toBeGreaterThanOrEqual(2000);
      expect(p.price).toBeLessThanOrEqual(4000);
      expect(p.rating).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("matches categories case-insensitively and ignores unknown ones", async () => {
    expect((await getProducts({ category: "audio" })).query.category).toBe("Audio");
    expect((await getProducts({ category: "nope" })).total).toBe(await all());
    expect(categories).toContain("Sports Gear");
  });

  it("sorts deterministically with id as the tie-breaker", async () => {
    const a = await getProducts({ sort: "rating", limit: 48 });
    const b = await getProducts({ sort: "rating", limit: 48 });
    expect(a.items.map((p) => p.id)).toEqual(b.items.map((p) => p.id));
    for (let i = 1; i < a.items.length; i += 1) {
      const [prev, cur] = [a.items[i - 1], a.items[i]];
      expect(prev.rating > cur.rating || (prev.rating === cur.rating && prev.id < cur.id)).toBe(true);
    }
    const low = await getProducts({ sort: "price-low", limit: 48 });
    expect(low.items.map((p) => p.price)).toEqual([...low.items.map((p) => p.price)].sort((x, y) => x - y));
  });

  it("clamps out-of-range pages to the last page", async () => {
    const result = await getProducts({ category: "Audio", page: 999 });
    expect(result.page).toBe(result.totalPages);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("returns an empty first page when nothing matches", async () => {
    const result = await getProducts({ search: "no-such-product-xyz" });
    expect(result).toMatchObject({ total: 0, page: 1, totalPages: 1, items: [] });
  });
});

describe("product details and related products", () => {
  it("resolves by id or slug and returns undefined for unknown ids", async () => {
    const byId = await getProductById("prod-001");
    expect(byId).toBeDefined();
    expect(await getProductById(byId!.slug)).toBe(byId);
    expect(await getProductById("does-not-exist")).toBeUndefined();
  });

  it("returns same-category related products without the product's own editions", async () => {
    const product = (await getProductById("prod-001"))!;
    const related = await getRelatedProducts(product.id);
    expect(related).toHaveLength(4);
    for (const item of related) {
      expect(item.category).toBe(product.category);
      expect(item.name.startsWith("Aurora Wireless Headphones")).toBe(false);
    }
    expect(await getRelatedProducts("does-not-exist")).toEqual([]);
  });
});
