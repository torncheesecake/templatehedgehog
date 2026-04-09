"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "home-email-capture",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to subscribe right now.");
      }

      setSubmitted(true);
      setEmail("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border bg-surface-secondary py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Get notified about updates and new releases
          </h2>
          <p className="mt-2 text-text-secondary">
            Be the first to know about new templates and major updates.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg bg-success-light p-4">
              <p className="text-sm font-medium text-success">
                You&apos;re in! We&apos;ll keep you posted.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </Button>
            </form>
          )}

          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <p className="mt-3 text-xs text-text-tertiary">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
