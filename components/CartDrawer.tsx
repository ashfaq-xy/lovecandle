"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { findProduct, money, displayName, type Product } from "@/lib/products";
import { wa } from "@/data/config";
import { IconClose, IconMinus, IconPlus } from "./Icons";
import ProductArt from "./ProductArt";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";

export default function CartDrawer() {
  const { open, setOpen, items, change, remove, count } = useCart();
  const ref = useRef<HTMLElement>(null);
  const rows = items.map(i => ({ ...i, p: findProduct(i.id) })).filter((r): r is typeof r & { p: Product } => !!r.p);
  const priced = rows.filter(r => r.p.price != null);
  const unpriced = rows.length - priced.length;
  const subtotal = priced.reduce((a, r) => a + (r.p.price as number) * r.q, 0);

  useScrollLock(open);
  useFocusTrap(ref, open, () => ref.current?.querySelector<HTMLElement>(".drawer-x") ?? null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, [open, setOpen]);

  const lines = rows.map(r => `• ${displayName(r.p)} (${r.p.id}) × ${r.q}${r.p.price != null ? " – " + money(r.p.price * r.q) : ""}`);
  const msg = `Hi LOVE CANDLE! I'd like to order:\n${lines.join("\n")}${priced.length ? `\nSubtotal: ${money(subtotal)}${unpriced ? " (+ items with prices to confirm)" : ""}` : ""}\n\nPlease confirm availability and total.`;

  return (
    <div className={"drawer-root" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="drawer-back" onClick={() => setOpen(false)} />
      <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title" inert={!open ? ("" as any) : undefined}>
        <header className="drawer-h">
          <h2 id="bag-title">Your bag{count ? <span> ({count})</span> : null}</h2>
          <button type="button" className="drawer-x icon-btn" onClick={() => setOpen(false)} aria-label="Close bag"><IconClose /></button>
        </header>

        {rows.length === 0 ? (
          <div className="drawer-empty">
            <p className="drawer-empty-t">Your bag is empty.</p>
            <p>When a candle catches your eye, it will wait for you here.</p>
            <Link href="/shop" className="btn btn-primary" onClick={() => setOpen(false)}>Explore the archive</Link>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {rows.map(({ p, q }) => (
                <li key={p.id} className="dl">
                  <Link href={`/shop/${p.id}`} className="dl-img" onClick={() => setOpen(false)} aria-label={`View ${displayName(p)}`}><ProductArt p={p} sizes="88px" /></Link>
                  <div className="dl-b">
                    <Link href={`/shop/${p.id}`} className="dl-n" onClick={() => setOpen(false)}>{displayName(p)}</Link>
                    <p className="dl-c">{p.category}</p>
                    <p className="dl-p">{p.price != null ? money(p.price * q) : "Price to be confirmed"}</p>
                    <div className="dl-ctl">
                      <div className="qty qty-s" role="group" aria-label={`Quantity of ${displayName(p)}`}>
                        <button type="button" onClick={() => change(p.id, -1)} aria-label={q === 1 ? `Remove ${displayName(p)}` : "Decrease quantity"}><IconMinus /></button>
                        <output aria-live="polite">{q}</output>
                        <button type="button" onClick={() => change(p.id, 1)} aria-label="Increase quantity"><IconPlus /></button>
                      </div>
                      <button type="button" className="link-btn" onClick={() => remove(p.id)} aria-label={`Remove ${displayName(p)} from bag`}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer-f">
              <div className="drawer-sub"><span>Subtotal</span><strong>{priced.length ? money(subtotal) : "To be confirmed"}</strong></div>
              {unpriced > 0 && priced.length > 0 && <p className="drawer-hint">{unpriced} item{unpriced > 1 ? "s" : ""} will be priced when you order.</p>}
              <a className="btn btn-primary btn-block" href={wa(msg)} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
              <p className="drawer-note">No payment is taken on this website. We’ll confirm availability, the total and delivery with you on WhatsApp.</p>
              <button type="button" className="link-btn drawer-cont" onClick={() => setOpen(false)}>Continue browsing</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
