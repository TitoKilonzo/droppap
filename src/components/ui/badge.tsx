import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const tones = {
  neutral: "border-line bg-canvas text-ink-soft",
  positive: "border-mint-strong bg-mint text-forest",
  warning: "border-amber-200 bg-warning-bg text-warning",
  danger: "border-red-200 bg-danger-bg text-danger",
} as const;

export function Badge({ tone = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />;
}
