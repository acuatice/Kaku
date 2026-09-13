export type LearningStatus = "available" | "coming-soon";

export interface LearningSystem {
  id: "hiragana" | "katakana" | "kanji";
  name: string;
  japaneseName: string;
  description: string;
  total?: number;
  learned?: number;
  href?: string;
  status: LearningStatus;
}

export interface KanaCharacter {
  character: string;
  romaji: string;
  group: string;
  order: number;
  example?: string;
  exampleReading?: string;
  exampleMeaning?: string;
}

export type LearningState =
  | "not-learned"
  | "learning"
  | "learned"
  | "needs-review";

export interface KanaRow {
  group: KanaCharacter["group"];
  characters: KanaCharacter[];
}
