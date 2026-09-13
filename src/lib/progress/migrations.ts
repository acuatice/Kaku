import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import type { CharacterLearningStatus, CharacterProgress, ProgressState, StorageAdapter, UnitAttempt } from "@/lib/progress/types";
import { PROGRESS_SCHEMA_VERSION } from "@/lib/progress/types";

export const LEGACY_PRACTICE_KEY = "kana:practice-stats";
export const LEGACY_LEARNING_KEY = "kana:learning-progress";
export const LEGACY_HOOK_KEY = "kana-progress";
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const numberOr = (value: unknown, fallback = 0) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
const stringOrNull = (value: unknown) => typeof value === "string" ? value : null;
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const numbers = (value: unknown) => Array.isArray(value) ? value.filter((item): item is number => typeof item === "number" && Number.isInteger(item)) : [];

export function createInitialProgress(now: string): ProgressState {
  return { schemaVersion: PROGRESS_SCHEMA_VERSION, profile: { createdAt: now, lastActivityAt: null, lastActiveUnitId: 1, activityDates: [], lastSavedAt: now }, characters: {}, units: Object.fromEntries(hiraganaCurriculum.map((unit) => [String(unit.id), { unlocked: unit.id === 1, completed: false, bestAccuracy: 0, completedAt: null }])), sessions: [] };
}
export function createCharacterProgress(now: string): CharacterProgress { return { status: "new", recognitionAttempts: 0, recognitionCorrect: 0, typingAttempts: 0, typingCorrect: 0, drawingAttempts: 0, drawingCorrect: 0, timesShown: 0, lastPracticed: null, updatedAt: now }; }
function statusFromLegacy(value: unknown): CharacterLearningStatus { if (value === "learning" || value === "learned") return value; if (value === "needs-review" || value === "review") return "review"; return "new"; }
function parseJson(raw: string | null): unknown { if (!raw) return null; try { return JSON.parse(raw) as unknown; } catch { return null; } }

export function migrateLegacyProgress(storage: StorageAdapter, now: string): ProgressState {
  const next = createInitialProgress(now);
  const practice = parseJson(storage.getItem(LEGACY_PRACTICE_KEY));
  if (isRecord(practice) && isRecord(practice.items)) for (const [id, rawStats] of Object.entries(practice.items)) {
    if (!isRecord(rawStats)) continue;
    const correct = numberOr(rawStats.correctAnswers); const incorrect = numberOr(rawStats.incorrectAnswers); const version = numberOr(practice.version);
    next.characters[id] = { ...createCharacterProgress(now), status: statusFromLegacy(rawStats.currentStatus ?? (incorrect > 0 ? "review" : correct > 0 ? "learning" : "new")), timesShown: numberOr(rawStats.timesShown), recognitionAttempts: version >= 2 ? numberOr(rawStats.recognitionAttempts) : 0, recognitionCorrect: version >= 2 ? numberOr(rawStats.recognitionCorrect) : 0, typingAttempts: version >= 2 ? numberOr(rawStats.typingAttempts) : correct + incorrect, typingCorrect: version >= 2 ? numberOr(rawStats.typingCorrect) : correct, lastPracticed: stringOrNull(rawStats.lastPracticedAt), updatedAt: stringOrNull(rawStats.lastPracticedAt) ?? now };
  }
  const learning = parseJson(storage.getItem(LEGACY_LEARNING_KEY));
  if (isRecord(learning) && isRecord(learning.hiragana)) {
    const hiragana = learning.hiragana;
    for (const id of strings(hiragana.introducedCharacterIds)) { const current = next.characters[id] ?? createCharacterProgress(now); next.characters[id] = { ...current, status: current.status === "new" ? "learning" : current.status, updatedAt: now }; }
    for (const unitId of numbers(hiragana.completedUnitIds)) { const key = String(unitId); if (next.units[key]) next.units[key] = { ...next.units[key], completed: true, unlocked: true }; const following = String(unitId + 1); if (next.units[following]) next.units[following] = { ...next.units[following], unlocked: true }; }
    next.profile.activityDates = strings(hiragana.activityDates);
    if (Array.isArray(hiragana.attempts)) next.sessions = hiragana.attempts.flatMap((raw): UnitAttempt[] => !isRecord(raw) || typeof raw.unitId !== "number" || typeof raw.completedAt !== "string" ? [] : [{ unitId: raw.unitId, completedAt: raw.completedAt, recognitionCorrect: numberOr(raw.recognitionCorrect), typingCorrect: numberOr(raw.typingCorrect), totalQuestions: numberOr(raw.totalQuestions), accuracy: numberOr(raw.accuracy), passed: raw.passed === true }]).slice(-100);
    for (const attempt of next.sessions) { const unit = next.units[String(attempt.unitId)]; if (unit) next.units[String(attempt.unitId)] = { ...unit, bestAccuracy: Math.max(unit.bestAccuracy, attempt.accuracy), completedAt: unit.completedAt ?? (attempt.passed ? attempt.completedAt : null) }; }
    next.profile.lastActivityAt = next.sessions.at(-1)?.completedAt ?? null;
  }
  const oldHook = parseJson(storage.getItem(LEGACY_HOOK_KEY));
  if (isRecord(oldHook)) for (const character of strings(oldHook.learnedHiragana)) { const id = character.startsWith("hiragana:") ? character : `hiragana:${character}`; next.characters[id] = { ...(next.characters[id] ?? createCharacterProgress(now)), status: "learned", updatedAt: now }; }
  const firstIncomplete = hiraganaCurriculum.find((unit) => !next.units[String(unit.id)]?.completed);
  next.profile.lastActiveUnitId = firstIncomplete?.id ?? hiraganaCurriculum.length;
  return next;
}
export function isCurrentProgress(value: unknown): value is ProgressState { return isRecord(value) && value.schemaVersion === PROGRESS_SCHEMA_VERSION && isRecord(value.profile) && isRecord(value.characters) && isRecord(value.units) && Array.isArray(value.sessions); }
