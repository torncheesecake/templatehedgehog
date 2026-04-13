import type { EmailCompatibility } from "@/data/email-components";

interface CompatibilityTableProps {
  compatibility: EmailCompatibility[];
  caption?: string;
  className?: string;
}

function getStatusStyles(status: EmailCompatibility["status"]) {
  if (status === "tested") {
    return {
      label: "Tested",
      className: "border-slate-200 bg-[rgba(22,163,74,0.18)] text-slate-900",
    };
  }

  if (status === "partial") {
    return {
      label: "Partial",
      className: "border-slate-200 bg-[rgba(249,115,22,0.2)] text-slate-900",
    };
  }

  return {
    label: "Unknown",
    className: "border-slate-200 bg-white text-slate-600",
  };
}

export function CompatibilityTable({
  compatibility,
  caption = "Email client compatibility table",
  className = "",
}: CompatibilityTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[420px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-slate-200 text-[0.84rem] uppercase tracking-[0.08em] text-slate-600">
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Client
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Status
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {compatibility.map((item) => {
            const statusMeta = getStatusStyles(item.status);

            return (
              <tr key={`${item.client}-${item.status}`} className="border-b border-slate-200 last:border-b-0">
                <th
                  scope="row"
                  className="px-3 py-3.5 text-[1rem] font-semibold text-slate-900"
                >
                  {item.client}
                </th>
                <td className="px-3 py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.82rem] font-semibold uppercase tracking-[0.04em] ${statusMeta.className}`}
                  >
                    {statusMeta.label}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-[0.95rem] leading-7 text-slate-500">
                  {item.notes ? item.notes : "No additional notes."}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
