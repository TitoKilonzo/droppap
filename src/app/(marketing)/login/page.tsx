import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/layout/auth-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto grid min-h-[36rem] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:py-20">
      <section className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest">Welcome back</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-5xl">Your team’s files, all in one place.</h1>
        <p className="mt-5 text-lg text-ink-soft">Log in to continue to your organization’s DropPap workspace.</p>
        <Link href="/" className="mt-8 inline-flex rounded-lg px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-mint">
          ← Back home
        </Link>
      </section>
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8" aria-labelledby="login-title">
        <h2 id="login-title" className="text-2xl font-semibold tracking-tight text-ink">Log in</h2>
        <p className="mt-2 text-sm text-ink-soft">Authentication is not enabled yet. This form is a preview.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
