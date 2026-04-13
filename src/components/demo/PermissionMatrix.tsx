import { ShieldCheck } from "lucide-react";

type Role = "Admin" | "Support" | "Billing" | "Analyst";

const matrix: Array<{ permission: string; admin: boolean; support: boolean; billing: boolean; analyst: boolean }> = [
  { permission: "Manage subscriptions", admin: true, support: false, billing: true, analyst: false },
  { permission: "Issue credits", admin: true, support: true, billing: true, analyst: false },
  { permission: "Export customer data", admin: true, support: false, billing: false, analyst: true },
  { permission: "Invite team members", admin: true, support: false, billing: false, analyst: false },
  { permission: "Access revenue reports", admin: true, support: false, billing: true, analyst: true },
];

function Cell({ enabled }: { enabled: boolean }) {
  return (
    <td className="py-3 text-center">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${enabled ? "bg-rose-600" : "bg-slate-100"}`}
        aria-label={enabled ? "Enabled" : "Disabled"}
      />
    </td>
  );
}

function Header({ label }: { label: Role }) {
  return <th className="py-2 text-center text-sm font-medium text-slate-500">{label}</th>;
}

export function PermissionMatrix() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Permission matrix</h2>
          <p className="mt-1 text-sm text-slate-500">Visibility of role-based access across core actions</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          RBAC policy
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="pb-2 text-sm font-medium text-slate-500">Permission</th>
              <Header label="Admin" />
              <Header label="Support" />
              <Header label="Billing" />
              <Header label="Analyst" />
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.permission} className="border-b border-slate-300 last:border-0">
                <td className="py-3.5 text-sm text-[#f7e9e3]">{row.permission}</td>
                <Cell enabled={row.admin} />
                <Cell enabled={row.support} />
                <Cell enabled={row.billing} />
                <Cell enabled={row.analyst} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
