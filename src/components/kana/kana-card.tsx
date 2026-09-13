import type { KanaCharacter, LearningState } from "@/lib/types";
import { learningStateLabels, learningStateStyles } from "@/lib/kana";

interface KanaCardProps {
  kana: KanaCharacter;
  state: LearningState;
  onOpen: (kana: KanaCharacter) => void;
}

export function KanaCard({ kana, state, onOpen }: KanaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(kana)}
      aria-label={`Abrir ${kana.character}, ${kana.romaji}. Estado: ${learningStateLabels[state]}`}
      className={`group aspect-square min-h-16 w-full touch-manipulation rounded-2xl border p-2 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-[0_12px_30px_rgba(0,0,0,.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:translate-y-0 ${learningStateStyles[state]}`}
    >
      <span className="text-[clamp(2rem,8vw,4rem)] leading-none transition-transform duration-200 group-hover:scale-[1.03] sm:text-5xl">
        {kana.character}
      </span>
    </button>
  );
}
