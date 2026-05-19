import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

type SectionTone = "canvas" | "surface" | "soft";
type SectionSpacing = keyof typeof visualSystem.sections.types;
type IntroPattern = "centred" | "full" | "split";

type IntroTone = "dark" | "light";

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-[var(--bg-canvas)]",
  surface: "bg-[var(--bg-surface)]",
  soft: "bg-[var(--bg-muted)]",
};

const borderClasses = {
  none: "",
  top: "border-t border-[var(--border-subtle)]",
  bottom: "border-b border-[var(--border-subtle)]",
  both: "border-y border-[var(--border-subtle)]",
  softTop: "border-t border-[var(--border-subtle)]",
  softBottom: "border-b border-[var(--border-subtle)]",
  softBoth: "border-y border-[var(--border-subtle)]",
} as const;

interface SectionShellProps {
  children: ReactNode;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  border?: keyof typeof borderClasses;
  width?: "content" | "page";
  className?: string;
  innerClassName?: string;
}

export function SectionShell({
  children,
  tone = "canvas",
  spacing = "feature",
  border = "none",
  width = "content",
  className,
  innerClassName,
}: SectionShellProps) {
  const VS = visualSystem;
  const needsImplicitSeparation = border === "none";

  return (
    <section
      className={cn(
        VS.sections.types[spacing],
        toneClasses[tone],
        borderClasses[border],
        needsImplicitSeparation ? "section-transition" : "",
        className,
      )}
    >
      <div className={cn(width === "content" ? VS.widths.content : VS.widths.page, innerClassName)}>
        {children}
      </div>
    </section>
  );
}

interface SectionIntroProps {
  title: string;
  eyebrow?: string;
  description?: string;
  pattern?: IntroPattern;
  tone?: IntroTone;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  aside?: ReactNode;
  children?: ReactNode;
}

const introPatternClasses: Record<IntroPattern, string> = {
  centred: "mx-auto max-w-3xl text-center",
  full: "max-w-3xl",
  split: "grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-end",
};

const introEyebrowClasses: Record<IntroTone, string> = {
  dark: "text-[var(--text-small)] font-semibold tracking-[0.08em] uppercase text-[var(--text-meta)]",
  light: "text-[var(--text-small)] font-semibold tracking-[0.08em] uppercase text-[var(--text-meta)]",
};

const introTitleClasses: Record<IntroTone, string> = {
  dark: "font-serif text-[var(--text-h2)] font-semibold leading-[1.08] tracking-normal text-[var(--text-primary)]",
  light: "font-serif text-[var(--text-h2)] font-semibold leading-[1.08] tracking-normal text-[var(--text-primary)]",
};

const introBodyClasses: Record<IntroTone, string> = {
  dark: "text-[var(--text-body)] leading-8 text-[var(--text-secondary)]",
  light: "text-[var(--text-body)] leading-8 text-[var(--text-secondary)]",
};

export function SectionIntro({
  title,
  eyebrow,
  description,
  pattern = "full",
  tone = "dark",
  className,
  titleClassName,
  descriptionClassName,
  aside,
  children,
}: SectionIntroProps) {
  return (
    <div className={cn(introPatternClasses[pattern], className)}>
      <div>
        {eyebrow ? <p className={introEyebrowClasses[tone]}>{eyebrow}</p> : null}
        <h2 className={cn("mt-5", introTitleClasses[tone], titleClassName)}>
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-6 max-w-3xl", introBodyClasses[tone], descriptionClassName)}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {pattern === "split" ? aside : null}
    </div>
  );
}

interface VisualPanelProps {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "soft";
}

export function VisualPanel({ children, className, tone = "dark" }: VisualPanelProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 sm:p-7 lg:p-8",
        tone === "dark"
          ? "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-muted)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
