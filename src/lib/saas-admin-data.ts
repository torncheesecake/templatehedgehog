import { TEMPLATE_CONFIG } from "@/config/template";

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: number[];
}

export interface Invoice {
  id: string;
  company: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
}

export interface TeamMember {
  name: string;
  role: "Admin" | "Support" | "Billing" | "Analyst";
  email: string;
  status: "Active" | "Invited";
}

export interface Customer {
  company: string;
  plan: "Starter" | "Growth" | "Scale";
  seats: number;
  arr: number;
  health: "Strong" | "Moderate" | "Risk";
}

function demoTeamEmail(localPart: string): string {
  return `${localPart}@${TEMPLATE_CONFIG.domain}`;
}

export const kpis: KPI[] = [
  { label: "MRR", value: "£84,320", change: "+8.1%", trend: [52, 56, 58, 61, 64, 68, 72] },
  { label: "Active Customers", value: "1,284", change: "+4.3%", trend: [44, 46, 47, 49, 51, 53, 55] },
  { label: "Net Revenue Retention", value: "112%", change: "+1.4%", trend: [48, 49, 50, 51, 52, 52, 53] },
  { label: "Churn", value: "2.1%", change: "-0.5%", trend: [62, 60, 58, 55, 53, 50, 47] },
];

export const revenueTrend = [42, 48, 46, 54, 59, 63, 68, 72, 70, 76, 81, 84];

export const revenueBySegment = [
  { label: "Starter", value: 22 },
  { label: "Growth", value: 38 },
  { label: "Scale", value: 40 },
];

export const recentInvoices: Invoice[] = [
  { id: "INV-4381", company: "Northstar Bio", amount: 1440, status: "Paid", date: "2026-03-04" },
  { id: "INV-4380", company: "Axion Cloud", amount: 3200, status: "Overdue", date: "2026-03-02" },
  { id: "INV-4379", company: "BrightForge", amount: 920, status: "Paid", date: "2026-03-01" },
  { id: "INV-4378", company: "Harbour Ops", amount: 2180, status: "Pending", date: "2026-02-28" },
  { id: "INV-4377", company: "Lumen Retail", amount: 960, status: "Pending", date: "2026-02-26" },
  { id: "INV-4376", company: "Nexus Fleet", amount: 2650, status: "Paid", date: "2026-02-24" },
  { id: "INV-4375", company: "Orion Legal", amount: 1290, status: "Overdue", date: "2026-02-22" },
  { id: "INV-4374", company: "Peak Dynamics", amount: 1760, status: "Paid", date: "2026-02-20" },
];

export const activityTimeline = [
  { title: "Invoice INV-4381 paid", detail: "Northstar Bio completed payment", time: "2h ago" },
  { title: "New team invite sent", detail: "Finance role invited for Axion Cloud", time: "5h ago" },
  { title: "Usage alert triggered", detail: "Lumen Retail reached 90% of seat limit", time: "Yesterday" },
  { title: "Plan upgraded", detail: "Harbour Ops moved from Growth to Scale", time: "Yesterday" },
];

export const teamMembers: TeamMember[] = [
  { name: "Amelia Stone", role: "Admin", email: demoTeamEmail("amelia"), status: "Active" },
  { name: "Lewis Kent", role: "Support", email: demoTeamEmail("lewis"), status: "Active" },
  { name: "Noah Reed", role: "Billing", email: demoTeamEmail("noah"), status: "Invited" },
  { name: "Olivia Hart", role: "Analyst", email: demoTeamEmail("olivia"), status: "Active" },
  { name: "Mia Harper", role: "Support", email: demoTeamEmail("mia"), status: "Active" },
];

export const customers: Customer[] = [
  { company: "Northstar Bio", plan: "Scale", seats: 28, arr: 17280, health: "Strong" },
  { company: "Axion Cloud", plan: "Growth", seats: 16, arr: 12960, health: "Moderate" },
  { company: "BrightForge", plan: "Starter", seats: 8, arr: 4320, health: "Moderate" },
  { company: "Harbour Ops", plan: "Scale", seats: 22, arr: 14520, health: "Strong" },
  { company: "Lumen Retail", plan: "Growth", seats: 11, arr: 8640, health: "Risk" },
  { company: "Nexus Fleet", plan: "Scale", seats: 34, arr: 22680, health: "Strong" },
  { company: "Orion Legal", plan: "Starter", seats: 6, arr: 3240, health: "Risk" },
  { company: "Peak Dynamics", plan: "Growth", seats: 19, arr: 15360, health: "Moderate" },
  { company: "QuantBridge", plan: "Scale", seats: 41, arr: 29160, health: "Strong" },
  { company: "Summit Works", plan: "Growth", seats: 15, arr: 11880, health: "Moderate" },
];

export const plans = [
  { name: "Starter", price: "£39", note: "For small teams and pilots" },
  { name: "Growth", price: "£99", note: "For scaling B2B SaaS products" },
  { name: "Scale", price: "£199", note: "For high-usage and multi-team accounts" },
];

export const reportHighlights = [
  { label: "Pipeline conversion", value: "34.8%", change: "+2.1%" },
  { label: "Average payback", value: "5.2 months", change: "-0.4" },
  { label: "Expansion revenue", value: "£21,600", change: "+11.3%" },
  { label: "Support SLA", value: "98.7%", change: "+0.6%" },
];

export const funnelStages = [
  { label: "Website visits", value: 12680 },
  { label: "Qualified leads", value: 3210 },
  { label: "Sales calls", value: 1240 },
  { label: "Proposals sent", value: 640 },
  { label: "Deals won", value: 264 },
];

export const onboardingWorkflows = [
  { title: "Connect billing provider", owner: "Finance", done: true },
  { title: "Set workspace permissions", owner: "Operations", done: true },
  { title: "Configure invoice sequence", owner: "Revenue Ops", done: false },
  { title: "Import first 100 customers", owner: "CS", done: false },
  { title: "Enable weekly KPI digest", owner: "Leadership", done: false },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}
