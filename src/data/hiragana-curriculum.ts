import { hiraganaCharacters } from "@/data/hiragana";
import type { KanaCharacter } from "@/lib/types";

export interface HiraganaUnit {
  id: number;
  group: string;
  title: string;
  characters: readonly KanaCharacter[];
}

const unitGroups = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"] as const;

export const hiraganaCurriculum: readonly HiraganaUnit[] = unitGroups.map((group, index) => ({
  id: index + 1,
  group,
  title: `Unidad ${index + 1}`,
  characters: hiraganaCharacters.filter((kana) => group === "wa" ? kana.group === "wa" || kana.group === "n" : kana.group === group),
}));

export function getHiraganaUnit(unitId: number): HiraganaUnit | undefined {
  return hiraganaCurriculum.find((unit) => unit.id === unitId);
}
