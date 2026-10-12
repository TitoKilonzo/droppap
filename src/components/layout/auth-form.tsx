"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [notice, setNotice] = useState("");
  const fieldsRef = useRef<HTMLDivElement>(null);
  const isRegister = mode === "register";

  function handlePreview() {
    const fields = fieldsRef.current?.querySelectorAll("input");
    if (!fields) return;
    for (const field of fields) {
      if (!field.reportValidity()) return;
    }
    setNotice("Authentication is not enabled yet. Your details were not submitted.");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePreview();
    }
  }

  return (
    <div ref={fieldsRef} role="group" aria-label={isRegister ? "Create account details" : "Log in details"} className="space-y-5">
      {isRegister ? (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
          <input id="name" autoComplete="name" required onKeyDown={handleKeyDown} className="h-11 w-full rounded-lg border border-line bg-white px-3 text-ink outline-none transition focus:border-forest" />
        </div>
      ) : null}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
        <input id="email" type="email" autoComplete="email" required onKeyDown={handleKeyDown} className="h-11 w-full rounded-lg border border-line bg-white px-3 text-ink outline-none transition focus:border-forest" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
        <input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={8} required onKeyDown={handleKeyDown} className="h-11 w-full rounded-lg border border-line bg-white px-3 text-ink outline-none transition focus:border-forest" />
        {isRegister ? <p className="mt-1.5 text-xs text-ink-soft">Use at least 8 characters.</p> : null}
      </div>
      <button type="button" onClick={handlePreview} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-forest px-4 text-sm font-medium text-white transition-colors hover:bg-forest-hover">
        {isRegister ? "Create account" : "Log in"}
      </button>
      {notice ? (
        <p role="status" className="rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink-soft">
          {notice}
        </p>
      ) : null}
      <p className="text-center text-sm text-ink-soft">
        {isRegister ? "Already have an account?" : "New to DropPap?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-forest underline-offset-4 hover:underline">
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
