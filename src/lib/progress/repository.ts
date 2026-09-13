import { hiraganaCurriculum, type HiraganaUnit } from "@/data/hiragana-curriculum";
import { createCharacterProgress, createInitialProgress, isCurrentProgress, migrateLegacyProgress } from "@/lib/progress/migrations";
import type { CharacterLearningStatus, LearningSnapshot, PracticeExercise, ProgressState, StorageAdapter, UnitAttempt } from "@/lib/progress/types";

export const PROGRESS_STORAGE_KEY = "kana:progress";
export const PROGRESS_EVENT = "kana-progress-change";
export const UNIT_PASS_THRESHOLD = 0.8;
type AnswerUpdate = { kind: PracticeExercise; correct: boolean };
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

export class ProgressRepository {
  constructor(private readonly storage: StorageAdapter, private readonly now: () => Date = () => new Date()) {}
  private timestamp() { return this.now().toISOString(); }
  loadProgress(): ProgressState {
    const raw = this.storage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      try { const parsed: unknown = JSON.parse(raw); if (isCurrentProgress(parsed)) return parsed; } catch { /* Preserve the raw value before recovery. */ }
      this.storage.setItem(`${PROGRESS_STORAGE_KEY}:corrupt-backup:${this.now().getTime()}`, raw);
    }
    const migrated = migrateLegacyProgress(this.storage, this.timestamp());
    return this.saveProgress(migrated);
  }
  saveProgress(progress: ProgressState): ProgressState { const next = clone(progress); next.profile.lastSavedAt = this.timestamp(); this.storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next)); return next; }
  update(updater: (current: ProgressState) => void): ProgressState { const next = clone(this.loadProgress()); updater(next); return this.saveProgress(next); }
  introduceCharacter(id: string, unitId?: number): ProgressState { return this.update((progress) => { const now = this.timestamp(); const current = progress.characters[id] ?? createCharacterProgress(now); progress.characters[id] = { ...current, status: current.status === "new" ? "learning" : current.status, updatedAt: now }; if (unitId) progress.profile.lastActiveUnitId = unitId; }); }
  recordCharacterShown(id: string): ProgressState { return this.update((progress) => { const now = this.timestamp(); const current = progress.characters[id] ?? createCharacterProgress(now); progress.characters[id] = { ...current, timesShown: current.timesShown + 1, updatedAt: now }; }); }
  updateCharacterProgress(id: string, answer: AnswerUpdate): ProgressState {
    return this.update((progress) => {
      const now = this.timestamp(); const current = progress.characters[id] ?? createCharacterProgress(now);
      const attemptsKey = `${answer.kind}Attempts` as "recognitionAttempts" | "typingAttempts" | "drawingAttempts";
      const correctKey = `${answer.kind}Correct` as "recognitionCorrect" | "typingCorrect" | "drawingCorrect";
      progress.characters[id] = { ...current, [attemptsKey]: current[attemptsKey] + 1, [correctKey]: current[correctKey] + (answer.correct ? 1 : 0), status: answer.correct ? (current.status === "new" ? "learning" : current.status) : "review", lastPracticed: now, updatedAt: now };
      progress.profile.lastActivityAt = now; const day = now.slice(0, 10); if (!progress.profile.activityDates.includes(day)) progress.profile.activityDates.push(day);
    });
  }
  setCharacterStatus(id: string, status: CharacterLearningStatus): ProgressState { return this.update((progress) => { const now = this.timestamp(); progress.characters[id] = { ...(progress.characters[id] ?? createCharacterProgress(now)), status, updatedAt: now }; }); }
  recordPracticeResult(unit: HiraganaUnit, recognitionCorrect: number, typingCorrect: number): UnitAttempt {
    const completedAt = this.timestamp(); const totalQuestions = unit.characters.length * 2; const accuracy = totalQuestions === 0 ? 0 : (recognitionCorrect + typingCorrect) / totalQuestions; const passed = accuracy >= UNIT_PASS_THRESHOLD;
    const attempt: UnitAttempt = { unitId: unit.id, completedAt, recognitionCorrect, typingCorrect, totalQuestions, accuracy, passed };
    this.update((progress) => {
      const key = String(unit.id); const current = progress.units[key] ?? { unlocked: true, completed: false, bestAccuracy: 0, completedAt: null };
      progress.units[key] = { unlocked: true, completed: current.completed || passed, bestAccuracy: Math.max(current.bestAccuracy, accuracy), completedAt: current.completedAt ?? (passed ? completedAt : null) };
      if (passed) { const following = progress.units[String(unit.id + 1)]; if (following) progress.units[String(unit.id + 1)] = { ...following, unlocked: true }; for (const character of unit.characters) { const id = `hiragana:${character.character}`; progress.characters[id] = { ...(progress.characters[id] ?? createCharacterProgress(completedAt)), status: "learned", updatedAt: completedAt }; } }
      progress.sessions = [...progress.sessions, attempt].slice(-100); progress.profile.lastActivityAt = completedAt; progress.profile.lastActiveUnitId = passed ? Math.min(unit.id + 1, hiraganaCurriculum.length) : unit.id; const day = completedAt.slice(0, 10); if (!progress.profile.activityDates.includes(day)) progress.profile.activityDates.push(day);
    });
    return attempt;
  }
  resetProgress(): ProgressState { return this.saveProgress(createInitialProgress(this.timestamp())); }
}

export function calculateStreak(activityDates: readonly string[], now = new Date()): number { const days = new Set(activityDates); const cursor = new Date(now); let streak = 0; while (days.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); } return streak; }
export function selectLearningSnapshot(progress: ProgressState, now = new Date()): LearningSnapshot {
  const introducedIds = Object.entries(progress.characters).filter(([, item]) => item.status !== "new").map(([id]) => id);
  const learnedIds = Object.entries(progress.characters).filter(([, item]) => item.status === "learned").map(([id]) => id);
  const reviewIds = Object.entries(progress.characters).filter(([, item]) => item.status === "review").map(([id]) => id);
  const completedUnitIds = Object.entries(progress.units).filter(([, unit]) => unit.completed).map(([id]) => Number(id)).sort((a, b) => a - b);
  const recent = progress.sessions.slice(-5); const answered = recent.reduce((sum, item) => sum + item.totalQuestions, 0); const correct = recent.reduce((sum, item) => sum + item.recognitionCorrect + item.typingCorrect, 0);
  return { introducedIds, learnedIds, reviewIds: reviewIds.filter((id) => introducedIds.includes(id)), completedUnitIds, currentUnitId: progress.profile.lastActiveUnitId, recentAccuracy: answered ? Math.round((correct / answered) * 100) : null, streak: calculateStreak(progress.profile.activityDates, now), sessionCount: progress.sessions.length };
}
