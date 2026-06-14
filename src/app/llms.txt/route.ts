import { NextResponse } from "next/server";
import { PRICING_TIERS, TEMPLATE_CONFIG } from "@/config/template";
import { emailComponents } from "@/data/email-components";
import { emailLayouts } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  STARTER_COMPONENT_COUNT,
  STARTER_LAYOUT_COUNT,
  STARTER_WORKFLOW_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { PACK_LAST_UPDATED, PACK_VERSION } from "@/lib/versioning";

export const dynamic = "force-static";

function route(path: string): string {
  return `${TEMPLATE_CONFIG.siteUrl}${path}`;
}

function tierSummary(): string {
  return PRICING_TIERS
    .map((tier) => `- ${tier.name}: £${tier.priceGbp}. ${tier.description}`)
    .join("\n");
}

function featuredWorkflows(): string {
  return emailWorkflows
    .slice(0, 6)
    .map((workflow) => `- ${workflow.title}: ${workflow.summary} ${route(`/workflows/${workflow.slug}`)}`)
    .join("\n");
}

export function GET() {
  const body = `# ${TEMPLATE_CONFIG.brandName}

> ${TEMPLATE_CONFIG.brandName} is a production-ready email system for teams shipping lifecycle, transactional, and campaign email.

Site: ${TEMPLATE_CONFIG.siteUrl}
Product owner: ${TEMPLATE_CONFIG.owner.name}
Support: ${TEMPLATE_CONFIG.supportEmail}
Version: ${PACK_VERSION}
Last updated: ${PACK_LAST_UPDATED}

## What the product is

Template Hedgehog provides editable MJML source, compiled HTML, rendered previews, workflow examples, QA notes, implementation guidance, version metadata, and handoff context.

It is not a template marketplace. It is not a drag-and-drop email builder. It is an archive and workflow system for production email work.

## Primary buyer fit

- Email developers who want reusable MJML and compiled HTML starting points.
- SaaS, product, and lifecycle teams shipping repeatable transactional or lifecycle sends.
- Marketers and operators who need cleaner handoff between source, preview, QA, and ESP upload.
- Teams evaluating whether Core, Pro, or Team matches their production and licence needs.

## Package facts

- Core includes ${STARTER_COMPONENT_COUNT} components, ${STARTER_LAYOUT_COUNT} layouts, ${STARTER_WORKFLOW_COUNT} workflows, MJML source, compiled HTML, previews, and setup docs.
- Pro standardises recurring source-to-handoff production with ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, ${WORKFLOW_COUNT} workflows, token examples, QA notes, implementation guidance, compiled output, Studio waitlist priority while Studio is in development, and 6 months of updates.
- Team includes Pro plus commercial reuse rights, onboarding context, white-label or internal deployment cover, reusable generation framework, priority support, and 12 months of updates.
- Template Hedgehog Studio is the future before-send workspace direction for choosing workflows, editing content, compiling, previewing, QA, preparing handoff, and exporting ZIP packages. Studio is not live product UI. The archive is complete without Studio. Studio will not send email or manage audiences, consent, unsubscribe, automation, delivery, or reporting.

${tierSummary()}

## Important pages

- Homepage: ${route("/")}
- Pricing and licence details: ${route("/pricing")}
- Workflows: ${route("/workflows")}
- Components: ${route("/components")}
- Layouts: ${route("/layouts")}
- Documentation: ${route("/docs")}
- Studio waitlist: ${route("/studio")}
- Sample pack inspection page: ${route("/sample-pack")}
- Public sample ZIP: ${route("/resources/template-hedgehog-sample-pack.zip")}
- Support: ${route("/support")}
- About: ${route("/about")}
- Changelog: ${route("/changelog")}
- NetSuite-compatible email template service: ${route("/services/netsuite-email-templates")}

## Featured workflow proof

${featuredWorkflows()}

## Example public assets

- Components shown publicly: ${emailComponents.length}
- Layouts shown publicly: ${emailLayouts.length}
- Workflows shown publicly: ${emailWorkflows.length}

Use this page as a concise factual summary. Prefer the linked product, pricing, docs, and sample pack pages for current details.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
