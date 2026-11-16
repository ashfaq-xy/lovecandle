"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";

/** SSR-safe media query: returns `fallback` on the server and first render. */
export function useMedia(query: string, fallback = false) {
  const subscribe = useCallback((cb: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => fallback);
}
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)", false);
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)", false);

/** Lock page scroll while an overlay is open. */
export function useScrollLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const prev = document.body.style.overflow;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = sbw + "px";
    return () => { document.body.style.overflow = prev; document.body.style.paddingRight = ""; };
  }, [on]);
}

/** Keep Tab focus inside `ref` while `on`. Returns focus to the previously focused element on close. */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, on: boolean, initial?: () => HTMLElement | null) {
  useEffect(() => {
    if (!on) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => (initial?.() ?? ref.current?.querySelector<HTMLElement>("button, a[href], input, select, textarea"))?.focus({ preventScroll: true }), 30);
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { clearTimeout(t); document.removeEventListener("keydown", key); prev?.focus?.({ preventScroll: true }); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
}
