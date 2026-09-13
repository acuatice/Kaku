import type { KanaCharacter, KanaRow, LearningState } from "@/lib/types";

export const KANA_GROUP_ORDER = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "n"] as const;

export const learningStateLabels: Record<LearningState, string> = {
  "not-learned": "No aprendido",
  learning: "Aprendiendo",
  learned: "Aprendido",
  "needs-review": "Necesita repaso",
};

export const learningStateStyles: Record<LearningState, string> = {
  "not-learned": "border-[var(--border)] bg-white text-neutral-950",
  learning: "border-amber-300 bg-amber-50 text-neutral-950",
  learned: "border-emerald-300 bg-emerald-50 text-neutral-950",
  "needs-review": "border-[var(--accent)] bg-[var(--accent-soft)] text-neutral-950",
};

export function getKanaRows(characters: readonly KanaCharacter[]): KanaRow[] {
  return KANA_GROUP_ORDER.map((group) => ({
    group,
    characters: characters.filter((character) => character.group === group),
  }));
}

export function getInitialLearningState(): LearningState {
  return "not-learned";
}
