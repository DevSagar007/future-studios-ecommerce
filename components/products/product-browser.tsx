"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { Input } from "@/components/ui/input";

export type ProductBrowserResult = {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
  categories: string[];
};

const SKELETON_COUNT = 8;

export function ProductBrowserSkeleton() {
  return (
    <main className="shop-page" aria-busy="true">
      <div className="products-grid">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    </main>
  );
}

function paginationItems(current: number, total: number) {
  const pages: (number | "gap")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) pages.push("gap");
  for (let page = from; page <= to; page += 1) pages.push(page);
  if (to < total - 1) pages.push("gap");
  if (total > 1) pages.push(total);
  return pages;
}

function useDebouncedParam(
  key: string,
  commit: (key: string, value: string) => void,
  delay = 350,
) {
  const searchParams = useSearchParams();
  const urlValue = searchParams.get(key) ?? "";
  const [value, setValue] = useState(urlValue);
  const lastPushed = useRef(urlValue);

  useEffect(() => {
    const next = searchParams.get(key) ?? "";
    if (next !== lastPushed.current) {
      lastPushed.current = next;
      setValue(next);
    }
  }, [searchParams, key]);

  useEffect(() => {
    const current = searchParams.get(key) ?? "";
    if (value === current) return;
    const timer = setTimeout(() => {
      lastPushed.current = value;
      commit(key, value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, searchParams, key, commit, delay]);

  return [value, setValue] as const;
}

export function ProductBrowser({ result }: { result: ProductBrowserResult }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const commitParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `/products?${query}` : "/products", { scroll: false });
      });
    },
    [router, searchParams],
  );

  const [search, setSearch] = useDebouncedParam("search", commitParam);
  const [minPrice, setMinPrice] = useDebouncedParam("minPrice", commitParam);
  const [maxPrice, setMaxPrice] = useDebouncedParam("maxPrice", commitParam);

  const navigate = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/products?${query}` : "/products", { scroll: false });
    });
  };

  const setFilter = (key: string, value: string) => {
    navigate((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
    });
  };

  const goToPage = (page: number) => {
    navigate((params) => {
      if (page > 1) params.set("page", String(page));
      else params.delete("page");
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  };

  const pages = paginationItems(result.page, result.totalPages);
  const sort = searchParams.get("sort") ?? "";
  const category = searchParams.get("category") ?? "all";
  const rating = searchParams.get("rating") ?? "";

  return (
    <main className="shop-page">
      <div className="breadcrumb">
        Home <span>›</span> Shop
      </div>
      <div className="shop-heading">
        <div>
          <p className="kicker">Our collection</p>
          <h1>
            Find your
            <br />
            <em>everyday.</em>
          </h1>
        </div>
        <p>Thoughtful essentials, fair prices and the little things that make life better.</p>
      </div>

      <div className="shop-toolbar">
        <div className="search-box">
          <Search size={18} aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setFilter("sort", e.target.value)}
          aria-label="Sort products"
        >
          <option value="">Sort by: Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-title">
            <b>
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters
            </b>
            <button type="button" onClick={clearFilters}>
              Clear
            </button>
          </div>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => setFilter("category", e.target.value === "all" ? "" : e.target.value)}
            >
              <option value="all">All categories</option>
              {result.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Minimum price
            <Input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="৳0"
            />
          </label>
          <label>
            Maximum price
            <Input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="৳100000"
            />
          </label>
          <label>
            Rating
            <select
              value={rating}
              onChange={(e) => setFilter("rating", e.target.value)}
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </label>
        </aside>

        <section className="results">
          <div className="results-meta">
            {result.total} products{" "}
            <span>
              Page {result.page} of {result.totalPages}
            </span>
          </div>

          {isPending ? (
            <div className="products-grid" aria-busy="true">
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div className="skeleton" key={i} />
              ))}
            </div>
          ) : result.items.length > 0 ? (
            <ProductGrid items={result.items} />
          ) : (
            <div className="empty">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {result.totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                type="button"
                onClick={() => goToPage(result.page - 1)}
                disabled={result.page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {pages.map((item, index) =>
                item === "gap" ? (
                  <span className="pagination-gap" key={`gap-${index}`}>
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    className={item === result.page ? "active" : ""}
                    aria-current={item === result.page ? "page" : undefined}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => goToPage(result.page + 1)}
                disabled={result.page >= result.totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
