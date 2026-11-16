"use client";
import { useState } from "react";
import { site, wa } from "@/data/config";
import { occasions } from "@/data/content";

const ok = (v: string) => /^\S+@\S+\.\S+$/.test(v);
type M = { t: string; e: boolean } | null;
const Msg = ({ m }: { m: M }) => <div aria-live="polite">{m && <div className={"msg " + (m.e ? "err" : "ok")} role={m.e ? "alert" : undefined}>{m.t}</div>}</div>;

export function ContactForm() {
  const [m, setM] = useState<M>(null);
  return (
    <form noValidate onSubmit={e => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const n = String(f.get("n")).trim(), em = String(f.get("e")).trim(), msg = String(f.get("m")).trim();
      if (!n || !ok(em) || msg.length < 5) { setM({ t: "Please enter your name, a valid email and a message.", e: true }); return; }
      setM({ t: "Thank you. WhatsApp is opening with your message ready to send.", e: false });
      window.open(wa(`Hi LOVE CANDLE, I’m ${n} (${em}).\n${msg}`), "_blank", "noopener");
    }}>
      <label htmlFor="n">Name</label><input id="n" name="n" autoComplete="name" />
      <label htmlFor="e">Email</label><input id="e" name="e" type="email" autoComplete="email" />
      <label htmlFor="m">Message</label><textarea id="m" name="m" rows={5} />
      <button className="btn btn-primary" style={{ marginTop: 22 }}>Send via WhatsApp</button>
      <Msg m={m} />
    </form>
  );
}

export function Newsletter() {
  const [m, setM] = useState<M>(null);
  return (
    <>
      <form noValidate style={{ marginTop: 4 }} onSubmit={e => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get("email")).trim();
        if (!ok(v)) { setM({ t: "Please enter a valid email address.", e: true }); return; }
        setM({ t: "Almost there: your email app is opening so you can send your subscription request.", e: false });
        location.href = `mailto:${site.email}?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent(v)}`;
      }}>
        <input name="email" type="email" placeholder="Your email" aria-label="Email address" autoComplete="email" />
        <button className="btn btn-ink">Subscribe</button>
      </form>
      <Msg m={m} />
    </>
  );
}

/** Gift enquiry: builds a prefilled WhatsApp message. */
export function GiftForm() {
  const [m, setM] = useState<M>(null);
  return (
    <form noValidate onSubmit={e => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const occ = String(f.get("occ")), who = String(f.get("who")).trim(), budget = String(f.get("budget")).trim(), note = String(f.get("note")).trim();
      if (!occ) { setM({ t: "Please choose an occasion.", e: true }); return; }
      setM({ t: "Thank you. WhatsApp is opening with your enquiry ready to send.", e: false });
      window.open(wa(`Hi LOVE CANDLE! I'd like help with a ${occ.toLowerCase()} gift.${who ? `\nIt's for: ${who}` : ""}${budget ? `\nBudget: ${budget}` : ""}${note ? `\nNotes: ${note}` : ""}`), "_blank", "noopener");
    }}>
      <label htmlFor="occ">Occasion</label>
      <select id="occ" name="occ" defaultValue=""><option value="" disabled>Choose an occasion</option>{occasions.map(o => <option key={o.name}>{o.name}</option>)}<option>Something else</option></select>
      <label htmlFor="who">Who is it for? <span style={{ color: "var(--soft)", fontWeight: 400 }}>(optional)</span></label>
      <input id="who" name="who" placeholder="A friend, my sister, a new neighbour…" />
      <label htmlFor="budget">Budget <span style={{ color: "var(--soft)", fontWeight: 400 }}>(optional)</span></label>
      <input id="budget" name="budget" placeholder="For example ₹1,500" />
      <label htmlFor="note">Anything else? <span style={{ color: "var(--soft)", fontWeight: 400 }}>(optional)</span></label>
      <textarea id="note" name="note" rows={3} />
      <button className="btn btn-primary" style={{ marginTop: 22 }}>Enquire on WhatsApp</button>
      <Msg m={m} />
    </form>
  );
}
