import Image from "next/image";
import Reveal from "@/components/Reveal";
import Occasions from "@/components/Occasions";
import MaskLines from "@/components/home/MaskLines";
import Parallax from "@/components/home/Parallax";
import { GiftForm } from "@/components/Forms";
import { showPlaceholders } from "@/data/content";
import "@/styles/product.css";
import "@/styles/home.css";
export const metadata = { title: "Gifting", description: "Candle gifts for birthdays, anniversaries, weddings, housewarmings and festive moments. Tell us the occasion and we’ll help you choose." };
export default function Gifting() {
  return (
    <>
      <Parallax />
      <section className="gift gift-page">
        <Reveal className="wrap gift-in">
          <div className="gift-txt">
            <p className="eyebrow rv-i">Gifting</p>
            <h1><MaskLines lines={["Gifts", "that glow."]} /></h1>
            <p className="lede rv-i" style={{ ["--i" as any]: 2 }}>For birthdays, anniversaries, weddings, housewarmings and festive moments. Choose an occasion and we’ll reply on WhatsApp to help you pick the right scent.</p>
          </div>
          <div className="gift-art rv-i" style={{ ["--i" as any]: 2 }} aria-hidden="true">
            <div className="arch"><div className="arch-in" /></div>
            <div className="gift-bow" style={{ top: "6%", right: "-10%", width: "92%" }} data-speed="-0.08" data-rot="5"><Image src="/brand/bow.webp" alt="" width={620} height={680} priority sizes="(max-width:760px) 70vw, 30vw" /></div>
            <div className="gift-candle" style={{ top: "34%" }} data-speed="-0.04"><Image src="/brand/candle.webp" alt="" width={687} height={421} sizes="40vw" style={{ width: "128%", marginLeft: "-14%", height: "auto" }} /></div>
          </div>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: 20 }}>
        <Reveal><h2 className="rv-i" style={{ marginBottom: 22 }}>Start with the occasion</h2><Occasions /></Reveal>
      </section>
      <section className="wrap two" style={{ marginTop: 70, alignItems: "start" }}>
        <div>
          <h2>Planning a gift?</h2>
          <p className="lede" style={{ margin: "14px 0 22px" }}>Share a few details and WhatsApp opens with your enquiry ready to send. No payment is taken on this website.</p>
          {showPlaceholders && <p className="note gnote">Gift combinations, packaging details and personalisation options will be listed here once you confirm what you offer.</p>}
        </div>
        <GiftForm />
      </section>
    </>
  );
}
