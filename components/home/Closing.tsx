import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import { Newsletter } from "../Forms";
import { founderStory, showPlaceholders, testimonials } from "@/data/content";

export default function Closing() {
  return (
    <>
      <section className="about" aria-labelledby="about-h">
        <span className="fstop" data-flame="92,36" />
        <Reveal className="wrap about-in">
          <div className="about-card rv-i" aria-hidden="true"><Image src="/logo.jpg" alt="" width={1271} height={1237} sizes="(max-width:760px) 80vw, 460px" /></div>
          <div className="about-txt">
            <h2 id="about-h" className="rv-i">Behind the flame</h2>
            {founderStory.length ? <p className="lede rv-i" style={{ ["--i" as any]: 1 }}>{founderStory[0]}</p>
              : <p className="lede rv-i" style={{ ["--i" as any]: 1 }}>LOVE CANDLE is a scented-candle brand built around warmth, fragrance and thoughtful gifting.</p>}
            {!founderStory.length && showPlaceholders && <p className="note rv-i" style={{ ["--i" as any]: 2 }}>Add your own story in <code>data/content.ts</code> (founderStory) and it appears here and on the Our Story page.</p>}
            <div className="rv-i" style={{ ["--i" as any]: 3 }}><Link href="/our-story" className="btn">Read our story</Link></div>
          </div>
        </Reveal>
      </section>

      {testimonials.length > 0 && (
        <section className="wrap proof" aria-labelledby="proof-h">
          <h2 id="proof-h">Kind words</h2>
          <Reveal className="proof-grid">{testimonials.map((t, i) => (
            <figure key={i} className="rv-i" style={{ ["--i" as any]: i }}><blockquote>{t.quote}</blockquote><figcaption>{t.name}{t.place ? `, ${t.place}` : ""}</figcaption></figure>
          ))}</Reveal>
        </section>
      )}

      <section className="news" aria-labelledby="news-h">
        <Reveal className="wrap news-in">
          <div className="news-t"><h2 id="news-h" className="rv-i">Stay in the glow</h2><p className="rv-i" style={{ ["--i" as any]: 1 }}>New scents and gifting ideas, sent only when there is something lovely to share.</p></div>
          <div className="rv-i" style={{ ["--i" as any]: 2 }}><Newsletter /></div>
        </Reveal>
      </section>
    </>
  );
}
