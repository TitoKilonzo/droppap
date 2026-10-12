import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-forest text-white hover:bg-forest-hover",
  secondary: "border border-line bg-white text-ink hover:bg-mint",
  ghost: "text-ink-soft hover:bg-mint hover:text-forest",
};
const sizes: Record<Size, string> = { md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonStyles(variant, size, className)} {...props} />;
}

export function LinkButton({ href, variant, size, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; size?: Size }) {
  return <Link href={href} className={buttonStyles(variant, size, className)} {...props} />;
}
