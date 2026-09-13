"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress/browser";
import { PROGRESS_EVENT, PROGRESS_STORAGE_KEY } from "@/lib/progress/repository";
import type { ProgressState } from "@/lib/progress/types";

export function ProgressDebugPanel() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  useEffect(() => { const refresh = () => setProgress(loadProgress()); refresh(); window.addEventListener(PROGRESS_EVENT, refresh); return () => window.removeEventListener(PROGRESS_EVENT, refresh); }, []);
  if (!progress) return null;
  return <aside className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-3 z-50 lg:bottom-4">
    <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full bg-[var(--sumi)] px-3 py-2 text-xs font-bold text-white shadow-lg">Progreso dev</button>
    {open && <div className="mt-2 max-h-[55dvh] w-[min(24rem,calc(100vw-1.5rem))] overflow-auto rounded-2xl border border-[var(--border)] bg-white p-4 text-xs shadow-2xl">
      <p><b>Clave:</b> {PROGRESS_STORAGE_KEY}</p><p><b>Schema:</b> {progress.schemaVersion}</p><p><b>Guardado:</b> {progress.profile.lastSavedAt}</p>
      <pre className="mt-3 whitespace-pre-wrap break-all">{JSON.stringify(progress, null, 2)}</pre>
    </div>}
  </aside>;
}
