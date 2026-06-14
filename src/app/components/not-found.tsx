import Link from "next/link";

export default function ComponentsNotFoundPage() {
  return (
    <main className="th-page th-monochrome">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
        <p className="rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-4 py-2 text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
          404
        </p>
        <h1 className="mt-5 text-[2.2rem] font-semibold leading-tight text-[var(--text-primary)] sm:text-[2.7rem]">
          Component not found
        </h1>
        <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-[var(--th-text-secondary)]">
          The component slug does not exist in the current registry.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/components"
            className="th-btn th-btn-sm th-btn-primary"
          >
            Back to gallery
          </Link>
          <Link
            href="/"
            className="th-btn th-btn-sm th-btn-secondary"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
