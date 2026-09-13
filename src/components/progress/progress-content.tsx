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
  return <div className="-mx-4 min-h-[calc(100dvh-5rem)] overflow-hidden rounded-[0_0_2.5rem_2.5rem] nazumo-purple-gradient px-4 pb-10 pt-6 text-white min-[375px]:-mx-5 min-[375px]:px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
    <header><p className="text-sm font-bold text-[var(--nazumo-lime)]">Tu recorrido</p><h1 className="mt-2 text-5xl font-extrabold tracking-[-.06em] sm:text-7xl">Progreso</h1></header>
    <section className="relative mt-7 min-h-52 overflow-hidden rounded-[var(--radius-card)] bg-[var(--nazumo-lime)] p-6 text-[var(--sumi)] sm:min-h-60 sm:p-8"><div className="relative z-10 max-w-[55%]"><p className="text-sm font-bold">Sigue así</p><p className="mt-2 text-3xl font-extrabold leading-none tracking-[-.05em]">Cada trazo cuenta.</p><p className="mt-4 text-sm text-[var(--sumi)]/60">{learned} de 46 caracteres aprendidos.</p></div><Image src="/brand/nazumo-character.png" alt="Personaje de Nazumo" width={1024} height={1024} loading="eager" className="absolute -bottom-32 -right-28 h-96 w-96 object-contain mix-blend-multiply sm:-bottom-40 sm:-right-16 sm:h-[30rem] sm:w-[30rem]" /></section>
    <section className="mt-4 rounded-[var(--radius-card)] bg-white p-5 text-[var(--sumi)] sm:p-7"><div className="flex items-end justify-between"><div><p className="text-sm font-extrabold">Tus unidades</p><p className="mt-1 text-xs text-[var(--muted)]">Hiragana</p></div><p className="text-2xl font-extrabold">{completed.length}<span className="text-sm text-[var(--muted)]"> / 10</span></p></div><div className="mt-7 flex h-32 items-end gap-2" aria-label={`${completed.length} de 10 unidades aprendidas`}>{hiraganaCurriculum.map((unit) => { const done = completed.includes(unit.id); const active = unit.id === currentUnit; return <div key={unit.id} className="flex h-full flex-1 flex-col justify-end gap-2"><div className={`w-full rounded-full ${done ? "bg-[var(--nazumo-purple)]" : active ? "bg-[var(--nazumo-lavender)]" : "bg-[#efedf2]"}`} style={{height: `${24 + unit.id * 7}%`}} /><span className="text-center text-[9px] font-bold text-[var(--muted)]">{unit.id}</span></div>; })}</div></section>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><Stat value={snapshot?.recentAccuracy == null ? "—" : `${snapshot.recentAccuracy}%`} label="Precisión reciente" /><Stat value={String(snapshot?.streak ?? 0)} label="Días de racha" /><Stat value={String(snapshot?.sessionCount ?? 0)} label="Sesiones" className="col-span-2 sm:col-span-1" /></div>
    <Link href="/practice" className="mt-4 flex min-h-20 items-center justify-between rounded-[var(--radius-card)] bg-[var(--nazumo-pink)] px-6 font-extrabold text-[var(--sumi)]"><span>Seguir practicando</span><span aria-hidden="true">→</span></Link>
  </div>;
}

function Stat({ value, label, className = "" }: { value: string; label: string; className?: string }) { return <article className={`rounded-[var(--radius-card)] bg-white/10 p-5 ${className}`}><p className="text-3xl font-extrabold tracking-[-.05em]">{value}</p><p className="mt-1 text-xs text-white/65">{label}</p></article>; }
