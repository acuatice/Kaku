import { notFound } from "next/navigation";
import { DrawingPracticeSession } from "@/components/writing/drawing-practice-session";
import { getHiraganaUnit, hiraganaCurriculum } from "@/data/hiragana-curriculum";

export const metadata = { title: "Practicar escritura" };
export function generateStaticParams() { return hiraganaCurriculum.map((unit) => ({ unitId: String(unit.id) })); }
export default async function UnitDrawingPage({ params }: { params: Promise<{ unitId: string }> }) { const { unitId } = await params; const unit = getHiraganaUnit(Number(unitId)); if (!unit) notFound(); return <DrawingPracticeSession unit={unit} />; }
