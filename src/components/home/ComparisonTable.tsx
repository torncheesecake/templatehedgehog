import { TEMPLATE_CONFIG } from "@/config/template";

const rows = [
  { label: "Time to ship", hedgehog: "1 week", custom: "3+ months", themeforest: "2-3 weeks" },
  { label: "Business logic included", hedgehog: true, custom: true, themeforest: false },
  { label: "ERP / NetSuite ready", hedgehog: true, custom: true, themeforest: false },
  { label: "Code quality", hedgehog: "A+", custom: "Varies", themeforest: "C" },
  { label: "TypeScript", hedgehog: true, custom: "Varies", themeforest: "Rarely" },
  { label: "Tailwind CSS", hedgehog: true, custom: true, themeforest: "Rarely" },
  { label: "Developer support", hedgehog: true, custom: "N/A", themeforest: "Varies" },
  { label: "Cost", hedgehog: "£299", custom: "£15k+", themeforest: "£30-60" },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg className="mx-auto h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ) : (
      <svg className="mx-auto h-5 w-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return <span>{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Compare</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {TEMPLATE_CONFIG.brandName} vs the alternatives
          </h2>
          <p className="mt-4 text-lg leading-8 text-text-secondary">
            See how our template compares to building from scratch or buying
            from generic marketplaces.
          </p>
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="mx-auto w-full max-w-4xl">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="py-4 pr-6 text-left text-sm font-medium text-text-secondary" />
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                  <div
                    className="rounded-lg px-4 py-2 font-semibold"
                    style={{ background: "rgba(222, 210, 204,0.08)" }}
                  >
                    {TEMPLATE_CONFIG.brandName}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">
                  Build Custom
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">
                  ThemeForest
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="py-4 pr-6 text-sm font-medium text-text-primary">
                    {row.label}
                  </td>
                  <td
                    className="px-6 py-4 text-center text-sm font-medium text-text-primary"
                    style={{ background: "rgba(222, 210, 204,0.03)" }}
                  >
                    <CellValue value={row.hedgehog} />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-text-secondary">
                    <CellValue value={row.custom} />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-text-secondary">
                    <CellValue value={row.themeforest} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
