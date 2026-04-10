import { type ReactNode } from "react";
import { Roboto_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

const displaySerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

type SectionTone = "canvas" | "surface" | "soft";
type SectionSpacing = keyof typeof visualSystem.sections.types;
type IntroPattern = "centred" | "full" | "split";

type IntroTone = "dark" | "light";

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-(--surface-strong)",
  surface: "bg-(--surface-soft)",
  soft: "bg-(--bg-soft)",
};

const borderClasses = {
  none: "",
  top: "border-t border-(--surface-line)",
  bottom: "border-b border-(--surface-line)",
  both: "border-y border-(--surface-line)",
  softTop: "border-t border-(--border-light)",
  softBottom: "border-b border-(--border-light)",
  softBoth: "border-y border-(--border-light)",
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
        needsImplicitSeparation ? "th-section-transition" : "",
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
  centred: "mx-auto max-w-[76ch] text-center",
  full: "max-w-[86ch]",
  split: "grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-end",
};

const introEyebrowClasses: Record<IntroTone, string> = {
  dark: "text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)",
  light: "text-[1rem] font-semibold tracking-[0.012em] text-(--text-secondary-light)",
};

const introTitleClasses: Record<IntroTone, string> = {
  dark: "text-[2.05rem] font-semibold leading-[0.94] text-(--text-primary-dark) sm:text-[2.75rem]",
  light: "text-[2.05rem] font-semibold leading-[0.94] text-(--text-primary-light) sm:text-[2.75rem]",
};

const introBodyClasses: Record<IntroTone, string> = {
  dark: "text-[1rem] leading-8 text-(--th-body-copy)",
  light: "text-[1rem] leading-8 text-(--text-secondary-light)",
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
        <h2 className={cn("mt-4", introTitleClasses[tone], displaySerif.className, titleClassName)}>
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-5 max-w-[74ch]", introBodyClasses[tone], descriptionClassName)}>
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
        "relative overflow-hidden rounded-[1.08rem] border p-6 sm:p-7 lg:p-8",
        tone === "dark"
          ? "border-(--surface-line) bg-(--surface-soft) shadow-[0_22px_42px_rgba(0,0,0,0.34)]"
          : "border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.09)]",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.42),transparent)]" />
      {children}
    </article>
  );
}
