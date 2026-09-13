"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function HiraganaCourseHero() {
  const snapshot = useLearningSnapshot();
  const learned = snapshot?.learnedIds.length ?? 0;
  const unit = snapshot?.currentUnitId ?? 1;
  return <div className="relative z-10 mt-16 rounded-[1.75rem] bg-white p-5 shadow-[0_18px_45px_rgba(73,35,143,.12)] sm:mt-24 sm:flex sm:items-end sm:justify-between sm:gap-8 sm:p-7"><div className="flex-1"><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--nazumo-purple)]">{learned === 0 ? "Empieza tu viaje" : "Sigue aprendiendo"}</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.04em]">Unidad {unit}</h2><p className="mt-1 text-sm text-[var(--muted)]">{learned} de 46 aprendidos</p><ProgressBar value={learned} max={46} label="Progreso de hiragana" className="mt-4" /></div><Link href={`/hiragana/unit/${unit}`} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--sumi)] px-6 text-sm font-bold text-white sm:mt-0">Continuar</Link></div>;
}
