import Link from "next/link";

export default function ComponentsNotFoundPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--th-text-secondary)]">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
        <p className="rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-4 py-2 text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
          404
        </p>
        <h1 className="mt-5 text-[2.2rem] font-semibold leading-tight text-white sm:text-[2.7rem]">
          Component not found
        </h1>
        <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-[var(--th-text-secondary)]">
          The component slug does not exist in the current registry.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/components"
            className="inline-flex h-11 items-center rounded-full bg-[var(--action-primary)] px-5 text-[0.93rem] font-bold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)]"
          >
            Back to gallery
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-5 text-[0.93rem] font-semibold text-white transition hover:border-[var(--border-subtle)]"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
