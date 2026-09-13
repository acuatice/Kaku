import Link from "next/link";
import { Badge } from "@/components/ui/pill";

export const metadata = { title: "Aprender" };

export default function LearnPage() {
  return <div className="pb-10 pt-4 sm:pt-8 lg:pt-12"><header className="mb-8"><p className="text-sm font-semibold text-[var(--kaku-purple)]">Biblioteca</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">Aprender</h1><p className="mt-3 max-w-xl text-[var(--muted)]">Construye tu japonés, un sistema de escritura cada vez.</p></header><div className="grid gap-4 lg:grid-cols-3"><SystemCard href="/hiragana" name="Hiragana" character="あ" color="bg-[var(--kaku-purple)] text-white" status="Empezar" /><SystemCard name="Katakana" character="ア" color="bg-[var(--sora)] text-[var(--sumi)]" status="Próximamente" disabled /><SystemCard name="Kanji" character="日" color="bg-[var(--momo)] text-[var(--sumi)]" status="Próximamente" disabled /></div><Link href="/practice/write" className="mt-4 flex min-h-24 items-center justify-between rounded-[var(--radius-card)] bg-[var(--yuzu)] px-6 font-bold text-[var(--sumi)] transition active:scale-[.99]"><span><span className="block text-xs font-semibold uppercase tracking-[.12em] opacity-60">Laboratorio de escritura</span><span className="mt-1 block text-xl">Practicar en el lienzo</span></span><span lang="ja" className="font-japanese text-5xl">書</span></Link></div>;
}

function SystemCard({ href, name, character, color, status, disabled = false }: { href?: string; name: string; character: string; color: string; status: string; disabled?: boolean }) {
  const content = <><div className="flex items-start justify-between"><span className="text-sm font-bold">{name}</span><Badge tone={disabled ? "neutral" : "yuzu"}>{status}</Badge></div><span lang="ja" className="font-japanese self-end text-[10rem] font-bold leading-none sm:text-[12rem]">{character}</span></>;
  const classes = `flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[var(--radius-hero)] p-6 transition ${color} ${disabled ? "opacity-75" : "active:scale-[.99] lg:hover:-translate-y-1"}`;
  return href ? <Link href={href} className={classes}>{content}</Link> : <article className={classes}>{content}</article>;
}
