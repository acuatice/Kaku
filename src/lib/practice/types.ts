export type PracticeMode =
  | "kana-to-romaji"
  | "romaji-to-kana"
  | "kanji-to-meaning"
  | "kanji-to-reading";

export type WritingSystem = "hiragana" | "katakana" | "kanji";
export type ExerciseKind = "recognition" | "typing";
export type PracticeStage = "loading" | "recognition" | "transition" | "typing" | "complete";
export type InteractionState = "question" | "feedback";

export interface PracticeItem {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  displayAnswer: string;
  writingSystem: WritingSystem;
  mode: PracticeMode;
  group?: string;
}

export interface CharacterPracticeStats {
  timesShown: number;
  correctAnswers: number;
  incorrectAnswers: number;
  lastPracticedAt: string | null;
  recognitionAttempts: number;
  recognitionCorrect: number;
  typingAttempts: number;
  typingCorrect: number;
  currentStatus: "not-learned" | "learning" | "learned" | "needs-review";
  scheduling?: {
    dueAt: string | null;
    intervalDays: number;
    easeFactor: number;
  };
}

export interface PracticeStatsStore {
  version: 2;
  items: Record<string, CharacterPracticeStats>;
}

export type Feedback = {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer?: string;
};

export interface PracticeCompletionResult {
  recognitionCorrect: number;
  typingCorrect: number;
  totalCharacters: number;
  needsReview: PracticeItem[];
}
