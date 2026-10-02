import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { getProductById, getRelatedProducts } from "@/services/product.service";
import { taka } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductActions } from "@/components/products/product-actions";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductById((await params).id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const product = await getProductById((await params).id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id);
  const reviewCount = product.reviews.length + 18;

  return (
    <>
      <StoreHeader />
      <main className="mx-auto mt-[70px] w-[calc(100%_-_32px)] max-w-[1270px]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/products" }, { label: product.name }]} />
        <div className="grid gap-[55px] bg-white p-[25px] min-[801px]:grid-cols-2">
          <div className="min-w-0">
            <Image
              className="aspect-square h-auto w-full object-cover"
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="min-w-0 p-[25px]">
            <p className="kicker">{product.category}</p>
            <h1 className="my-3 text-[38px] leading-tight tracking-[-1px]">{product.name}</h1>
            <div className="rating">
              <span className="text-[16px] tracking-[1px] text-amber-500" aria-hidden="true">
                ★★★★★
              </span>
              <small>
                {product.rating} ({reviewCount} reviews)
              </small>
            </div>
            <div className="my-[22px] text-[25px] font-bold text-[var(--text)]">
              {taka(product.price)} <del className="ml-2.5 text-[13px] text-[#94a3b8]">{taka(product.originalPrice)}</del>
            </div>
            <p className="max-w-[560px] leading-[1.7] text-(--muted)">{product.description}</p>
            <div className={`my-5 text-[13px] ${product.stock <= 3 ? "text-red-600" : "text-green-600"}`}>
              ● {product.stock} available
            </div>
            <ProductActions product={product} />
            <div className="grid gap-3 border-t border-[var(--line)] pt-4 text-xs min-[801px]:grid-cols-2">
              <b>Delivery options</b>
              <span>Regular delivery within 2–3 days</span>
              <b>Sold by</b>
              <span>Falcon Official Store ✓</span>
            </div>
          </div>
        </div>

        <section className="mt-[50px]">
          <h2 className="mb-1.5 text-[26px]">Customer reviews</h2>
          <p className="mt-0 text-[13px] text-(--muted)">
            {product.rating} out of 5 · {reviewCount} reviews
          </p>
          {product.reviews.length > 0 ? (
            <div className="mt-[18px] grid gap-3.5">
              {product.reviews.map((review) => (
                <article className="rounded-[6px] bg-white p-[18px]" key={review.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <b>{review.author}</b>
                    <span className="text-[16px] tracking-[1px] text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(Math.max(0, 5 - review.rating))}
                    </span>
                  </div>
                  <p className="m-0 text-sm leading-[1.6] text-(--muted)">{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-(--muted)">
              No written reviews yet. Be the first to review this product.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-[75px]">
            <h2 className="mb-6 text-[26px]">Related products</h2>
            <ProductGrid items={related} />
          </section>
        )}
      </main>
      <StoreFooter />
    </>
  );
}
