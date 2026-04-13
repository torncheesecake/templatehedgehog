interface StatusBadgeProps {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "border-slate-200 bg-white text-slate-500",
  success: "border-[#2d6a52] bg-[#153a2e] text-[#9df0c3]",
  warning: "border-[#6f5d2d] bg-[#3d3518] text-[#ffe7a8]",
  danger: "border-[#70414a] bg-[#3c1d24] text-[#ffc0cb]",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
