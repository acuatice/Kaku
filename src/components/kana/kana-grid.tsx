"use client";

import { useEffect, useMemo, useState } from "react";
import { KanaCard } from "@/components/kana/kana-card";
import { KanaDetail } from "@/components/kana/kana-detail";
import { getInitialLearningState, getKanaRows } from "@/lib/kana";
import type { KanaCharacter } from "@/lib/types";

export function KanaGrid({ characters }: { characters: readonly KanaCharacter[] }) {
  const rows = useMemo(() => getKanaRows(characters), [characters]);
  const [selected, setSelected] = useState<KanaCharacter | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {rows.map((row) => (
          <div key={row.group} className="grid grid-cols-5 gap-2 sm:gap-3" aria-label={`Fila ${row.group}`}>
            {row.group === "ya" ? (
              <><KanaCard kana={row.characters[0]} state={getInitialLearningState()} onOpen={setSelected} /><span /><KanaCard kana={row.characters[1]} state={getInitialLearningState()} onOpen={setSelected} /><span /><KanaCard kana={row.characters[2]} state={getInitialLearningState()} onOpen={setSelected} /></>
            ) : row.group === "wa" ? (
              <><KanaCard kana={row.characters[0]} state={getInitialLearningState()} onOpen={setSelected} /><span /><span /><span /><KanaCard kana={row.characters[1]} state={getInitialLearningState()} onOpen={setSelected} /></>
            ) : row.group === "n" ? (
              <><KanaCard kana={row.characters[0]} state={getInitialLearningState()} onOpen={setSelected} /><span /><span /><span /><span /></>
            ) : row.characters.map((kana) => <KanaCard key={kana.character} kana={kana} state={getInitialLearningState()} onOpen={setSelected} />)}
          </div>
        ))}
      </div>
      {selected && <KanaDetail kana={selected} state={getInitialLearningState()} onClose={() => setSelected(null)} />}
    </>
  );
}
