"use client";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories, findProduct, searchText, type Product } from "@/lib/products";
import { Grid } from "./ProductCard";
import ScentArchive, { type ArchiveHandle } from "./archive/ScentArchive";
import MobileTrack from "./archive/MobileTrack";
import DetailSheet from "./archive/DetailSheet";
import { IconArc, IconGrid, IconSearch } from "./Icons";
import { useMedia } from "@/lib/hooks";
import "@/styles/archive.css";

type View = "archive" | "grid";
const SORTS = [["new", "Newest"], ["best", "Bestsellers first"], ["lo", "Price: low to high"], ["hi", "Price: high to low"]] as const;
const validCat = (c: string | null) => (c && categories.includes(c) ? c : "All");

function sortList(a: Product[], sort: string) {
  return [...a].sort((x, y) =>
    sort === "lo" ? (x.price ?? 1e12) - (y.price ?? 1e12)
    : sort === "hi" ? (y.price ?? -1) - (x.price ?? -1)
    : sort === "best" ? Number(y.bestseller) - Number(x.bestseller) || y.added - x.added
    : y.added - x.added);
}

export default function ShopClient() {
  const sp = useSearchParams();
  const phone = useMedia("(max-width: 767px)", false);
  const [mounted, setMounted] = useState(false);
  const deepId = useRef<string | null>(sp.get("v"));
  const [cat, setCat] = useState(() => validCat(sp.get("cat")));
  const [q, setQ] = useState(sp.get("q") || "");
  const [sort, setSort] = useState("new");
  const [view, setView] = useState<View>(sp.get("view") === "grid" && !sp.get("v") ? "grid" : "archive");
  const dq = useDeferredValue(q);

  const list = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return sortList(products.filter(p => (cat === "All" || p.category === cat) && (!needle || searchText(p).includes(needle))), sort);
  }, [cat, dq, sort]);
  const counts = useMemo(() => Object.fromEntries(categories.map(c => [c, products.filter(p => p.category === c).length])), []);

  /* ---------- URL <-> state: filters are shareable; the sheet gets its own history entry ---------- */
  const written = useRef<string | null>(null);
  useEffect(() => {
    const cur = sp.toString();
    if (cur === written.current) return;
    setCat(validCat(sp.get("cat")));
    setQ(sp.get("q") || "");
    if (!sp.get("v")) setView(sp.get("view") === "grid" ? "grid" : "archive");
  }, [sp]);
  useEffect(() => {
    if (!mounted) return;
    const u = new URL(window.location.href);
    const set = (k: string, v: string, def: string) => (v && v !== def ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set("cat", cat, "All"); set("q", q.trim(), ""); set("view", view, "archive");
    const next = u.pathname + u.search;
    if (next !== window.location.pathname + window.location.search) { written.current = u.searchParams.toString(); window.history.replaceState(window.history.state, "", next); }
  }, [cat, q, view, mounted]);

  /* ---------- detail sheet ---------- */
  const arc = useRef<ArchiveHandle>(null);
  const [sheet, setSheet] = useState<{ p: Product; rect: DOMRect | null } | null>(null);
  const [closing, setClosing] = useState(false);
  const pushed = useRef(false);
  const sheetRef = useRef(sheet); sheetRef.current = sheet;
  const closingRef = useRef(closing); closingRef.current = closing;

  const openSheet = useCallback((p: Product, rect: DOMRect | null) => {
    if (sheetRef.current) return;
    setClosing(false); setSheet({ p, rect });
    const u = new URL(window.location.href); u.searchParams.set("v", p.id);
    written.current = u.searchParams.toString();
    window.history.pushState(null, "", u.pathname + u.search);
    pushed.current = true;
  }, []);
  const requestClose = useCallback(() => {
    if (!sheetRef.current || closingRef.current) return;
    if (pushed.current) { pushed.current = false; window.history.back(); } // popstate then plays the closing animation
    else {
      const u = new URL(window.location.href); u.searchParams.delete("v");
      written.current = u.searchParams.toString();
      window.history.replaceState(window.history.state, "", u.pathname + u.search);
      setClosing(true);
    }
  }, []);
  useEffect(() => {
    const onPop = () => {
      const u = new URL(window.location.href);
      const v = u.searchParams.get("v");
      written.current = u.searchParams.toString();
      if (!v) { if (sheetRef.current && !closingRef.current) setClosing(true); return; }
      const p = findProduct(v);
      if (p && !sheetRef.current) {
        setView("archive");
        requestAnimationFrame(() => { arc.current?.focus(p.id); setClosing(false); setSheet({ p, rect: arc.current?.coverRect(p.id) ?? null }); pushed.current = true; });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => setMounted(true), []);
  // Opening straight from a /shop?v=ID link (refresh, shared URL)
  useEffect(() => {
    const id = deepId.current;
    if (!mounted || !id) return;
    const p = findProduct(id);
    if (!p) { deepId.current = null; return; }
    if (!list.some(x => x.id === id)) { setCat("All"); setQ(""); return; } // list changes, effect runs again
    const t = setTimeout(() => {
      deepId.current = null;
      arc.current?.focus(id);
      setSheet({ p, rect: arc.current?.coverRect(id) ?? null });
      pushed.current = false;
    }, 90);
    return () => clearTimeout(t);
  }, [mounted, list]);

  const clear = () => { setCat("All"); setQ(""); };
  const key = `${cat}|${dq}|${sort}|${phone}`;

  return (
    <div className="shop">
      <div className="shop-top">
        <h1>The Scent Archive</h1>
        <div className="shop-tools">
          <div className="shop-search">
            <IconSearch width={18} height={18} />
            <label htmlFor="shop-q" className="sr-only">Search candles</label>
            <input id="shop-q" type="search" placeholder="Search candles" value={q} onChange={e => setQ(e.target.value)} autoComplete="off" />
          </div>
          <label htmlFor="shop-sort" className="sr-only">Sort candles</label>
          <select id="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === "archive"} onClick={() => setView("archive")}><IconArc /><span>Archive</span></button>
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}><IconGrid /><span>Grid</span></button>
          </div>
        </div>
      </div>
      <div className="shop-bar">
        <div className="shop-chips" role="group" aria-label="Scent family">
          {["All", ...categories].map(c => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}{c !== "All" && <sup>{counts[c]}</sup>}
            </button>
          ))}
        </div>
        <p className="shop-count" role="status" aria-live="polite">{list.length === 0 ? "No candles found" : `${list.length} candle${list.length === 1 ? "" : "s"}${cat !== "All" ? ` in ${cat}` : ""}${dq.trim() ? ` matching “${dq.trim()}”` : ""}`}</p>
      </div>

      {!mounted ? <div className="arc-skel" aria-hidden="true" />
        : list.length === 0 ? (
          <div className="shop-empty">
            <p className="shop-empty-t">Nothing matches that search.</p>
            <p>Try a different word, or browse a scent family instead.</p>
            <button type="button" className="btn btn-primary" onClick={clear}>Clear filters</button>
          </div>
        )
        : view === "grid" ? <div className="wrap shop-grid"><Grid list={list} /></div>
        : phone ? <MobileTrack key={key} ref={arc} list={list} onOpen={openSheet} />
        : <ScentArchive key={key} ref={arc} list={list} sheetOpen={!!sheet} onOpen={openSheet} />}

      {sheet && <DetailSheet p={sheet.p} rect={sheet.rect} closing={closing} getRect={() => arc.current?.coverRect(sheet.p.id) ?? null} onRequestClose={requestClose} onDone={() => { setSheet(null); setClosing(false); }} />}
    </div>
  );
}
