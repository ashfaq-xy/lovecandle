import Image from "next/image";
import Reveal from "../Reveal";
import MaskLines from "./MaskLines";

const Petal = ({ s = 22, r = 0 }: { s?: number; r?: number }) => (
  <svg width={s} height={s * 1.3} viewBox="0 0 20 26" aria-hidden="true" style={{ transform: `rotate(${r}deg)` }}><path d="M10 1C16 7 19 13 15 20c-2 3.500-8 3.500-10 0C1 13 4 7 10 1Z" fill="currentColor" /></svg>
);

/** Three chapters of the candle ritual: parallax, mask-revealed headings, layered art. */
export default function Story() {
  return (
    <div className="story">
      {/* 01 */}
      <section className="st st-1" aria-labelledby="st1">
        <span className="fstop" data-flame="88,30" />
        <Reveal className="wrap st-in">
          <div className="st-txt">
            <span className="st-no rv-i" aria-hidden="true">01</span>
            <h2 id="st1"><MaskLines lines={["Strike", "the match."]} /></h2>
            <p className="rv-i" style={{ ["--i" as any]: 3 }}>A candle begins with a small ritual: the match, the pause, the first steady flame. Before the fragrance arrives, the room has already slowed down.</p>
          </div>
          <div className="st-art st-art-1 rv-i" style={{ ["--i" as any]: 2 }} aria-hidden="true">
            <div className="arch"><div className="arch-in" /></div>
            <div className="st-layer l-blos" data-speed="-0.12"><Image src="/brand/blossoms.webp" alt="" width={487} height={515} sizes="(max-width:760px) 70vw, 34vw" /></div>
            <div className="st-layer l-petal p1" data-speed="0.2" data-rot="40"><Petal s={26} r={20} /></div>
            <div className="st-layer l-petal p2" data-speed="0.32" data-rot="-60"><Petal s={18} r={-30} /></div>
          </div>
        </Reveal>
      </section>

      {/* 02 (dark) */}
      <section className="st st-2" aria-labelledby="st2" data-header="dark">
        <Reveal className="wrap st-in rev">
          <div className="st-art st-art-2 rv-i" aria-hidden="true">
            <div className="arch"><div className="arch-in" /></div>
            <div className="st-halo" />
            <div className="st-layer l-candle" data-speed="-0.06"><Image src="/brand/candle.webp" alt="" width={687} height={421} sizes="(max-width:760px) 96vw, 44vw" /></div>
            <span className="fstop fs-candle" data-flame="38,50" />
          </div>
          <div className="st-txt">
            <span className="st-no rv-i" aria-hidden="true">02</span>
            <h2 id="st2"><MaskLines lines={["Let the", "room fill."]} /></h2>
            <p className="rv-i" style={{ ["--i" as any]: 3 }}>Fragrance changes a space before anyone says a word. Florals soften an afternoon, something woody settles the evening, and something sweet makes an ordinary table feel like a celebration.</p>
          </div>
        </Reveal>
      </section>

      {/* 03 */}
      <section className="st st-3" aria-labelledby="st3">
        <span className="fstop" data-flame="90,28" />
        <Reveal className="wrap st-in">
          <div className="st-txt">
            <span className="st-no rv-i" aria-hidden="true">03</span>
            <h2 id="st3"><MaskLines lines={["Leave it", "glowing."]} /></h2>
            <p className="rv-i" style={{ ["--i" as any]: 3 }}>The best part comes after: a warm light on the shelf, a note on a gift tag, a fragrance someone will remember was from you.</p>
          </div>
          <div className="st-art st-art-3 rv-i" style={{ ["--i" as any]: 2 }} aria-hidden="true">
            <div className="arch"><div className="arch-in" /></div>
            <div className="st-layer l-bow" data-speed="-0.1" data-rot="-8"><Image src="/brand/bow.webp" alt="" width={620} height={680} sizes="(max-width:760px) 70vw, 30vw" /></div>
            <div className="st-layer l-petal p3" data-speed="0.25" data-rot="50"><Petal s={24} r={10} /></div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
