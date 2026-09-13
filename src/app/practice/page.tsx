import { ReviewPractice } from "@/components/practice/review-practice";

export const metadata = { title: "Práctica" };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ review?: string }> }) {
  const { review } = await searchParams;
  return <div className="flex min-h-[calc(100dvh-8rem-env(safe-area-inset-top))] items-start justify-center py-4 sm:items-center sm:py-12"><ReviewPractice reviewOnly={review === "1"} /></div>;
}
