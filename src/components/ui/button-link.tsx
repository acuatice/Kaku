import Link from "next/link";
import type { ReactNode } from "react";

export function ButtonLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 ${className}`}>{children}</Link>;
}
