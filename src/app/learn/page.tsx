import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Aprender" };

export default function LearnPage() {
  return <div className="pb-10 pt-4 sm:pt-8 lg:pt-10"><header className="mb-7"><p className="text-sm font-bold text-[var(--nazumo-purple)]">Biblioteca</p><h1 className="mt-2 text-5xl font-extrabold tracking-[-.06em] sm:text-7xl">Aprender</h1><p className="mt-3 max-w-xl text-[var(--muted)]">Tu recorrido por los tres sistemas de escritura japonesa.</p></header><div className="grid gap-4 lg:grid-cols-3"><SystemCard href="/hiragana" name="Hiragana" subtitle="La base de todo" character="あ" tone="purple" /><SystemCard name="Katakana" subtitle="Próximamente" character="ア" tone="lavender" image="/brand/nazumo-katakana.png" /><SystemCard name="Kanji" subtitle="Próximamente" character="日" tone="pink" image="/brand/nazumo-kanji.png" /></div><Link href="/practice/write" className="mt-4 flex min-h-28 items-center justify-between rounded-[var(--radius-card)] bg-[var(--nazumo-lime)] px-6 font-extrabold transition hover:-translate-y-0.5 active:scale-[.99]"><span><span className="block text-xs uppercase tracking-[.12em] opacity-55">Laboratorio</span><span className="mt-1 block text-xl">Practicar escritura</span></span><span lang="ja" className="font-japanese text-5xl">書</span></Link></div>;
}

function SystemCard({ href, name, subtitle, character, tone, image }: { href?: string; name: string; subtitle: string; character: string; tone: "purple" | "lavender" | "pink"; image?: string }) {
  const colors = { purple: "bg-[var(--nazumo-purple)] text-white", lavender: "bg-[var(--nazumo-lavender)]", pink: "bg-[var(--nazumo-pink)]" };
  const content = <><div className="relative z-10"><p className="text-sm font-bold opacity-65">{subtitle}</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.05em]">{name}</h2></div>{image ? <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover opacity-90" /> : <span lang="ja" className="font-japanese absolute -bottom-9 right-3 text-[13rem] font-bold leading-none text-[var(--nazumo-lime)]">{character}</span>}<span className="relative z-10 mt-auto text-sm font-bold">{href ? "Explorar →" : "En preparación"}</span></>;
  const classes = `relative flex min-h-[22rem] flex-col overflow-hidden rounded-[var(--radius-hero)] p-6 transition ${colors[tone]} ${href ? "hover:-translate-y-1 active:scale-[.99]" : "opacity-80"}`;
  return href ? <Link href={href} className={classes}>{content}</Link> : <article className={classes}>{content}</article>;
}
