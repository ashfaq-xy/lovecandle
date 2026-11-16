import raw from "@/data/products.json";
import { families, type Family } from "@/data/families";

export type Product = {
  id: string;
  name: string;
  images: string[];
  price: number | null;
  originalPrice: number | null;
  short: string;
  detail: string;
  category: string;
  stock: string; // "in" | "out"
  bestseller: boolean;
  featured: boolean;
  isNew: boolean;
  added: number; // higher = newer
  // Optional. Shown only when filled in.
  notes?: string; // legacy single-line notes
  scentFamily?: string; // e.g. "Rose & peony"; falls back to category
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  wax?: string;
  size?: string;
  burn?: string;
};

export const products = raw as unknown as Product[];
export const categories = families.map(f => f.name);

export const money = (p: number | null) =>
  p == null ? "Price coming soon" : "₹" + (Number.isInteger(p) ? p.toLocaleString("en-IN") : p.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export const familyOf = (p: Product): Family => families.find(f => f.name === p.category) ?? families[0];
export const isPlaceholder = (p: Product) => /placeholder/i.test(p.name) || /to be added/i.test(p.short || "");
export const displayName = (p: Product) => p.name.replace(/\s*\(placeholder\)\s*$/i, "").trim();
export const inStock = (p: Product) => p.stock !== "out";
export const familyLabel = (p: Product) => (p.scentFamily && p.scentFamily.trim()) || p.category;
export const hasPrice = (p: Product) => p.price != null;
export const hasDiscount = (p: Product) => p.price != null && p.originalPrice != null && p.originalPrice > p.price;
export const discountPct = (p: Product) => (hasDiscount(p) ? Math.round((1 - p.price! / p.originalPrice!) * 100) : 0);

/** Short line for captions: the real description if supplied, otherwise the family mood. */
export const blurb = (p: Product) => (p.short && !/to be added/i.test(p.short) ? p.short : familyOf(p).tagline);
export const longText = (p: Product) => (p.detail && !/to be added/i.test(p.detail) ? p.detail : "");

export type NoteGroup = { label: string; hint: string; items: string[] };
export function noteGroups(p: Product): NoteGroup[] {
  const g: NoteGroup[] = [
    { label: "Top", hint: "The first impression", items: (p.topNotes ?? []).filter(Boolean) },
    { label: "Heart", hint: "The middle of the fragrance", items: (p.heartNotes ?? []).filter(Boolean) },
    { label: "Base", hint: "What lingers", items: (p.baseNotes ?? []).filter(Boolean) },
  ].filter(x => x.items.length);
  if (!g.length && p.notes && p.notes.trim()) return [{ label: "Notes", hint: "", items: [p.notes.trim()] }];
  return g;
}
export const specs = (p: Product): [string, string][] =>
  ([["Wax", p.wax], ["Size", p.size], ["Burn time", p.burn]] as [string, string | undefined][]).filter((x): x is [string, string] => !!(x[1] && x[1].trim()));

export const findProduct = (id: string) => products.find(p => p.id === id);
export function related(p: Product, n = 4): Product[] {
  const same = products.filter(x => x.id !== p.id && x.category === p.category);
  const rest = products.filter(x => x.id !== p.id && x.category !== p.category);
  return [...same, ...rest].slice(0, n);
}
export const searchText = (p: Product) =>
  [p.name, p.category, p.scentFamily, p.short, p.notes, ...(p.topNotes ?? []), ...(p.heartNotes ?? []), ...(p.baseNotes ?? [])].filter(Boolean).join(" ").toLowerCase();
