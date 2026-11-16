"use client";
import { useState } from "react";
import { noteGroups, type Product } from "@/lib/products";

/** Top / heart / base notes as a small interactive ladder. Renders nothing unless notes were supplied. */
export default function NotesLadder({ p, tone }: { p: Product; tone?: string }) {
  const g = noteGroups(p);
  const [a, setA] = useState(0);
  if (!g.length) return null;
  return (
    <div className="nl" style={tone ? ({ ["--tone" as any]: tone }) : undefined}>
      <h3 className="nl-h">Scent notes</h3>
      <div className="nl-body">
        {g.length > 1 && (
          <div className="nl-rail" aria-hidden="true">
            {g.map((x, i) => <span key={x.label} className={"nl-dot" + (a === i ? " on" : "")} style={{ top: (i / (g.length - 1)) * 100 + "%" }} />)}
          </div>
        )}
        <ul>
          {g.map((x, i) => (
            <li key={x.label}>
              <button type="button" className={"nl-row" + (a === i ? " on" : "")} aria-pressed={a === i} onClick={() => setA(i)} onMouseEnter={() => setA(i)}>
                <span className="nl-l">{x.label}{x.hint && <small>{x.hint}</small>}</span>
                <span className="nl-i">{x.items.join(", ")}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
