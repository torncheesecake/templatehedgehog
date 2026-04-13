import { reviews } from "@/lib/mock-data";
import { StarRating } from "@/components/ui/StarRating";

export function Testimonials() {
  const featured = reviews.slice(0, 3);

  return (
    <section className="bg-surface-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What Developers Say
          </h2>
          <p className="mt-4 text-lg leading-8 text-text-secondary">
            Don&apos;t just take our word for it — hear from developers who&apos;ve
            shipped with our templates.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <StarRating rating={review.rating} size="sm" />
              <p className="mt-4 text-base font-semibold text-text-primary">
                &ldquo;{review.title}&rdquo;
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {review.body}
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-medium text-text-primary">
                  {review.customerName}
                </p>
                <p className="text-sm text-text-secondary">
                  {review.customerRole}
                  {review.customerCompany && ` at ${review.customerCompany}`}
                </p>
                {review.verified && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-success">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Purchase
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
