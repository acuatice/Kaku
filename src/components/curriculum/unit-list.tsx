"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function UnitList() {
  const snapshot = useLearningSnapshot();
  const completed = snapshot?.completedUnitIds ?? [];
  const currentUnitId = snapshot?.currentUnitId ?? 1;
  return <div className="space-y-3">{hiraganaCurriculum.map((unit) => {
    const isCompleted = completed.includes(unit.id);
    const isCurrent = unit.id === currentUnitId;
    const isAccessible = isCompleted || unit.id <= currentUnitId;
    const row = <><span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${isCompleted ? "bg-[var(--nazumo-lime)]" : isCurrent ? "bg-[var(--nazumo-purple)] text-white" : "bg-[var(--nazumo-lavender)] text-[var(--nazumo-purple)]"}`}>{isCompleted ? "✓" : unit.id}</span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">Unidad {unit.id}</span><span lang="ja" className={`font-japanese mt-0.5 block truncate text-xl tracking-[.12em] ${isAccessible ? "text-[var(--sumi)]/65" : "text-[var(--muted)]/50"}`}>{unit.characters.map((kana) => kana.character).join("")}</span></span><span className="hidden text-xs font-semibold text-[var(--muted)] min-[375px]:block">{isCompleted ? "Aprendida" : isCurrent ? "Continuar" : "Bloqueada"}</span>{isAccessible ? <Icon name="arrow" className="size-5 text-[var(--nazumo-purple)]" /> : <span aria-label="Bloqueada" className="text-lg text-[var(--muted)]">·</span>}</>;
    const classes = `flex min-h-[5.25rem] items-center gap-3 rounded-[1.45rem] border p-3.5 transition sm:px-5 ${isCurrent ? "border-[var(--nazumo-purple)] bg-[#f1ebff] nazumo-shadow" : "border-black/[.04] bg-white"} ${isAccessible ? "hover:-translate-y-0.5 hover:border-[var(--nazumo-lavender)] active:scale-[.99]" : "opacity-55"}`;
    return isAccessible ? <Link key={unit.id} href={`/hiragana/unit/${unit.id}`} className={classes}>{row}</Link> : <article key={unit.id} className={classes}>{row}</article>;
  })}</div>;
}
