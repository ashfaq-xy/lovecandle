"use client";
import { useCart } from "@/lib/cart";
import { inStock, displayName, type Product } from "@/lib/products";

export default function QuickAdd({ p }: { p: Product }) {
  const { add } = useCart();
  const out = !inStock(p);
  return <button type="button" className="btn btn-sm pc-add" disabled={out} onClick={() => add(p.id, 1)} aria-label={out ? `${displayName(p)} is out of stock` : `Add ${displayName(p)} to bag`}>{out ? "Out of stock" : "Add to bag"}</button>;
}
