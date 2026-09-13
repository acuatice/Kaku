import { describe, expect, it } from "vitest";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { LEGACY_LEARNING_KEY, LEGACY_PRACTICE_KEY } from "@/lib/progress/migrations";
import { ProgressRepository, PROGRESS_STORAGE_KEY } from "@/lib/progress/repository";
import type { StorageAdapter } from "@/lib/progress/types";

class MemoryStorage implements StorageAdapter {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}
const instant = new Date("2026-09-13T10:00:00.000Z");
const repository = (storage = new MemoryStorage()) => ({ storage, repo: new ProgressRepository(storage, () => instant) });

describe("ProgressRepository", () => {
  it("crea el progreso inicial de un usuario nuevo", () => {
    const { storage, repo } = repository(); const progress = repo.loadProgress();
    expect(progress.schemaVersion).toBe(1); expect(progress.profile.lastActiveUnitId).toBe(1); expect(progress.units["1"].unlocked).toBe(true); expect(storage.getItem(PROGRESS_STORAGE_KEY)).not.toBeNull();
  });
  it("guarda una práctica completada", () => {
    const { repo } = repository(); repo.recordPracticeResult(hiraganaCurriculum[0], 5, 4); const progress = repo.loadProgress();
    expect(progress.sessions).toHaveLength(1); expect(progress.units["1"].completed).toBe(true); expect(progress.units["1"].bestAccuracy).toBe(0.9);
  });
  it("mantiene el progreso al recargar", () => {
    const { storage, repo } = repository(); repo.updateCharacterProgress("hiragana:あ", { kind: "typing", correct: true });
    expect(new ProgressRepository(storage, () => instant).loadProgress().characters["hiragana:あ"].typingCorrect).toBe(1);
  });
  it("acumula dos sesiones y parte siempre del dato más reciente", () => {
    const { repo } = repository(); repo.recordPracticeResult(hiraganaCurriculum[0], 5, 5); repo.recordPracticeResult(hiraganaCurriculum[0], 4, 4);
    expect(repo.loadProgress().sessions).toHaveLength(2); expect(repo.loadProgress().units["1"].bestAccuracy).toBe(1);
  });
  it("conserva el progreso de dos caracteres", () => {
    const { repo } = repository(); repo.updateCharacterProgress("hiragana:あ", { kind: "recognition", correct: true }); repo.updateCharacterProgress("hiragana:い", { kind: "typing", correct: false }); const characters = repo.loadProgress().characters;
    expect(characters["hiragana:あ"].recognitionCorrect).toBe(1); expect(characters["hiragana:い"].typingAttempts).toBe(1);
  });
  it("migra y combina los dos formatos anteriores sin borrarlos", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_PRACTICE_KEY, JSON.stringify({ version: 2, items: { "hiragana:あ": { timesShown: 3, correctAnswers: 2, incorrectAnswers: 1, lastPracticedAt: "2026-09-12T10:00:00.000Z", recognitionAttempts: 2, recognitionCorrect: 1, typingAttempts: 1, typingCorrect: 1, currentStatus: "needs-review" } } }));
    storage.setItem(LEGACY_LEARNING_KEY, JSON.stringify({ version: 1, hiragana: { introducedCharacterIds: ["hiragana:あ"], completedUnitIds: [1], attempts: [{ unitId: 1, completedAt: "2026-09-12T10:00:00.000Z", recognitionCorrect: 5, typingCorrect: 4, totalQuestions: 10, accuracy: 0.9, passed: true }], activityDates: ["2026-09-12"] } }));
    const progress = new ProgressRepository(storage, () => instant).loadProgress();
    expect(progress.characters["hiragana:あ"].recognitionAttempts).toBe(2); expect(progress.characters["hiragana:あ"].status).toBe("review"); expect(progress.units["1"].completed).toBe(true); expect(storage.getItem(LEGACY_PRACTICE_KEY)).not.toBeNull();
  });
  it("recupera datos corruptos conservando una copia", () => {
    const { storage, repo } = repository(); storage.setItem(PROGRESS_STORAGE_KEY, "{roto"); const progress = repo.loadProgress();
    expect(progress.schemaVersion).toBe(1); expect([...storage.data.keys()].some((key) => key.startsWith(`${PROGRESS_STORAGE_KEY}:corrupt-backup:`))).toBe(true);
  });
  it("cambiar de ruta o recrear el repositorio no pierde progreso", () => {
    const { storage, repo } = repository(); repo.introduceCharacter("hiragana:あ", 1);
    const afterNavigation = new ProgressRepository(storage, () => instant); afterNavigation.updateCharacterProgress("hiragana:あ", { kind: "typing", correct: true });
    expect(new ProgressRepository(storage, () => instant).loadProgress().characters["hiragana:あ"]).toMatchObject({ status: "learning", typingAttempts: 1, typingCorrect: 1 });
  });
  it("acumula la autoevaluación de dibujo y persiste el repaso", () => {
    const { storage, repo } = repository(); repo.updateCharacterProgress("hiragana:う", { kind: "drawing", correct: true }); repo.updateCharacterProgress("hiragana:う", { kind: "drawing", correct: false });
    const saved = new ProgressRepository(storage, () => instant).loadProgress().characters["hiragana:う"];
    expect(saved).toMatchObject({ drawingAttempts: 2, drawingCorrect: 1, status: "review" });
  });
});
