import { Roboto_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { EffortComparisonVisual, type EffortItem } from "@/components/site/ProductVisuals";
import { visualSystem } from "@/components/site/visualSystem";

const displaySerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface ComparisonSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: EffortItem[];
  rightItems: EffortItem[];
  sectionClassName?: string;
}

export function ComparisonSection({
  eyebrow,
  title,
  description,
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  sectionClassName,
}: ComparisonSectionProps) {
  const VS = visualSystem;

  return (
    <section className={cn(VS.sections.types.comparison, sectionClassName)}>
      <div className={VS.widths.page}>
        <div className={VS.sections.intros.fullWidth}>
          <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--accent-support)">{eyebrow}</p>
          <h2
            className={cn(
              "mt-3 max-w-[18ch] text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.5rem]",
              displaySerif.className,
            )}
          >
            {title}
          </h2>
          <p className="mt-4 max-w-[72ch] text-[1rem] leading-8 text-(--th-body-copy)">{description}</p>
        </div>

        <EffortComparisonVisual
          className={VS.sections.intros.contentGap}
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          leftItems={leftItems}
          rightItems={rightItems}
        />
      </div>
    </section>
  );
}
