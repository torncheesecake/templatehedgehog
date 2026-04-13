interface ReportHighlight {
  label: string;
  value: string;
  change: string;
}

interface ReportHighlightsProps {
  rows: ReportHighlight[];
}

export function ReportHighlights({ rows }: ReportHighlightsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Quarterly highlights</h2>
      <p className="mt-1 text-sm text-slate-500">KPI snapshots prepared for board packs</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <article key={row.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{row.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{row.value}</p>
            <p className="mt-1 text-sm text-rose-600">{row.change} vs previous period</p>
          </article>
        ))}
      </div>
    </section>
  );
}
