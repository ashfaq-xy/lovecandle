"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import ProductArt from "../ProductArt";
import WishlistButton from "../WishlistButton";
import { discountPct, displayName, familyLabel, familyOf, hasDiscount, inStock, isPlaceholder, money, blurb, type Product } from "@/lib/products";
import type { ArchiveHandle } from "./ScentArchive";
import "@/styles/archive.css";

/** Phone layout of the archive: a native, finger-friendly horizontal track with snap points. */
const MobileTrack = forwardRef<ArchiveHandle, { list: Product[]; onOpen: (p: Product, rect: DOMRect) => void }>(function MobileTrack({ list, onOpen }, ref) {
  const trk = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  const measure = useCallback(() => {
    raf.current = 0;
    const el = trk.current; if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bd = 1e9;
    cards.current.forEach((c, i) => { if (!c) return; const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    setActive(best);
  }, []);
  const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(measure); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useImperativeHandle(ref, () => ({
    focus: (id: string) => {
      const i = list.findIndex(p => p.id === id);
      const c = cards.current[i], el = trk.current;
      if (c && el) { el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: "auto" }); setActive(i); }
    },
    coverRect: (id: string) => cards.current[list.findIndex(p => p.id === id)]?.querySelector(".mt-img")?.getBoundingClientRect() ?? null,
  }), [list]);

  const goTo = (i: number) => {
    const c = cards.current[i], el = trk.current;
    if (c && el) el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <section className="mt" aria-roledescription="carousel" aria-label={`Scent Archive, ${list.length} candles. Swipe sideways to browse.`}>
      <div className="mt-trk" ref={trk} onScroll={onScroll}>
        {list.map((p, i) => {
          const f = familyOf(p);
          return (
            <article key={p.id} ref={el => { cards.current[i] = el; }} className={"mt-card" + (i === active ? " on" : "")} style={{ ["--t" as any]: f.tint, ["--dp" as any]: f.deep }} aria-label={`${i + 1} of ${list.length}: ${displayName(p)}`}>
              <button type="button" className="mt-img" onClick={e => onOpen(p, (e.currentTarget as HTMLElement).getBoundingClientRect())} aria-label={`View details of ${displayName(p)}`}>
                <span className="mt-no">No. {String(i + 1).padStart(2, "0")}</span>
                <div className="mt-art"><ProductArt p={p} sizes="80vw" priority={i < 2} /></div>
                <span className="mt-fam">{familyLabel(p)}</span>
              </button>
              <WishlistButton id={p.id} name={displayName(p)} className="mt-wl" />
              <div className="mt-b">
                <h2>{displayName(p)}{isPlaceholder(p) && <em className="cap-tag">Sample entry</em>}</h2>
                <p className="mt-d">{blurb(p)}</p>
                <p className="mt-p"><strong className={p.price == null ? "muted" : ""}>{money(p.price)}</strong>{hasDiscount(p) && <><s>{money(p.originalPrice)}</s><em>{discountPct(p)}% off</em></>}{!inStock(p) && <em className="oos">Out of stock</em>}</p>
                <button type="button" className="btn btn-ink btn-sm" onClick={e => onOpen(p, (e.currentTarget.closest(".mt-card")!.querySelector(".mt-img") as HTMLElement).getBoundingClientRect())}>View details</button>
              </div>
            </article>
          );
        })}
      </div>
      {list.length > 1 && (
        <div className="mt-pg" role="group" aria-label="Choose a candle">
          <div className="mt-bar">{list.map((p, i) => <button key={p.id} type="button" className={i === active ? "on" : ""} onClick={() => goTo(i)} aria-label={`${displayName(p)}, ${i + 1} of ${list.length}`} aria-current={i === active ? "true" : undefined}><i /></button>)}</div>
          <span className="mt-ct" aria-hidden="true"><b>{String(active + 1).padStart(2, "0")}</b> / {String(list.length).padStart(2, "0")}</span>
        </div>
      )}
    </section>
  );
});
export default MobileTrack;
