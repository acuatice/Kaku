"use client";

// Compatibility facade: persistence lives exclusively in ProgressRepository.
export { getLearningSnapshot, introduceCharacter, recordPracticeResult as recordUnitAttempt } from "@/lib/progress/browser";
export { UNIT_PASS_THRESHOLD } from "@/lib/progress/repository";
