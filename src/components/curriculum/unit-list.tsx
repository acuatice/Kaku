"use client";

import Link from "next/link";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { Badge } from "@/components/ui/pill";

export function UnitList() {
  const snapshot = useLearningSnapshot();
  const completed = snapshot?.completedUnitIds ?? [];
  const currentUnitId = snapshot?.currentUnitId ?? 1;

  return (
    <div className="space-y-3">
      {hiraganaCurriculum.map((unit) => {
        const isCompleted = completed.includes(unit.id);
        const isCurrent = unit.id === currentUnitId;
        const isAccessible = isCompleted || unit.id <= currentUnitId;
        const status = isCompleted ? "Aprendida" : isCurrent ? "Continuar" : "Bloqueada";
        const content = <><div className="flex items-center justify-between gap-4"><span className="text-sm font-bold">Unidad {unit.id}</span><Badge tone={isCompleted ? "success" : isCurrent ? "yuzu" : "neutral"}>{isCompleted ? "✓ " : ""}{status}</Badge></div><p className={`font-japanese mt-7 text-4xl tracking-[0.1em] sm:text-5xl ${isAccessible ? "text-[var(--sumi)]" : "text-neutral-300"}`}>{unit.characters.map((kana) => kana.character).join("")}</p><p className="mt-4 text-sm text-[var(--muted)]">{unit.title}</p></>;
        const className = `block rounded-[var(--radius-card)] border p-5 transition sm:p-6 ${isCurrent ? "border-[var(--electric-violet)] bg-[var(--kaku-purple)] text-white shadow-[0_18px_50px_rgba(55,21,143,.16)] [&_p]:text-white/70" : "border-[var(--border)] bg-white"} ${isAccessible ? "hover:-translate-y-0.5 hover:border-[var(--electric-violet)]" : "cursor-not-allowed opacity-60"}`;
        return isAccessible ? <Link key={unit.id} href={`/hiragana/unit/${unit.id}`} className={className}>{content}</Link> : <article key={unit.id} className={className}>{content}</article>;
      })}
    </div>
  );
}
