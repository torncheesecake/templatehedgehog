import Link from "next/link";

export default function ComponentsNotFoundPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
        <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-500">
          404
        </p>
        <h1 className="mt-5 text-[2.2rem] font-semibold leading-tight text-slate-900 sm:text-[2.7rem]">
          Component not found
        </h1>
        <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-500">
          The component slug does not exist in the current registry.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/components"
            className="inline-flex h-11 items-center rounded-full bg-rose-600 px-5 text-[0.93rem] font-bold text-white transition hover:bg-rose-700"
          >
            Back to gallery
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-5 text-[0.93rem] font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
