import Image from "next/image";
import Link from "next/link";
import MaskLines from "./MaskLines";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-bow" aria-hidden="true"><div data-speed="-0.1"><Image src="/brand/bow.webp" alt="" width={620} height={680} priority sizes="(max-width:760px) 40vw, 24vw" /></div></div>
      <div className="hero-blos" aria-hidden="true"><div data-speed="0.07"><Image src="/brand/blossoms.webp" alt="" width={487} height={515} sizes="(max-width:760px) 34vw, 20vw" /></div></div>
      <div className="hero-candle" aria-hidden="true">
        <div data-speed="-0.035">
          <Image src="/brand/candle.webp" alt="" width={687} height={421} priority sizes="(max-width:760px) 96vw, 62vw" />
          <span className="hero-flame" data-flame-origin><i className="hf-core" />{[0, 1, 2, 3, 4, 5].map(k => <b key={k} className="mote" style={{ ["--k" as any]: k }} />)}</span>
        </div>
      </div>
      <div className="wrap hero-txt">
        <h1 id="hero-h"><MaskLines lines={["Light up", "your little", "moments."]} className="hero-h" /></h1>
        <p className="hero-sub">Scented candles for quiet evenings, small celebrations and the people you love to thank.</p>
        <div className="hero-cta">
          <Link href="/shop" className="btn btn-primary">Explore the Scent Archive</Link>
          <Link href="/gifting" className="btn">Gifting</Link>
        </div>
      </div>
    </section>
  );
}
