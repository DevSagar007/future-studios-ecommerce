import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/services/product.service";
import {
  ProductBrowser,
  ProductBrowserSkeleton,
} from "@/components/products/product-browser";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Browse 500+ products across electronics, audio, lifestyle and accessories. Search, filter and sort the full Falcon collection.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pick = (key: string) => {
    const value = first(params[key]);
    return value && value.length > 0 ? value : undefined;
  };
  const toNumber = (key: string) => {
    const value = pick(key);
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const result = await getProducts({
    search: pick("search"),
    category: pick("category"),
    sort: pick("sort"),
    page: toNumber("page") ?? 1,
    minPrice: toNumber("minPrice"),
    maxPrice: toNumber("maxPrice"),
    rating: toNumber("rating"),
  });

  return (
    <>
      <StoreHeader />
      <Suspense fallback={<ProductBrowserSkeleton />}>
        <ProductBrowser result={result} />
      </Suspense>
      <StoreFooter />
    </>
  );
}
