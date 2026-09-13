"use client";

import Image from "next/image";
import Link from "next/link";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function ProgressContent() {
  const snapshot = useLearningSnapshot();
  const learned = snapshot?.learnedIds.length ?? 0;
  const completed = snapshot?.completedUnitIds ?? [];
  const currentUnit = snapshot?.currentUnitId ?? 1;
  const accuracy = snapshot?.recentAccuracy;
  const sessionCount = snapshot?.sessionCount ?? 0;

  return <div className="-mx-4 min-h-[calc(100dvh-5rem)] overflow-hidden rounded-[0_0_2.2rem_2.2rem] nazumo-purple-gradient px-4 pb-7 pt-5 text-white min-[375px]:-mx-5 min-[375px]:px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
    <header className="mb-5"><h1 className="text-[2rem] font-extrabold tracking-[-.055em] sm:text-5xl">Tu progreso</h1><p className="mt-1 text-sm text-white/75">Cada trazo cuenta.</p></header>

    <section className="relative min-h-[7.2rem] overflow-hidden rounded-[1.45rem] bg-[var(--nazumo-lime)] p-5 text-[var(--sumi)]"><div className="relative z-10 max-w-[57%]"><h2 className="text-xl font-extrabold tracking-[-.035em]">Sigue así</h2><p className="mt-1 text-xs leading-relaxed">{learned === 0 ? "Estás construyendo una base sólida." : `Ya dominas ${learned} hiragana.`}</p></div><Image src="/brand/nazumo-character.png" alt="Personaje de Nazumo" width={1024} height={1024} loading="eager" className="absolute -bottom-36 -right-28 h-80 w-80 object-contain mix-blend-multiply" /></section>

    <section className="mt-3 rounded-[1.45rem] bg-white p-4 text-[var(--sumi)] min-[375px]:p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold tracking-[-.03em]">Tu aprendizaje</h2><p className="mt-0.5 text-[11px] text-[var(--muted)]">Unidades de hiragana</p></div><p className="text-sm font-bold text-[var(--nazumo-purple)]">{completed.length} / 10</p></div><div className="mt-4 flex h-[6.2rem] items-end gap-2" aria-label={`${completed.length} de 10 unidades aprendidas`}>{hiraganaCurriculum.map((unit) => { const done = completed.includes(unit.id); const active = unit.id === currentUnit; return <div key={unit.id} className="flex h-full flex-1 flex-col justify-end gap-1.5"><div className={`w-full rounded-t-lg rounded-b-sm ${done ? "bg-[var(--nazumo-purple)]" : active ? "bg-[var(--electric-violet)]" : "bg-[var(--nazumo-lavender)]"}`} style={{ height: `${30 + unit.id * 5}%`, opacity: done || active ? 1 : .7 }} /><span className="text-center text-[8px] font-bold text-[var(--muted)]">{unit.id}</span></div>; })}</div></section>

    <div className="mt-3 grid grid-cols-2 gap-3"><Metric value={String(learned)} label="caracteres aprendidos" icon="あ" /><Metric value={String(sessionCount)} label="sesiones completadas" icon="◷" /></div>

    <Link href="/practice" className="relative mt-3 flex min-h-[6.2rem] items-center justify-between overflow-hidden rounded-[1.45rem] bg-[var(--nazumo-pink)] p-5 text-[var(--sumi)] transition active:scale-[.99]"><div className="relative z-10"><p className="text-lg font-extrabold">Explora más</p><p className="mt-1 text-xs">{accuracy == null ? "Haz tu primera práctica." : `${accuracy}% de precisión reciente.`}</p></div><span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[var(--sumi)] text-white">›</span><span className="absolute -right-3 top-5 size-16 rotate-12 rounded-2xl bg-[var(--electric-violet)]" /><span className="absolute right-8 top-2 size-8 rotate-12 rounded-lg bg-[var(--nazumo-lime)]" /></Link>
  </div>;
}

function Metric({ value, label, icon }: { value: string; label: string; icon: string }) { return <article className="flex min-h-[5.75rem] items-center gap-3 rounded-[1.35rem] bg-white p-3 text-[var(--sumi)]"><span className="font-japanese flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg text-[var(--nazumo-purple)]">{icon}</span><span><strong className="block text-xl font-extrabold leading-none">{value}</strong><span className="mt-1 block text-[10px] leading-tight text-[var(--muted)]">{label}</span></span></article>; }
