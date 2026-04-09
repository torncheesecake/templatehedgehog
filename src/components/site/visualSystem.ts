export const visualSystem = {
  widths: {
    page: "mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-14",
    content: "mx-auto w-full max-w-[1120px]",
    docs: "mx-auto w-full max-w-[1500px]",
    bodyNarrow: "max-w-[60ch]",
    bodyWide: "max-w-[76ch]",
  },
  spacing: {
    hero: "pb-24 pt-12 sm:pt-14 lg:pb-28 lg:pt-16",
    heroCompact: "pb-20 pt-10 sm:pt-12 lg:pb-24 lg:pt-14",
    section: "py-16 sm:py-20",
    sectionTop: "pt-16 sm:pt-18 lg:pt-20",
    sectionBottom: "pb-16 sm:pb-20 lg:pb-24",
    sectionCompact: "pt-8 pb-18 sm:pt-9 lg:pb-22",
  },
  radius: {
    panel: "rounded-[1.2rem]",
    panelSoft: "rounded-[1rem]",
    cta: "rounded-[1.4rem]",
    pill: "rounded-full",
  },
  shadows: {
    card: "shadow-[0_22px_42px_rgba(20, 19, 43,0.12)]",
    cardSoft: "shadow-[0_16px_34px_rgba(20, 19, 43,0.12)]",
    dark: "shadow-[0_20px_38px_rgba(20, 19, 43,0.34)]",
    floating: "shadow-[0_34px_72px_rgba(20, 19, 43,0.42)]",
  },
  headings: {
    display:
      "text-[2.9rem] font-semibold leading-[0.9] text-(--hedgehog-core-navy) sm:text-[4rem] lg:text-[4.5rem]",
    page:
      "text-[2.2rem] font-semibold leading-[1.04] text-(--hedgehog-core-navy) sm:text-[2.85rem]",
    section:
      "text-[1.92rem] font-semibold leading-[1.05] text-(--hedgehog-core-navy) sm:text-[2.45rem]",
    subsection:
      "text-[1.3rem] font-semibold leading-[1.1] text-(--hedgehog-core-navy) sm:text-[1.5rem]",
  },
  eyebrow: {
    dark: "text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)",
    light: "text-[1rem] font-semibold tracking-[0.01em] text-(--hedgehog-core-blue-deep)",
    accent:
      "text-[1rem] font-semibold tracking-[0.01em] text-(--accent-primary)",
  },
  body: {
    onDark: "text-[1.02rem] leading-8 text-(--th-body-copy)",
    onLight: "text-[1rem] leading-8 text-(--th-body-copy)",
    compact: "text-[0.98rem] leading-7 text-(--th-body-copy)",
  },
  buttons: {
    primary:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.9rem] font-semibold tracking-[0.01em] !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    primaryLarge:
      "inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.9rem] font-semibold tracking-[0.01em] !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    secondaryLight:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-(--hedgehog-core-blue-deep) px-4 text-[0.86rem] font-semibold text-(--hedgehog-core-blue-deep) transition duration-200 hover:bg-(--surface-strong) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
    secondaryDark:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-[#FDFDFD] bg-[#FDFDFD] px-4 text-[0.86rem] font-semibold !text-(--hedgehog-core-navy) transition duration-200 hover:bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2",
  },
  cards: {
    light:
      "rounded-[1.2rem] border border-[rgba(222, 210, 204,0.3)] bg-[linear-gradient(158deg,#FDFDFD,#fbf3f0)] shadow-[0_22px_42px_rgba(20, 19, 43,0.12)]",
    lightSoft:
      "rounded-[1rem] border border-[rgba(222, 210, 204,0.2)] bg-[#FDFDFD] shadow-[0_16px_34px_rgba(20, 19, 43,0.1)]",
    dark:
      "rounded-[1.2rem] border border-[rgba(222, 210, 204,0.24)] bg-(--hedgehog-core-navy) shadow-[0_20px_38px_rgba(20, 19, 43,0.34)]",
    darkDeep:
      "rounded-[1.2rem] border border-[rgba(222, 210, 204,0.3)] bg-(--hedgehog-core-blue-deep) shadow-[0_20px_38px_rgba(20, 19, 43,0.34)]",
  },
  dividers: {
    soft: "border-[rgba(222, 210, 204,0.16)]",
    regular: "border-[rgba(222, 210, 204,0.24)]",
    strong: "border-[rgba(222, 210, 204,0.4)]",
  },
  surfaces: {
    page: "bg-(--hedgehog-core-navy)",
    dark: "bg-(--hedgehog-core-navy)",
    darkDeep: "bg-(--hedgehog-core-blue-deep)",
    light: "bg-(--surface-strong)",
    lightAlt: "bg-[#f7e9e3]",
  },
  ctaPattern: {
    band:
      "rounded-[1.4rem] border border-[rgba(222, 210, 204,0.28)] bg-[linear-gradient(180deg,var(--hedgehog-core-navy)_0%,#3a3950_100%)] px-7 py-9 shadow-[0_20px_38px_rgba(20, 19, 43,0.34)] sm:px-9 sm:py-10",
  },
  templates: {
    landing: {
      main: "min-h-screen text-(--th-body-copy)",
      heroShell:
        "relative isolate overflow-hidden border-b border-[rgba(222, 210, 204,0.42)] bg-(--surface-strong)",
      heroGrid:
        "grid gap-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:items-start",
      heroLead: "z-10 self-center",
      heroAside: "relative min-h-[16rem] sm:min-h-[24rem] lg:min-h-[32rem]",
      sectionDivider:
        "border-y border-[rgba(222, 210, 204,0.56)]",
    },
    library: {
      main: "min-h-screen text-(--th-body-copy)",
      frame:
        "relative mx-auto w-full max-w-[1840px] rounded-[1.3rem] border border-[rgba(222, 210, 204,0.32)] bg-(--surface-strong) px-5 pb-20 pt-8 shadow-[0_18px_36px_rgba(20, 19, 43,0.2)] sm:px-8 lg:px-14 lg:pb-24 lg:pt-9",
      heroGrid:
        "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start",
      heroLead: "max-w-[88ch]",
      railCard:
        "rounded-[1rem] border border-[rgba(222, 210, 204,0.16)] bg-[#FDFDFD] p-4 sm:p-5",
      sectionSplit:
        "section-breath border-t border-[rgba(222, 210, 204,0.14)] pt-8",
    },
    content: {
      main: "min-h-screen text-(--th-body-copy)",
      frame:
        "mx-auto w-full max-w-[1840px] px-5 pb-16 pt-10 sm:px-8 lg:px-14 lg:pb-20 lg:pt-12",
      body: "mx-auto w-full max-w-[1120px]",
      heroCard:
        "rounded-[1.2rem] border border-[rgba(222, 210, 204,0.3)] bg-[linear-gradient(158deg,#FDFDFD,#fbf3f0)] p-6 shadow-[0_22px_42px_rgba(20, 19, 43,0.12)] sm:p-7",
      sectionCard:
        "mt-8 rounded-[1.12rem] border border-[rgba(222, 210, 204,0.3)] bg-[linear-gradient(168deg,#FDFDFD,#fbf3f0)] p-5 shadow-[0_16px_34px_rgba(20, 19, 43,0.11)] sm:p-6",
    },
  },
} as const;
