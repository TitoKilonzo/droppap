"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils/cn";
import { WORKSPACE_NAV } from "./nav";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {WORKSPACE_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-mint text-forest" : "text-mint/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function WorkspaceShell({ organizationName, children }: { organizationName: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="on-forest hidden bg-forest px-4 py-6 lg:block">
        <Logo inverted className="px-2" />
        <div className="mt-8">
          <NavList />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-mint lg:hidden"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <span className="text-sm font-medium text-ink">{organizationName}</span>
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside id={drawerId} role="dialog" aria-modal="true" aria-label="Navigation" className="on-forest relative h-full w-72 max-w-[85%] bg-forest px-4 py-6 shadow-pop">
            <div className="flex items-center justify-between px-2">
              <Logo inverted />
              <button type="button" aria-label="Close navigation" className="inline-flex size-9 items-center justify-center rounded-lg text-mint hover:bg-white/10" onClick={() => setOpen(false)}>
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
