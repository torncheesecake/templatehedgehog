interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: number[];
}

export function MetricCard({ label, value, change, trend }: MetricCardProps) {
  const up = !change.startsWith("-");
  const max = Math.max(...trend);
  const points = trend
    .map((n, i) => `${(i / (trend.length - 1)) * 100},${100 - (n / max) * 100}`)
    .join(" ");

  return (
    <div className="animate-fade-rise rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4 transition hover:-translate-y-[2px] hover:border-(--hedgehog-core-blue-deep)">
      <p className="text-sm text-(--dune-muted)">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className={`mt-1 text-sm ${up ? "text-[#7edb9f]" : "text-[#ffc0cb]"}`}>{change}</p>
      <div className="mt-3 h-10 rounded-md bg-(--hedgehog-core-navy) p-1.5">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={up ? "var(--accent-primary)" : "#ff9eb0"}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}
