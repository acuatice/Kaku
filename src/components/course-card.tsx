import Link from "next/link";
import type { LearningSystem } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

export function CourseCard({ course }: { course: LearningSystem }) {
  const available = course.status === "available";
  const content = <>
    <div className="flex items-start justify-between gap-4"><span className={`text-5xl font-normal sm:text-6xl ${available ? "text-neutral-950" : "text-neutral-300"}`}>{course.japaneseName}</span>{available ? <Icon name="arrow" className="mt-1 size-5 transition-transform group-hover:translate-x-1"/> : <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Próximamente</span>}</div>
    <div><h3 className="text-xl font-medium tracking-[-0.025em]">{course.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{course.description}</p>{available && <div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span>Progreso</span><span>{course.learned}/{course.total}</span></div><div className="h-1 overflow-hidden rounded-full bg-neutral-100"><div className="h-full w-0 bg-[var(--accent)]" /></div></div>}</div>
  </>;
  const className = `group flex min-h-72 flex-col justify-between rounded-[1.75rem] border border-[var(--border)] bg-white p-6 transition sm:p-7 ${available ? "hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,.06)]" : "opacity-75"}`;
  return available && course.href ? <Link href={course.href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}
