import { getPublishedProducts } from "@/lib/mock-data";
import { TemplateCard } from "@/components/templates/TemplateCard";

export function FeaturedTemplates() {
  const products = getPublishedProducts();

  return (
    <section id="featured" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Featured</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Our Flagship Template
          </h2>
          <p className="mt-4 text-lg leading-8 text-text-secondary">
            4 pages, 18 components, and dark/light mode. Works out of the box
            with mock data — includes a guide for connecting to NetSuite.
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-lg">
          {products.map((product) => (
            <TemplateCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
