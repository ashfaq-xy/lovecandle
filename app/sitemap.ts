import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/collections", "/gifting", "/our-story", "/contact"].map(p => ({ url: base + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  return [...pages, ...products.map(p => ({ url: `${base}/shop/${p.id}`, changeFrequency: "weekly" as const, priority: 0.7 }))];
}
