import { UnitList } from "@/components/curriculum/unit-list";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Hiragana" };

export default function HiraganaPage() {
  return (
    <div className="mx-auto max-w-3xl pb-10 pt-10 sm:pt-16">
      <header className="mb-12 border-b border-[var(--border)] pb-10 sm:mb-14 sm:pb-12">
        <p className="text-sm font-bold text-[var(--kaku-purple)]">Curso 01</p>
        <div className="mt-4 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-5xl font-extrabold tracking-[-0.065em] sm:text-7xl">Hiragana</h1>
            <p className="font-japanese mt-3 text-xl text-[var(--muted)]">ひらがな</p>
          </div>
          <ButtonLink href="/hiragana/collection" variant="neutral">Ver colección</ButtonLink>
        </div>
      </header>

      <section aria-labelledby="hiragana-units-title">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div><p className="text-sm font-bold text-[var(--kaku-purple)]">Recorrido de aprendizaje</p><h2 id="hiragana-units-title" className="mt-2 text-2xl font-extrabold tracking-[-0.045em] sm:text-3xl">Diez unidades</h2></div>
          <p className="max-w-48 text-right text-sm leading-relaxed text-[var(--muted)]">Aprende un grupo natural de kana cada vez.</p>
        </div>
        <UnitList />
      </section>
    </div>
  );
}
