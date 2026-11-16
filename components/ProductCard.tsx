import Link from "next/link";
import ProductArt from "./ProductArt";
import QuickAdd from "./QuickAdd";
import WishlistButton from "./WishlistButton";
import { discountPct, displayName, familyLabel, familyOf, hasDiscount, inStock, money, type Product } from "@/lib/products";

export default function ProductCard({ p, i = 0, priority = false }: { p: Product; i?: number; priority?: boolean }) {
  const f = familyOf(p);
  return (
    <article className="pc rv-i" style={{ ["--i" as any]: i, ["--t" as any]: f.tint, ["--dp" as any]: f.deep }}>
      <div className="pc-media">
        <Link href={`/shop/${p.id}`} className="pc-img" aria-label={`${displayName(p)}, ${familyLabel(p)}`}>
          <ProductArt p={p} priority={priority} sizes="(max-width:600px) 46vw, (max-width:1000px) 30vw, 300px" />
        </Link>
        <div className="pc-tags">{p.isNew && <span>New</span>}{p.bestseller && <span>Bestseller</span>}{!inStock(p) && <span className="oos">Out of stock</span>}</div>
        <WishlistButton id={p.id} name={displayName(p)} className="pc-wl" />
      </div>
      <div className="pc-b">
        <p className="pc-f" style={{ color: f.deep }}>{familyLabel(p)}</p>
        <h3><Link href={`/shop/${p.id}`}>{displayName(p)}</Link></h3>
        <p className="pc-p"><strong className={p.price == null ? "muted" : ""}>{money(p.price)}</strong>{hasDiscount(p) && <><s>{money(p.originalPrice)}</s><em>{discountPct(p)}% off</em></>}</p>
      </div>
      <QuickAdd p={p} />
    </article>
  );
}

export function Grid({ list, empty }: { list: Product[]; empty?: React.ReactNode }) {
  if (!list.length) return <>{empty ?? <p className="pc-empty">No candles match. Try another search or scent family.</p>}</>;
  return <div className="pgrid">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i % 8} priority={i < 4} />)}</div>;
}
