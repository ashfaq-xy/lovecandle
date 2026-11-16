import type { SVGProps } from "react";
import type { Glyph } from "@/data/families";
const B = (p: SVGProps<SVGSVGElement>) => ({ width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false, ...p });
export const IconBag = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>;
export const IconHeart = ({ filled, ...p }: SVGProps<SVGSVGElement> & { filled?: boolean }) => <svg {...B(p)} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>;
export const IconSearch = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
export const IconMenu = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><path d="M4 8h16M4 16h16" /></svg>;
export const IconClose = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const IconPlus = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={16} height={16}><path d="M12 5v14M5 12h14" /></svg>;
export const IconMinus = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={16} height={16}><path d="M5 12h14" /></svg>;
export const IconPrev = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><path d="M15 5l-7 7 7 7" /></svg>;
export const IconNext = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)}><path d="M9 5l7 7-7 7" /></svg>;
export const IconPlay = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={16} height={16} fill="currentColor" strokeWidth={0}><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>;
export const IconPause = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={16} height={16} fill="currentColor" strokeWidth={0}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
export const IconCheck = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={18} height={18}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const IconGrid = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={18} height={18}><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></svg>;
export const IconArc = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={18} height={18}><path d="M3 15c3-6 15-6 18 0" /><path d="M6 17V13M12 15V9.5M18 17V13" /></svg>;
export const IconWhatsApp = (p: SVGProps<SVGSVGElement>) => <svg {...B(p)} width={18} height={18}><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z" /><path d="M9 9.5c.3 2.2 2.3 4.2 5 5l1.2-1.3-1.8-1-1 .6c-.8-.4-1.4-1-1.8-1.8l.6-1-1-1.8L9 9.5Z" strokeWidth={1.2} /></svg>;

/** Small line emblem for each scent family. */
export function FamilyGlyph({ glyph, size = 44, ...p }: { glyph: Glyph; size?: number } & SVGProps<SVGSVGElement>) {
  const s = { width: size, height: size, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false, ...p };
  switch (glyph) {
    case "flower": return <svg {...s}>{[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="24" cy="12.5" rx="5.2" ry="8.5" transform={`rotate(${a} 24 24)`} />)}<circle cx="24" cy="24" r="2.4" /></svg>;
    case "swirl": return <svg {...s}><path d="M24 24c0-2 3-2 3 0s-4 3.5-6 1-1-7 3-8.5 9 .5 10 6-3 11-9.5 11.5S8.5 28 9.5 21" /></svg>;
    case "drop": return <svg {...s}><path d="M24 7c6 8.5 10 13 10 19a10 10 0 0 1-20 0c0-6 4-10.500 10-19Z" /><path d="M19 28a5.500 5.500 0 0 0 4 5" /></svg>;
    case "rings": return <svg {...s}><ellipse cx="24" cy="24" rx="17" ry="14" /><ellipse cx="24" cy="24" rx="11.500" ry="9" /><ellipse cx="24" cy="24" rx="6" ry="4.500" /><circle cx="24" cy="24" r="0.900" /></svg>;
    case "heart": return <svg {...s}><path d="M24 40S9 31 9 20.500A8.500 8.500 0 0 1 24 15a8.500 8.500 0 0 1 15 5.500C39 31 24 40 24 40Z" /></svg>;
    case "moon": return <svg {...s}><path d="M31 8.500A16 16 0 1 0 40 29 13 13 0 0 1 31 8.500Z" /><path d="M36 8v6M33 11h6" strokeWidth={1} /></svg>;
  }
}
