"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { site } from "@/data/config";
import { families } from "@/data/families";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch } from "./Icons";
import { useFocusTrap, useReducedMotion, useScrollLock } from "@/lib/hooks";

const links: [string, string][] = [["/", "Home"], ["/shop", "Shop"], ["/collections", "Collections"], ["/gifting", "Gifting"], ["/our-story", "Our Story"], ["/contact", "Contact"]];
const isOn = (path: string, h: string) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const { count, bump, setOpen } = useCart();
  const wl = useWishlist();
  const reduce = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const msgs = site.announcements;

  useEffect(() => {
    if (reduce || msgs.length < 2) return;
    const t = setInterval(() => setA(x => x + 1), 4200);
    return () => clearInterval(t);
  }, [reduce, msgs.length]);
  useEffect(() => { setMenu(false); setSearch(false); }, [path]);

  // Header changes appearance over sections marked data-header="dark"
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const els = document.querySelectorAll<HTMLElement>('[data-header="dark"]');
      let d = false;
      els.forEach(el => { const r = el.getBoundingClientRect(); if (r.top <= 40 && r.bottom >= 40) d = true; });
      setDark(d);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const t = setTimeout(run, 400); // after route content mounts
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearTimeout(t); if (raf) cancelAnimationFrame(raf); };
  }, [path]);

  useScrollLock(menu || search);
  useFocusTrap(menuRef, menu);
  useFocusTrap(searchRef, search, () => searchRef.current?.querySelector("input") ?? null);
  useEffect(() => {
    if (!menu && !search) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setSearch(false); } };
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, [menu, search]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    setSearch(false);
    router.push(t ? `/shop?q=${encodeURIComponent(t)}` : "/shop");
  };

  return (
    <>
      <div className="bar" role="region" aria-label="Announcements">
        <div className="bar-in"><span key={a % msgs.length} className="bar-msg">{msgs[a % msgs.length]}</span></div>
      </div>
      <header className={"hdr" + (scrolled ? " is-scrolled" : "") + (dark ? " is-dark" : "")}>
        <div className="hdr-in">
          <button type="button" className="icon-btn hdr-menu" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="mobile-menu"><IconMenu /></button>
          <nav className="hdr-nav" aria-label="Main">
            <ul>{links.map(([h, l]) => <li key={h}><Link href={h} aria-current={isOn(path, h) ? "page" : undefined} className={isOn(path, h) ? "on" : ""}>{l}</Link></li>)}</ul>
          </nav>
          <Link href="/" className="hdr-logo" aria-label="LOVE CANDLE — home">
            <Image src="/brand/wordmark.webp" alt="" width={640} height={259} priority sizes="190px" />
          </Link>
          <div className="hdr-tools">
            <button type="button" className="icon-btn" onClick={() => setSearch(true)} aria-label="Search candles"><IconSearch /></button>
            <Link href="/wishlist" className="icon-btn hdr-wl" aria-label={`Wishlist${wl.count ? `, ${wl.count} saved` : ""}`}>
              <IconHeart filled={wl.count > 0} />{wl.count > 0 && <span className="cnt">{wl.count}</span>}
            </Link>
            <button type="button" className="icon-btn hdr-bag" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
              <IconBag />{count > 0 && <span key={bump} className="cnt bump">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="mobile-menu" className={"mm" + (menu ? " open" : "")} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menu} inert={!menu ? ("" as any) : undefined}>
        <button type="button" className="icon-btn mm-x" onClick={() => setMenu(false)} aria-label="Close menu"><IconClose /></button>
        <ul>{links.map(([h, l], i) => <li key={h} style={{ ["--i" as any]: i }}><Link href={h} onClick={() => setMenu(false)} aria-current={isOn(path, h) ? "page" : undefined}>{l}</Link></li>)}</ul>
        <div className="mm-foot">
          <Link href="/wishlist" onClick={() => setMenu(false)}>Wishlist{wl.count > 0 ? ` (${wl.count})` : ""}</Link>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </div>

      <div ref={searchRef} className={"sr-ov" + (search ? " open" : "")} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!search} inert={!search ? ("" as any) : undefined}>
        <div className="sr-back" onClick={() => setSearch(false)} />
        <form className="sr-box" onSubmit={go} role="search">
          <label htmlFor="hdr-q" className="sr-only">Search candles</label>
          <input id="hdr-q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or scent family" autoComplete="off" />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="icon-btn" onClick={() => setSearch(false)} aria-label="Close search"><IconClose /></button>
          <div className="sr-chips">{families.map(f => <Link key={f.slug} href={`/shop?cat=${encodeURIComponent(f.name)}`} className="chip" onClick={() => setSearch(false)}>{f.name}</Link>)}</div>
        </form>
      </div>
    </>
  );
}
