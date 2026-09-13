"use client";

import { useEffect, useState } from "react";
import { getLearningSnapshot } from "@/lib/progress/storage";
import type { LearningSnapshot } from "@/lib/progress/types";

export function useLearningSnapshot() {
  const [snapshot, setSnapshot] = useState<LearningSnapshot | null>(null);

  useEffect(() => {
    const refresh = () => setSnapshot(getLearningSnapshot());
    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener("kana-progress-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("kana-progress-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return snapshot;
}
