import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-mint text-forest">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
      {children ? <p className="mt-1 max-w-sm text-sm text-ink-soft">{children}</p> : null}
    </div>
  );
}
