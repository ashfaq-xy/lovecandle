import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import { Grid } from "@/components/ProductCard";
import { products, displayName } from "@/lib/products";
import "@/styles/product.css";

export const metadata = {
  title: "The Scent Archive",
  description: "Browse every LOVE CANDLE scented candle in the Scent Archive, filed by scent family: floral, sweet & gourmand, fresh & clean, woody & warm, romantic and relaxing.",
};

export default function Shop() {
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "LOVE CANDLE — The Scent Archive",
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: displayName(p), url: `/shop/${p.id}` })),
  };
  return (
    <>
      {/* The fallback below is what search engines and no-JS visitors get; the archive replaces it once the page loads. */}
      <Suspense fallback={<div className="wrap fade" style={{ paddingTop: 36 }}><h1 style={{ fontSize: "clamp(2.1rem,3.6vw,3rem)", marginBottom: 24 }}>The Scent Archive</h1><Grid list={products} /></div>}>
        <ShopClient />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
