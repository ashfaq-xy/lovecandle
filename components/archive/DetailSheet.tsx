"use client";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AddToBag from "../AddToBag";
import CandleArt from "../CandleArt";
import NotesLadder from "../NotesLadder";
import { IconPrev } from "../Icons";
import { blurb, discountPct, displayName, familyLabel, familyOf, hasDiscount, inStock, isPlaceholder, longText, money, specs, type Product } from "@/lib/products";
import { useFocusTrap, useReducedMotion, useScrollLock } from "@/lib/hooks";
import { showPlaceholders } from "@/data/content";

const EASE = "cubic-bezier(.76,0,.18,1)";
const clipFrom = (r: DOMRect | null) => {
  if (!r) return "inset(50% 50% 50% 50% round 6px)";
  const t = Math.max(0, r.top), l = Math.max(0, r.left);
  const b = Math.max(0, window.innerHeight - r.bottom), rt = Math.max(0, window.innerWidth - r.right);
  return `inset(${t}px ${rt}px ${b}px ${l}px round 6px)`;
};
const CIRCLES = [
  { cx: 240, cy: 420, R: 650, d: 0 }, { cx: 90, cy: 190, R: 520, d: 120 }, { cx: 390, cy: 250, R: 520, d: 200 },
  { cx: 110, cy: 650, R: 520, d: 260 }, { cx: 400, cy: 680, R: 520, d: 330 },
];

function Poster({ p, play, reduce }: { p: Product; play: boolean; reduce: boolean }) {
  const f = familyOf(p);
  const g = useRef<SVGGElement>(null);
  const [done, setDone] = useState(reduce);
  const src = p.images?.[0];
  const imgUrl = src ? (src.startsWith("http") ? src : `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=78`) : "";
  useEffect(() => {
    if (!play || done) return;
    const fine = !window.matchMedia("(pointer: coarse)").matches;
    if (!fine) g.current?.removeAttribute("filter");
    const circles = Array.from(g.current?.querySelectorAll("circle") ?? []);
    const start = performance.now() + 520;
    let raf = 0;
    const loop = (t: number) => {
      const k = t - start;
      let all = true;
      circles.forEach((c, i) => {
        const e = Math.min(1, Math.max(0, (k - CIRCLES[i].d) / 1100));
        const ease = 1 - Math.pow(1 - e, 3);
        c.setAttribute("r", String(ease * CIRCLES[i].R));
        if (e < 1) all = false;
      });
      if (all) setDone(true); else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [play, done]);
  return (
    <svg className="sh-poster" viewBox="0 0 480 760" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${displayName(p)} — ${familyLabel(p)} candle`}>
      <defs>
        <filter id="ink-f" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".011 .015" numOctaves="3" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="140" /></filter>
        <mask id="ink-m" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="760">
          <g ref={g} filter="url(#ink-f)" fill="#fff">{CIRCLES.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={reduce ? c.R : 0} />)}</g>
        </mask>
        <linearGradient id="arch-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".55" stopColor={f.tint} /><stop offset="1" stopColor={f.tint} stopOpacity=".78" /></linearGradient>
      </defs>
      <g mask={done ? undefined : "url(#ink-m)"}>
        <path d="M44 716V270a196 196 0 0 1 392 0v446Z" fill="url(#arch-g)" />
        <path d="M60 716V272a180 180 0 0 1 360 0v444Z" fill="none" stroke={f.deep} strokeOpacity=".22" />
        {imgUrl ? <image href={imgUrl} x="70" y="170" width="340" height="500" preserveAspectRatio="xMidYMid meet" />
          : <CandleArt family={f} x="76" y="190" width="328" height="426" />}
        <ellipse cx="240" cy="718" rx="150" ry="9" fill="#2a1a16" opacity=".12" />
      </g>
    </svg>
  );
}

export type SheetProps = {
  p: Product; rect: DOMRect | null; closing: boolean;
  getRect: () => DOMRect | null; onRequestClose: () => void; onDone: () => void;
};
export default function DetailSheet({ p, rect, closing, getRect, onRequestClose, onDone }: SheetProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [from] = useState(() => clipFrom(rect));
  const [poster, setPoster] = useState(false);
  const fam = familyOf(p);
  const nSpecs = specs(p);
  const txt = longText(p) || blurb(p);

  useScrollLock(true);
  useFocusTrap(ref, !closing, () => ref.current?.querySelector<HTMLElement>(".sheet-back") ?? null);

  // open: the sheet unfolds from the candle itself
  useLayoutEffect(() => {
    const el = ref.current!;
    const dur = reduce ? 1 : 1050;
    const a = el.animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }], { duration: dur, easing: EASE, fill: "both" });
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".rv"));
    lines.forEach((l, i) => l.animate([{ transform: "translateY(112%)" }, { transform: "none" }], { duration: reduce ? 1 : 900, delay: reduce ? 0 : 560 + i * 55, easing: "cubic-bezier(.22,.8,.2,1)", fill: "both" }));
    const t = setTimeout(() => setPoster(true), 0);
    a.finished.then(() => { a.cancel(); el.style.clipPath = "none"; }).catch(() => {});
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close: fold back into the candle
  useEffect(() => {
    if (!closing) return;
    const el = ref.current!;
    el.style.clipPath = "inset(0px 0px 0px 0px round 0px)";
    const to = clipFrom(getRect());
    const a = el.animate([{ clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: to }], { duration: reduce ? 1 : 760, easing: EASE, fill: "both" });
    el.querySelectorAll<HTMLElement>(".sheet-scroll").forEach(s => s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? 1 : 300, fill: "both" }));
    a.finished.then(onDone).catch(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !closing) { e.stopPropagation(); onRequestClose(); } };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [closing, onRequestClose]);

  return createPortal(
    <div ref={ref} className="sheet" role="dialog" aria-modal="true" aria-label={displayName(p)} style={{ clipPath: from, ["--t" as any]: fam.tint, ["--dp" as any]: fam.deep }}>
      <div className="sheet-scroll">
        <button type="button" className="sheet-back" onClick={onRequestClose}><IconPrev width={18} height={18} /><span>Back to the archive</span></button>
        <div className="sheet-grid">
          <div className="sheet-text">
            <div className="mk"><p className="rv sh-fam"><span style={{ color: fam.deep }}>{familyLabel(p)}</span>{isPlaceholder(p) && <em className="cap-tag">Sample entry</em>}</p></div>
            <h2 className="sh-title mk"><span className="rv">{displayName(p)}</span></h2>
            <div className="mk"><p className="rv sh-price">
              <strong className={p.price == null ? "muted" : ""}>{money(p.price)}</strong>
              {hasDiscount(p) && <><s>{money(p.originalPrice)}</s><em className="badge">{discountPct(p)}% off</em></>}
              <em className={"stock " + (inStock(p) ? "in" : "out")}>{inStock(p) ? "In stock" : "Out of stock"}</em>
            </p></div>
            <div className="mk"><p className="rv sh-desc">{txt}</p></div>
            <div className="mk rv-block"><div className="rv"><NotesLadder p={p} tone={fam.deep} /></div></div>
            {nSpecs.length > 0 && (
              <div className="mk rv-block"><dl className="rv specs">{nSpecs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
            )}
            <div className="mk rv-block"><div className="rv"><AddToBag p={p} /></div></div>
            <div className="mk"><p className="rv sh-more"><Link href={`/shop/${p.id}`}>Open the full page</Link></p></div>
            {isPlaceholder(p) && showPlaceholders && <div className="mk rv-block"><p className="rv note sh-note">This is a sample entry. Add the real name, photograph, price and scent details in <code>data/products.json</code>.</p></div>}
          </div>
          <div className="sheet-art"><Poster p={p} play={poster} reduce={reduce} /></div>
        </div>
      </div>
    </div>,
    document.body
  );
}
