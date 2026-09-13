"use client";
import type { HiraganaUnit } from "@/data/hiragana-curriculum";
import type { PracticeItem } from "@/lib/practice/types";
import { ProgressRepository, PROGRESS_EVENT, selectLearningSnapshot } from "@/lib/progress/repository";
import type { CharacterLearningStatus, PracticeExercise, ProgressState } from "@/lib/progress/types";

let repository: ProgressRepository | null = null;
export function getProgressRepository() { if (typeof window === "undefined") return null; repository ??= new ProgressRepository(window.localStorage); return repository; }
function notify() { window.dispatchEvent(new Event(PROGRESS_EVENT)); }
export function loadProgress(): ProgressState | null { return getProgressRepository()?.loadProgress() ?? null; }
export function updateCharacterProgress(item: PracticeItem, exercise: PracticeExercise, correct: boolean) { const result = getProgressRepository()?.updateCharacterProgress(item.id, { kind: exercise, correct }); if (result) notify(); return result; }
export function recordCharacterShown(item: PracticeItem) { const result = getProgressRepository()?.recordCharacterShown(item.id); if (result) notify(); return result; }
export function introduceCharacter(character: string, unitId?: number) { const result = getProgressRepository()?.introduceCharacter(`hiragana:${character}`, unitId); if (result) notify(); return result; }
export function setCharacterStatus(id: string, status: CharacterLearningStatus) { const result = getProgressRepository()?.setCharacterStatus(id, status); if (result) notify(); return result; }
export function recordPracticeResult(unit: HiraganaUnit, recognitionCorrect: number, typingCorrect: number) { const result = getProgressRepository()?.recordPracticeResult(unit, recognitionCorrect, typingCorrect); if (result) notify(); return result; }
export function getLearningSnapshot() { const progress = loadProgress(); return progress ? selectLearningSnapshot(progress) : null; }
