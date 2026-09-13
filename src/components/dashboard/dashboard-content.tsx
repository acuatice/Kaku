"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function DashboardContent() {
  const snapshot = useLearningSnapshot();
  const currentUnit = hiraganaCurriculum.find((unit) => unit.id === (snapshot?.currentUnitId ?? 1)) ?? hiraganaCurriculum[0];
  const learned = snapshot?.learnedIds.length ?? 0;
  const reviewPool = snapshot ? (snapshot.reviewIds.length ? snapshot.reviewIds : snapshot.learnedIds.length ? snapshot.learnedIds : snapshot.introducedIds) : [];
  const reviewCount = Math.min(10, reviewPool.length);
  const accuracy = snapshot?.recentAccuracy;

  return <div className="pb-8 pt-4 sm:pt-8 lg:pt-10">
    <header className="mb-6 max-w-2xl sm:mb-8"><p className="text-sm font-bold text-[var(--nazumo-purple)]">¡Hola!</p><h1 className="mt-2 text-[2rem] font-extrabold leading-[1.05] tracking-[-.055em] min-[375px]:text-[2.35rem] sm:text-5xl">Hoy es un buen día<br />para aprender japonés.</h1></header>
    <section className="relative min-h-[25rem] overflow-hidden rounded-[var(--radius-hero)] bg-[var(--nazumo-lavender)] nazumo-shadow sm:min-h-[27rem] lg:min-h-[30rem]">
      <Image src="/brand/nazumo-hero.png" alt="El personaje de Nazumo entre formas inspiradas en la escritura japonesa" fill priority sizes="(max-width: 768px) 100vw, 1200px" className="object-cover object-[67%_center] lg:object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#e8e0ff] via-[#e8e0ff]/85 to-transparent sm:via-[#e8e0ff]/55" />
      <div className="relative z-10 flex min-h-[25rem] max-w-[18rem] flex-col justify-between p-6 min-[375px]:p-7 sm:min-h-[27rem] sm:max-w-sm sm:p-10 lg:min-h-[30rem]">
        <div><p className="text-sm font-bold text-[var(--nazumo-purple)]">Tu siguiente paso</p><h2 className="mt-3 text-3xl font-extrabold leading-none tracking-[-.05em] sm:text-5xl">{learned === 0 ? "Tu primer trazo" : `Unidad ${currentUnit.id}`}</h2><p className="mt-4 text-sm font-medium leading-relaxed text-[var(--sumi)]/65">{learned} de 46 hiragana aprendidos</p></div>
        <Link href={`/hiragana/unit/${currentUnit.id}`} className="inline-flex min-h-14 w-fit items-center gap-4 rounded-full bg-[var(--sumi)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 active:scale-[.98]">Empezar <Icon name="arrow" className="size-4" /></Link>
      </div>
    </section>
    <section className="mt-10"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Explora</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-.045em]">Tu aprendizaje</h2></div><Link href="/learn" className="text-sm font-bold text-[var(--nazumo-purple)]">Ver todo</Link></div><div className="grid gap-3 sm:grid-cols-3"><ExploreCard href="/hiragana" title="Hiragana" subtitle={`${learned} / 46 aprendidos`} tone="purple" character="あ" /><ExploreCard title="Katakana" subtitle="Próximamente" tone="lavender" character="ア" /><ExploreCard title="Kanji" subtitle="Próximamente" tone="pink" character="日" /></div></section>
    <section className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]"><Link href={reviewCount ? "/practice?review=1" : `/hiragana/unit/${currentUnit.id}`} className="flex min-h-32 items-center justify-between rounded-[var(--radius-card)] bg-[var(--nazumo-lime)] p-6 transition active:scale-[.99]"><div><p className="text-sm font-bold">Repaso de hoy</p><p className="mt-2 text-2xl font-extrabold tracking-[-.04em]">{reviewCount} caracteres</p></div><span className="flex size-12 items-center justify-center rounded-full bg-white/70"><Icon name="arrow" className="size-5" /></span></Link><div className="grid grid-cols-2 gap-3 sm:grid-cols-1"><Metric label="Precisión reciente" value={accuracy == null ? "—" : `${accuracy}%`} /><Metric label="Racha" value={`${snapshot?.streak ?? 0} días`} /></div></section>
  </div>;
}

function ExploreCard({ href, title, subtitle, tone, character }: { href?: string; title: string; subtitle: string; tone: "purple" | "lavender" | "pink"; character: string }) {
  const colors = { purple: "bg-[var(--nazumo-purple)] text-white", lavender: "bg-[var(--nazumo-lavender)] text-[var(--sumi)]", pink: "bg-[var(--nazumo-pink)] text-[var(--sumi)]" };
  const content = <><div className="relative z-10"><p className="text-lg font-extrabold">{title}</p><p className={`mt-1 text-xs ${tone === "purple" ? "text-white/65" : "text-[var(--sumi)]/55"}`}>{subtitle}</p></div><span lang="ja" className="font-japanese absolute -bottom-5 right-3 text-[7.5rem] font-bold leading-none opacity-90">{character}</span></>;
  const className = `relative min-h-44 overflow-hidden rounded-[var(--radius-card)] p-5 transition ${colors[tone]} ${href ? "hover:-translate-y-0.5 active:scale-[.99]" : "opacity-80"}`;
  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}

function Metric({ label, value }: { label: string; value: string }) { return <article className="rounded-[var(--radius-card)] bg-white p-4 min-[375px]:p-5"><p className="text-xl font-extrabold tracking-[-.04em] min-[375px]:text-2xl">{value}</p><p className="mt-1 text-[11px] text-[var(--muted)]">{label}</p></article>; }
