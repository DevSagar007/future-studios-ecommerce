import seed from "@/data/products.json";
import type { Product, ProductQuery } from "@/types/product";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const products: Product[] = Array.from({ length: 520 }, (_, i) => {
  const p = seed[i % seed.length] as Product;
  const n = Math.floor(i / seed.length) + 1;
  return {
    ...p,
    id: `prod-${String(i + 1).padStart(3, "0")}`,
    name: n === 1 ? p.name : `${p.name} Edition ${n}`,
    slug: `${p.slug}-${n}`,
    price: Math.max(990, p.price + ((i * 137) % 1900) - 700),
    originalPrice: p.originalPrice + ((i * 91) % 2400),
    stock: Math.max(3, p.stock + ((i * 11) % 25) - 8),
  };
});

export const categories = [...new Set(products.map((p) => p.category))];

function finite(value: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function getProducts(q: ProductQuery = {}) {
  let list = [...products];

  const search = q.search?.toLowerCase().trim();
  if (search) {
    list = list.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search),
    );
  }

  if (q.category && q.category !== "all") {
    list = list.filter((p) => p.category === q.category);
  }

  const minPrice = finite(q.minPrice);
  const maxPrice = finite(q.maxPrice);
  const rating = finite(q.rating);
  if (minPrice !== undefined) list = list.filter((p) => p.price >= minPrice);
  if (maxPrice !== undefined) list = list.filter((p) => p.price <= maxPrice);
  if (rating !== undefined) list = list.filter((p) => p.rating >= rating);

  if (q.sort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (q.sort === "price-high") list.sort((a, b) => b.price - a.price);
  else if (q.sort === "rating") list.sort((a, b) => b.rating - a.rating);

  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(finite(q.limit) ?? DEFAULT_LIMIT)));
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, Math.floor(finite(q.page) ?? 1)), totalPages);

  return {
    items: list.slice((page - 1) * limit, page * limit),
    total,
    page,
    limit,
    totalPages,
    categories,
  };
}

export async function getProductById(id: string) {
  return products.find((p) => p.id === id || p.slug === id);
}

export async function getRelatedProducts(id: string, limit = 4) {
  const product = await getProductById(id);
  if (!product) return [];
  return products
    .filter((x) => x.category === product.category && x.id !== product.id)
    .slice(0, limit);
}
