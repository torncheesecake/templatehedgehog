const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

export const visualSystem = {
  widths: {
    page: pageWidth,
    content: pageWidth,
    docs: pageWidth,
    bodyNarrow: "max-w-2xl",
    bodyWide: "max-w-3xl",
  },
  spacing: {
    hero: "pb-26 pt-14 sm:pt-16 lg:pb-30 lg:pt-18",
    heroCompact: "pb-22 pt-12 sm:pt-14 lg:pb-26 lg:pt-16",
    section: "py-24",
    sectionTop: "pt-24",
    sectionBottom: "pb-24",
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
    display: "text-5xl font-semibold leading-[1.05] text-slate-900 sm:text-6xl",
    page: "text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl",
    section: "text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl",
    subsection: "text-xl font-semibold leading-tight text-slate-900",
  },
  eyebrow: {
    dark: "text-sm font-semibold uppercase tracking-[0.08em] text-slate-500",
    light: "text-sm font-semibold uppercase tracking-[0.08em] text-slate-500",
    accent: "text-sm font-semibold uppercase tracking-[0.08em] text-slate-500",
  },
  body: {
    onDark: "text-base leading-7 text-slate-600",
    onLight: "text-base leading-7 text-slate-600",
    compact: "text-base leading-7 text-slate-600",
  },
  buttons: {
    primary:
      "inline-flex h-11 items-center rounded-xl border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-sm font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    primaryLarge:
      "inline-flex h-12 items-center rounded-xl border border-[var(--action-primary)] bg-[var(--action-primary)] px-6 text-sm font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    secondaryLight:
      "inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2",
    secondaryDark:
      "inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2",
  },
  cards: {
    light:
      "rounded-2xl border border-slate-200 bg-slate-50 shadow-sm",
    lightSoft:
      "rounded-xl border border-slate-200 bg-slate-50 shadow-sm",
    dark:
      "rounded-2xl border border-slate-200 bg-slate-50 shadow-sm",
    darkDeep:
      "rounded-2xl border border-slate-200 bg-white shadow-sm",
  },
  dividers: {
    soft: "border-slate-200",
    regular: "border-slate-200",
    strong: "border-slate-200",
  },
  surfaces: {
    page: "bg-white",
    dark: "bg-slate-50",
    darkDeep: "bg-white",
    light: "bg-slate-50",
    lightAlt: "bg-slate-50",
  },
  sections: {
    types: {
      hero: "pb-24 pt-16 sm:pt-18 lg:pb-30 lg:pt-24",
      feature: "py-24",
      proof: "py-24",
      comparison: "py-24",
      grid: "py-24",
      cta: "py-24",
    },
    surfaces: {
      dark: "bg-white",
      mid: "bg-slate-50",
      light: "bg-slate-50",
    },
    intros: {
      centered: "mx-auto max-w-3xl text-center",
      wideSplit:
        "grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end",
      fullWidth: "max-w-3xl",
      headingGap: "mt-5",
      bodyGap: "mt-6",
      contentGap: "mt-16",
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
      "rounded-[1.4rem] border border-slate-200 bg-slate-50 px-7 py-9 shadow-[0_20px_38px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10",
  },
  templates: {
    landing: {
      main: "min-h-screen text-slate-600",
      heroShell:
        "relative isolate overflow-hidden border-b border-slate-200 bg-white",
      heroGrid:
        "grid gap-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:items-start",
      heroLead: "z-10 self-center",
      heroAside: "relative min-h-[16rem] sm:min-h-[24rem] lg:min-h-[32rem]",
      sectionDivider:
        "border-y border-slate-200",
    },
    library: {
      main: "min-h-screen text-slate-600",
      frame:
        "relative mx-auto w-full max-w-7xl rounded-[1.3rem] border border-slate-200 bg-white px-5 pb-20 pt-8 shadow-[0_18px_36px_rgba(0,0,0,0.38)] sm:px-8 lg:px-12 lg:pb-24 lg:pt-9",
      heroGrid:
        "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start",
      heroLead: "max-w-3xl",
      railCard:
        "rounded-[1rem] border border-slate-200 bg-slate-50 p-4 sm:p-5",
      sectionSplit: "mt-14 border-t border-slate-200 pt-8",
    },
    content: {
      main: "min-h-screen text-slate-600",
      frame:
        "mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12",
      body: pageWidth,
      heroCard:
        "rounded-[1.2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_22px_42px_rgba(0,0,0,0.34)] sm:p-7",
      sectionCard:
        "mt-8 rounded-[1.12rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_16px_34px_rgba(0,0,0,0.3)] sm:p-6",
    },
  },
} as const;
