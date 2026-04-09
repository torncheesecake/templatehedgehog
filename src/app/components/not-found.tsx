import Link from "next/link";

export default function ComponentsNotFoundPage() {
  return (
    <main className="min-h-screen bg-(--hedgehog-core-navy) text-(--text-primary-dark)">
      <section className="mx-auto flex w-full max-w-[900px] flex-col items-center px-5 py-24 text-center sm:px-8">
        <p className="rounded-full border border-(--surface-line) bg-(--hedgehog-core-navy) px-4 py-2 text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--dune-muted)">
          404
        </p>
        <h1 className="mt-5 text-[2.2rem] font-semibold leading-tight text-(--text-primary-dark) sm:text-[2.7rem]">
          Component not found
        </h1>
        <p className="mt-3 max-w-[52ch] text-[1rem] leading-8 text-(--dune-muted)">
          The component slug does not exist in the current registry.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/components"
            className="inline-flex h-11 items-center rounded-full bg-(--accent-primary) px-5 text-[0.93rem] font-bold text-(--text-primary-dark) transition hover:bg-(--accent-secondary)"
          >
            Back to gallery
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-(--surface-line) bg-(--surface-soft) px-5 text-[0.93rem] font-semibold text-(--text-primary-dark) transition hover:border-(--accent-support)"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
