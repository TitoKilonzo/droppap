import { LogoMark } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <LogoMark className="size-12" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="max-w-md text-ink-soft">The page does not exist, or you do not have access to it.</p>
      <LinkButton href="/">Back to home</LinkButton>
    </main>
  );
}
