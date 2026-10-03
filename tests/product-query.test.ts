import { describe, expect, it } from "vitest";
import { DEFAULT_LIMIT, MAX_LIMIT, parseProductQuery, productsHref } from "@/lib/product-query";

const parse = (query: string) => parseProductQuery(new URLSearchParams(query));

describe("parseProductQuery", () => {
  it("returns defaults for an empty query", () => {
    expect(parse("")).toEqual({
      search: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      sort: "featured",
      page: 1,
      limit: DEFAULT_LIMIT,
    });
  });

  it("parses valid values and trims text", () => {
    expect(parse("search=%20lamp%20&category=Audio&minPrice=100&maxPrice=2500.5&rating=4.5&sort=price-low&page=3")).toMatchObject({
      search: "lamp",
      category: "Audio",
      minPrice: 100,
      maxPrice: 2500.5,
      rating: 4.5,
      sort: "price-low",
      page: 3,
    });
  });

  it.each(["-5", "abc", "1e3", "Infinity", "", "  "])("ignores malformed or negative price %j", (value) => {
    expect(parse(`minPrice=${encodeURIComponent(value)}`).minPrice).toBeUndefined();
  });

  it("swaps minimum and maximum when minimum is greater", () => {
    expect(parse("minPrice=5000&maxPrice=1000")).toMatchObject({ minPrice: 1000, maxPrice: 5000 });
  });

  it("falls back to featured for unknown sort options", () => {
    expect(parse("sort=DROP%20TABLE").sort).toBe("featured");
  });

  it.each(["0", "-1", "2.5", "abc", "99999999999999999999"])("defaults invalid page %j to 1", (value) => {
    expect(parse(`page=${value}`).page).toBe(1);
  });

  it("clamps rating to 0–5 and limit to MAX_LIMIT", () => {
    expect(parse("rating=9").rating).toBe(5);
    expect(parse("rating=0").rating).toBeUndefined();
    expect(parse("limit=1000").limit).toBe(MAX_LIMIT);
  });

  it("uses the first value of repeated params from a Next.js searchParams record", () => {
    expect(parseProductQuery({ page: ["2", "5"], search: ["a", "b"] })).toMatchObject({ page: 2, search: "a" });
  });

  it("caps search length", () => {
    expect(parse(`search=${"x".repeat(500)}`).search).toHaveLength(100);
  });
});

describe("productsHref", () => {
  it("keeps existing params while applying changes", () => {
    expect(productsHref("category=Audio&page=3", { sort: "rating", page: null })).toBe(
      "/products?category=Audio&sort=rating",
    );
  });

  it("returns the bare path when nothing is left", () => {
    expect(productsHref("page=2", { page: null })).toBe("/products");
  });
});
