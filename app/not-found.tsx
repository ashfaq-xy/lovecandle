import Link from "next/link";
import CandleArt from "@/components/CandleArt";
import "@/styles/product.css";
export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <div className="wrap wl-empty" style={{ padding: "80px 0" }}>
      <div className="pa"><CandleArt lit={false} /></div>
      <h1 style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>This candle has burned out.</h1>
      <p>The page you’re looking for isn’t here. Let’s find you something to light instead.</p>
      <Link href="/shop" className="btn btn-primary">Explore the archive</Link>
    </div>
  );
}
