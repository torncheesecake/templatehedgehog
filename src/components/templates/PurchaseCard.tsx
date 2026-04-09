import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

interface PurchaseCardProps {
  product: Product;
}

const includes = [
  "Full source code + mock data",
  "NetSuite integration guide",
  "6 months of bug fixes & patches",
  "Commercial licence — unlimited client projects",
  "30-day money-back guarantee",
];

export function PurchaseCard({ product }: PurchaseCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-bold text-text-primary">{product.name}</h2>

      <div className="mt-2">
        <StarRating
          rating={product.averageRating}
          count={product.reviewCount}
          size="sm"
        />
      </div>

      {/* Price */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-text-primary">
          {formatPrice(product.priceGbp)}
        </span>
      </div>

      {/* Buy Button */}
      <div className="mt-6">
        <Button size="lg" className="w-full">
          Buy Now
        </Button>
      </div>

      {/* Discount Code */}
      <button className="mt-3 w-full text-center text-sm text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Have a discount code?
      </button>

      {/* Includes */}
      <div className="mt-6 border-t border-border pt-6">
        <ul className="space-y-2.5">
          {includes.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <svg
                className="h-4 w-4 shrink-0 text-success"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Update Policy Note */}
      <div className="mt-6 rounded-lg bg-surface-secondary p-4">
        <p className="text-xs text-text-tertiary leading-5">
          Version {product.version} — React 18, Next.js 14, Tailwind CSS.
          Major framework upgrades may be released as new versions at a discounted upgrade price.
        </p>
      </div>
    </div>
  );
}
