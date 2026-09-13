"use client";

import { useState } from "react";

const STORAGE_KEY = "kana-progress";

export interface Progress {
  learnedHiragana: string[];
  streak: number;
}

const initialProgress: Progress = { learnedHiragana: [], streak: 0 };

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === "undefined") return initialProgress;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialProgress;
    try { return JSON.parse(saved) as Progress; } catch { window.localStorage.removeItem(STORAGE_KEY); return initialProgress; }
  });

  const updateProgress = (next: Progress) => {
    setProgress(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return { progress, updateProgress };
}
