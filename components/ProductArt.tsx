"use client";
import Image from "next/image";
import { useState } from "react";
import CandleArt from "./CandleArt";
import { familyOf, displayName, type Product } from "@/lib/products";

/** Product photograph if supplied (and loadable), otherwise the illustrated candle placeholder. */
export default function ProductArt({ p, sizes = "(max-width:768px) 80vw, 420px", priority = false, fit = "contain", showNote = false, className = "" }: {
  p: Product; sizes?: string; priority?: boolean; fit?: "contain" | "cover"; showNote?: boolean; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = p.images?.[0];
  const ok = !!src && !failed;
  return (
    <div className={"pa " + className} data-photo={ok ? "1" : "0"}>
      {ok ? (
        src.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={displayName(p)} loading={priority ? "eager" : "lazy"} style={{ objectFit: fit }} onError={() => setFailed(true)} />
        ) : (
          <Image src={src} alt={displayName(p)} fill sizes={sizes} priority={priority} style={{ objectFit: fit }} onError={() => setFailed(true)} />
        )
      ) : (
        <>
          <CandleArt family={familyOf(p)} className="pa-art" />
          {showNote && <span className="pa-note">Photograph coming soon</span>}
        </>
      )}
    </div>
  );
}
