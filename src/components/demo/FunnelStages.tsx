import { formatCurrency } from "@/lib/saas-admin-data";

interface FunnelStage {
  label: string;
  value: number;
}

interface FunnelStagesProps {
  stages: FunnelStage[];
}

export function FunnelStages({ stages }: FunnelStagesProps) {
  const peak = Math.max(...stages.map((stage) => stage.value));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Demand funnel</h2>
      <p className="mt-1 text-sm text-slate-500">Acquisition to close tracking for leadership reviews</p>

      <div className="mt-5 space-y-3">
        {stages.map((stage) => {
          const width = Math.round((stage.value / peak) * 100);
          return (
            <div key={stage.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span>{stage.label}</span>
                <span className="text-slate-500">{stage.value.toLocaleString("en-GB")}</span>
              </div>
              <div className="h-2.5 rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-(--accent-primary) via-(--accent-primary) to-(--accent-primary)"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Estimated new ARR from current funnel</p>
        <p className="mt-1 text-3xl font-semibold text-rose-600">{formatCurrency(147000)}</p>
      </div>
    </section>
  );
}
