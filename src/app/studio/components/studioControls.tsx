import type { ReactNode } from "react";

export function getStatusTone(status: "pass" | "warn" | "fail") {
  if (status === "pass") return "border-[#6ee7b7]/30 bg-[#052116] text-[#bbf7d0]";
  if (status === "warn") return "border-amber-300/35 bg-amber-950/25 text-amber-100";
  return "border-red-300/35 bg-red-950/30 text-red-100";
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
      {children}
    </h2>
  );
}

export function IconPanelButton({
  children,
  active = false,
  onClick,
  disabled = false,
  testId,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[0.76rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] disabled:cursor-not-allowed disabled:opacity-55 ${
        active
          ? "border-[#8b5cf6]/60 bg-[#7c3aed] text-white shadow-[0_0_24px_rgba(124,58,237,0.2)]"
          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {children}
    </button>
  );
}
