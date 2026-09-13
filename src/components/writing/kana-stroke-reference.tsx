import type { KanaStrokeData } from "@/lib/drawing/types";

export function KanaStrokeReference({ data, animated = false, showNumbers = false, className = "" }: { data: KanaStrokeData; animated?: boolean; showNumbers?: boolean; className?: string }) {
  return <svg viewBox={data.viewBox} className={className} aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{data.paths.map((path, index) => <path key={path} d={path} pathLength={1} className={animated ? "animate-stroke-order" : undefined} style={animated ? { animationDelay: `${index * 0.72}s` } : undefined} />)}</g>{showNumbers ? <g className="fill-current text-[7px] font-bold">{data.labels.map((label) => <text key={label.number} x={label.x} y={label.y}>{label.number}</text>)}</g> : null}</svg>;
}
