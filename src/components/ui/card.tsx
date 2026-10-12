import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-line bg-white shadow-card", className)} {...props} />;
}

export function CardHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("border-b border-line px-5 py-4", className)}>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-0.5 text-sm text-ink-soft">{description}</p> : null}
    </div>
  );
}
