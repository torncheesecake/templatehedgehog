import Link from "next/link";

interface GalleryItem {
  name: string;
  caption: string;
  href: string;
  tone: string;
}

export function TemplateGallery({ items }: { items: GalleryItem[] }) {
  return (
    <section className="mt-8 rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-6">
      <h2 className="text-2xl font-semibold">Page gallery</h2>
      <p className="mt-1 text-sm text-(--dune-muted)">Preview the quality and depth buyers receive</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group overflow-hidden rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) transition hover:border-(--accent-secondary)"
          >
            <div className={`h-44 w-full bg-gradient-to-br ${item.tone} p-3`}>
              <div className="h-full rounded-lg border border-white/20 bg-black/20 p-2">
                <div className="grid gap-1.5">
                  <div className="h-2 w-20 rounded bg-white/40" />
                  <div className="h-2 w-14 rounded bg-white/25" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <div className="h-8 rounded bg-white/20" />
                  <div className="h-8 rounded bg-white/20" />
                  <div className="h-8 rounded bg-white/20" />
                </div>
                <div className="mt-3 h-16 rounded bg-white/15" />
              </div>
            </div>

            <div className="p-4">
              <p className="text-lg font-semibold text-(--surface-strong)">{item.name}</p>
              <p className="mt-1 text-sm text-(--dune-muted)">{item.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
