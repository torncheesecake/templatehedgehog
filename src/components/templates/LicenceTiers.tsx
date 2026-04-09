import { BadgeCheck } from "lucide-react";

const tiers = [
  {
    name: "Single Project",
    price: "£299",
    note: "One production product or one client deployment",
    items: ["Full source code", "All current pages", "6 months updates", "Email support"],
  },
  {
    name: "Studio",
    price: "£699",
    note: "For agencies building multiple paid client products",
    items: ["Everything in Single Project", "Up to 10 client deployments", "12 months updates", "Priority support"],
    featured: true,
  },
  {
    name: "Unlimited",
    price: "£1,299",
    note: "For teams shipping repeatedly across products",
    items: ["Unlimited internal and client projects", "Perpetual updates access", "Priority support lane", "Commercial expansion rights"],
  },
];

export function LicenceTiers() {
  return (
    <section className="mt-8 rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-6">
      <h2 className="text-2xl font-semibold">Licensing and support</h2>
      <p className="mt-1 text-sm text-(--dune-muted)">Clear commercial terms for freelancers, studios, and product teams</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`rounded-xl border p-5 ${
              tier.featured
                ? "border-(--accent-primary) bg-[linear-gradient(160deg,#3a3950,var(--hedgehog-core-navy))]"
                : "border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy)"
            }`}
          >
            <p className="text-sm text-(--dune-muted)">{tier.name}</p>
            <p className="mt-2 text-4xl font-bold text-(--surface-strong)">{tier.price}</p>
            <p className="mt-2 text-sm text-(--dune-muted)">{tier.note}</p>

            <ul className="mt-4 space-y-2">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#f7e9e3]">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-(--accent-primary)" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
