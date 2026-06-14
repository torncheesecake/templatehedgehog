/**
 * MJML tier dialect transform.
 *
 * Generalises the proven prototype (prototype/tiering/) into a transform that runs over
 * the whole catalogue. Given an assembled `mjmlSource` string (as produced by
 * src/data/mjml-library.ts wrapMjmlFragment / a standalone example document) it emits a
 * tier-specific dialect, using the CANONICAL token registry in mjml-library.ts as the
 * single source of truth for resolution.
 *
 * Binding rules (Lead):
 *  - Output robustness is CONSTANT across tiers: ALL three inline the brand tokens onto
 *    each element, so the rendered email is identical regardless of tier.
 *  - <mj-style> is ADDITIVE only (responsive @media + dark-mode guard, plus — for Pro —
 *    a self-contained class stylesheet, and — for Enterprise — an externalised helper
 *    include). It is never the sole carrier of delivery-critical styling.
 *  - Enterprise's value is the FRAMEWORK (shared head + token registry + assembler +
 *    add-on library), not runtime-include magic. The include carries only de-duplicatable
 *    HELPER classes; delivery-critical CSS, <mj-raw> meta and <mj-attributes> tokens stay
 *    inline so output never depends on include-merge behaviour.
 */
import {
  MJML_BASE_FONT_FAMILY,
  MJML_CLASS_TOKENS,
  MJML_ELEMENT_DEFAULTS,
  MJML_GUARDRAIL_STYLE,
  MJML_HELPER_STYLE,
  MJML_RAW_HEAD,
  addDarkSurfaceHooks,
  renderSharedAttributes,
} from "@/data/mjml-library";

/**
 * Built-in MJML elements that hard-code font-family:Ubuntu in mjml-core 5.3.0 and are not
 * covered by the shared <mj-attributes> mj-all default. We set the brand font-family inline
 * on them so the compiled HTML never carries the Ubuntu default (which also stops mjml
 * injecting the Google Fonts Ubuntu @import/<link> into the head). Inline font-family
 * overrides the core default, verified against mjml 5.3.0.
 */
const UBUNTU_DEFAULT_TAGS = new Set(["mj-table", "mj-social"]);

export type PackTier = "starter" | "pro" | "enterprise";

/** Filename of the shared head the Enterprise dialect references via <mj-include>. */
export const ENTERPRISE_SHARED_HEAD_FILENAME = "head.mjml";

type Attributes = Map<string, string>;

const VOID_OR_INLINE_TAGS = new Set([
  "mj-text",
  "mj-button",
  "mj-image",
  "mj-wrapper",
  "mj-section",
  "mj-column",
  "mj-divider",
  "mj-table",
  "mj-hero",
  "mj-group",
  "mj-spacer",
  "mj-navbar",
  "mj-social",
]);

/** Attribute names that, when carried by an mj-class, must be inlined onto the element. */
function tokenAttrsFor(classNames: string[]): Attributes {
  const resolved: Attributes = new Map();
  for (const name of classNames) {
    const token = MJML_CLASS_TOKENS[name];
    if (!token) continue;
    for (const [key, value] of Object.entries(token)) {
      resolved.set(key, value);
    }
  }
  return resolved;
}

/** Parse the attribute string of a single opening tag into an ordered map. */
function parseAttributes(attrString: string): { attrs: Attributes; order: string[] } {
  const attrs: Attributes = new Map();
  const order: string[] = [];
  const re = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrString)) !== null) {
    const key = m[1];
    if (!attrs.has(key)) order.push(key);
    attrs.set(key, m[2]);
  }
  return { attrs, order };
}

function serialiseAttributes(attrs: Attributes, order: string[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const key of order) {
    if (seen.has(key)) continue;
    seen.add(key);
    if (!attrs.has(key)) continue;
    parts.push(`${key}="${attrs.get(key)}"`);
  }
  // any keys added during resolution that were not in the original order
  for (const key of attrs.keys()) {
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push(`${key}="${attrs.get(key)}"`);
  }
  return parts.join(" ");
}

/**
 * Inline brand tokens onto every body element (the cross-tier CONSTANT).
 *
 * For each opening tag in the <mj-body>:
 *  - resolve its mj-class="..." tokens to concrete attributes,
 *  - merge in the element-type defaults (mj-all + per-tag) so they survive even when the
 *    shared <mj-attributes> block is dropped,
 *  - explicit attributes already on the element always win.
 *
 * The mj-class attribute is removed. Existing css-class is preserved untouched.
 */
function inlineTokensInBody(body: string): string {
  // First add the dark-mode surface hook (css-class="dm-surface") onto light-surface
  // wrappers/sections while their mj-class token is still present, then inline tokens.
  const hooked = addDarkSurfaceHooks(body);
  // Match opening tags of mj-* elements (including self-closing).
  return hooked.replace(
    /<(mj-[a-z0-9-]+)((?:\s+[a-zA-Z][a-zA-Z0-9-]*\s*=\s*"[^"]*")*)\s*(\/?)>/g,
    (full, tag: string, attrString: string, selfClose: string) => {
      const { attrs, order } = parseAttributes(attrString);

      const classAttr = attrs.get("mj-class");
      const classNames = classAttr ? classAttr.trim().split(/\s+/).filter(Boolean) : [];

      // Resolution order (lowest -> highest precedence):
      //   element-type defaults  <  mj-class tokens  <  explicit element attributes
      const resolved: Attributes = new Map();

      const elementDefaults = MJML_ELEMENT_DEFAULTS[tag];
      const allDefaults = MJML_ELEMENT_DEFAULTS["mj-all"];
      // mj-all defaults only apply to leaf-ish content tags that actually render text/links.
      if (allDefaults && (tag === "mj-text" || tag === "mj-button")) {
        for (const [k, v] of Object.entries(allDefaults)) resolved.set(k, v);
      }
      if (elementDefaults) {
        for (const [k, v] of Object.entries(elementDefaults)) resolved.set(k, v);
      }

      for (const [k, v] of tokenAttrsFor(classNames)) resolved.set(k, v);

      // mj-table / mj-social hard-code font-family:Ubuntu in mjml-core. Set the brand font
      // inline (still beaten by an explicit element font-family below) so no Ubuntu leaks.
      if (UBUNTU_DEFAULT_TAGS.has(tag)) {
        resolved.set("font-family", MJML_BASE_FONT_FAMILY);
      }

      // explicit attributes on the element win, except mj-class which we are removing
      const newOrder: string[] = [];
      for (const key of order) {
        if (key === "mj-class") continue;
        resolved.set(key, attrs.get(key) as string);
        newOrder.push(key);
      }

      // append resolved-only keys (defaults + tokens) after the explicit ones, in a stable order
      for (const key of resolved.keys()) {
        if (!newOrder.includes(key)) newOrder.push(key);
      }

      const serialised = serialiseAttributes(resolved, newOrder);
      const close = selfClose ? " /" : "";
      return `<${tag}${serialised ? " " + serialised : ""}${close}>`;
    },
  );
}

type ParsedDoc = {
  leadingComments: string;
  previewText: string;
  bodyOpenTag: string;
  body: string;
};

function extractPreviewText(head: string): string {
  const m = head.match(/<mj-preview>([\s\S]*?)<\/mj-preview>/i);
  return m ? m[1].trim() : "";
}

/** Split an assembled mjml document into the parts the dialects need. */
function parseDocument(mjmlSource: string): ParsedDoc {
  const mjmlOpen = mjmlSource.search(/<mjml[\s>]/i);
  const leadingComments = mjmlOpen > 0 ? mjmlSource.slice(0, mjmlOpen) : "";

  const headMatch = mjmlSource.match(/<mj-head>[\s\S]*?<\/mj-head>/i);
  const previewText = headMatch ? extractPreviewText(headMatch[0]) : "";

  // The real document body is the <mj-body> that OPENS a container (has a matching
  // </mj-body>) and lives after the head. Search only the region after </mj-head> so we
  // never confuse it with the self-closing `<mj-body ... />` default inside <mj-attributes>.
  const headEnd = headMatch
    ? mjmlSource.indexOf(headMatch[0]) + headMatch[0].length
    : 0;
  const region = mjmlSource.slice(headEnd);

  const bodyInnerMatch = region.match(/<mj-body\b[^>]*?>([\s\S]*?)<\/mj-body>/i);
  const bodyOpenMatch = region.match(/<mj-body\b[^>]*?>(?=[\s\S]*?<\/mj-body>)/i);
  const bodyOpenTag = bodyOpenMatch ? bodyOpenMatch[0] : '<mj-body background-color="#f3f4f6">';
  const body = bodyInnerMatch ? bodyInnerMatch[1] : "";

  return { leadingComments, previewText, bodyOpenTag, body };
}

function previewOrDefault(previewText: string): string {
  return previewText && previewText !== "TemplateHedgehog reusable email block"
    ? previewText
    : "Replace this line with a one-sentence inbox summary";
}

/** STARTER: tokens resolved inline; shared <mj-attributes> dropped; minimal guardrail style. */
function toStarter(parsed: ParsedDoc): string {
  const body = inlineTokensInBody(parsed.body);
  return `${parsed.leadingComments}<mjml>
  <mj-head>
    <mj-preview>${previewOrDefault(parsed.previewText)}</mj-preview>
    <mj-style>
${MJML_GUARDRAIL_STYLE}
    </mj-style>
${MJML_RAW_HEAD}
  </mj-head>
  ${parsed.bodyOpenTag}
${body}
  </mj-body>
</mjml>
`;
}

/**
 * PRO: inline tokens (the constant) PLUS a fuller self-contained <mj-style> stylesheet in
 * the file's own head (helper classes + guardrail). No external include.
 */
function toPro(parsed: ParsedDoc): string {
  const body = inlineTokensInBody(parsed.body);
  return `${parsed.leadingComments}<mjml>
  <mj-head>
    <mj-preview>${previewOrDefault(parsed.previewText)}</mj-preview>
    <mj-style>
${MJML_HELPER_STYLE}
${MJML_GUARDRAIL_STYLE}
    </mj-style>
${MJML_RAW_HEAD}
  </mj-head>
  ${parsed.bodyOpenTag}
${body}
  </mj-body>
</mjml>
`;
}

/**
 * ENTERPRISE: inline tokens (the constant) + an <mj-include> of the shared head.mjml.
 *
 * The include is a DIRECT CHILD of <mjml> (mjml 5.3.0 rejects an included <mj-head> nested
 * inside another <mj-head>). Verified mjml 5.3.0 head-merge behaviour: once ANY include head
 * is present, the document head's own <mj-style> is dropped in favour of the included one.
 * So ALL <mj-style> (guardrail + helper) lives in the shared head.mjml, and the document
 * head carries only the <mj-preview>, <mj-attributes> tokens and <mj-raw> meta (which DO
 * merge correctly). The acceptance gate compiles this on the trusted path and asserts the
 * guardrail actually survives, so output never SILENTLY depends on include-merge.
 *
 * Robustness is still guaranteed by the inline-token constant (brand fonts/colours are on
 * every element), identical to Starter/Pro.
 *
 * @param headIncludePath relative path used in <mj-include path="..."> (e.g. "./head.mjml"
 *        for examples/layouts that sit one folder below a shared head).
 */
function toEnterprise(parsed: ParsedDoc, headIncludePath: string): string {
  const body = inlineTokensInBody(parsed.body);
  // The shared head.mjml carries <mj-style> AND <mj-raw> (meta + fonts), because mjml 5.3.0
  // drops the document head's own <mj-style>/<mj-raw> once an include head is present.
  // The document head keeps only <mj-preview> + <mj-attributes> tokens, which DO merge.
  return `${parsed.leadingComments}<mjml>
  <mj-include path="${headIncludePath}" />
  <mj-head>
    <mj-preview>${previewOrDefault(parsed.previewText)}</mj-preview>
    ${renderSharedAttributes()}
  </mj-head>
  ${parsed.bodyOpenTag}
${body}
  </mj-body>
</mjml>
`;
}

export type ToDialectOptions = {
  /** Relative include path for the Enterprise shared head. Defaults to "./head.mjml". */
  enterpriseHeadIncludePath?: string;
};

/**
 * Transform an assembled mjml document into the given tier's dialect.
 * Starter/Pro require no I/O. Enterprise emits an <mj-include> the caller must satisfy by
 * writing the shared head (see buildEnterpriseSharedHead) at the referenced path.
 */
export function toDialect(
  tier: PackTier,
  mjmlSource: string,
  options: ToDialectOptions = {},
): string {
  const parsed = parseDocument(mjmlSource);
  switch (tier) {
    case "starter":
      return toStarter(parsed);
    case "pro":
      return toPro(parsed);
    case "enterprise":
      return toEnterprise(
        parsed,
        options.enterpriseHeadIncludePath ?? `./${ENTERPRISE_SHARED_HEAD_FILENAME}`,
      );
    default: {
      const exhaustive: never = tier;
      throw new Error(`Unknown tier: ${String(exhaustive)}`);
    }
  }
}

/**
 * The shared head.mjml source for the Enterprise tier. It is a bare <mj-head> fragment
 * included as a direct child of <mjml>. It carries the full shared <mj-style> — both the
 * delivery-critical guardrail (responsive + dark-mode) and the de-duplicatable helper
 * classes — because mjml 5.3.0 emits the INCLUDED head's <mj-style> and drops the document
 * head's own. Restyle these rules here once and every including template picks it up.
 * (Brand tokens are additionally inlined per-element in each file, so rendering is robust
 * even where a client ignores <style>.)
 */
export function buildEnterpriseSharedHead(): string {
  return `<!-- Shared head for the Enterprise framework. Restyle the shared <mj-style> here once;
     every template that includes it picks up the change. Brand design tokens are also
     inlined per-element in each template (see the framework README in this pack).
     Carries <mj-raw> meta + webfont links too: mjml 5.3.0 emits the INCLUDED head's
     <mj-style>/<mj-raw> and drops the document head's own once an include is present. -->
<mj-head>
    <mj-style>
${MJML_HELPER_STYLE}
${MJML_GUARDRAIL_STYLE}
    </mj-style>
${MJML_RAW_HEAD}
</mj-head>
`;
}

// Re-export the void/inline tag set for tests that want to assert structural coverage.
export const KNOWN_BODY_TAGS = VOID_OR_INLINE_TAGS;
