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
    hero: "pb-[var(--space-section-y)] pt-[clamp(3rem,7vw,6rem)]",
    heroCompact: "pb-[var(--space-section-y-compact)] pt-[clamp(2.5rem,6vw,5rem)]",
    section: "py-[var(--space-section-y)]",
    sectionTop: "pt-[var(--space-section-y)]",
    sectionBottom: "pb-[var(--space-section-y)]",
    sectionCompact: "py-[var(--space-section-y-compact)]",
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
    display: "font-serif text-[var(--text-hero)] font-semibold leading-[0.95] tracking-normal text-[var(--text-primary)]",
    page: "font-serif text-[var(--text-h1)] font-semibold leading-[1.02] tracking-normal text-[var(--text-primary)]",
    section: "font-serif text-[var(--text-h2)] font-semibold leading-[1.08] tracking-normal text-[var(--text-primary)]",
    subsection: "text-[var(--text-h3)] font-semibold leading-tight text-[var(--text-primary)]",
  },
  eyebrow: {
    dark: "text-sm font-semibold uppercase tracking-[0.08em] text-[var(--th-text-muted)]",
    light: "text-sm font-semibold uppercase tracking-[0.08em] text-[var(--th-text-muted)]",
    accent: "text-sm font-semibold uppercase tracking-[0.08em] text-[var(--th-text-muted)]",
  },
  body: {
    onDark: "text-base leading-7 text-[var(--th-text-secondary)]",
    onLight: "text-base leading-7 text-[var(--th-text-secondary)]",
    compact: "text-base leading-7 text-[var(--th-text-secondary)]",
  },
  buttons: {
    primary:
      "inline-flex h-11 items-center rounded-xl border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-sm font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    primaryLarge:
      "inline-flex h-12 items-center rounded-xl border border-[var(--action-primary)] bg-[var(--action-primary)] px-6 text-sm font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    secondaryLight:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    secondaryDark:
      "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
    tertiary:
      "inline-flex h-10 items-center rounded-[0.72rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
  },
  cards: {
    light:
      "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
    lightSoft:
      "rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
    dark:
      "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
    darkDeep:
      "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
  },
  dividers: {
    soft: "border-[var(--th-border-dark)]",
    regular: "border-[var(--th-border-dark)]",
    strong: "border-[var(--th-border-dark)]",
  },
  surfaces: {
    page: "bg-[var(--bg-canvas)]",
    dark: "bg-[var(--bg-canvas)]",
    darkDeep: "bg-[var(--bg-canvas)]",
    light: "bg-[var(--bg-surface)]",
    lightAlt: "bg-[var(--bg-surface)]",
  },
  sections: {
    types: {
      hero: "pb-[var(--space-section-y)] pt-[clamp(3rem,7vw,6rem)]",
      feature: "py-[var(--space-section-y)]",
      proof: "py-[var(--space-section-y)]",
      comparison: "py-[var(--space-section-y)]",
      grid: "py-[var(--space-section-y)]",
      cta: "py-[var(--space-section-y)]",
    },
    surfaces: {
      dark: "bg-[var(--bg-canvas)]",
      mid: "bg-[var(--bg-surface)]",
      light: "bg-[var(--bg-surface)]",
    },
    intros: {
      centered: "mx-auto max-w-3xl text-center",
      wideSplit:
        "grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end",
      fullWidth: "max-w-3xl",
      headingGap: "mt-5",
      bodyGap: "mt-5",
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
      "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-7 sm:px-8 sm:py-9",
  },
  templates: {
    landing: {
      main: "min-h-screen text-[var(--th-text-secondary)]",
      heroShell:
        "relative isolate overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
      heroGrid:
        "grid gap-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:items-start",
      heroLead: "z-10 self-center",
      heroAside: "relative min-h-[16rem] sm:min-h-[24rem] lg:min-h-[32rem]",
      sectionDivider:
        "border-y border-[var(--th-border-dark)]",
    },
    library: {
      main: "min-h-screen bg-[var(--bg-canvas)] text-[var(--text-secondary)]",
      frame:
        "relative mx-auto w-full max-w-7xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 pb-[var(--space-section-y)] pt-8 sm:px-8 lg:px-12",
      heroGrid:
        "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start",
      heroLead: "max-w-3xl",
      railCard:
        "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5",
      sectionSplit: "mt-14 border-t border-[var(--th-border-dark)] pt-8",
    },
    content: {
      main: "min-h-screen bg-[var(--bg-canvas)] text-[var(--text-secondary)]",
      frame:
        "mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12",
      body: pageWidth,
      heroCard:
        "rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7",
      sectionCard:
        "mt-8 rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6",
    },
  },
} as const;
