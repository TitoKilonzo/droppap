import { cn } from "@/lib/utils/cn";

export function Progress({ value, label, tone = "default" }: { value: number; label: string; tone?: "default" | "warning" }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamped)} className="h-2 w-full overflow-hidden rounded-full bg-mint">
      <div className={cn("h-full rounded-full", tone === "warning" ? "bg-amber-600" : "bg-forest")} style={{ width: `${clamped}%` }} />
    </div>
  );
}
