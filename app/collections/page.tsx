import Reveal from "@/components/Reveal";
import FamilyTile from "@/components/home/FamilyTile";
import { families } from "@/data/families";
import "@/styles/product.css";
import "@/styles/home.css";
export const metadata = { title: "Collections", description: "Explore LOVE CANDLE by scent family: floral, sweet & gourmand, fresh & clean, woody & warm, romantic and relaxing." };
export default function Collections() {
  return (
    <div className="wrap fade">
      <div className="pg-head"><p className="eyebrow">Collections</p><h1>Choose by mood</h1><p className="lede">Every candle in the archive belongs to a scent family. Start with the feeling you’re after.</p></div>
      <Reveal className="fam-grid">{families.map((f, i) => <FamilyTile key={f.slug} f={f} i={i} level={2} />)}</Reveal>
    </div>
  );
}
