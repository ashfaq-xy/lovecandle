import Link from "next/link";
import { FamilyGlyph } from "../Icons";
import { products } from "@/lib/products";
import type { Family } from "@/data/families";

export default function FamilyTile({ f, i = 0, level = 3 }: { f: Family; i?: number; level?: 2 | 3 }) {
  const H = (level === 2 ? "h2" : "h3") as "h2" | "h3";
  const n = products.filter(p => p.category === f.name).length;
  return (
    <div className="rv-i" style={{ ["--i" as any]: i }}>
      <Link href={`/shop?cat=${encodeURIComponent(f.name)}`} className="fam" style={{ ["--t" as any]: f.tint, ["--dp" as any]: f.deep }}>
        <span className="fam-g"><FamilyGlyph glyph={f.glyph} size={84} strokeWidth={1} /></span>
        <H>{f.name}</H>
        <p>{f.tagline}</p>
        <small>{n} candle{n === 1 ? "" : "s"} in the archive</small>
      </Link>
    </div>
  );
}
