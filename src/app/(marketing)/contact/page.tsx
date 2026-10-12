import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldQuestion } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact" };

const contactGuidance = [
  {
    icon: MessageCircle,
    title: "Workspace access",
    text: "For an invitation or help joining your organization, contact your workspace administrator.",
  },
  {
    icon: ShieldQuestion,
    title: "Security questions",
    text: "Your administrator can direct security and privacy questions to the right person in your organization.",
  },
  {
    icon: Mail,
    title: "General enquiries",
    text: "DropPap is still getting set up. Please check back for a dedicated support contact.",
  },
];

export default function ContactPage() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-5xl">
          We’ll help you find the right way forward.
        </h1>
        <p className="mt-5 text-lg text-ink-soft">
          Choose the topic that best matches what you need. DropPap is in early development, so workspace support is currently handled by your organization.
        </p>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3" aria-label="Contact options">
        {contactGuidance.map(({ icon: Icon, title, text }) => (
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
        <LinkButton href="/login">Go to log in</LinkButton>
        <LinkButton href="/" variant="secondary">Back home</LinkButton>
      </div>
    </main>
  );
}
