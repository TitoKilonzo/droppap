import { Building2, FileClock, FolderLock, Link2, ScrollText, Search, ShieldCheck, UploadCloud } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const capabilities = [
  { icon: Building2, title: "Departments and roles", text: "Owners, administrators, department heads, employees and read-only members each get exactly the access their role allows." },
  { icon: UploadCloud, title: "Direct private uploads", text: "Files go from the browser straight to private object storage and become available only after the server verifies them." },
  { icon: FileClock, title: "Version history", text: "Replace a document without losing the previous version. Every version keeps its own size, type and uploader." },
  { icon: Link2, title: "Sharing that expires", text: "Share with people or departments, or send a read-only link that expires, can be revoked and can limit downloads." },
  { icon: Search, title: "Search by what you can open", text: "Find files by name, tag, owner, department, date and type. Results never include documents you cannot access." },
  { icon: ScrollText, title: "Audit trail", text: "Sensitive actions are recorded for owners and administrators without storing file contents or secrets." },
];

const accessPath = [
  { label: "Organization", note: "Members, roles and storage quota" },
  { label: "Departments", note: "Finance, HR, Engineering and others" },
  { label: "Folders and files", note: "Private by default, shared on purpose" },
  { label: "Share links", note: "Read-only, expiring, revocable" },
];

const safeguards = [
  "Every request is authorized on the server, scoped to your organization.",
  "Documents live in private storage and are reached through short-lived signed links.",
  "Share link tokens are stored only as hashes and can be revoked at any time.",
  "Platform administrators cannot read confidential file contents.",
];

export default function LandingPage() {
  return (
    <main id="main">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-forest">A private workspace for your team</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-5xl">Company files stay with the people who should see them.</h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              DropPap gives every department a private place to store, version and share documents. Access is decided on the server and recorded in an audit trail.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/register" size="lg">
                Get started
              </LinkButton>
              <LinkButton href="/dashboard" variant="secondary" size="lg">
                Open workspace
              </LinkButton>
            </div>
          </div>

          <div id="access" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6" aria-labelledby="access-title">
            <h2 id="access-title" className="text-base font-semibold text-ink">
              How access flows
            </h2>
            <p className="mt-1 text-sm text-ink-soft">Each layer narrows who can open a document.</p>
            <ol className="mt-5 space-y-3">
              {accessPath.map((step, index) => (
                <li key={step.label} className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-mint text-forest">
                    <FolderLock className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{step.label}</span>
                    <span className="block text-sm text-ink-soft">{step.note}</span>
                  </span>
                  <span className="ml-auto pt-1 text-xs font-medium tabular-nums text-ink-soft">0{index + 1}</span>
                </li>
              ))}
            </ol>
          </div>
      </section>

      <section id="capabilities" className="border-y border-line bg-white" aria-labelledby="capabilities-title">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-forest">Everything in its place</p>
            <h2 id="capabilities-title" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Built for how departments actually work
            </h2>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl border border-line bg-canvas p-5 transition-colors hover:border-mint-strong hover:bg-white">
                <span className="flex size-10 items-center justify-center rounded-lg bg-mint text-forest">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="security-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="security-title" className="text-2xl font-semibold tracking-tight text-ink">
              Private by default
            </h2>
            <p className="mt-3 text-ink-soft">Security rules are enforced by the server, not by what the interface chooses to show.</p>
          </div>
          <ul className="space-y-4">
            {safeguards.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
