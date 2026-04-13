"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

interface WaitlistFormProps {
  className?: string;
  source?: string;
  buttonLabel?: string;
  placeholder?: string;
}

export function WaitlistForm({
  className = "",
  source,
  buttonLabel = "Get early access",
  placeholder = "you@company.com",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You are on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-xl flex-col gap-3 sm:flex-row ${className}`}>
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        className="h-12 flex-1 rounded-[0.72rem] border border-[hsl(var(--th-accent)/0.42)] bg-[rgba(8,16,32,0.62)] px-4 text-base text-slate-900 placeholder:text-slate-500 focus:border-rose-700 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-[0.72rem] border border-rose-600 bg-rose-600 px-6 text-base font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Joining..." : buttonLabel}
      </button>
      {message ? (
        <p
          className={`w-full rounded-[0.72rem] px-3 py-2 text-base ${
            status === "error"
              ? "border border-[#9f4957] bg-[rgba(73,24,34,0.5)] text-[#ffc7d1]"
              : "border border-[#3f7a63] bg-[rgba(19,53,41,0.5)] text-[#b6f4d4]"
          }`}
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
