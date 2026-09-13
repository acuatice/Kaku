import type { HiraganaUnit } from "@/data/hiragana-curriculum";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { readPracticeStats, setCharacterLearningStatus } from "@/lib/practice/storage";
import type { LearningProgressStore, LearningSnapshot, UnitAttempt } from "@/lib/progress/types";

export const LEARNING_PROGRESS_STORAGE_KEY = "kana:learning-progress";
export const UNIT_PASS_THRESHOLD = 0.8;

const emptyStore: LearningProgressStore = {
  version: 1,
  hiragana: { introducedCharacterIds: [], completedUnitIds: [], attempts: [], activityDates: [] },
};

function characterId(character: string) {
  return `hiragana:${character}`;
}

export function readLearningProgress(): LearningProgressStore {
  if (typeof window === "undefined") return emptyStore;
  const saved = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as LearningProgressStore;
      if (parsed.version === 1 && parsed.hiragana) return parsed;
    } catch {
      // Fall through to a safe bootstrap from existing practice statistics.
    }
  }

  const previousStats = readPracticeStats();
  const introducedCharacterIds = Object.entries(previousStats.items)
    .filter(([, stats]) => stats.timesShown > 0)
    .map(([id]) => id);
  const bootstrapped: LearningProgressStore = {
    ...emptyStore,
    hiragana: { ...emptyStore.hiragana, introducedCharacterIds },
  };
  window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(bootstrapped));
  return bootstrapped;
}

function writeLearningProgress(store: LearningProgressStore) {
  window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("kana-progress-change"));
}

export function introduceCharacter(character: string) {
  const store = readLearningProgress();
  const id = characterId(character);
  if (store.hiragana.introducedCharacterIds.includes(id)) return;
  writeLearningProgress({
    ...store,
    hiragana: { ...store.hiragana, introducedCharacterIds: [...store.hiragana.introducedCharacterIds, id] },
  });
  setCharacterLearningStatus(id, "learning");
}

export function recordUnitAttempt(unit: HiraganaUnit, recognitionCorrect: number, typingCorrect: number): UnitAttempt {
  const store = readLearningProgress();
  const totalQuestions = unit.characters.length * 2;
  const accuracy = totalQuestions === 0 ? 0 : (recognitionCorrect + typingCorrect) / totalQuestions;
  const passed = accuracy >= UNIT_PASS_THRESHOLD;
  const completedAt = new Date().toISOString();
  const attempt: UnitAttempt = { unitId: unit.id, completedAt, recognitionCorrect, typingCorrect, totalQuestions, accuracy, passed };
  const completedUnitIds = passed
    ? [...new Set([...store.hiragana.completedUnitIds, unit.id])].sort((a, b) => a - b)
    : store.hiragana.completedUnitIds;
  const localDate = completedAt.slice(0, 10);

  writeLearningProgress({
    ...store,
    hiragana: {
      ...store.hiragana,
      completedUnitIds,
      attempts: [...store.hiragana.attempts, attempt].slice(-50),
      activityDates: [...new Set([...store.hiragana.activityDates, localDate])].sort(),
    },
  });

  if (passed) {
    unit.characters.forEach((kana) => setCharacterLearningStatus(characterId(kana.character), "learned"));
  }
  return attempt;
}

function calculateStreak(activityDates: readonly string[]): number {
  const days = new Set(activityDates);
  const cursor = new Date();
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function getLearningSnapshot(): LearningSnapshot {
  const progress = readLearningProgress();
  const stats = readPracticeStats();
  const learnedIds = Object.entries(stats.items).filter(([, value]) => value.currentStatus === "learned").map(([id]) => id);
  const reviewIds = Object.entries(stats.items).filter(([, value]) => value.currentStatus === "needs-review").map(([id]) => id);
  const recentAttempts = progress.hiragana.attempts.slice(-5);
  const answered = recentAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const correct = recentAttempts.reduce((sum, attempt) => sum + attempt.recognitionCorrect + attempt.typingCorrect, 0);
  const firstIncomplete = hiraganaCurriculum.find((unit) => !progress.hiragana.completedUnitIds.includes(unit.id));
  return {
    introducedIds: progress.hiragana.introducedCharacterIds,
    learnedIds,
    reviewIds: reviewIds.filter((id) => progress.hiragana.introducedCharacterIds.includes(id)),
    completedUnitIds: progress.hiragana.completedUnitIds,
    currentUnitId: firstIncomplete?.id ?? hiraganaCurriculum.length,
    recentAccuracy: answered > 0 ? Math.round((correct / answered) * 100) : null,
    streak: calculateStreak(progress.hiragana.activityDates),
    sessionCount: progress.hiragana.attempts.length,
  };
}
