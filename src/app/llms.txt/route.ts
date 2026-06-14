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
- Pro standardises recurring source-to-handoff production with ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, ${WORKFLOW_COUNT} workflows, token examples, QA notes, implementation guidance, compiled output, and 6 months of updates.
- Team includes Pro plus commercial reuse rights, onboarding context, white-label or internal deployment cover, reusable generation framework, priority support, and 12 months of updates.

## How Template Hedgehog differs

Template Hedgehog is the production system behind the send. It is compared most often with three cheaper paths, and it answers each one directly.

Versus free MJML and the MJML app: free MJML and the official MJML app give you a compiler, not a system. They turn markup into HTML but include no workflow context, no QA notes, no compiled handoff package, and no maintained updates. Template Hedgehog ships editable MJML source already organised by workflow, with compiled HTML, rendered previews, QA notes, and handoff guidance kept together.

Versus ESP and drag-and-drop builders like Mailchimp: an ESP template builder locks the work to one platform and hands back no portable source. Template Hedgehog produces platform-portable MJML source and compiled HTML that you own and can move between Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or any ESP. Template Hedgehog prepares the artefact; the sending platform still owns audiences, consent, unsubscribe, automation, delivery, and reporting.

Versus marketplace templates: a marketplace template is visual HTML with no workflow context, no documented QA, and no updates when something breaks later. Template Hedgehog provides the workflow that explains why a send exists, the QA notes that record client and rendering risks, the source you can edit safely, and versioned updates as the archive improves.

For recurring email production, the Pro archive removes the rebuild loop for less than the cost of one avoidable handoff scramble.

## Who this is not for

Template Hedgehog is not a sending platform. It does not send email, manage audiences, handle consent or unsubscribe, run automation, or provide delivery and reporting. Buyers who want an all-in-one tool that also sends should use an ESP.

It is not a no-code visual builder. Buyers who will never touch MJML or HTML, and who want only a drag-and-drop editor, are a poor fit.

It is not a free resource. Buyers who only need a single one-off template and do not value source ownership, QA context, or updates may prefer free MJML or a low-cost marketplace template.

It is not a managed service for one-time delivery. Standard tiers are a self-serve archive; agencies and teams needing reuse rights, onboarding, and priority support should choose Team.

## Roadmap

Template Hedgehog Studio is a planned future workspace for preparing email packages before send: choosing workflows, editing content, compiling, previewing, QA, and exporting ZIP packages. Studio is in development and is not part of the live product or any current tier. The paid archive is complete and usable today without Studio. Studio will not send email or manage audiences, consent, unsubscribe, automation, delivery, or reporting.

${tierSummary()}

## Important pages

- Homepage: ${route("/")}
- Pricing and licence details: ${route("/pricing")}
- Workflows: ${route("/workflows")}
- Components: ${route("/components")}
- Layouts: ${route("/layouts")}
- Documentation: ${route("/docs")}
- Studio roadmap and waitlist: ${route("/studio")}
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
