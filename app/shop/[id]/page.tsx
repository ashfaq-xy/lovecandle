import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, findProduct, related, money, displayName, familyOf, familyLabel, blurb, longText, specs, inStock, hasDiscount, discountPct, isPlaceholder } from "@/lib/products";
import ProductGallery from "@/components/ProductGallery";
import AddToBag from "@/components/AddToBag";
import NotesLadder from "@/components/NotesLadder";
import { Grid } from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { careTips, showPlaceholders } from "@/data/content";
import "@/styles/product.css";

export const generateStaticParams = () => products.map(p => ({ id: p.id }));
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = findProduct(params.id);
  if (!p) return { title: "Candle not found" };
  const title = `${displayName(p)} — ${familyLabel(p)} candle`;
  const description = blurb(p);
  return { title, description, alternates: { canonical: `/shop/${p.id}` }, openGraph: { title, description, images: p.images?.[0] ? [{ url: p.images[0] }] : [{ url: "/og.jpg" }] } };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const p = findProduct(params.id);
  if (!p) notFound();
  const f = familyOf(p);
  const sp = specs(p);
  const txt = longText(p);
  const rel = related(p, 4);
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: displayName(p), sku: p.id, category: p.category, description: blurb(p),
    ...(p.images?.length ? { image: p.images } : {}),
    brand: { "@type": "Brand", name: "LOVE CANDLE" },
    ...(p.price != null ? { offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } } : {}),
  };
  return (
    <div className="pp" style={{ ["--t" as any]: f.tint, ["--dp" as any]: f.deep }}>
      <div className="wrap pp-in fade">
        <nav className="pp-crumb" aria-label="Breadcrumb">
          <Link href="/shop">The Scent Archive</Link><span aria-hidden="true">/</span>
          <Link href={`/shop?cat=${encodeURIComponent(p.category)}`}>{p.category}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{displayName(p)}</span>
        </nav>
        <div className="pp-grid">
          <ProductGallery p={p} />
          <div className="pp-info">
            <p className="pp-fam"><span style={{ color: f.deep }}>{familyLabel(p)}</span>{isPlaceholder(p) && <em className="cap-tag">Sample entry</em>}</p>
            <h1>{displayName(p)}</h1>
            <p className="pp-price">
              <strong className={p.price == null ? "muted" : ""}>{money(p.price)}</strong>
              {hasDiscount(p) && <><s>{money(p.originalPrice)}</s><em className="badge">{discountPct(p)}% off</em></>}
              <em className={"stock " + (inStock(p) ? "in" : "out")}>{inStock(p) ? "In stock" : "Out of stock"}</em>
              {p.isNew && <em className="badge">New</em>}{p.bestseller && <em className="badge">Bestseller</em>}
            </p>
            <p className="pp-desc">{txt || blurb(p)}</p>
            <NotesLadder p={p} tone={f.deep} />
            {sp.length > 0 && <dl className="specs">{sp.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
            <AddToBag p={p} />
            <p className="pp-order">Orders are confirmed on WhatsApp. No payment is taken on this website.</p>
            {isPlaceholder(p) && showPlaceholders && <p className="note">This is a sample entry. Add the real name, photographs, price and scent details in <code>data/products.json</code> and this page updates itself.</p>}
          </div>
        </div>
      </div>

      <section className="pp-care" aria-labelledby="care-h">
        <Reveal className="wrap pp-care-in">
          <h2 id="care-h" className="rv-i">Burning your candle well</h2>
          <ol>{careTips.map((t, i) => <li key={i} className="rv-i" style={{ ["--i" as any]: i + 1 }}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{t}</p></li>)}</ol>
        </Reveal>
      </section>

      <section className="wrap pp-rel" aria-labelledby="rel-h">
        <div className="pp-rel-h"><h2 id="rel-h">More scents to explore</h2><Link href="/shop" className="btn btn-sm">Back to the archive</Link></div>
        <Reveal><Grid list={rel} /></Reveal>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
