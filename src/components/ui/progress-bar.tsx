export function ProgressBar({ value, max = 100, label, className = "" }: { value: number; max?: number; label: string; className?: string }) {
  const percentage = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return <div className={`h-2 overflow-hidden rounded-full bg-black/10 ${className}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><div className="h-full rounded-full bg-current transition-[width] duration-300" style={{ width: `${percentage}%` }} /></div>;
}
