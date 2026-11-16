import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import CandleArt from "../CandleArt";
import MaskLines from "./MaskLines";
import Occasions from "../Occasions";
import { families } from "@/data/families";

export default function GiftingBand() {
  return (
    <section className="gift" aria-labelledby="gift-h">
      <span className="fstop" data-flame="50,14" />
      <Reveal className="wrap gift-in">
        <div className="gift-art rv-i" aria-hidden="true">
          <div className="arch"><div className="arch-in" /></div>
          <div className="gift-candle" data-speed="-0.05"><CandleArt family={families[4]} /></div>
          <div className="gift-bow" data-speed="-0.12" data-rot="6"><Image src="/brand/bow.webp" alt="" width={620} height={680} sizes="(max-width:760px) 60vw, 26vw" /></div>
        </div>
        <div className="gift-txt">
          <p className="eyebrow rv-i">Gifting</p>
          <h2 id="gift-h"><MaskLines lines={["A candle is a", "lovely way", "to say it."]} /></h2>
          <p className="lede rv-i" style={{ ["--i" as any]: 3 }}>Birthdays, anniversaries, weddings, new homes and festive evenings. Tell us the occasion and we’ll help you choose.</p>
          <Occasions />
          <div className="rv-i" style={{ ["--i" as any]: 6 }}><Link href="/gifting" className="btn btn-primary">Plan a gift</Link></div>
        </div>
      </Reveal>
    </section>
  );
}
