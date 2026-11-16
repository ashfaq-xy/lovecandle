"use client";
import { useWishlist } from "@/lib/wishlist";
import { IconHeart } from "./Icons";

export default function WishlistButton({ id, name, className = "", label }: { id: string; name: string; className?: string; label?: boolean }) {
  const { has, toggle } = useWishlist();
  const on = has(id);
  return (
    <button type="button" className={"wl-btn " + className + (on ? " on" : "")} aria-pressed={on} aria-label={`${on ? "Remove" : "Save"} ${name} ${on ? "from" : "to"} wishlist`} onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id); }}>
      <IconHeart filled={on} width={20} height={20} />
      {label && <span>{on ? "Saved" : "Save"}</span>}
    </button>
  );
}
