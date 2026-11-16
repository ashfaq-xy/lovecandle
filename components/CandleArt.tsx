import type { SVGProps } from "react";
import { families, type Family } from "@/data/families";
import { FamilyGlyph } from "./Icons";

/**
 * Illustrated candle used wherever a real photograph hasn't been supplied yet.
 * It is deliberately an illustration (not a fake product photo) and is tinted by scent family.
 */
export default function CandleArt({ family, lit = true, label, ...rest }: { family?: Family; lit?: boolean; label?: string } & SVGProps<SVGSVGElement>) {
  const f = family ?? families[0];
  const id = "ca-" + f.slug;
  return (
    <svg viewBox="0 0 200 260" role="img" aria-label={label ?? `${f.name} candle illustration`} {...rest}>
      <defs>
        <linearGradient id={id + "-glass"} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".22" stopColor={f.tint} stopOpacity=".55" />
          <stop offset=".8" stopColor={f.tint} stopOpacity=".9" />
          <stop offset="1" stopColor={f.deep} stopOpacity=".28" />
        </linearGradient>
        <linearGradient id={id + "-wax"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF8EC" />
          <stop offset="1" stopColor={f.tint} stopOpacity=".7" />
        </linearGradient>
        <radialGradient id={id + "-glow"}><stop offset="0" stopColor="#FFD58A" stopOpacity=".55" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" /></radialGradient>
        <linearGradient id={id + "-flame"} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F0A04B" /><stop offset=".55" stopColor="#FFD98C" /><stop offset="1" stopColor="#FFF6DC" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="239" rx="64" ry="7.500" fill="#2a1a16" opacity=".16" />
      {lit && <circle className="ca-glow" cx="100" cy="76" r="62" fill={`url(#${id}-glow)`} />}
      <rect x="40" y="96" width="120" height="140" rx="20" fill={`url(#${id}-glass)`} stroke={f.deep} strokeOpacity=".32" />
      <rect x="49" y="106" width="102" height="122" rx="13" fill={`url(#${id}-wax)`} />
      <ellipse cx="100" cy="106" rx="51" ry="6" fill="#FFF8EC" stroke={f.deep} strokeOpacity=".18" />
      <rect x="52" y="104" width="7" height="118" rx="3.500" fill="#fff" opacity=".4" />
      <g style={{ color: f.deep }} opacity=".72"><FamilyGlyph glyph={f.glyph} size={44} x={78} y={142} strokeWidth={1.4} /></g>
      <path d="M100 104v-14" stroke="#4a3a34" strokeWidth="1.800" strokeLinecap="round" />
      {lit && (
        <g className="ca-flame">
          <path d="M100 52c7 9 9.500 16 9.500 22a9.500 9.500 0 0 1-19 0c0-6 2.500-13 9.500-22Z" fill={`url(#${id}-flame)`} />
          <path d="M100 66c3 4.500 4 7.500 4 10.500a4 4 0 0 1-8 0c0-3 1-6 4-10.500Z" fill="#fff" opacity=".85" />
        </g>
      )}
    </svg>
  );
}
