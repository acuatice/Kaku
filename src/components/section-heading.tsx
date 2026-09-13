import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, children, aside }: { eyebrow?: string; children: ReactNode; aside?: ReactNode }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{eyebrow}</p>}<h2 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{children}</h2></div>{aside}</div>;
}
