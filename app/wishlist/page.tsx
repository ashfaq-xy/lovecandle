import WishlistView from "@/components/WishlistView";
import "@/styles/product.css";
export const metadata = { title: "Your wishlist", description: "Candles you’ve saved to come back to.", robots: { index: false } };
export default function Wishlist() {
  return (
    <div className="wrap fade">
      <div className="pg-head"><p className="eyebrow">Saved for later</p><h1>Your wishlist</h1><p className="lede">Saved on this device, so they’ll be here when you return.</p></div>
      <WishlistView />
    </div>
  );
}
