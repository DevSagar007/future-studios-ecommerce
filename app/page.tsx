import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/product.service";
import { ProductGrid } from "@/components/products/product-grid";

export const metadata: Metadata = {
  title: "Everyday things, better chosen",
  description:
    "Discover useful, beautiful products at fair prices. Shop 500+ items across electronics, audio, lifestyle and accessories.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const featured = await getProducts({ limit: 4, sort: "rating" });
  return (
    <>
      <StoreHeader />
      <main>
        <section className="home-hero">
          <div>
            <p className="kicker">The new Falcon collection</p>
            <h1>
              Everyday things.
              <br />
              <em>Better chosen</em>
            </h1>
            <p>
              Experience a new platform for discovering useful, beautiful things made for modern
              life.
            </p>
            <Button asChild>
              <Link href="/products">
                Shop now <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
          <div className="hero-image">
            <Image
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&q=85"
              alt="Curated desk setup"
              width={1200}
              height={900}
              preload
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </section>
        <section className="home-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Popular now</p>
              <h2>Made for your everyday</h2>
            </div>
            <Link href="/products">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <ProductGrid items={featured.items} />
        </section>
        <section className="feature-banner rounded-lg">
          <div>
            <p className="kicker">Thoughtfully selected</p>
            <h2>
              Good design
              <br />
              should feel easy
            </h2>
            <Button asChild>
              <Link href="/products">Explore collection</Link>
            </Button>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=85"
            alt="Bright workspace"
            width={1200}
            height={900}
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </section>
      </main>
      <StoreFooter />
    </>
  );
}
