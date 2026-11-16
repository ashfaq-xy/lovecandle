"use client";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { findProduct, type Product } from "@/lib/products";
import { Grid } from "./ProductCard";
import CandleArt from "./CandleArt";

export default function WishlistView() {
  const { ids } = useWishlist();
  const list = ids.map(findProduct).filter((p): p is Product => !!p);
  if (!list.length) return (
    <div className="wl-empty">
      <div className="pa"><CandleArt /></div>
      <p className="shop-empty-t">Nothing saved yet.</p>
      <p>Tap the heart on any candle to keep it here for later.</p>
      <Link href="/shop" className="btn btn-primary">Explore the archive</Link>
    </div>
  );
  return <Grid list={list} />;
}
