"use client";
import { useEffect } from "react";

/**
 * One passive scroll listener drives every [data-speed] element on the page (Melli-style parallax).
 * data-speed: fraction of the element's distance from viewport centre to translate (e.g. -0.12).
 * data-rot: degrees of rotation per viewport-height of travel. Disabled for reduced motion.
 */
export default function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-speed]"));
    if (!els.length) return;
    let raf = 0;
    const small = () => window.innerWidth < 760;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight, k = small() ? 0.5 : 1;
      for (const el of els) {
        const host = el.parentElement!;
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue; // off-screen: skip
        const d = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around the viewport centre
        const sp = parseFloat(el.dataset.speed || "0") * k;
        const rot = parseFloat(el.dataset.rot || "0");
        const base = el.dataset.base || "";
        el.style.transform = `translate3d(0,${(d * sp * vh).toFixed(1)}px,0) ${base} ${rot ? `rotate(${(d * rot).toFixed(2)}deg)` : ""}`;
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
