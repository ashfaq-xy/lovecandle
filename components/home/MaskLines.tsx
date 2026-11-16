/** Heading split into lines; each line slides up through its own mask when the parent <Reveal> enters view. */
export default function MaskLines({ lines, className = "", start = 0 }: { lines: string[]; className?: string; start?: number }) {
  return (
    <span className={"mlines " + className}>
      {lines.map((l, i) => <span key={i} className="mline"><span style={{ ["--i" as any]: i + start }}>{l}</span></span>)}
    </span>
  );
}
