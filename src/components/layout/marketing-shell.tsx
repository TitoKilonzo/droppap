import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNavigation } from "@/components/layout/marketing-navigation";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Log in" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative border-b border-line bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-0">
          <Link href="/" aria-label="DropPap home" className="rounded-lg">
            <Logo />
          </Link>
          <MarketingNavigation />
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" aria-label="DropPap home" className="inline-flex rounded-lg">
              <Logo />
            </Link>
            <p className="mt-2 text-sm text-ink-soft">Secure file management for teams and departments.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            {footerLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-sm hover:text-forest">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
