# LOVE CANDLE: website

Next.js 14 · React 18 · TypeScript. No payment gateway: orders are confirmed on WhatsApp (unchanged).

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```
Optional: set `NEXT_PUBLIC_SITE_URL=https://your-domain` (used for the sitemap, robots and social-share URLs).

## What to edit (no code changes needed)

| I want to… | Edit |
|---|---|
| Add / change candles | `data/products.json` |
| Add product photos | put files in `public/products/` and list them in that product's `images` |
| Change phone / email / Instagram / announcement bar | `data/config.ts` |
| Write your story, philosophy, testimonials, gifting occasions, care tips | `data/content.ts` |
| Hide the dashed "placeholder" notes at launch | `showPlaceholders = false` in `data/content.ts` |
| Rename or recolour a scent family | `data/families.ts` (names must match each product's `category`) |

### Product fields (`data/products.json`)
Required: `id`, `name`, `images` (array, may be empty), `price` (number or `null`), `category`, `stock` (`"in"` / `"out"`), `short`, `detail`.
Optional (shown only when filled in): `originalPrice` (shows a strikethrough price + % off), `scentFamily`, `topNotes`, `heartNotes`, `baseNotes` (arrays of words), `wax`, `size`, `burn`, `bestseller`, `featured`, `isNew`, `added` (higher number = newer). Keep existing IDs: they are the product URLs.

Photo tips: portrait or square, plain background, at least 1200 px on the long side, JPG/WebP. The first image is used in the archive; extra images become the gallery on `/shop/[id]`. Images are never cropped in the archive (`object-fit: contain`).

## How the pieces map to files
- **Scent Archive** (the curved shelf): `components/archive/` (`geometry.ts` maths, `ScentArchive.tsx` shelf, `DetailSheet.tsx` expanding sheet, `MobileTrack.tsx` phone layout), wired up in `components/ShopClient.tsx`.
- **Home**: `app/page.tsx` + `components/home/` (hero, story chapters, gifting, scroll-driven flame, parallax).
- **Shop / bag**: `lib/cart.tsx`, `components/CartDrawer.tsx`, `components/AddToBag.tsx`; wishlist in `lib/wishlist.tsx`.
- **Styles**: `app/globals.css` (tokens, header, bag), `styles/shared.css`, `styles/archive.css`, `styles/product.css`, `styles/home.css`.
- **Brand artwork**: `public/brand/*.webp` are transparent cut-outs made from `public/logo.jpg` (your original is untouched). `app/icon.png` is the favicon.

## Notes
- Fonts are self-hosted via `@fontsource` (Cormorant Garamond + Jost), so no Google Fonts request at build or run time.
- `components/reactbits/` is kept from your original project but is currently unused.
- The archive switches to an endless looping shelf automatically once there are 24+ candles; below that it is a finite shelf, so no candle is ever duplicated.
