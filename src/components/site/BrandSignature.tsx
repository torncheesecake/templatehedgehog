import { cn } from "@/lib/utils";

interface BrandSignatureProps {
  index?: string;
  label: string;
  className?: string;
}

export function BrandSignature({ index, label, className }: BrandSignatureProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 text-[0.78rem] tracking-[0.08em] text-[var(--text-meta)]", className)}>
      {index ? <span className="font-medium text-[var(--text-meta)]">{index}</span> : null}
      <span className="h-px w-10 bg-[var(--border-strong)]" />
      <span className="uppercase">{label}</span>
    </div>
  );
}
