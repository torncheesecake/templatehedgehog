// Preview-only merge-field substitution.
//
// The library MJML and the downloadable archives intentionally keep real merge
// fields (e.g. `{{ user.first_name }}`) so buyers wire them to their ESP. But a
// *rendered* preview — the live iframe on /layouts and /components, and the PNG
// thumbnails — should read like a finished email, not show raw tokens. This
// helper runs only at preview render time; it never touches the source or the
// compiled HTML shipped in the archives.

const SAMPLE_VALUES: Record<string, string> = {
  // Identity
  "user.first_name": "Alex",
  "first_name": "Alex",
  "user.name": "Alex Morgan",
  // Links
  "account.verify_url": "https://example.com/verify",
  "account.activity_url": "https://example.com/account/activity",
  "support.contact_url": "https://example.com/support",
  "reset_url": "https://example.com/reset",
  "app_store_url": "https://example.com/ios",
  "play_store_url": "https://example.com/android",
  "preferences_url": "https://example.com/preferences",
  "unsubscribe_url": "https://example.com/unsubscribe",
  "cta_url": "https://example.com",
  // Transactional values
  "expiry_window": "60 minutes",
  "order.number": "#10482",
  "order.item_count": "2",
  "order.dispatch_estimate": "1–2 days",
  "order.total": "£240.00",
  "invoice.number": "INV-2048",
  "invoice.issue_date": "14 March 2026",
  "invoice.due_date": "28 March 2026",
  "invoice.amount_due": "£420.00",
  // Security event
  "event.date": "16 March 2026",
  "event.location": "London, United Kingdom",
  "event.device": "Browser on macOS",
};

function titleiseKey(key: string): string {
  const last = key.split(".").pop() ?? key;
  return last
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveToken(key: string): string {
  if (key in SAMPLE_VALUES) {
    return SAMPLE_VALUES[key];
  }
  // Anything that looks like a link gets a harmless sample URL so hrefs stay valid.
  if (/(_url|\.url|_link|\.link|href)$/i.test(key)) {
    return "https://example.com";
  }
  return titleiseKey(key);
}

/**
 * Replace `{{ token }}` merge fields with realistic sample values for display.
 * Unknown tokens fall back to a sample URL (link-like keys) or a humanised label.
 */
export function applyPreviewSampleData(html: string): string {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) =>
    resolveToken(key),
  );
}
