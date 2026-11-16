"use client";
import { useCart } from "@/lib/cart";
import { IconCheck, IconClose } from "./Icons";

/** Polite live region for cart / wishlist feedback. Errors use role="alert". */
export default function Toast() {
  const { toast, dismissToast, setOpen } = useCart();
  return (
    <div className="toast-wrap">
      <div role="status" aria-live="polite" className="sr-only">{toast && toast.kind === "ok" ? toast.text : ""}</div>
      <div role="alert" className="sr-only">{toast && toast.kind === "error" ? toast.text : ""}</div>
      {toast && (
        <div key={toast.key} className={"toast " + toast.kind} aria-hidden="true">
          <span className="toast-ic">{toast.kind === "ok" ? <IconCheck /> : "!"}</span>
          <span className="toast-tx">{toast.text}</span>
          {toast.bag && <button type="button" className="toast-act" tabIndex={-1} onClick={() => { dismissToast(); setOpen(true); }}>View bag</button>}
          <button type="button" className="toast-x" tabIndex={-1} onClick={dismissToast} aria-label="Dismiss"><IconClose width={16} height={16} /></button>
        </div>
      )}
    </div>
  );
}
