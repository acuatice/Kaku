"use client";

import Link from "next/link";
import { PracticeSession } from "@/components/practice/practice-session";
import { hiraganaCharacters } from "@/data/hiragana";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function ReviewPractice({ reviewOnly = false }: { reviewOnly?: boolean }) {
  const snapshot = useLearningSnapshot();
  if (!snapshot) return <div className="text-sm text-[var(--muted)]">Preparando repaso…</div>;
  const reviewPool = reviewOnly && snapshot.reviewIds.length > 0 ? snapshot.reviewIds : snapshot.introducedIds;
  const studied = hiraganaCharacters.filter((kana) => reviewPool.includes(`hiragana:${kana.character}`)).slice(0, 10);
  if (studied.length === 0) return <section className="max-w-lg text-center"><h1 className="text-4xl font-extrabold tracking-[-0.04em]">Conoce tus primeros caracteres</h1><p className="mt-4 text-[var(--muted)]">La práctica solo utiliza kana que ya hayas estudiado.</p><Link href="/hiragana/unit/1" className="mt-8 inline-flex min-h-13 items-center rounded-[var(--radius-button)] bg-[var(--kaku-purple)] px-6 text-sm font-bold text-white">Empezar hiragana</Link></section>;
  return <PracticeSession characters={studied} sessionSize={Math.min(10, studied.length)} />;
}
