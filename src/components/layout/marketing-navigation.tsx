"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function navLinkClass(active: boolean) {
  return cn(
    "rounded-lg px-3 py-2 text-sm transition-colors hover:bg-mint hover:text-forest",
    active ? "font-semibold text-forest" : "text-ink-soft",
  );
}

export function MarketingNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:flex">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={navLinkClass(pathname === href)}>
            {label}
          </Link>
        ))}
        <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={cn(navLinkClass(pathname === "/login"), "font-medium")}>
          Log in
        </Link>
        <LinkButton href="/register" aria-current={pathname === "/register" ? "page" : undefined}>Register</LinkButton>
      </nav>

      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-forest transition-colors hover:bg-mint lg:hidden"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open ? (
        <nav id={menuId} aria-label="Mobile navigation" className="absolute inset-x-0 top-full z-30 border-b border-line bg-white px-4 py-3 shadow-pop lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={navLinkClass(pathname === href)}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              <Link
                href="/login"
                aria-current={pathname === "/login" ? "page" : undefined}
                className={cn(navLinkClass(pathname === "/login"), "flex flex-1 items-center justify-center font-medium")}
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <LinkButton
                href="/register"
                aria-current={pathname === "/register" ? "page" : undefined}
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Register
              </LinkButton>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
