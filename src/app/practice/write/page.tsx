import { WritePractice } from "@/components/writing/write-practice";

export const metadata = { title: "Escritura" };

export default function WritePage() { return <div className="flex min-h-[calc(100dvh-8rem-env(safe-area-inset-top))] items-start justify-center py-4 sm:items-center"><WritePractice /></div>; }
