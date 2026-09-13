"use client";

import Link from "next/link";
import { HeroCard, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionTitle } from "@/components/ui/section-title";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function DashboardContent() {
  const snapshot = useLearningSnapshot();
  const currentUnit = hiraganaCurriculum.find((unit) => unit.id === (snapshot?.currentUnitId ?? 1)) ?? hiraganaCurriculum[0];
  const learned = snapshot?.learnedIds.length ?? 0;
  const reviewPool = snapshot ? (snapshot.reviewIds.length > 0 ? snapshot.reviewIds : snapshot.learnedIds.length > 0 ? snapshot.learnedIds : snapshot.introducedIds) : [];
  const reviewCount = Math.min(10, reviewPool.length);
  const heroCharacter = currentUnit.characters[0]?.character ?? "あ";

  return <div className="pb-10 pt-4 sm:pt-8 lg:pt-12">
    <header className="mb-6"><p className="font-japanese text-2xl font-bold">おはよう</p><p className="mt-1 text-sm text-[var(--muted)]">¿Preparado para un trazo más?</p></header>

    <HeroCard className="relative min-h-[24rem] overflow-hidden p-7 sm:min-h-[28rem] sm:p-10">
      <div className="relative z-10 flex h-full min-h-[20rem] max-w-sm flex-col justify-between sm:min-h-[23rem]">
        <div><p className="text-sm font-semibold text-white/70">Hiragana</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em]">{learned} / 46 aprendidos</h1><ProgressBar value={learned} max={46} label="Dominio de hiragana" className="mt-5 max-w-56 text-[var(--yuzu)]" /></div>
        <Link href={`/hiragana/unit/${currentUnit.id}`} className="inline-flex min-h-14 w-fit items-center rounded-[var(--radius-button)] bg-[var(--yuzu)] px-6 text-sm font-bold text-[var(--sumi)] transition active:scale-[.98]">Continuar · {currentUnit.title}</Link>
      </div>
      <span lang="ja" className="font-japanese absolute -bottom-10 -right-4 text-[18rem] font-bold leading-none text-[var(--yuzu)] sm:-right-2 sm:text-[24rem]">{heroCharacter}</span>
    </HeroCard>

    <section className="mt-9"><SectionTitle>Acciones rápidas</SectionTitle><div className="grid grid-cols-2 gap-3"><Link href="/practice" className="flex min-h-40 flex-col justify-between rounded-[var(--radius-card)] bg-[var(--yuzu)] p-5 text-[var(--sumi)] transition active:scale-[.98]"><span className="text-sm font-semibold">Práctica rápida</span><span className="text-2xl font-bold">5 min</span></Link><Link href={reviewCount > 0 ? "/practice?review=1" : `/hiragana/unit/${currentUnit.id}`} className="flex min-h-40 flex-col justify-between rounded-[var(--radius-card)] bg-[var(--sora)] p-5 text-[var(--sumi)] transition active:scale-[.98]"><span className="text-sm font-semibold">Repaso</span><span className="text-2xl font-bold">{reviewCount} caracteres</span></Link></div></section>

    <section className="mt-9"><SectionTitle action={<Link href="/progress" className="text-sm font-semibold text-[var(--kaku-purple)]">Ver todo</Link>}>Tu progreso</SectionTitle><Card className="grid grid-cols-3 gap-2 p-5"><Metric value={String(learned)} label="Aprendidos" /><Metric value={snapshot?.recentAccuracy == null ? "—" : `${snapshot.recentAccuracy}%`} label="Precisión" /><Metric value={String(snapshot?.streak ?? 0)} label="Días de racha" /></Card></section>
  </div>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><p className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">{label}</p></div>;
}
