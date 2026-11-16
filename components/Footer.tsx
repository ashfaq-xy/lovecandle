import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/config";
import { families } from "@/data/families";

export default function Footer() {
  return (
    <footer className="ftr" data-header="dark">
      <div className="wrap ftr-in">
        <div className="ftr-brand">
          <Image src="/brand/wordmark.webp" alt="LOVE CANDLE — light of love" width={640} height={259} sizes="240px" className="ftr-logo" />
          <p>Scented candles and thoughtful gifting. Light of love.</p>
        </div>
        <nav aria-label="Explore" className="ftr-col">
          <h2>Explore</h2>
          <ul>
            <li><Link href="/shop">The Scent Archive</Link></li>
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/gifting">Gifting</Link></li>
            <li><Link href="/our-story">Our Story</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
          </ul>
        </nav>
        <nav aria-label="Scent families" className="ftr-col">
          <h2>Scent families</h2>
          <ul>{families.map(f => <li key={f.slug}><Link href={`/shop?cat=${encodeURIComponent(f.name)}`}>{f.name}</Link></li>)}</ul>
        </nav>
        <div className="ftr-col">
          <h2>Get in touch</h2>
          <ul>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href={`mailto:${site.email}`}>Email</a></li>
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr-base">
        <span>© {new Date().getFullYear()} LOVE CANDLE</span>
        <span>Orders are confirmed on WhatsApp. No payment is taken on this website.</span>
      </div>
    </footer>
  );
}
