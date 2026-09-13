export type CharacterLearningStatus = "new" | "learning" | "learned" | "review";

export interface UnitAttempt {
  unitId: number;
  completedAt: string;
  recognitionCorrect: number;
  typingCorrect: number;
  totalQuestions: number;
  accuracy: number;
  passed: boolean;
}

export interface HiraganaLearningProgress {
  introducedCharacterIds: string[];
  completedUnitIds: number[];
  attempts: UnitAttempt[];
  activityDates: string[];
}

export interface LearningProgressStore {
  version: 1;
  hiragana: HiraganaLearningProgress;
}

export interface LearningSnapshot {
  introducedIds: string[];
  learnedIds: string[];
  reviewIds: string[];
  completedUnitIds: number[];
  currentUnitId: number;
  recentAccuracy: number | null;
  streak: number;
  sessionCount: number;
}
