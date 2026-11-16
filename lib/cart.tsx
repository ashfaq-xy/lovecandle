"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { findProduct, inStock, displayName } from "@/lib/products";

type Item = { id: string; q: number };
type Toast = { key: number; text: string; kind: "ok" | "error"; bag?: boolean };
type CartCtx = {
  items: Item[];
  count: number;
  bump: number; // increments on every successful add (drives the bag-count animation)
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => boolean;
  change: (id: string, d: number) => void;
  remove: (id: string) => void;
  qtyOf: (id: string) => number;
  toast: Toast | null;
  notify: (text: string, kind?: "ok" | "error", bag?: boolean) => void;
  dismissToast: () => void;
};
const Ctx = createContext<CartCtx | null>(null);
export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
};
export const MAX_QTY = 20;
const KEY = "lc-cart"; // unchanged: existing visitors keep their bag

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const tk = useRef(0);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) setItems(raw.filter((i: any) => i && typeof i.id === "string" && Number.isInteger(i.q) && i.q > 0 && findProduct(i.id)).map((i: any) => ({ id: i.id, q: Math.min(i.q, MAX_QTY) })));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items, ready]);
  // keep the bag in sync across tabs
  useEffect(() => {
    const f = (e: StorageEvent) => { if (e.key === KEY && e.newValue) try { setItems(JSON.parse(e.newValue)); } catch {} };
    window.addEventListener("storage", f); return () => window.removeEventListener("storage", f);
  }, []);

  const dismissToast = useCallback(() => { clearTimeout(timer.current); setToast(null); }, []);
  const notify = useCallback((text: string, kind: "ok" | "error" = "ok", bag = false) => {
    clearTimeout(timer.current);
    setToast({ key: ++tk.current, text, kind, bag });
    timer.current = setTimeout(() => setToast(null), kind === "error" ? 5000 : 3600);
  }, []);

  const add = useCallback((id: string, qty = 1) => {
    const p = findProduct(id);
    if (!p) { notify("Couldn’t add to bag. Please try again.", "error"); return false; }
    if (!inStock(p)) { notify(`${displayName(p)} is currently out of stock.`, "error"); return false; }
    let capped = false;
    setItems(prev => {
      const cur = prev.find(i => i.id === id);
      const next = Math.min(MAX_QTY, (cur?.q ?? 0) + qty);
      capped = (cur?.q ?? 0) + qty > MAX_QTY;
      return cur ? prev.map(i => (i.id === id ? { ...i, q: next } : i)) : [...prev, { id, q: next }];
    });
    setBump(b => b + 1);
    notify(capped ? `Maximum ${MAX_QTY} per candle. Bag updated.` : `${displayName(p)} added to your bag.`, "ok", true);
    return true;
  }, [notify]);
  const change = useCallback((id: string, d: number) => setItems(p => p.map(i => (i.id === id ? { ...i, q: Math.min(MAX_QTY, i.q + d) } : i)).filter(i => i.q > 0)), []);
  const remove = useCallback((id: string) => setItems(p => p.filter(i => i.id !== id)), []);
  const count = useMemo(() => items.reduce((a, i) => a + i.q, 0), [items]);
  const qtyOf = useCallback((id: string) => items.find(i => i.id === id)?.q ?? 0, [items]);

  const value = useMemo(() => ({ items, count, bump, open, setOpen, add, change, remove, qtyOf, toast, notify, dismissToast }), [items, count, bump, open, add, change, remove, qtyOf, toast, notify, dismissToast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
