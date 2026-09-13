import Link from "next/link";
import { KanaCollection } from "@/components/kana/kana-collection";

export const metadata = { title: "Colección de hiragana" };

export default function HiraganaCollectionPage() { return <div className="mx-auto max-w-3xl pb-12 pt-4 sm:pt-8"><Link href="/hiragana" className="mb-7 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] hover:text-[var(--sumi)]">← Volver a las unidades</Link><KanaCollection /></div>; }
