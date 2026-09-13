import type { FormEvent, RefObject } from "react";
import type { Feedback, InteractionState } from "@/lib/practice/types";
import { Button } from "@/components/ui/button";
import { ExerciseFeedback } from "@/components/ui/exercise-feedback";

interface TypingAnswerProps {
  prompt: string;
  answer: string;
  feedback: Feedback | null;
  interaction: InteractionState;
  inputRef: RefObject<HTMLInputElement | null>;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onContinue: () => void;
}

export function TypingAnswer({ prompt, answer, feedback, interaction, inputRef, onAnswerChange, onSubmit, onContinue }: TypingAnswerProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (interaction === "feedback") onContinue();
    else onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="romaji-answer" className="sr-only">Escribe el romaji de {prompt}</label>
      <input ref={inputRef} id="romaji-answer" name="romaji" type="text" inputMode="text" enterKeyHint="done" value={answer} onChange={(event) => onAnswerChange(event.target.value)} onFocus={(event) => { const input = event.currentTarget; window.setTimeout(() => input.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 150); }} placeholder="Escribe el rōmaji" disabled={interaction === "feedback"} autoComplete="off" autoCapitalize="none" spellCheck={false} className={`h-16 w-full scroll-mb-40 rounded-[1.25rem] border-2 bg-[var(--background)] px-5 text-center text-xl font-bold outline-none transition placeholder:text-base placeholder:font-medium placeholder:text-neutral-400 focus:border-[var(--electric-violet)] disabled:opacity-70 ${feedback?.isCorrect ? "border-[var(--success)]" : feedback ? "border-[var(--error)]/55" : "border-transparent"}`} />

      <div className="min-h-16 py-3 text-center sm:min-h-20 sm:py-4" aria-live="polite">
        {feedback && <ExerciseFeedback correct={feedback.isCorrect}><p className="mt-1 text-sm">La respuesta es <strong>{feedback.correctAnswer}</strong></p></ExerciseFeedback>}
      </div>

      <Button type="submit" disabled={interaction === "question" && answer.trim() === ""} className="w-full">{interaction === "feedback" ? "Continuar" : "Comprobar"}</Button>
    </form>
  );
}
