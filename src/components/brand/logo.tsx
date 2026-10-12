import { cn } from "@/lib/utils/cn";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8 shrink-0", className)} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect width="64" height="64" rx="14" fill="#173D32" />
      <path d="M19 11h18l9 9v25a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4z" fill="#DDF4E8" />
      <path d="M37 11v7a2 2 0 0 0 2 2h7z" fill="#9FD3B8" />
      <circle cx="30.5" cy="32" r="4.2" fill="#173D32" />
      <path d="M28.9 35.2h3.2l1 8h-5.2z" fill="#173D32" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={inverted ? "rounded-lg ring-1 ring-mint/30" : undefined} />
      <span className={cn("text-lg font-semibold tracking-tight", inverted ? "text-white" : "text-forest")}>DropPap</span>
    </span>
  );
}
