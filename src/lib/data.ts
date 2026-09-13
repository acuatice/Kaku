import type { LearningSystem } from "@/lib/types";

export const learningSystems: LearningSystem[] = [
  { id: "hiragana", name: "Hiragana", japaneseName: "ひらがな", description: "La base fonética del japonés", total: 46, learned: 0, href: "/hiragana", status: "available" },
  { id: "katakana", name: "Katakana", japaneseName: "カタカナ", description: "Palabras y nombres extranjeros", status: "coming-soon" },
  { id: "kanji", name: "Kanji", japaneseName: "漢字", description: "Caracteres, significado y lectura", status: "coming-soon" },
];
