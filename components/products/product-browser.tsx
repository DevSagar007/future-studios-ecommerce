"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export type ProductBrowserResult = {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
  categories: string[];
};

const SKELETON_COUNT = 8;

const SORT_LABELS: Record<string, string> = {
  "": "Sort by: Featured",
  featured: "Sort by: Featured",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
  rating: "Top rated",
};

const RATING_LABELS: Record<string, string> = {
  "": "Any rating",
  any: "Any rating",
  "4": "4+ stars",
  "4.5": "4.5+ stars",
};

export function ProductBrowserSkeleton() {
  return (
    <main className="shop-page" aria-busy="true">
      <div className="products-grid">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <Skeleton className="skeleton" key={i} />
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
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Shop" }]} />
      <div className="shop-heading">
        <div>
          <h1>
            Find your <em>everyday</em>
          </h1>
        </div>
      </div>

      <div className="shop-toolbar">
        <div className="search-box h-10 rounded-md border border-[var(--line)] bg-white px-3">
          <Search size={18} className="shrink-0 text-(--muted)" aria-hidden="true" />
          <Input
            className="h-9 min-w-0 border-0 bg-transparent px-0 shadow-none focus:border-transparent focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
        <Select
          value={sort || "featured"}
          onValueChange={(value) => setFilter("sort", value === "featured" ? "" : value)}
        >
          <SelectTrigger aria-label="Sort products">
            <SelectValue>{SORT_LABELS[sort] ?? SORT_LABELS[""]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Sort by: Featured</SelectItem>
            <SelectItem value="price-low">Price: low to high</SelectItem>
            <SelectItem value="price-high">Price: high to low</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-title">
            <b>
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters
            </b>
            <Button type="button" variant="link" onClick={clearFilters}>
              Clear
            </Button>
          </div>
          <label>
            Category
            <Select
              value={category}
              onValueChange={(value) => setFilter("category", value === "all" ? "" : value)}
            >
              <SelectTrigger className="mt-1.75">
                <SelectValue>{category === "all" ? "All categories" : category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {result.categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={rating || "any"}
              onValueChange={(value) => setFilter("rating", value === "any" ? "" : value)}
            >
              <SelectTrigger className="mt-1.75">
                <SelectValue>{RATING_LABELS[rating] ?? RATING_LABELS[""]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any rating</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
              </SelectContent>
            </Select>
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
                <Skeleton className="skeleton" key={i} />
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
            <Pagination aria-label="Pagination">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink asChild aria-label="Previous page">
                    <button
                      type="button"
                      onClick={() => goToPage(result.page - 1)}
                      disabled={result.page <= 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </PaginationLink>
                </PaginationItem>
                {pages.map((item, index) =>
                  item === "gap" ? (
                    <PaginationItem key={`gap-${index}`}>
                      <span className="flex w-7.5 items-center justify-center text-(--muted)">…</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        asChild
                        isActive={item === result.page}
                        className={item === result.page ? "active" : ""}
                      >
                        <button type="button" onClick={() => goToPage(item)}>
                          {item}
                        </button>
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationLink asChild aria-label="Next page">
                    <button
                      type="button"
                      onClick={() => goToPage(result.page + 1)}
                      disabled={result.page >= result.totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </div>
    </main>
  );
}
