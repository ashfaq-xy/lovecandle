"use client";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Text that changes by sliding through a mask (old line exits, new line enters),
 * rather than a plain opacity fade. `dir` = +1 when moving forward, -1 backward.
 */
export default function MaskSwap({ id, dir, delay = 0, className = "", children }: { id: string; dir: number; delay?: number; className?: string; children: ReactNode }) {
  const prev = useRef<{ id: string; node: ReactNode }>({ id, node: children });
  const [leaving, setLeaving] = useState<{ id: string; node: ReactNode; dir: number } | null>(null);
  useLayoutEffect(() => {
    if (prev.current.id !== id) setLeaving({ id: prev.current.id, node: prev.current.node, dir });
    prev.current = { id, node: children };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // safety net: never leave an exited line in the DOM, even if animationend is skipped
  useEffect(() => { if (!leaving) return; const t = setTimeout(() => setLeaving(null), 1400); return () => clearTimeout(t); }, [leaving]);
  const style = { ["--dir" as any]: dir, ["--d" as any]: delay + "ms" };
  return (
    <span className={"ms " + className} style={style}>
      {leaving && <span key={"o" + leaving.id} className="ms-out" aria-hidden="true" style={{ ["--dir" as any]: leaving.dir, ["--d" as any]: delay + "ms" }} onAnimationEnd={() => setLeaving(null)}>{leaving.node}</span>}
      <span key={id} className="ms-in">{children}</span>
    </span>
  );
}
