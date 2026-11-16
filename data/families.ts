// The six scent families. Names MUST match the `category` values used in data/products.json.
// tint / deep drive the colours of the archive spines, tiles and placeholder art.
// `tagline` describes the mood of the family (not any specific product).
export type Glyph = "flower" | "swirl" | "drop" | "rings" | "heart" | "moon";
export type Family = {
  name: string;
  slug: string;
  tagline: string;
  tint: string;
  deep: string;
  glyph: Glyph;
};

export const families: Family[] = [
  { name: "Floral", slug: "floral", tagline: "Soft petals and slow garden afternoons.", tint: "#F2CFD8", deep: "#A8456A", glyph: "flower" },
  { name: "Sweet & Gourmand", slug: "sweet-gourmand", tagline: "The comfort of something warm on the table.", tint: "#EBCFA7", deep: "#8A5A2B", glyph: "swirl" },
  { name: "Fresh & Clean", slug: "fresh-clean", tagline: "Light, airy and quietly bright.", tint: "#D3E3D8", deep: "#456B59", glyph: "drop" },
  { name: "Woody & Warm", slug: "woody-warm", tagline: "Deep, grounding and unhurried.", tint: "#D9BFA3", deep: "#664230", glyph: "rings" },
  { name: "Romantic", slug: "romantic", tagline: "For candlelit evenings and handwritten notes.", tint: "#EFB7C5", deep: "#9A2F55", glyph: "heart" },
  { name: "Relaxing", slug: "relaxing", tagline: "For the hour when the day finally slows down.", tint: "#D9D2EA", deep: "#5A4E85", glyph: "moon" },
];
