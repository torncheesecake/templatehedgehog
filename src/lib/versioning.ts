export type ChangelogEntry = {
  date: string;
  title: string;
  bulletPoints: string[];
};

const SEMVER_PATTERN =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export const PACK_VERSION = "1.0.0";

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-03-09",
    title: "Versioning and gated delivery hardening",
    bulletPoints: [
      "Added provider-backed gated download delivery with safer production defaults.",
      "Introduced download smoke coverage for HEAD and GET endpoint flows.",
      "Added packaged version files and changelog metadata in build output.",
    ],
  },
  {
    date: "2026-03-08",
    title: "Layouts and documentation expansion",
    bulletPoints: [
      "Added reusable layout recipes with rendered preview and source copy panels.",
      "Expanded docs, pricing, and success flows for production-style buyer journeys.",
    ],
  },
  {
    date: "2026-03-07",
    title: "Initial MJML components pack release",
    bulletPoints: [
      "Shipped the first public pack with MJML and compiled HTML assets.",
      "Added compatibility notes and preview assets for core email components.",
    ],
  },
];

function assertPackVersion(version: string): void {
  const trimmed = version.trim();
  if (!trimmed) {
    throw new Error("[versioning] PACK_VERSION must not be empty.");
  }

  if (!SEMVER_PATTERN.test(trimmed)) {
    throw new Error(
      `[versioning] PACK_VERSION "${version}" is invalid. Expected a semver-like value such as 1.0.0.`,
    );
  }
}

function assertChangelog(entries: ChangelogEntry[]): void {
  if (entries.length === 0) {
    throw new Error("[versioning] CHANGELOG must include at least one entry.");
  }

  for (const entry of entries) {
    if (!entry.date.trim()) {
      throw new Error("[versioning] CHANGELOG entry date must not be empty.");
    }
    if (!entry.title.trim()) {
      throw new Error("[versioning] CHANGELOG entry title must not be empty.");
    }
    if (entry.bulletPoints.length === 0) {
      throw new Error(
        `[versioning] CHANGELOG entry "${entry.title}" must include at least one bullet point.`,
      );
    }
  }
}

assertPackVersion(PACK_VERSION);
assertChangelog(CHANGELOG);

export const PACK_LAST_UPDATED = CHANGELOG[0].date;

export function formatVersionDate(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return dateInput;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
