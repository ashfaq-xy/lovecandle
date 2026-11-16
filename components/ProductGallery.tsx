"use client";
import Image from "next/image";
import { useState } from "react";
import CandleArt from "./CandleArt";
import { displayName, familyOf, type Product } from "@/lib/products";

/** Functional gallery: thumbnails switch the main image; hover-zoom on fine pointers. Falls back to the illustrated candle. */
export default function ProductGallery({ p }: { p: Product }) {
  const f = familyOf(p);
  const [i, setI] = useState(0);
  const [bad, setBad] = useState<Record<string, boolean>>({});
  const imgs = (p.images ?? []).filter(s => !bad[s]);
  const cur = imgs[Math.min(i, imgs.length - 1)];
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="pg" style={{ ["--t" as any]: f.tint, ["--dp" as any]: f.deep }}>
      <div
        className="pg-main"
        data-photo={cur ? "1" : "0"}
        onPointerMove={e => { if (e.pointerType !== "mouse" || !cur) return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        onPointerLeave={() => setZoom(null)}
      >
        {cur ? (
          cur.startsWith("http")
            // eslint-disable-next-line @next/next/no-img-element
            ? <img key={cur} className="pg-img" src={cur} alt={`${displayName(p)}, image ${i + 1}`} onError={() => setBad(b => ({ ...b, [cur]: true }))} style={zoom ? { transform: "scale(1.7)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            : <Image key={cur} className="pg-img" src={cur} alt={`${displayName(p)}, image ${i + 1}`} fill priority sizes="(max-width:900px) 92vw, 560px" onError={() => setBad(b => ({ ...b, [cur]: true }))} style={zoom ? { transform: "scale(1.7)", transformOrigin: `${zoom.x}% ${zoom.y}%`, objectFit: "contain" } : { objectFit: "contain" }} />
        ) : (
          <>
            <CandleArt family={f} className="pg-art" label={`Illustration of a ${f.name} candle`} />
            <span className="pg-note">Photograph coming soon</span>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <ul className="pg-th" aria-label="Product images">
          {imgs.map((s, k) => (
            <li key={s}>
              <button type="button" onClick={() => setI(k)} aria-label={`Show image ${k + 1} of ${imgs.length}`} aria-current={k === i ? "true" : undefined} className={k === i ? "on" : ""}>
                {s.startsWith("http") ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={s} alt="" /> : <Image src={s} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
