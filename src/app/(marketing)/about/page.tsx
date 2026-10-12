import type { Metadata } from "next";
import { FileClock, FolderLock, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "About" };

const principles = [
  {
    icon: FolderLock,
    title: "Private by default",
    text: "Files belong in private storage and should only be shared with the right people.",
  },
  {
    icon: ShieldCheck,
    title: "Access you can trust",
    text: "Permissions are checked on the server, scoped to an organization and recorded for accountability.",
  },
  {
    icon: FileClock,
    title: "Built for everyday teams",
    text: "Departments can organize work and keep a clear history as documents change.",
  },
];

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest">About DropPap</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-5xl">
          A calmer, safer home for team files.
        </h1>
        <p className="mt-5 text-lg text-ink-soft">
          DropPap is being built to help organizations keep important documents organized, private and easy to share with the right people.
        </p>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3" aria-label="Our principles">
        {principles.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-mint text-forest">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
          </article>
        ))}
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <LinkButton href="/contact">Contact us</LinkButton>
        <LinkButton href="/" variant="secondary">Back home</LinkButton>
      </div>
    </main>
  );
}
