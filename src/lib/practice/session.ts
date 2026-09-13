import type { KanaCharacter } from "@/lib/types";
import type { PracticeItem, WritingSystem } from "@/lib/practice/types";

export const DEFAULT_SESSION_SIZE = 10;

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLocaleLowerCase("en-US");
}

export function isAnswerCorrect(answer: string, acceptedAnswers: readonly string[]): boolean {
  const normalized = normalizeAnswer(answer);
  return acceptedAnswers.some((candidate) => normalizeAnswer(candidate) === normalized);
}

export function createKanaToRomajiItems(
  characters: readonly KanaCharacter[],
  writingSystem: Exclude<WritingSystem, "kanji">,
): PracticeItem[] {
  return characters.map((kana) => ({
    id: `${writingSystem}:${kana.character}`,
    prompt: kana.character,
    acceptedAnswers: [kana.romaji],
    displayAnswer: kana.romaji,
    writingSystem,
    mode: "kana-to-romaji",
    group: kana.group,
  }));
}

export function createPracticeSession<T>(
  items: readonly T[],
  size = DEFAULT_SESSION_SIZE,
  random: () => number = Math.random,
): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(size, shuffled.length));
}

export function reshuffleSession<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const reshuffled = createPracticeSession(items, items.length, random);
  if (reshuffled.length > 1 && reshuffled.every((item, index) => item === items[index])) {
    reshuffled.push(reshuffled.shift() as T);
  }
  return reshuffled;
}

export function createRecognitionOptions(
  item: PracticeItem,
  allItems: readonly PracticeItem[],
  count = 4,
  random: () => number = Math.random,
): string[] {
  const uniqueDistractors = new Map<string, PracticeItem>();
  for (const candidate of allItems) {
    if (candidate.id !== item.id && candidate.displayAnswer !== item.displayAnswer) {
      uniqueDistractors.set(candidate.displayAnswer, candidate);
    }
  }

  const candidates = [...uniqueDistractors.values()];
  const sameGroup = candidates.filter((candidate) => candidate.group === item.group);
  const otherGroups = candidates.filter((candidate) => candidate.group !== item.group);
  const distractors = [
    ...createPracticeSession(sameGroup, sameGroup.length, random),
    ...createPracticeSession(otherGroups, otherGroups.length, random),
  ].slice(0, Math.max(0, count - 1));

  return createPracticeSession(
    [item.displayAnswer, ...distractors.map((candidate) => candidate.displayAnswer)],
    count,
    random,
  );
}
