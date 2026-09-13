import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "@/components/ui/icon";

export function IconButton({ icon, label, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
  return <button type="button" aria-label={label} className={`inline-flex size-12 items-center justify-center rounded-[var(--radius-control)] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`} {...props}><Icon name={icon} className="size-5" /></button>;
}
