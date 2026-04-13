import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

type SectionTone = "canvas" | "surface" | "soft";
type SectionSpacing = keyof typeof visualSystem.sections.types;
type IntroPattern = "centred" | "full" | "split";

type IntroTone = "dark" | "light";

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-white",
  surface: "bg-slate-50",
  soft: "bg-slate-50",
};

const borderClasses = {
  none: "",
  top: "border-t border-slate-200",
  bottom: "border-b border-slate-200",
  both: "border-y border-slate-200",
  softTop: "border-t border-slate-200",
  softBottom: "border-b border-slate-200",
  softBoth: "border-y border-slate-200",
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
  dark: "text-sm font-semibold uppercase tracking-[0.08em] text-slate-500",
  light: "text-sm font-semibold uppercase tracking-[0.08em] text-slate-500",
};

const introTitleClasses: Record<IntroTone, string> = {
  dark: "text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl",
  light: "text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl",
};

const introBodyClasses: Record<IntroTone, string> = {
  dark: "text-base leading-7 text-slate-600",
  light: "text-base leading-7 text-slate-600",
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
        "relative overflow-hidden rounded-xl border p-6 sm:p-7 lg:p-8",
        tone === "dark"
          ? "border-slate-200 bg-slate-50 shadow-sm"
          : "border-slate-200 bg-slate-50 shadow-sm",
        className,
      )}
    >
      {children}
    </article>
  );
}
