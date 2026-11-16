"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { findProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";

type W = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; count: number };
const Ctx = createContext<W | null>(null);
export const useWishlist = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return c;
};
const KEY = "lc-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const { notify } = useCart();
  useEffect(() => {
    try { const r = JSON.parse(localStorage.getItem(KEY) || "[]"); if (Array.isArray(r)) setIds(r.filter((x: any) => typeof x === "string" && findProduct(x))); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {} }, [ids, ready]);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    const saved = ids.includes(id);
    setIds(p => (saved ? p.filter(x => x !== id) : [...p, id]));
    notify(saved ? "Removed from your wishlist." : "Saved to your wishlist.", "ok");
  }, [ids, notify]);
  const value = useMemo(() => ({ ids, has, toggle, count: ids.length }), [ids, has, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
