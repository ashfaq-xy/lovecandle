import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskLines from "@/components/home/MaskLines";
import Parallax from "@/components/home/Parallax";
import { founderStory, philosophy, showPlaceholders } from "@/data/content";
import "@/styles/product.css";
import "@/styles/home.css";
export const metadata = { title: "Our Story", description: "The story behind LOVE CANDLE: warmth, fragrance and thoughtful gifting." };

export default function Story() {
  return (
    <>
      <Parallax />
      <section className="gift gift-page">
        <Reveal className="wrap gift-in">
          <div className="gift-txt">
            <p className="eyebrow rv-i">Our story</p>
            <h1><MaskLines lines={["Every flame", "has a story."]} /></h1>
            <p className="lede rv-i" style={{ ["--i" as any]: 2 }}>LOVE CANDLE is a scented-candle brand built around warmth, fragrance and thoughtful gifting. Light of love.</p>
          </div>
          <div className="about-card rv-i" style={{ ["--i" as any]: 2 }}><Image src="/logo.jpg" alt="LOVE CANDLE logo: a watercolour bow, cherry blossoms and a glass candle with a heart" width={1271} height={1237} priority sizes="(max-width:760px) 80vw, 460px" /></div>
        </Reveal>
      </section>

      <section className="st st-1" style={{ minHeight: 0, marginTop: 40 }} aria-labelledby="why-h">
        <Reveal className="wrap st-in" >
          <div className="st-txt"><h2 id="why-h" style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)" }}><MaskLines lines={["Why LOVE CANDLE", "began"]} /></h2></div>
          <div className="stack">
            {founderStory.length ? founderStory.map((t, i) => <p key={i} className="lede rv-i" style={{ ["--i" as any]: i + 1 }}>{t}</p>)
              : showPlaceholders ? <p className="note rv-i">Your story goes here: why you started, what inspired the brand, what you hope every candle brings. Add it in your own words in <code>data/content.ts</code> (founderStory). Nothing has been invented for you.</p> : null}
          </div>
        </Reveal>
      </section>

      <section className="st st-3" style={{ minHeight: 0, margin: 0 }} aria-labelledby="phil-h">
        <Reveal className="wrap st-in">
          <div className="st-txt"><h2 id="phil-h" style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)" }}><MaskLines lines={["Our", "philosophy"]} /></h2></div>
          <div className="stack">
            {philosophy.length ? philosophy.map((t, i) => <p key={i} className="lede rv-i" style={{ ["--i" as any]: i + 1 }}>{t}</p>)
              : showPlaceholders ? <p className="note rv-i">Add your philosophy and what you want every customer to feel in <code>data/content.ts</code> (philosophy).</p> : null}
            <div className="rv-i" style={{ ["--i" as any]: 4 }}><Link href="/shop" className="btn btn-primary">Explore the Scent Archive</Link></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
