"use client";
import { useState } from "react";
import { useCart, MAX_QTY } from "@/lib/cart";
import { IconMinus, IconPlus } from "./Icons";
import WishlistButton from "./WishlistButton";
import { inStock, displayName, type Product } from "@/lib/products";

export default function AddToBag({ p, wishlist = true }: { p: Product; wishlist?: boolean }) {
  const { add, qtyOf } = useCart();
  const [q, setQ] = useState(1);
  const out = !inStock(p);
  const inBag = qtyOf(p.id);
  return (
    <div className="atb">
      <div className="atb-row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQ(v => Math.max(1, v - 1))} disabled={out || q <= 1} aria-label="Decrease quantity"><IconMinus /></button>
          <output aria-live="polite" aria-label={`Quantity ${q}`}>{q}</output>
          <button type="button" onClick={() => setQ(v => Math.min(MAX_QTY, v + 1))} disabled={out || q >= MAX_QTY} aria-label="Increase quantity"><IconPlus /></button>
        </div>
        <button type="button" className="btn btn-primary atb-add" disabled={out} onClick={() => { if (add(p.id, q)) setQ(1); }}>
          {out ? "Out of stock" : "Add to bag"}
        </button>
        {wishlist && <WishlistButton id={p.id} name={displayName(p)} className="atb-wl" />}
      </div>
      {inBag > 0 && <p className="atb-in">{inBag} in your bag</p>}
    </div>
  );
}
