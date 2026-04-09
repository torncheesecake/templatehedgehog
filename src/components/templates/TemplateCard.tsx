import Link from "next/link";
import { Product } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";

interface TemplateCardProps {
  product: Product;
}

export function TemplateCard({ product }: TemplateCardProps) {
  const discount = product.comparePrice
    ? getDiscountPercentage(product.priceGbp, product.comparePrice)
    : 0;

  return (
    <div className="group rounded-xl border border-border bg-surface transition-all hover:shadow-lg hover:border-border-hover">
      {/* Preview — monochrome wireframe */}
      <Link href={`/templates/${product.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
          <div
            className="absolute inset-0 p-4"
            style={{ background: "var(--hedgehog-core-navy)" }}
          >
            <div className="flex h-full gap-2">
              {/* Mini sidebar */}
              <div className="hidden sm:block w-16 space-y-1.5 rounded-lg p-2 bg-white/5">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-3 w-10 rounded bg-white/5" />
                <div className="h-3 w-8 rounded bg-white/5" />
                <div className="h-3 w-12 rounded bg-white/10" />
                <div className="h-3 w-9 rounded bg-white/5" />
              </div>
              {/* Main content */}
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded p-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="h-1.5 w-6 rounded bg-white/10" />
                      <div className="mt-1 h-3 w-10 rounded bg-white/15" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-end gap-0.5 h-full">
                    {[35, 55, 40, 70, 50, 65, 80, 55, 75, 60, 85, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-white/10"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-text-primary opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              View Details
            </span>
          </div>
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute left-3 top-3">
              <Badge variant="success">Save {discount}%</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/templates/${product.slug}`}>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-text-secondary line-clamp-2">
          {product.tagline}
        </p>

        {/* Tech stack tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="mt-3">
          <StarRating
            rating={product.averageRating}
            count={product.reviewCount}
          />
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-primary">
              {formatPrice(product.priceGbp)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-text-tertiary line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <Button size="sm" href={`/templates/${product.slug}`}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
