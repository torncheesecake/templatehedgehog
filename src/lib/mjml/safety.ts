const BLOCKED_INPUT_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /<\s*mj-include\b/i,
    message: "mj-include is disabled for untrusted MJML compilation.",
  },
  {
    pattern: /file:\/\//i,
    message: "file:// paths are not allowed in untrusted MJML input.",
  },
  {
    pattern: /<\s*mj-font\b[^>]*href\s*=\s*["']https?:\/\//i,
    message: "Remote font fetches are disabled for untrusted MJML compilation.",
  },
];

export function assertSafeUntrustedMjml(source: string): void {
  for (const rule of BLOCKED_INPUT_PATTERNS) {
    if (rule.pattern.test(source)) {
      throw new Error(rule.message);
    }
  }
}
