import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { getProductById, getRelatedProducts } from "@/services/product.service";
import { taka } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductActions } from "@/components/products/product-actions";

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
      <main className="detail-page">
        <div className="breadcrumb">
          Home <span>›</span> <Link href="/products">Shop</Link> <span>›</span> {product.name}
        </div>
        <div className="detail-grid">
          <div className="detail-image">
            <Image
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="detail-copy">
            <p className="kicker">{product.category}</p>
            <h1>{product.name}</h1>
            <div className="rating">
              <span className="stars" aria-hidden="true">
                ★★★★★
              </span>
              <small>
                {product.rating} ({reviewCount} reviews)
              </small>
            </div>
            <div className="detail-price">
              {taka(product.price)} <del>{taka(product.originalPrice)}</del>
            </div>
            <p>{product.description}</p>
            <div className={`stock${product.stock <= 3 ? " low" : ""}`}>
              ● {product.stock} available
            </div>
            <ProductActions product={product} />
            <div className="detail-info">
              <b>Delivery options</b>
              <span>Regular delivery within 2–3 days</span>
              <b>Sold by</b>
              <span>Falcon Official Store ✓</span>
            </div>
          </div>
        </div>

        <section className="reviews">
          <h2>Customer reviews</h2>
          <p className="reviews-summary">
            {product.rating} out of 5 · {reviewCount} reviews
          </p>
          {product.reviews.length > 0 ? (
            <div className="review-list">
              {product.reviews.map((review) => (
                <article className="review" key={review.id}>
                  <div className="review-head">
                    <b>{review.author}</b>
                    <span className="stars" aria-label={`${review.rating} out of 5 stars`}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(Math.max(0, 5 - review.rating))}
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="reviews-empty">
              No written reviews yet. Be the first to review this product.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section className="related">
            <h2>Related products</h2>
            <ProductGrid items={related} />
          </section>
        )}
      </main>
      <StoreFooter />
    </>
  );
}
