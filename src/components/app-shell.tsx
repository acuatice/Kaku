import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-[100dvh] max-w-[1280px] px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] min-[375px]:px-5 sm:px-8 lg:px-10 lg:pb-12"><Navigation /><main className="min-w-0">{children}</main></div>;
}
