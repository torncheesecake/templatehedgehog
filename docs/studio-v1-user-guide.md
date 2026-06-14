# Studio v1 user guide

Studio is a local-first workspace for preparing an email workflow before it is handed to a sending platform. It does not send campaigns, manage audiences, manage consent, manage unsubscribes, automate journeys, report analytics, store cloud projects, or connect to platform APIs.

## Basic workflow

1. Open `/studio`.
2. Choose one of the supported workflows: onboarding, password reset, product launch, or weekly digest.
3. Edit structured content in quick edit mode, or edit MJML directly in the source panel.
4. Use brand tokens for local brand defaults such as colours, font, logo, support email, and footer copy.
5. Generate MJML after structured edits.
6. Compile locally.
7. Review the preview, content checks, link checks, image checks, and manual QA checklist.
8. Select a manual handoff platform.
9. Export the ZIP package when readiness allows it.

## Local save and reset

Draft source, saved source, structured content, brand tokens, QA state, selected platform, compiled HTML, snapshots, and workflow selection are stored in the browser. There are no accounts and no cloud sync.

Use `Save locally` to store the current workflow source as the saved version. Use reset actions to return source, structured fields, or component structure to the saved or default local state.

## Snapshots

Snapshots capture a local point-in-time version of the current workflow. A snapshot includes source, compiled HTML, structured content, brand tokens, QA state, platform, source origin, compile metadata, and workflow metadata. Snapshots are stored only in the browser and can be restored or deleted from Studio.

## Paste MJML import

Paste import accepts MJML text directly into the current workflow. Studio checks that the pasted source looks like MJML and is within the local size limit. Importing pasted MJML marks the source as manual and requires a new compile before preview and export are considered current.

## Handoff

The handoff panel explains what to upload, what to paste, what the selected platform handles, and what Studio handles. Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, and Other are manual guidance targets only.
