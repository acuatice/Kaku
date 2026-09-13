import { notFound } from "next/navigation";
import { UnitLearning } from "@/components/curriculum/unit-learning";
import { getHiraganaUnit, hiraganaCurriculum } from "@/data/hiragana-curriculum";

export function generateStaticParams() {
  return hiraganaCurriculum.map((unit) => ({ unitId: String(unit.id) }));
}

export default async function HiraganaUnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = getHiraganaUnit(Number(unitId));
  if (!unit) notFound();
  return <UnitLearning unit={unit} />;
}
