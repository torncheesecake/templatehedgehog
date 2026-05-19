import type { Metadata } from "next";
import { TEMPLATE_CONFIG } from "@/config/template";
import { DocsLayout, DocsSection } from "@/components/docs/DocsLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Docs",
  description:
    `Implementation guides for ${TEMPLATE_CONFIG.brandName} layouts, MJML source, compiled HTML, and email client caveats.`,
  path: "/docs",
  keywords: [
    "MJML implementation docs",
    "compiled HTML email guidance",
    "email client QA",
    "production email documentation",
  ],
});

const inlineCodeClass =
  "rounded-[0.45rem] border border-[var(--th-border-dark)] bg-slate-900/70 px-1.5 py-0.5 text-[0.88em] font-medium text-slate-100";
const listClass = "list-disc space-y-2.5 pl-5 marker:text-slate-200";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "workflow", label: "Workflow" },
  { id: "copy-modes", label: "Copy modes" },
  { id: "outlook", label: "Outlook caveats" },
  { id: "customisation", label: "Safe customisation" },
  { id: "images", label: "Image hosting" },
  { id: "layouts-vs-components", label: "Layouts vs components" },
  { id: "esp-handoff", label: "ESP handoff" },
  { id: "pitfalls", label: "Client pitfalls" },
];

export default function DocsPage() {
  return (
    <DocsLayout
      title="Developer documentation."
      summary="Implementation guidance for using MJML components, layouts, and compiled HTML in production email systems."
      navItems={sections}
    >
      <JsonLd
        id="docs-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
        ])}
      />
      <DocsSection id="intro" title="Intro">
        <p>
          {TEMPLATE_CONFIG.brandName} is an {TEMPLATE_CONFIG.owner.name} implementation system for production email.
          Layout pages show complete message structure, and component pages let you inspect single blocks when needed.
        </p>
        <p>
          The intended editing model is straightforward: treat MJML as the source of truth, compile to HTML when your ESP
          or review process needs final markup, and keep screenshots or previews as validation rather than the editable
          asset.
        </p>
      </DocsSection>

      <DocsSection id="workflow" title="Recommended workflow">
        <p>
          A safe working pattern for most teams looks like this:
        </p>
        <ol className="list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-slate-200">
          <li>Start from the closest layout, then move to component detail when needed.</li>
          <li>Edit the <span className={inlineCodeClass}>MJML</span> source rather than patching compiled HTML by hand.</li>
          <li>Compile to HTML and test the result in your delivery workflow.</li>
          <li>Run quick visual checks in Gmail, Outlook, and Apple Mail before final send.</li>
        </ol>
        <p>
          Use the compiled HTML panels when you need a delivery-ready snapshot for QA, approval, or an ESP that only
          accepts raw HTML. If you expect the block to be reused, keep your real changes in the MJML source instead.
        </p>
      </DocsSection>

      <DocsSection id="copy-modes" title="Snippet vs standalone">
        <p>
          Component pages expose two copy modes when the sources differ. Use the <span className={inlineCodeClass}>snippet</span>{" "}
          mode when you are stacking multiple blocks inside one existing <span className={inlineCodeClass}>mj-body</span>.
          Use the <span className={inlineCodeClass}>standalone</span> mode when you need a complete file that can compile on
          its own.
        </p>
        <ul className={listClass}>
          <li>MJML snippets are block-level source for composing several sections into the same email.</li>
          <li>Standalone MJML includes the wrapper, shared classes, and document structure required for independent compilation.</li>
          <li>HTML snippets are useful for inspection and controlled assembly, but most ESP handoff should use standalone compiled HTML.</li>
          <li>Compiled standalone HTML is the delivery-ready output for QA, import, and final review.</li>
        </ul>
      </DocsSection>

      <DocsSection id="outlook" title="Outlook rendering caveats">
        <p>
          Desktop Outlook is still the main reason email markup becomes brittle. MJML helps, but it does not make Outlook
          behave like a modern browser.
        </p>
        <ul className={listClass}>
          <li>Keep complex nesting conservative. Deeply layered sections, unusual overlaps, and fancy spacing are more likely to break.</li>
          <li>Test button padding and border radius in Outlook desktop. Small visual differences are common even when the block is valid.</li>
          <li>Avoid relying on background-image tricks for essential content or CTA clarity.</li>
          <li>Expect typography to render slightly heavier or looser than in Gmail and Apple Mail.</li>
          <li>When in doubt, prefer simpler table-safe structure over a more ambitious visual treatment.</li>
        </ul>
      </DocsSection>

      <DocsSection id="customisation" title="Safe MJML customisation patterns">
        <p>
          The safest customisation approach is to change tokens and content first, then structure only when required.
        </p>
        <ul className={listClass}>
          <li>Replace copy, links, imagery, and brand colours before altering block structure.</li>
          <li>Keep CTA labels short so buttons still read cleanly on narrow mobile clients.</li>
          <li>When swapping imagery, preserve the overall aspect ratio where possible to avoid uneven spacing.</li>
          <li>Reuse spacing values consistently instead of introducing one-off padding tweaks across multiple sections.</li>
          <li>If you need a recurring variant, duplicate the MJML block in your own codebase rather than repeatedly editing compiled HTML.</li>
        </ul>
        <p>
          A good default is to maintain your own small token map for colours, spacing, and button styles, then interpolate
          those values into the MJML before compilation.
        </p>
      </DocsSection>

      <DocsSection id="images" title="Image hosting best practices">
        <p>
          Email clients fetch images remotely, so image delivery matters as much as markup quality.
        </p>
        <ul className={listClass}>
          <li>Host production images on a stable HTTPS domain or CDN you control.</li>
          <li>Do not rely on temporary design-tool URLs or expiring preview links.</li>
          <li>Use meaningful <span className={inlineCodeClass}>alt</span> text for content images and empty alt text only for decorative ones.</li>
          <li>Optimise file sizes before send. Heavy images slow down preview loading and can affect clipping in some clients.</li>
          <li>Keep critical message copy out of images so dark mode, blocking, or accessibility settings do not hide it.</li>
        </ul>
      </DocsSection>

      <DocsSection id="layouts-vs-components" title="When to use layouts vs components">
        <p>
          Components are best when you are assembling or updating one block at a time. Layouts are best when you need a
          starting architecture for a complete send.
        </p>
        <ul className={listClass}>
          <li>Start with a component page when the job is small, such as swapping a hero, footer, CTA, or transactional panel.</li>
          <li>Start with a layout page when the whole email structure matters, including content order and message pacing.</li>
          <li>Use the component breakdown on layout pages to identify which blocks should become your editable source modules.</li>
          <li>Once a layout is close, refine its individual sections through the related component pages rather than editing blindly.</li>
        </ul>
      </DocsSection>

      <DocsSection id="esp-handoff" title="ESP handoff guidance">
        <p>
          Some teams hand compiled HTML straight to an ESP. Others move through review, QA, or CRM tooling first. The
          important thing is to separate editable source from delivery output.
        </p>
        <ul className={listClass}>
          <li>Use MJML in version control if developers or marketers will iterate on the email again.</li>
          <li>Use compiled HTML for final import, QA snapshots, or platforms that do not understand MJML.</li>
          <li>Keep a record of the component or layout slug used so future edits start from the right source block.</li>
          <li>After importing into an ESP, verify that tracking links, merge tags, and unsubscribe logic did not alter structure unexpectedly.</li>
        </ul>
      </DocsSection>

      <DocsSection id="pitfalls" title="Common email client pitfalls">
        <p>
          Even solid MJML can be undermined by delivery context. These are the common issues worth checking before send.
        </p>
        <ul className={listClass}>
          <li>Long CTA labels that wrap awkwardly on mobile.</li>
          <li>Logo or hero images that are too small to survive high-density displays cleanly.</li>
          <li>Dark-mode inversions that reduce contrast on muted text or secondary links.</li>
          <li>Padding values that look balanced in webmail but become too tight in Outlook desktop.</li>
          <li>Edited compiled HTML drifting away from the MJML source, making the next revision harder than it should be.</li>
        </ul>
        <p>
          If you hit one of these issues often, favour the simpler variant in the layout reference. Reliability is usually worth more
          than a slightly more decorative layout treatment.
        </p>
      </DocsSection>
    </DocsLayout>
  );
}
