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
    <section className="rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
      <h2 className="text-xl font-semibold">Quarterly highlights</h2>
      <p className="mt-1 text-sm text-(--dune-muted)">KPI snapshots prepared for board packs</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <article key={row.label} className="rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4">
            <p className="text-sm text-(--dune-muted)">{row.label}</p>
            <p className="mt-1 text-2xl font-semibold text-(--surface-strong)">{row.value}</p>
            <p className="mt-1 text-sm text-(--accent-primary)">{row.change} vs previous period</p>
          </article>
        ))}
      </div>
    </section>
  );
}
