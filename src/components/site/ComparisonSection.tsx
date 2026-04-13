import { Roboto_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { EffortComparisonVisual, type EffortItem } from "@/components/site/ProductVisuals";
import { visualSystem } from "@/components/site/visualSystem";
import { SectionIntro } from "@/components/site/SectionPrimitives";

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
  containerClassName?: string;
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
  containerClassName,
}: ComparisonSectionProps) {
  const VS = visualSystem;

  return (
    <section className={cn(VS.sections.types.comparison, sectionClassName)}>
      <div className={cn(VS.widths.content, containerClassName)}>
        <SectionIntro
          pattern="full"
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="pt-2 sm:pt-3"
          titleClassName={cn("max-w-3xl", displaySerif.className)}
        />

        <div className="mt-12 rounded-[1.2rem] border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
          <EffortComparisonVisual
            className="mt-2"
            leftTitle={leftTitle}
            rightTitle={rightTitle}
            leftItems={leftItems}
            rightItems={rightItems}
          />
        </div>
      </div>
    </section>
  );
}
