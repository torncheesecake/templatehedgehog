# Studio v2 product readiness

Studio v2 makes Template Hedgehog feel like a local email production product for marketers, consultants, and implementation teams.

## Product loop

The core loop is:

1. Choose a workflow.
2. Edit structured content.
3. Apply local brand tokens.
4. Insert supported components.
5. Generate MJML.
6. Compile locally.
7. Review preview, content QA, links, images, and manual QA.
8. Inspect the package.
9. Export a ZIP.
10. Hand off manually to the sending platform.

## What changed from v1

- No-MJML mode is the default editing surface.
- Advanced MJML remains available for power users.
- Brand tokens are local and reusable.
- Components are inserted into a structured model first.
- Content QA, link review, image review, package inspection, and export readiness scoring run locally.
- Core, Pro, and Team pack manifests describe commercial architecture without backend enforcement.

## What remains intentionally local

- Structured content.
- Brand tokens.
- MJML source.
- Compiled HTML.
- QA state.
- Export readiness state.
- Platform handoff target.
- Pack manifest selection.

## What Studio does not do

Studio does not send, automate, manage audiences, manage consent, manage unsubscribes, provide reporting, store data in the cloud, authenticate users, or connect to CRM or email platform APIs.

## Readiness definition

An export-ready workflow has:

- Successful local compile.
- Required structured fields completed.
- Manual QA completed.
- No failed content QA checks.
- No failed link review items.
- No failed image review items.
- Manual handoff platform selected.
- Package inspector passing for fixed export paths.

Studio does not claim deliverability, inbox placement, live platform validation, or campaign performance.
