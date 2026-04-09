interface CodePreviewProps {
  code?: string;
}

const defaultCode = `import { Card } from "@/components/ui/Card"
import { formatCurrency } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: number
  change: number
  format?: "currency" | "number" | "percentage"
}

export function MetricCard({ title, value, change, format = "number" }: MetricCardProps) {
  const formatted = format === "currency"
    ? formatCurrency(value)
    : format === "percentage"
      ? \`\${value}%\`
      : value.toLocaleString()

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{formatted}</p>
      <div className="mt-2 flex items-center gap-1">
        <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
          {change >= 0 ? "+" : ""}{change}%
        </span>
        <span className="text-sm text-muted-foreground">vs last month</span>
      </div>
    </Card>
  )
}`;

export function CodePreview({ code = defaultCode }: CodePreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-invert overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-white/50 font-mono">MetricCard.tsx</span>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className="text-white/70 font-mono">{code}</code>
      </pre>
    </div>
  );
}
