import { CharacterCard, type CharacterVisualState } from "@/components/kana/character-card";
import type { KanaCharacter, KanaRow } from "@/lib/types";

export function CharacterGrid({ rows, stateFor, onSelect }: { rows: readonly KanaRow[]; stateFor: (kana: KanaCharacter) => CharacterVisualState; onSelect: (kana: KanaCharacter) => void }) {
  return <div className="space-y-2.5 sm:space-y-3">{rows.map((row) => <div key={row.group} className="grid grid-cols-5 gap-2.5 sm:gap-3">{positionsFor(row).map((kana, index) => kana ? <CharacterCard key={kana.character} character={kana.character} state={stateFor(kana)} onClick={() => onSelect(kana)} /> : <span key={`${row.group}-${index}`} />)}</div>)}</div>;
}

function positionsFor(row: KanaRow): Array<KanaCharacter | null> {
  if (row.group === "ya") return [row.characters[0], null, row.characters[1], null, row.characters[2]];
  if (row.group === "wa") return [row.characters[0], null, null, null, row.characters[1]];
  if (row.group === "n") return [row.characters[0], null, null, null, null];
  return row.characters;
}
