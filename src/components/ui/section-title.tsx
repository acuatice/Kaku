import type { ReactNode } from "react";

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-xl font-bold tracking-[-0.035em] sm:text-2xl">{children}</h2>{action}</div>;
}
