import { LogoMark } from "@/components/brand/logo";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas">
      <LogoMark className="size-12 motion-safe:animate-pulse" />
      <p className="text-sm text-ink-soft">Loading DropPap</p>
    </div>
  );
}
