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
      className: "border-(--surface-line) bg-[rgba(22,163,74,0.18)] text-(--text-primary-dark)",
    };
  }

  if (status === "partial") {
    return {
      label: "Partial",
      className: "border-(--surface-line) bg-[rgba(249,115,22,0.2)] text-(--text-primary-dark)",
    };
  }

  return {
    label: "Unknown",
    className: "border-(--surface-line) bg-(--surface-strong) text-(--th-body-copy)",
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
          <tr className="border-b border-(--surface-line) text-[0.84rem] uppercase tracking-[0.08em] text-(--th-body-copy)">
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
              <tr key={`${item.client}-${item.status}`} className="border-b border-(--surface-line) last:border-b-0">
                <th
                  scope="row"
                  className="px-3 py-3.5 text-[1rem] font-semibold text-(--foreground)"
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
                <td className="px-3 py-3.5 text-[0.95rem] leading-7 text-(--dune-muted)">
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
