import { occasions } from "@/data/content";
import { wa } from "@/data/config";

/** Each occasion opens a prefilled WhatsApp enquiry. */
export default function Occasions({ dark = false }: { dark?: boolean }) {
  return (
    <ul className={"occ" + (dark ? " occ-dark" : "")}>
      {occasions.map((o, i) => (
        <li key={o.name} className="rv-i" style={{ ["--i" as any]: i }}>
          <a href={wa(`Hi LOVE CANDLE! I'd like to enquire about a ${o.name.toLowerCase()} gift.`)} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${o.name.toLowerCase()} gifting on WhatsApp`}>
            <span className="occ-n">{o.name}</span>
            <span className="occ-l">{o.line}</span>
            <span className="occ-go" aria-hidden="true">Enquire</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
