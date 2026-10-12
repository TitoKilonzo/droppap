"use client";

import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <LogoMark className="size-12" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Something went wrong</h1>
      <p className="max-w-md text-ink-soft">The page could not be loaded. Try again, and contact your administrator if it keeps happening.</p>
      {error.digest ? <p className="text-xs text-ink-soft">Reference: {error.digest}</p> : null}
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
