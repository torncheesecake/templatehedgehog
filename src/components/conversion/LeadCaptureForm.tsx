"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { track } from "@/lib/analytics";

type LeadCaptureFormProps = {
  source: string;
  compact?: boolean;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function LeadCaptureForm({ source, compact = false }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });
      const payload = await response.json().catch(() => ({})) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setState("error");
        setMessage(payload.error ?? "Could not save your email. Please try again.");
        return;
      }

      track("lead_capture_submit", { source });
      setState("success");
      setMessage(payload.message ?? "Saved. We will send product updates and implementation notes.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Could not save your email. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="sr-only" htmlFor={`lead-email-${source}`}>
          Email address
        </label>
        <input
          id={`lead-email-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="work@email.com"
          className="h-12 min-w-0 rounded-[0.82rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 text-[0.95rem] font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-meta)] focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--action-primary)]"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-12 items-center justify-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.92rem] font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? "Saving" : "Get QA checklist"}
          {state === "submitting" ? null : <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      <p className="mt-3 text-[0.86rem] leading-6 text-[var(--text-secondary)]">
        Receive the production email QA checklist and product update notes. No generic newsletter.
      </p>
      {message ? (
        <div
          className={`mt-3 flex items-start gap-2 text-[0.86rem] font-semibold leading-6 ${
            state === "success" ? "text-[var(--text-primary)]" : "text-[var(--action-primary)]"
          }`}
          role="status"
        >
          {state === "success" ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> : null}
          <span>
            {message}
            {state === "success" ? (
              <>
                {" "}
                <a
                  className="underline underline-offset-4"
                  href="/resources/production-email-qa-checklist.txt"
                >
                  Open the checklist.
                </a>
              </>
            ) : null}
          </span>
        </div>
      ) : null}
    </form>
  );
}
