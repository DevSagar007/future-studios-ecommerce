import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const number = (key: string) => {
    if (!params.has(key)) return undefined;
    const value = Number(params.get(key));
    return Number.isFinite(value) ? value : undefined;
  };

  try {
    const result = await getProducts({
      search: params.get("search") || undefined,
      category: params.get("category") || undefined,
      sort: params.get("sort") || undefined,
      minPrice: number("minPrice"),
      maxPrice: number("maxPrice"),
      rating: number("rating"),
      page: number("page"),
      limit: number("limit"),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
