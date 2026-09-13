import type { ReactNode } from "react";

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${className}`}>{children}</span>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "error" | "yuzu" }) {
  const tones = { neutral: "bg-black/8 text-[var(--muted)]", success: "bg-[var(--success)]/20 text-[#126c4c]", error: "bg-[var(--error)]/15 text-[#a72924]", yuzu: "bg-[var(--yuzu)] text-[var(--sumi)]" };
  return <Pill className={tones[tone]}>{children}</Pill>;
}
