import type { CharacterPracticeStats, ExerciseKind, PracticeItem, PracticeStatsStore } from "@/lib/practice/types";

export const PRACTICE_STATS_STORAGE_KEY = "kana:practice-stats";

const emptyStore: PracticeStatsStore = { version: 2, items: {} };

function emptyCharacterStats(): CharacterPracticeStats {
  return {
    timesShown: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastPracticedAt: null,
    recognitionAttempts: 0,
    recognitionCorrect: 0,
    typingAttempts: 0,
    typingCorrect: 0,
    currentStatus: "not-learned",
  };
}

type LegacyCharacterPracticeStats = Pick<CharacterPracticeStats, "timesShown" | "correctAnswers" | "incorrectAnswers" | "lastPracticedAt" | "scheduling">;
type LegacyPracticeStatsStore = { version: 1; items: Record<string, LegacyCharacterPracticeStats> };

function migrateLegacyStore(store: LegacyPracticeStatsStore): PracticeStatsStore {
  return {
    version: 2,
    items: Object.fromEntries(Object.entries(store.items).map(([id, stats]) => [id, {
      ...stats,
      recognitionAttempts: 0,
      recognitionCorrect: 0,
      typingAttempts: stats.correctAnswers + stats.incorrectAnswers,
      typingCorrect: stats.correctAnswers,
      currentStatus: stats.incorrectAnswers > 0 ? "needs-review" : stats.correctAnswers > 0 ? "learning" : "not-learned",
    } satisfies CharacterPracticeStats])),
  };
}

export function readPracticeStats(): PracticeStatsStore {
  if (typeof window === "undefined") return emptyStore;
  const saved = window.localStorage.getItem(PRACTICE_STATS_STORAGE_KEY);
  if (!saved) return emptyStore;

  try {
    const parsed = JSON.parse(saved) as PracticeStatsStore | LegacyPracticeStatsStore;
    if (!parsed.items) return emptyStore;
    if (parsed.version === 2) return parsed;
    if (parsed.version === 1) {
      const migrated = migrateLegacyStore(parsed);
      window.localStorage.setItem(PRACTICE_STATS_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return emptyStore;
  } catch {
    window.localStorage.removeItem(PRACTICE_STATS_STORAGE_KEY);
    return emptyStore;
  }
}

function updateItem(item: PracticeItem, update: (stats: CharacterPracticeStats) => CharacterPracticeStats) {
  const store = readPracticeStats();
  const current = store.items[item.id] ?? emptyCharacterStats();
  const next: PracticeStatsStore = {
    ...store,
    items: { ...store.items, [item.id]: update(current) },
  };
  window.localStorage.setItem(PRACTICE_STATS_STORAGE_KEY, JSON.stringify(next));
}

export function recordCharacterShown(item: PracticeItem) {
  updateItem(item, (stats) => ({ ...stats, timesShown: stats.timesShown + 1 }));
}

export function recordPracticeAnswer(item: PracticeItem, exercise: ExerciseKind, isCorrect: boolean) {
  updateItem(item, (stats) => ({
    ...stats,
    correctAnswers: stats.correctAnswers + (isCorrect ? 1 : 0),
    incorrectAnswers: stats.incorrectAnswers + (isCorrect ? 0 : 1),
    recognitionAttempts: stats.recognitionAttempts + (exercise === "recognition" ? 1 : 0),
    recognitionCorrect: stats.recognitionCorrect + (exercise === "recognition" && isCorrect ? 1 : 0),
    typingAttempts: stats.typingAttempts + (exercise === "typing" ? 1 : 0),
    typingCorrect: stats.typingCorrect + (exercise === "typing" && isCorrect ? 1 : 0),
    lastPracticedAt: new Date().toISOString(),
    currentStatus: isCorrect ? (stats.currentStatus === "not-learned" ? "learning" : stats.currentStatus) : "needs-review",
  }));
}

export function setCharacterLearningStatus(id: string, status: CharacterPracticeStats["currentStatus"]) {
  const store = readPracticeStats();
  const current = store.items[id] ?? emptyCharacterStats();
  const next: PracticeStatsStore = { ...store, items: { ...store.items, [id]: { ...current, currentStatus: status } } };
  window.localStorage.setItem(PRACTICE_STATS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("kana-progress-change"));
}
