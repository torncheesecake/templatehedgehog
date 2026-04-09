interface RevenueAreaChartProps {
  values: number[];
}

export function RevenueAreaChart({ values }: RevenueAreaChartProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 90 - ((value - min) / span) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `${points} 100,92 0,92`;

  return (
    <div className="rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
      <h2 className="text-xl font-semibold">Revenue trend</h2>
      <p className="mt-1 text-sm text-(--dune-muted)">Last 12 months</p>

      <div className="mt-5 h-60 rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points="0,92 100,92" stroke="#3a3950" strokeWidth="1.2" />
          <polygon points={area} fill="url(#areaFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
