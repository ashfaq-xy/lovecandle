"use client";
import { useEffect, useRef } from "react";

/**
 * A small candle flame that lifts off the hero candle and drifts between sections as you scroll.
 * Position is interpolated between viewport-space "stops" declared in the page with
 * data-flame="x,y" (percent of viewport). Pure SVG + transforms: no 3D library needed.
 * Hidden on small screens and for reduced motion.
 */
export default function ScrollFlame() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 900) { el.style.display = "none"; return; }
    type Stop = { y: number; x: number; vy: number };
    let stops: Stop[] = [], hero = { x: 0, y: 0 };
    const cur = { x: -200, y: -200, s: 1, g: 0.4, o: 0 };
    let raf = 0, last = 0, vw = innerWidth, vh = innerHeight;
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const measure = () => {
      vw = innerWidth; vh = innerHeight;
      const sy = scrollY;
      const h = document.querySelector<HTMLElement>("[data-flame-origin]");
      if (h) { const r = h.getBoundingClientRect(); hero = { x: r.left + r.width / 2, y: r.top + r.height / 2 + sy }; }
      stops = Array.from(document.querySelectorAll<HTMLElement>("[data-flame]")).map(s => {
        const [x, y] = (s.dataset.flame || "50,50").split(",").map(Number);
        const r = s.getBoundingClientRect();
        return { y: r.top + sy + r.height / 2, x: (x / 100) * vw, vy: (y / 100) * vh };
      }).sort((a, b) => a.y - b.y);
    };
    const target = () => {
      const sy = scrollY, read = sy + vh * 0.5;
      const lift = Math.min(1, sy / (vh * 0.18));
      let x = hero.x, y = hero.y - sy; // starts exactly on the hero candle's wick
      if (stops.length) {
        const first = stops[0];
        if (read < first.y) {
          const t = smooth(Math.max(0, Math.min(1, sy / Math.max(1, first.y - vh * 0.5))));
          x = hero.x + (first.x - hero.x) * t; y = hero.y - sy + (first.vy - (hero.y - sy)) * t;
        } else {
          let i = stops.length - 2;
          while (i > 0 && stops[i].y > read) i--;
          const a = stops[Math.max(0, i)], b = stops[Math.min(stops.length - 1, i + 1)];
          const t = a === b ? 0 : smooth(Math.max(0, Math.min(1, (read - a.y) / (b.y - a.y))));
          x = a.x + (b.x - a.x) * t; y = a.vy + (b.vy - a.vy) * t;
        }
      }
      // brighter when over a dark section
      let dark = 0;
      document.querySelectorAll<HTMLElement>('[data-header="dark"]').forEach(d => { const r = d.getBoundingClientRect(); if (y > r.top && y < r.bottom) dark = 1; });
      return { x, y, o: lift, g: dark ? 1 : 0.4, s: dark ? 1.25 : 1 };
    };
    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      const T = target(), e = 1 - Math.exp(-dt * 5);
      cur.x += (T.x - cur.x) * e; cur.y += (T.y - cur.y) * e; cur.g += (T.g - cur.g) * e; cur.s += (T.s - cur.s) * e; cur.o += (T.o - cur.o) * (1 - Math.exp(-dt * 8));
      el.style.transform = `translate3d(${cur.x.toFixed(1)}px,${cur.y.toFixed(1)}px,0) scale(${cur.s.toFixed(3)})`;
      el.style.opacity = cur.o.toFixed(3);
      el.style.setProperty("--g", cur.g.toFixed(3));
      if (Math.abs(T.x - cur.x) > 0.3 || Math.abs(T.y - cur.y) > 0.3 || Math.abs(T.o - cur.o) > 0.005 || Math.abs(T.g - cur.g) > 0.01) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    measure(); cur.x = hero.x; cur.y = hero.y - scrollY; kick();
    const re = () => { measure(); kick(); };
    const ro = new ResizeObserver(re); ro.observe(document.body);
    addEventListener("scroll", kick, { passive: true }); addEventListener("resize", re);
    const t = setTimeout(re, 600);
    return () => { removeEventListener("scroll", kick); removeEventListener("resize", re); ro.disconnect(); clearTimeout(t); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={box} className="sflame" aria-hidden="true" style={{ opacity: 0 }}>
      <span className="sf-glow" />
      <svg viewBox="0 0 40 64" width="30" height="48"><defs><linearGradient id="sf-g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F0A04B" /><stop offset=".55" stopColor="#FFD98C" /><stop offset="1" stopColor="#FFF6DC" /></linearGradient></defs>
        <g className="sf-fl"><path d="M20 3c8 11 12 19 12 28a12 12 0 0 1-24 0C8 22 12 14 20 3Z" fill="url(#sf-g)" /><path d="M20 30c4 5 5.500 9 5.500 13a5.500 5.500 0 0 1-11 0c0-4 1.500-8 5.500-13Z" fill="#fff" opacity=".85" /></g>
      </svg>
    </div>
  );
}
