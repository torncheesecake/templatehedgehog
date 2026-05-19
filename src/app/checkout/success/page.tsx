"use client";

import { useEffect } from "react";

export default function CheckoutSuccessRedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id")?.trim();
    const destination = sessionId
      ? `/success?session_id=${encodeURIComponent(sessionId)}`
      : "/success";
    window.location.replace(destination);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-canvas)] px-5 text-center text-[var(--text-primary)]">
      <div>
        <h1 className="text-[1.6rem] font-semibold">Redirecting to your download.</h1>
        <p className="mt-3 text-[0.98rem] text-[var(--text-secondary)]">
          If this page does not move automatically, open the success page from your checkout confirmation.
        </p>
      </div>
    </main>
  );
}
