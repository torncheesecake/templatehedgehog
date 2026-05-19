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
      className: "border-[var(--border-strong)] bg-[var(--bg-accent-soft)] text-[var(--text-primary)]",
    };
  }

  if (status === "partial") {
    return {
      label: "Partial",
      className: "border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)]",
    };
  }

  return {
    label: "Unknown",
    className: "border-[var(--th-border-dark)] bg-[var(--bg-canvas)] text-[var(--th-text-secondary)]",
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
          <tr className="border-b border-[var(--th-border-dark)] text-[0.84rem] uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
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
              <tr key={`${item.client}-${item.status}`} className="border-b border-[var(--th-border-dark)] last:border-b-0">
                <th
                  scope="row"
                  className="px-3 py-3.5 text-[1rem] font-semibold text-[var(--text-primary)]"
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
                <td className="px-3 py-3.5 text-[0.95rem] leading-7 text-[var(--th-text-secondary)]">
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
