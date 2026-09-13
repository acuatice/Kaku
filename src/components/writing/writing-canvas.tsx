"use client";

import { KanaDrawingCanvas } from "@/components/writing/kana-drawing-canvas";
import { hiraganaStrokeData } from "@/data/hiragana-strokes";

export function WritingCanvas({ character = "あ", onStrokeChange }: { character?: string; onStrokeChange?: (hasStrokes: boolean) => void }) {
  const data = hiraganaStrokeData[character] ?? hiraganaStrokeData["あ"];
  return <KanaDrawingCanvas data={data} level="memory" onChange={(strokes) => onStrokeChange?.(strokes.length > 0)} />;
}
