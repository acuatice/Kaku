"use client";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function ProgressContent() {
  const snapshot = useLearningSnapshot();
  const learned = snapshot?.learnedIds.length ?? 0;
  return <div className="pb-10 pt-4 sm:pt-8 lg:pt-12"><header className="mb-8"><p className="text-sm font-semibold text-[var(--kaku-purple)]">Tu recorrido</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">Progreso</h1></header><Card className="bg-[var(--kaku-purple)] p-6 text-white sm:p-8"><p className="text-sm text-white/65">Caracteres aprendidos</p><p className="mt-3 text-6xl font-extrabold tracking-[-0.06em]">{learned}<span className="text-2xl text-white/50"> / 46</span></p><ProgressBar value={learned} max={46} label="Progreso de hiragana" className="mt-7 text-[var(--yuzu)]" /></Card><div className="mt-4 grid grid-cols-3 gap-3"><Stat value={String(snapshot?.sessionCount ?? 0)} label="Sesiones" /><Stat value={snapshot?.recentAccuracy == null ? "—" : `${snapshot.recentAccuracy}%`} label="Precisión" /><Stat value={String(snapshot?.streak ?? 0)} label="Racha" /></div><section className="mt-8 rounded-[var(--radius-card)] bg-white p-6"><div className="flex items-center justify-between"><div><p className="font-bold">Hiragana</p><p className="mt-1 text-sm text-[var(--muted)]">{learned} caracteres aprendidos</p></div><span lang="ja" className="font-japanese text-5xl font-bold text-[var(--kaku-purple)]">あ</span></div></section><section className="mt-3 rounded-[var(--radius-card)] bg-white/55 p-6 opacity-70"><div className="flex items-center justify-between"><div><p className="font-bold">Katakana</p><p className="mt-1 text-sm text-[var(--muted)]">Próximamente</p></div><span lang="ja" className="font-japanese text-5xl font-bold text-[var(--sora)]">ア</span></div></section></div>;
}

function Stat({ value, label }: { value: string; label: string }) { return <Card className="p-4"><p className="text-2xl font-bold tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">{label}</p></Card>; }
