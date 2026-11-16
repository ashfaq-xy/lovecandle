import Link from "next/link";
import Hero from "@/components/home/Hero";
import Story from "@/components/home/Story";
import GiftingBand from "@/components/home/GiftingBand";
import Closing from "@/components/home/Closing";
import Parallax from "@/components/home/Parallax";
import ScrollFlame from "@/components/home/ScrollFlame";
import FamilyTile from "@/components/home/FamilyTile";
import MaskLines from "@/components/home/MaskLines";
import Reveal from "@/components/Reveal";
import { Grid } from "@/components/ProductCard";
import { families } from "@/data/families";
import { products } from "@/lib/products";
import "@/styles/product.css";
import "@/styles/home.css";

export const metadata = { title: { absolute: "LOVE CANDLE — Light up your little moments" }, description: "Scented candles and thoughtful gifting. Explore the LOVE CANDLE Scent Archive: floral, sweet & gourmand, fresh & clean, woody & warm, romantic and relaxing." };

export default function Home() {
  const featured = products.filter(p => p.featured).slice(0, 4);
  const show = featured.length ? featured : products.slice(0, 4);
  return (
    <>
      <noscript><style>{`.rv-i,.mline>span{opacity:1!important;transform:none!important}.hero-h .mline>span{transform:none!important}`}</style></noscript>
      <Parallax />
      <ScrollFlame />
      <Hero />

      <section className="sec families" aria-labelledby="fam-h" id="collections">
        <span className="fstop" data-flame="91,42" />
        <Reveal className="wrap">
          <div className="sec-h">
            <h2 id="fam-h"><MaskLines lines={["Find a scent", "that feels like you"]} /></h2>
            <p className="lede rv-i" style={{ ["--i" as any]: 3 }}>Six families, from soft florals to slow, woody evenings. Pick a mood and the archive does the rest.</p>
          </div>
          <div className="fam-grid">{families.map((f, i) => <FamilyTile key={f.slug} f={f} i={i + 2} />)}</div>
        </Reveal>
      </section>

      <section className="sec featured" aria-labelledby="feat-h">
        <span className="fstop" data-flame="7,46" />
        <Reveal className="wrap">
          <div className="sec-h row">
            <h2 id="feat-h"><MaskLines lines={["Featured candles"]} /></h2>
            <Link href="/shop" className="btn rv-i" style={{ ["--i" as any]: 2 }}>Enter the Scent Archive</Link>
          </div>
          <Grid list={show} />
        </Reveal>
      </section>

      <Story />
      <GiftingBand />
      <Closing />
    </>
  );
}
