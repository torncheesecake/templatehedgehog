interface TeamCapacityChartProps {
  values: Array<{ label: string; utilisation: number }>;
}

export function TeamCapacityChart({ values }: TeamCapacityChartProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Capacity by function</h2>
      <p className="mt-1 text-sm text-slate-500">Workload visibility for operational planning</p>

      <div className="mt-5 space-y-3">
        {values.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="text-slate-500">{item.utilisation}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-(--accent-primary) to-(--accent-primary)"
                style={{ width: `${item.utilisation}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
