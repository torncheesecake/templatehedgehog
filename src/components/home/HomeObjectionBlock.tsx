"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

type ObjectionItem = {
  id: string;
  question: string;
  answer: string;
};

const objectionItems: ObjectionItem[] = [
  {
    id: "who-for",
    question: "Who this is for",
    answer:
      "Developers, technical email builders, and teams shipping repeated campaign and lifecycle sends.",
  },
  {
    id: "who-not-for",
    question: "Who this is not for",
    answer:
      "Teams wanting drag-and-drop editing or a design gallery without implementation ownership.",
  },
  {
    id: "licence",
    question: "What the licence means",
    answer:
      "One payment for Hedgehog Core with commercial use across your own and client projects.",
  },
  {
    id: "updates",
    question: "How updates work",
    answer:
      "Versioned releases with changelog context so adoption stays predictable.",
  },
  {
    id: "docs-support",
    question: "Docs and support",
    answer:
      "Practical docs are included, and support pages cover implementation and handoff questions.",
  },
  {
    id: "compiled-html",
    question: "Compiled HTML included",
    answer:
      "Yes. MJML source and compiled HTML are both included for QA and ESP import.",
  },
];

export function HomeObjectionBlock() {
  return (
    <article className="rounded-[1.2rem] border border-slate-700 bg-slate-900 p-6 sm:p-7">
      <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-300">
        Decision checks before you buy
      </p>
      <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-slate-400">
        Concise answers to the objections that usually block purchase.
      </p>

      <div className="mt-6 space-y-3">
        {objectionItems.map((item) => (
          <details
            key={item.id}
            className="rounded-[0.9rem] border border-slate-700 bg-[#07111f] px-4 py-3"
            onToggle={(event) => {
              if (event.currentTarget.open) {
                track("faq_expand", { source: "homepage", question: item.id });
              }
            }}
          >
            <summary className="cursor-pointer text-[0.9rem] font-semibold text-slate-100">
              {item.question}
            </summary>
            <p className="mt-2 text-[0.9rem] leading-7 text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 text-[0.86rem] font-semibold">
        <Link
          href="/docs"
          onClick={() => track("docs_click", { source: "objection_block" })}
          className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
        >
          Documentation
        </Link>
        <Link
          href="/changelog"
          onClick={() => track("changelog_click", { source: "objection_block" })}
          className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
        >
          Changelog
        </Link>
        <Link
          href="/pricing"
          onClick={() => track("licence_click", { source: "objection_block" })}
          className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
        >
          Licence and pricing
        </Link>
        <Link
          href="/support"
          className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
        >
          Support
        </Link>
      </div>
    </article>
  );
}

