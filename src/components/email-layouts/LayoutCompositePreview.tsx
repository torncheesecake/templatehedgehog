import Image from "next/image";

interface LayoutCompositePreviewItem {
  title: string;
  previewImageUrl: string;
}

interface LayoutCompositePreviewProps {
  items: LayoutCompositePreviewItem[];
  title: string;
  className?: string;
}

export function LayoutCompositePreview({
  items,
  title,
  className = "",
}: LayoutCompositePreviewProps) {
  const previewItems = items.slice(0, 4);

  if (previewItems.length === 0) {
    return (
      <div
        className={`relative grid min-h-[320px] place-items-center rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) text-[1rem] text-(--th-body-copy) ${className}`}
      >
        No component previews are available for this layout yet.
      </div>
    );
  }

  const isSingle = previewItems.length === 1;
  const isDouble = previewItems.length === 2;

  return (
    <div
      className={`relative overflow-hidden rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) shadow-[0_18px_36px_rgba(0,0,0,0.32)] ${className}`}
    >
      <div
        className={`grid min-h-[320px] ${
          isSingle
            ? "grid-cols-1"
            : isDouble
              ? "grid-cols-2"
              : "grid-cols-2"
        } ${previewItems.length > 2 ? "grid-rows-2" : "grid-rows-1"}`}
      >
        {previewItems.map((item, index) => (
          <div
            key={`${item.previewImageUrl}-${index}`}
            className="relative min-h-[160px] border border-(--surface-line) bg-(--bg-soft)"
          >
            <Image
              src={item.previewImageUrl}
              alt={`${title} block ${index + 1}: ${item.title}`}
              fill
              unoptimized
              className="object-cover object-[center_56%]"
            />
            <div className="absolute left-2 top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-[0.35rem] border border-(--surface-line) bg-(--surface-strong) px-1.5 text-[0.72rem] font-bold text-(--accent-support)">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-8">
        <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">
          Composite preview from components
        </p>
        <p className="text-[0.96rem] text-(--text-primary-dark)">
          Built from {items.length} reusable block{items.length === 1 ? "" : "s"} in stack order.
        </p>
      </div>
    </div>
  );
}
