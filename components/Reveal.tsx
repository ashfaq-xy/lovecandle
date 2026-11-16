"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Adds `.in` once the element scrolls into view. Children with class `rv-i` (and optional --i index)
 * transition in. Content is never hidden if IntersectionObserver is missing or motion is reduced.
 */
export default function Reveal({ as: Tag = "div", className = "", children, margin = "0px 0px -8% 0px", ...rest }: { as?: ElementType; className?: string; children: ReactNode; margin?: string } & Record<string, any>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }), { rootMargin: margin, threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return <Tag ref={ref} className={"reveal " + className} {...rest}>{children}</Tag>;
}
