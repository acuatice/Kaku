import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ExerciseOptionState = "idle" | "correct" | "incorrect" | "disabled";

const states: Record<ExerciseOptionState, string> = {
  idle: "bg-white text-[var(--sumi)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] active:scale-[.98]",
  correct: "bg-[var(--success)] text-[var(--sumi)] ring-2 ring-[var(--sumi)]/10",
  incorrect: "bg-[var(--momo)] text-[var(--sumi)] ring-2 ring-[var(--error)]/30",
  disabled: "bg-white text-[var(--muted)] opacity-45",
};

export function ExerciseOption({ state = "idle", children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { state?: ExerciseOptionState; children: ReactNode }) {
  return <button type="button" className={`min-h-16 touch-manipulation rounded-[var(--radius-button)] px-4 text-lg font-bold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-18 ${states[state]} ${className}`} {...props}>{children}</button>;
}
