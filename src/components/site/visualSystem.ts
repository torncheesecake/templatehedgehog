const pageWidth = "mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-14";

export const visualSystem = {
  widths: {
    page: pageWidth,
    content: pageWidth,
    docs: pageWidth,
    bodyNarrow: "max-w-[60ch]",
    bodyWide: "max-w-[76ch]",
  },
  spacing: {
    hero: "pb-26 pt-14 sm:pt-16 lg:pb-30 lg:pt-18",
    heroCompact: "pb-22 pt-12 sm:pt-14 lg:pb-26 lg:pt-16",
    section: "py-20 sm:py-24 lg:py-28",
    sectionTop: "pt-20 sm:pt-24 lg:pt-28",
    sectionBottom: "pb-20 sm:pb-24 lg:pb-28",
    sectionCompact: "pt-8 pb-18 sm:pt-9 lg:pb-22",
  },
  radius: {
    panel: "rounded-[1.2rem]",
    panelSoft: "rounded-[1rem]",
    cta: "rounded-[1.4rem]",
    pill: "rounded-full",
  },
  shadows: {
    card: "shadow-[0_22px_42px_rgba(0,0,0,0.34)]",
    cardSoft: "shadow-[0_16px_34px_rgba(0,0,0,0.3)]",
    dark: "shadow-[0_20px_38px_rgba(0,0,0,0.42)]",
    floating: "shadow-[0_34px_72px_rgba(0,0,0,0.48)]",
  },
  headings: {
    display:
      "text-[2.9rem] font-semibold leading-[0.9] text-(--text-primary-dark) sm:text-[4rem] lg:text-[4.5rem]",
    page:
      "text-[2.2rem] font-semibold leading-[1.04] text-(--text-primary-dark) sm:text-[2.85rem]",
    section:
      "text-[1.92rem] font-semibold leading-[1.05] text-(--text-primary-dark) sm:text-[2.45rem]",
    subsection:
      "text-[1.3rem] font-semibold leading-[1.1] text-(--text-primary-dark) sm:text-[1.5rem]",
  },
  eyebrow: {
    dark: "text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)",
    light: "text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)",
    accent:
      "text-[1rem] font-semibold tracking-[0.01em] text-(--accent-support)",
  },
  body: {
    onDark: "text-[1.02rem] leading-8 text-(--th-body-copy)",
    onLight: "text-[1rem] leading-8 text-(--th-body-copy)",
    compact: "text-[0.98rem] leading-7 text-(--th-body-copy)",
  },
  buttons: {
    primary:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.9rem] font-semibold tracking-[0.01em] !text-(--text-primary-dark) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    primaryLarge:
      "inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.9rem] font-semibold tracking-[0.01em] !text-(--text-primary-dark) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    secondaryLight:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-(--surface-line) bg-transparent px-4 text-[0.86rem] font-semibold text-(--th-body-copy) transition duration-200 hover:border-(--accent-support) hover:text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    secondaryDark:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-(--surface-line) bg-(--surface-soft) px-4 text-[0.86rem] font-semibold !text-(--text-primary-dark) transition duration-200 hover:border-(--accent-support) hover:bg-(--dune-deep) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
  },
  cards: {
    light:
      "rounded-[1.2rem] border border-(--surface-line) bg-(--surface-soft) shadow-[0_22px_42px_rgba(0,0,0,0.34)]",
    lightSoft:
      "rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) shadow-[0_16px_34px_rgba(0,0,0,0.28)]",
    dark:
      "rounded-[1.2rem] border border-(--surface-line) bg-(--surface-soft) shadow-[0_20px_38px_rgba(0,0,0,0.4)]",
    darkDeep:
      "rounded-[1.2rem] border border-(--surface-line) bg-(--dune-deep) shadow-[0_20px_38px_rgba(0,0,0,0.42)]",
  },
  dividers: {
    soft: "border-(--surface-line)",
    regular: "border-(--surface-line)",
    strong: "border-(--surface-line)",
  },
  surfaces: {
    page: "bg-(--surface-strong)",
    dark: "bg-(--surface-soft)",
    darkDeep: "bg-(--dune-deep)",
    light: "bg-(--surface-muted)",
    lightAlt: "bg-(--bg-surface-elevated)",
  },
  sections: {
    types: {
      hero: "pb-24 pt-16 sm:pt-18 lg:pb-30 lg:pt-24",
      feature: "py-24 sm:py-28 lg:py-28",
      proof: "py-24 sm:py-28 lg:py-28",
      comparison: "py-24 sm:py-28 lg:py-28",
      grid: "py-24 sm:py-28 lg:py-28",
      cta: "py-24 sm:py-28 lg:py-28",
    },
    surfaces: {
      dark: "bg-(--surface-strong)",
      mid: "bg-(--surface-soft)",
      light: "bg-(--surface-muted)",
    },
    intros: {
      centered: "mx-auto max-w-[78ch] text-center",
      wideSplit:
        "grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end",
      fullWidth: "max-w-[84ch]",
      headingGap: "mt-3",
      bodyGap: "mt-4",
      contentGap: "mt-12",
    },
    layouts: {
      split: "grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] lg:items-start",
      splitTight: "grid gap-10 lg:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)] lg:items-start",
      proofCombo: "grid gap-6 lg:grid-cols-[minmax(0,1.26fr)_minmax(0,0.74fr)]",
      cards3: "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
      cards5: "grid gap-6 md:grid-cols-2 xl:grid-cols-5",
      pair: "grid gap-6 lg:grid-cols-2",
    },
  },
  ctaPattern: {
    band:
      "rounded-[1.4rem] border border-(--surface-line) bg-(--surface-soft) px-7 py-9 shadow-[0_20px_38px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10",
  },
  templates: {
    landing: {
      main: "min-h-screen text-(--th-body-copy)",
      heroShell:
        "relative isolate overflow-hidden border-b border-(--surface-line) bg-(--surface-strong)",
      heroGrid:
        "grid gap-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:items-start",
      heroLead: "z-10 self-center",
      heroAside: "relative min-h-[16rem] sm:min-h-[24rem] lg:min-h-[32rem]",
      sectionDivider:
        "border-y border-(--surface-line)",
    },
    library: {
      main: "min-h-screen text-(--th-body-copy)",
      frame:
        "relative mx-auto w-full max-w-[1840px] rounded-[1.3rem] border border-(--surface-line) bg-(--surface-strong) px-5 pb-20 pt-8 shadow-[0_18px_36px_rgba(0,0,0,0.38)] sm:px-8 lg:px-14 lg:pb-24 lg:pt-9",
      heroGrid:
        "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start",
      heroLead: "max-w-[88ch]",
      railCard:
        "rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-4 sm:p-5",
      sectionSplit:
        "section-breath border-t border-(--surface-line) pt-8",
    },
    content: {
      main: "min-h-screen text-(--th-body-copy)",
      frame:
        "mx-auto w-full max-w-[1840px] px-5 pb-16 pt-10 sm:px-8 lg:px-14 lg:pb-20 lg:pt-12",
      body: pageWidth,
      heroCard:
        "rounded-[1.2rem] border border-(--surface-line) bg-(--surface-soft) p-6 shadow-[0_22px_42px_rgba(0,0,0,0.34)] sm:p-7",
      sectionCard:
        "mt-8 rounded-[1.12rem] border border-(--surface-line) bg-(--surface-soft) p-5 shadow-[0_16px_34px_rgba(0,0,0,0.3)] sm:p-6",
    },
  },
} as const;
