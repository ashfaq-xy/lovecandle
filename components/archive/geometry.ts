/**
 * Geometry for the curved Scent Archive shelf.
 * Pure functions, no DOM. Adapted from the "curved archive" reference:
 *  - F(r): arc-length position of the item at fractional offset r from the active item
 *  - scl(u): perspective scale of an item at arc-length u
 *  - xsc(u): on-screen x of an item at arc-length u (integral of scl, so spacing compresses with depth)
 */
export const PERSP = 1400;
export const LOOP_MIN = 24; // below this many items the shelf is finite (no duplicated candles)
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const mod = (n: number, m: number) => ((n % m) + m) % m;

export type Metrics = {
  H: number; ws: number; d: number; gap: number; step: number; U: number; open: number;
  scl: (u: number) => number;
  xsc: (u: number) => number;
  F: (r: number) => number;
  cutoff: number;
};

export function makeMetrics(H: number, N: number): Metrics {
  const ws = H * 0.19;           // spine width
  const d = H * 0.6;             // cover width (what the active candle shows)
  const gap = H * 0.035;
  const U = H * 1.55;            // depth length-scale
  const base = ws + gap;
  const loop = N >= LOOP_MIN;
  // small catalogues: spread the shelf out so it fills the stage instead of huddling in the middle
  const spread = loop ? 1 : clamp((U * 1.0) / (base * ((N - 1) / 2 + 1)), 1, 2.7);
  const step = base * spread;
  const open = d - ws + gap * 1.4;
  const scl = (u: number) => 1 / (1 + Math.pow(Math.abs(u) / U, 1.6));
  const cutoff = U * 1.95;
  // integral table, 2px resolution
  const len = Math.ceil(cutoff / 2) + 4;
  const xs = new Float32Array(len + 1);
  for (let i = 0; i < len; i++) xs[i + 1] = xs[i] + 2 * scl(2 * i + 1);
  const xsc = (u: number) => {
    const a = Math.abs(u) / 2;
    const i = Math.min(len - 1, Math.floor(a));
    const v = xs[i] + (xs[i + 1] - xs[i]) * (a - i);
    return u < 0 ? -v : v;
  };
  const B = (r: number) => (Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5);
  const F = (r: number) => r * step + open * B(r);
  return { H, ws, d, gap, step, U, open, scl, xsc, F, cutoff };
}

/** Layout of the stage: how big the shelf is and where its vertical centre sits. */
export function layout(W: number, Hs: number) {
  const topPad = 28, cap = Hs < 640 ? 176 : 196, tl = 84;
  const avail = Hs - topPad - cap - tl;
  const H = clamp(Math.min(avail * 0.95, W * (W < 1000 ? 0.44 : 0.34)), 190, 580);
  const cy = topPad + avail / 2 + (avail - H) * 0.0;
  return { H, cy };
}
