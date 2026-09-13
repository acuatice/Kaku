import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";

export interface NavigationItem {
  href: string;
  label: string;
  icon: IconName;
}

export function BottomNavigation({ items, isActive }: { items: readonly NavigationItem[]; isActive: (href: string) => boolean }) {
  return <nav aria-label="Navegación principal" className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-4 rounded-[1.6rem] bg-[var(--sumi)] p-1.5 shadow-[0_16px_40px_rgba(23,23,25,.22)] min-[375px]:inset-x-4 md:hidden">{items.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.15rem] text-[11px] font-semibold transition duration-150 active:scale-95 ${isActive(item.href) ? "bg-[var(--yuzu)] text-[var(--sumi)]" : "text-white/65"}`}><Icon name={item.icon} className="size-[19px]"/>{item.label}</Link>)}</nav>;
}
