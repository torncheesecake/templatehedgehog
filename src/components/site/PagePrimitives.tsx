import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  summary: string;
  className?: string;
  titleClassName?: string;
}

export function PageHero({ eyebrow, title, summary, className, titleClassName }: PageHeroProps) {
  return (
    <header className={cn("rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7", className)}>
      {eyebrow ? <p className="text-[var(--text-small)] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">{eyebrow}</p> : null}
      <h1 className={cn("mt-3 text-[var(--text-h1)] font-semibold leading-[1.04] text-[var(--text-primary)]", titleClassName)}>
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-[var(--text-body)] leading-8 text-[var(--text-secondary)]">{summary}</p>
    </header>
  );
}

interface CTAButtonProps {
  href: string;
  label: string;
  tone?: "primary" | "secondary";
  className?: string;
}

export function CTAButton({ href, label, tone = "primary", className }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        tone === "primary"
          ? "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.92rem] font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
          : "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 text-[0.92rem] font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--text-primary)]">
      {children}
    </span>
  );
}
