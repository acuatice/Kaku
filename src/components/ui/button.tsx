import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "neutral" | "success" | "error";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--sumi)] text-white hover:bg-[#302d43]",
  secondary: "bg-[var(--yuzu)] text-[var(--sumi)] hover:bg-[#e8f43d]",
  neutral: "bg-white text-[var(--sumi)] hover:bg-neutral-50",
  success: "bg-[var(--success)] text-[var(--sumi)]",
  error: "bg-[var(--error)] text-white",
};

const base = "inline-flex min-h-13 items-center justify-center gap-2 rounded-[var(--radius-button)] px-6 text-sm font-bold transition duration-150 active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: ButtonVariant; className?: string }) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}
