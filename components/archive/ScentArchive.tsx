"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import ProductArt from "../ProductArt";
import MaskSwap from "./MaskSwap";
import { FamilyGlyph, IconNext, IconPause, IconPlay, IconPrev } from "../Icons";
import { LOOP_MIN, Metrics, PERSP, clamp, layout, makeMetrics, mod, smooth } from "./geometry";
import { blurb, discountPct, displayName, familyLabel, familyOf, hasDiscount, inStock, isPlaceholder, money, type Product } from "@/lib/products";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import "@/styles/archive.css";

export type ArchiveHandle = {
  /** Jump (instantly) to a product, e.g. when restoring a deep link. */
  focus: (id: string) => void;
  /** Current on-screen rectangle of a product's cover face, used as the origin of the detail sheet. */
  coverRect: (id: string) => DOMRect | null;
};
type Props = { list: Product[]; sheetOpen: boolean; onOpen: (p: Product, rect: DOMRect) => void };

const AUTOPLAY_MS = 5000;
const pad = (n: number) => String(n).padStart(2, "0");

const ScentArchive = forwardRef<ArchiveHandle, Props>(function ScentArchive({ list, sheetOpen, onOpen }, ref) {
  const N = list.length;
  const loop = N >= LOOP_MIN;
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  const stageRef = useRef<HTMLElement>(null);
  const tapeEls = useRef<(HTMLDivElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLButtonElement>(null);
  const curRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(true);
  const [docVisible, setDocVisible] = useState(true);
  const [dragging, setDragging] = useState(false);

  // All animation state lives in a ref: React only re-renders when the *active product* changes.
  const S = useRef({
    s: 0, T: 0, M: null as Metrics | null, cy: 0, W: 0,
    lift: [] as number[], shown: [] as boolean[], hoverIdx: -1, act: -1,
    tilt: { x: 0, y: 0, tx: 0, ty: 0 },
    cur: { x: 0, y: 0, px: 0, py: 0, on: false },
    drag: null as null | { id: number; x0: number; T0: number; moved: boolean; lx: number; lt: number; v: number },
    raf: 0, last: 0, wheelAcc: 0, wheelAt: 0,
  });

  const idxOf = useCallback((s: number) => (loop ? mod(Math.round(s), N) : clamp(Math.round(s), 0, N - 1)), [loop, N]);

  /* ---------- paint: write transforms straight to the DOM ---------- */
  const paint = useCallback(() => {
    const st = S.current, M = st.M;
    if (!M) return;
    const s = st.s;
    for (let i = 0; i < N; i++) {
      const el = tapeEls.current[i];
      if (!el) continue;
      let r = i - s;
      if (loop) r = mod(r + N / 2, N) - N / 2;
      const u = M.F(r);
      if (Math.abs(u) > M.cutoff) {
        if (st.shown[i] !== false) { el.style.visibility = "hidden"; st.shown[i] = false; }
        continue;
      }
      if (st.shown[i] !== true) { el.style.visibility = "visible"; st.shown[i] = true; }
      const o = smooth(Math.max(0, 1 - Math.abs(r)));
      const sc = M.scl(u), k = 1 / sc;
      const lift = st.lift[i] || 0;
      const x = M.xsc(u) * k;
      const z = PERSP * (1 - k) + o * M.H * 0.1;
      const y = (M.H * 0.5 * (1 - sc) * 0.42 + o * M.H * 0.012 - lift * M.H * 0.05) * k;
      const ry = -Math.sign(u) * Math.min(1, Math.abs(u) / M.U) * 24 * (1 - o) - 90 * o + st.tilt.x * o;
      const rx = st.tilt.y * o;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      el.style.zIndex = String(1000 - Math.round(Math.abs(u)));
      el.style.setProperty("--ss", Math.min(0.62, o * 0.55 + (1 - sc) * 0.34).toFixed(3));
      el.style.setProperty("--cs", ((1 - o) * 0.4).toFixed(3));
      el.style.setProperty("--co", o.toFixed(3));
    }
    const settle = 1 - Math.min(1, Math.abs(st.T - s) * 1.6);
    if (dotRef.current) {
      const pos = loop ? mod(s + 0.5, N) - 0.5 : clamp(s, 0, N - 1);
      dotRef.current.style.left = ((pos + 0.5) / N) * 100 + "%";
    }
    if (ringRef.current) ringRef.current.style.opacity = String(Math.max(0, settle * 2 - 1).toFixed(2));
    if (glowRef.current) glowRef.current.style.opacity = String(settle.toFixed(2));
    const a = idxOf(s);
    if (a !== st.act) { st.act = a; setActive(a); }
  }, [N, loop, idxOf]);

  /* ---------- the loop only runs while something is moving ---------- */
  const tick = useCallback((t: number) => {
    const st = S.current;
    st.raf = 0;
    const dt = Math.min(0.05, (t - st.last) / 1000 || 0.016);
    st.last = t;
    let moving = false;
    const diff = st.T - st.s;
    if (Math.abs(diff) > 0.0004) {
      st.s += diff * (1 - Math.exp(-dt * (st.drag?.moved ? 26 : reduce ? 80 : 5.2)));
      moving = true;
    } else st.s = st.T;
    const act = idxOf(st.s);
    for (let i = 0; i < N; i++) {
      const target = st.hoverIdx === i && i !== act && !st.drag?.moved ? 1 : 0;
      const cur = st.lift[i] || 0;
      if (Math.abs(target - cur) > 0.003) { st.lift[i] = cur + (target - cur) * (1 - Math.exp(-dt * 12)); moving = true; } else st.lift[i] = target;
    }
    const tl = st.tilt;
    const dx = tl.tx - tl.x, dy = tl.ty - tl.y;
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) { const e = 1 - Math.exp(-dt * 8); tl.x += dx * e; tl.y += dy * e; moving = true; }
    const c = st.cur;
    if (curRef.current && c.on) {
      const ex = c.px - c.x, ey = c.py - c.y;
      if (Math.abs(ex) > 0.1 || Math.abs(ey) > 0.1) { const e = 1 - Math.exp(-dt * 18); c.x += ex * e; c.y += ey * e; moving = true; }
      curRef.current.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;
    }
    paint();
    if (moving) st.raf = requestAnimationFrame(tick);
  }, [N, idxOf, paint, reduce]);
  const kick = useCallback(() => { const st = S.current; if (!st.raf) { st.last = performance.now(); st.raf = requestAnimationFrame(tick); } }, [tick]);

  /* ---------- measuring ---------- */
  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const W = el.clientWidth, Hs = el.clientHeight;
    const { H, cy } = layout(W, Hs);
    const M = makeMetrics(H, N);
    const st = S.current;
    st.M = M; st.cy = cy; st.W = W;
    el.style.setProperty("--H", H + "px");
    el.style.setProperty("--ws", M.ws + "px");
    el.style.setProperty("--d", M.d + "px");
    el.style.setProperty("--cy", cy + "px");
    paint();
  }, [N, paint]);

  useLayoutEffect(() => {
    const st = S.current;
    st.s = st.T = reduce ? 0 : -Math.min(2.2, N * 0.4); // gentle entrance: the shelf glides in
    st.T = 0;
    measure();
    kick();
    const el = stageRef.current!;
    const ro = new ResizeObserver(() => { measure(); });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(st.raf); st.raf = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- navigation ---------- */
  const stopAuto = useCallback(() => setPlaying(false), []);
  const goTo = useCallback((i: number, user = true) => {
    const st = S.current;
    let T = i;
    if (loop) T = Math.round(st.T) + (mod(i - Math.round(st.T) + N / 2, N) - N / 2);
    else T = clamp(i, 0, N - 1);
    if (T === st.T) return;
    setDir(T > st.T ? 1 : -1);
    st.T = T;
    if (user) stopAuto();
    kick();
  }, [N, loop, kick, stopAuto]);
  const stepBy = useCallback((d: number, user = true) => {
    const st = S.current;
    const cur = Math.round(st.T);
    if (loop) { goTo(cur + d, user); return; }
    goTo(mod(cur + d, N), user); // finite shelf: arrows wrap round to the other end
    setDir(d > 0 ? 1 : -1);
  }, [N, loop, goTo]);

  const open = useCallback((i?: number) => {
    const idx = i ?? idxOf(S.current.s);
    const el = tapeEls.current[idx]?.querySelector<HTMLElement>(".cv");
    if (!el) return;
    onOpen(list[idx], el.getBoundingClientRect());
  }, [list, onOpen, idxOf]);

  useImperativeHandle(ref, () => ({
    focus: (id: string) => {
      const i = list.findIndex(p => p.id === id);
      if (i < 0) return;
      const st = S.current;
      st.s = st.T = i; st.act = -1;
      setDir(1); paint(); setActive(i);
    },
    coverRect: (id: string) => {
      const i = list.findIndex(p => p.id === id);
      return tapeEls.current[i]?.querySelector<HTMLElement>(".cv")?.getBoundingClientRect() ?? null;
    },
  }), [list, paint]);

  /* ---------- pointer: drag, tap, hover, cursor ---------- */
  const blockTarget = (t: EventTarget | null) => !!(t as Element | null)?.closest?.("button, a, input, .arc-cap, .arc-tl");
  /** Which candle is under the pointer? Done by projected face rectangles, so it is identical in every browser's 3D hit-testing. */
  const hitTape = (cx: number, cy: number) => {
    const st = S.current;
    let best = -1, bz = -1;
    for (let i = 0; i < N; i++) {
      if (st.shown[i] !== true) continue;
      const el = tapeEls.current[i]; if (!el) continue;
      const z = Number(el.style.zIndex) || 0;
      if (z <= bz) continue;
      for (const f of [el.firstElementChild, el.querySelector(".cv")] as (Element | null)[]) {
        if (!f) continue;
        const r = f.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) { best = i; bz = z; break; }
      }
    }
    return best;
  };
  const setCursorState = (t: EventTarget | null, x: number, y: number) => {
    const c = curRef.current; if (!c) return;
    const el = t as Element | null;
    const hi = hitTape(x, y);
    let state = "drag";
    if (el?.closest?.("button, a, .arc-tl")) state = "btn";
    else if (hi >= 0) state = hi === idxOf(S.current.s) ? "view" : "go";
    c.dataset.state = state;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.pointerType === "mouse" && e.button !== 0) || blockTarget(e.target) || sheetOpen) return;
    S.current.drag = { id: e.pointerId, x0: e.clientX, T0: S.current.T, moved: false, lx: e.clientX, lt: performance.now(), v: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = S.current, M = st.M;
    if (!M) return;
    const rect = stageRef.current!.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      st.cur.px = e.clientX - rect.left; st.cur.py = e.clientY - rect.top;
      if (!st.cur.on) { st.cur.on = true; st.cur.x = st.cur.px; st.cur.y = st.cur.py; curRef.current?.classList.add("on"); }
      setCursorState(e.target, e.clientX, e.clientY);
    }
    const dr = st.drag;
    if (dr && dr.id === e.pointerId) {
      const dx = e.clientX - dr.x0;
      if (!dr.moved && Math.abs(dx) > 6) {
        dr.moved = true; setDragging(true); stopAuto();
        try { stageRef.current!.setPointerCapture(e.pointerId); } catch {}
      }
      if (dr.moved) {
        let T = dr.T0 - dx / M.step;
        if (!loop) { if (T < 0) T *= 0.35; else if (T > N - 1) T = N - 1 + (T - (N - 1)) * 0.35; }
        const now = performance.now();
        dr.v = (dr.v * 0.6) + (((dr.T0 - (e.clientX - dr.x0) / M.step) - (st.T)) / Math.max(1, now - dr.lt)) * 1000 * 0.4;
        dr.lt = now; dr.lx = e.clientX;
        st.T = T; kick();
        return;
      }
    }
    if (e.pointerType === "mouse") {
      const hi = (e.target as Element).closest?.("button, a, .arc-tl, .arc-cap") ? -1 : hitTape(e.clientX, e.clientY);
      if (hi !== st.hoverIdx) st.hoverIdx = hi;
      // tilt the active cover toward the pointer
      if (hi === idxOf(st.s)) { st.tilt.tx = clamp((st.cur.px - st.W / 2) / (M.d / 2), -1, 1) * 5; st.tilt.ty = clamp(-(st.cur.py - st.cy) / (M.H / 2), -1, 1) * 3.5; }
      else { st.tilt.tx = 0; st.tilt.ty = 0; }
      kick();
    }
  };
  const endDrag = (e: React.PointerEvent, cancel = false) => {
    const st = S.current, dr = st.drag;
    if (!dr || dr.id !== e.pointerId) return;
    st.drag = null;
    if (dr.moved) {
      setDragging(false);
      try { stageRef.current!.releasePointerCapture(e.pointerId); } catch {}
      const proj = st.T + clamp(dr.v, -6, 6) * 0.12; // flick: a little momentum before snapping
      let T = loop ? Math.round(proj) : clamp(Math.round(proj), 0, N - 1);
      if (!loop && !Number.isFinite(T)) T = 0;
      setDir(T >= S.current.s ? 1 : -1);
      st.T = T; kick();
      return;
    }
    if (cancel) return;
    // a tap / click
    if (sheetOpen || (e.target as Element).closest?.("button, a, .arc-tl, .arc-cap")) return;
    const i = hitTape(e.clientX, e.clientY);
    if (i < 0) return;
    if (i === idxOf(st.s) && Math.abs(st.T - st.s) < 0.2) open(i);
    else goTo(i);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const st = S.current;
    st.hoverIdx = -1; st.tilt.tx = 0; st.tilt.ty = 0; st.cur.on = false;
    curRef.current?.classList.remove("on");
    setHovering(false); kick();
  };

  /* ---------- wheel (horizontal intent only, so the page can still scroll), keyboard ---------- */
  useEffect(() => {
    const el = stageRef.current!;
    const onWheel = (e: WheelEvent) => {
      if (sheetOpen) return;
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2 || e.shiftKey;
      if (!horiz) return;
      e.preventDefault();
      const st = S.current, now = performance.now();
      st.wheelAcc += e.deltaX || e.deltaY;
      if (Math.abs(st.wheelAcc) > 50 && now - st.wheelAt > 320) { stepBy(st.wheelAcc > 0 ? 1 : -1); st.wheelAcc = 0; st.wheelAt = now; }
      if (now - st.wheelAt > 600) st.wheelAcc = 0;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stepBy, sheetOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheetOpen || !inView || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (t?.closest?.('[role="dialog"]')) return;
      if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
      else if (e.key === "Home" && t === stageRef.current) { e.preventDefault(); goTo(0); }
      else if (e.key === "End" && t === stageRef.current) { e.preventDefault(); goTo(N - 1); }
      else if ((e.key === "Enter" || e.key === " ") && t === stageRef.current) { e.preventDefault(); open(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen, inView, stepBy, goTo, open, N]);

  /* ---------- visibility (autoplay should only run when it can be seen) ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting && en.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] });
    io.observe(stageRef.current!);
    const dv = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", dv);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", dv); };
  }, []);
  useEffect(() => { if (reduce) setPlaying(false); }, [reduce]);

  const running = playing && !hovering && inView && docVisible && !sheetOpen && !dragging && N > 1 && !reduce;
  const p = list[active] ?? list[0];
  const fam = familyOf(p);
  const price = p.price != null;

  return (
    <section
      ref={stageRef}
      className="arc"
      data-fine={fine ? "1" : "0"}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Scent Archive, ${N} candle${N === 1 ? "" : "s"}. Use the left and right arrow keys to browse, Enter to open.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={e => endDrag(e)}
      onPointerCancel={e => endDrag(e, true)}
      onPointerEnter={e => { if (e.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={onPointerLeave}
    >
      <div className="arc-bg" aria-hidden="true"><span className="ghost l">Scent</span><span className="ghost r">Archive</span></div>

      <div className="arc-shelf">
        <div className="arc-floor" aria-hidden="true" />
        <div className="arc-glow" ref={glowRef} aria-hidden="true" />
        {list.map((q, i) => {
          const f = familyOf(q);
          return (
            <div key={q.id} className="tape" data-i={i} aria-hidden="true" ref={el => { tapeEls.current[i] = el; }} style={{ ["--t" as any]: f.tint, ["--dp" as any]: f.deep, visibility: "hidden" }}>
              <div className="sp">
                <span className="sp-no">{pad(i + 1)}</span>
                <span className="sp-name">{displayName(q)}</span>
                <span className="sp-glyph"><FamilyGlyph glyph={f.glyph} size={22} /></span>
                <i className="shade" />
              </div>
              <div className="sd"><i className="shade" /></div>
              <div className="cv">
                <div className="cv-in"><ProductArt p={q} sizes="(max-width:1100px) 30vw, 340px" /></div>
                <span className="cv-no">No. {pad(i + 1)}</span>
                <span className="cv-fam">{familyLabel(q)}</span>
                <i className="shade" />
              </div>
            </div>
          );
        })}
        <button type="button" ref={ringRef} className="arc-ring" tabIndex={-1} aria-hidden="true" onClick={() => open()} style={{ opacity: 0 }}><span>View</span></button>
      </div>

      <div className="arc-cap">
        <button type="button" className="arc-nav prev" onClick={() => stepBy(-1)} aria-label="Previous candle" disabled={N < 2}><IconPrev /></button>
        <div className="arc-cap-body">
          <MaskSwap id={p.id} dir={dir} delay={0} className="cap-fam"><span style={{ color: fam.deep }}>{familyLabel(p)}</span>{isPlaceholder(p) && <em className="cap-tag">Sample entry</em>}</MaskSwap>
          <h2 className="cap-title"><MaskSwap id={p.id} dir={dir} delay={60}>{displayName(p)}</MaskSwap></h2>
          <p className="cap-desc"><MaskSwap id={p.id} dir={dir} delay={120}>{blurb(p)}</MaskSwap></p>
          <div className="cap-buy">
            <MaskSwap id={p.id} dir={dir} delay={180}>
              <span className="cap-price">
                <strong className={price ? "" : "muted"}>{money(p.price)}</strong>
                {hasDiscount(p) && <><s>{money(p.originalPrice)}</s><em>{discountPct(p)}% off</em></>}
                {!inStock(p) && <em className="oos">Out of stock</em>}
                {p.isNew && <em className="badge">New</em>}
                {p.bestseller && <em className="badge">Bestseller</em>}
              </span>
            </MaskSwap>
            <button type="button" className="btn btn-ink btn-sm cap-cta" onClick={() => open()}>View details</button>
          </div>
        </div>
        <button type="button" className="arc-nav next" onClick={() => stepBy(1)} aria-label="Next candle" disabled={N < 2}><IconNext /></button>
      </div>

      <div className="arc-tl">
        {!reduce && N > 1 && (
          <button type="button" className="tl-pp" onClick={() => setPlaying(v => !v)} aria-pressed={!playing} aria-label={playing ? "Pause automatic browsing" : "Play automatic browsing"}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
        )}
        {N > 1 ? (
          <div className="tl-track" role="group" aria-label="Choose a candle">
            {list.map((q, i) => {
              const cur = i === active;
              return (
                <button key={q.id} type="button" className={"tk" + (cur ? " on" : "")} data-n={displayName(q)} aria-label={`${displayName(q)}, ${i + 1} of ${N}`} aria-current={cur ? "true" : undefined} onClick={() => goTo(i)} style={{ ["--c" as any]: familyOf(q).deep }}>
                  <i>{cur && !reduce && playing && (
                    <b key={p.id + dir} className="tk-fill" style={{ animationDuration: AUTOPLAY_MS + "ms", animationPlayState: running ? "running" : "paused" }} onAnimationEnd={() => stepBy(1, false)} />
                  )}</i>
                </button>
              );
            })}
            <span className="tl-dot" ref={dotRef} aria-hidden="true" />
          </div>
        ) : <span className="tl-track single" />}
        <span className="tl-count" aria-hidden="true"><b>{pad(active + 1)}</b><span> / {pad(N)}</span></span>
      </div>

      <div className="arc-hint" aria-hidden="true">{fine ? "Drag, or use ← →" : "Swipe to explore"}</div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{`Candle ${active + 1} of ${N}: ${displayName(p)}, ${familyLabel(p)}.`}</div>

      {fine && (
        <div className={"arc-cursor" + (dragging ? " is-drag" : "")} ref={curRef} data-state="drag" aria-hidden="true">
          <span className="c-ring" /><span className="c-dot" />
          <span className="c-lbl l-drag">Drag</span><span className="c-lbl l-view">View</span><span className="c-lbl l-go">Go</span>
        </div>
      )}
    </section>
  );
});
export default ScentArchive;
