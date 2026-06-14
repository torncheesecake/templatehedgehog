# Studio v1 product walkthrough

Date: 3 June 2026

## Walkthrough path

Tested the local Studio flow as a customer preparing an email before sending:

1. Open `/studio`.
2. Choose the product launch workflow.
3. Edit headline, body, CTA, link, footer/legal copy, and support email.
4. Save locally.
5. Reset.
6. Compile a valid MJML source.
7. Break MJML with an unsafe include and confirm the failure is readable.
8. Confirm the previous valid preview remains visible after failure.
9. Complete QA.
10. Select Mailchimp.
11. Export ZIP.
12. Inspect ZIP contents.

## What feels useful

- The "Everything before send" boundary is clear and valuable. Studio does not over-promise sending, automation, audiences, consent, unsubscribe handling, or reporting.
- Workflow selection makes the product feel like a workspace, not just a code viewer.
- Editable MJML, local save/reset, compile, preview, QA, and ZIP export form a useful end-to-end loop.
- The structured editor is the right direction for non-MJML users. It gives users a safer path before they touch source.
- Platform handoff guidance is practical because it explains what to upload, what to paste, and what the sending platform owns.
- Export ZIP contents are useful and inspectable, especially MJML, compiled HTML, QA notes, implementation notes, platform handoff, and metadata.

## What feels slow or confusing

- The central workspace still mixes too many jobs: quick content edits, brand tokens, component structure, source editing, compile, and preview compete for attention.
- The structured editor says changes are staged, but section structure changes are not immediately obvious to users as source-affecting work.
- Compile status is readable, but the workspace needs clearer stale-preview and compile-timing signals.
- QA has useful checks, but group-level progress and group actions are needed to make readiness feel less like a long form.
- Export blocking is correct, but users need a clearer blocked-reason list and a package preview before download.

## What feels too technical

- MJML source is still visually dominant. That is useful for technical users, but non-MJML users need the quick edit and structure panels to feel primary.
- Component validation uses field names like `ctaUrl` and `bodyCopy`. These are precise, but the surrounding UI should translate them into customer-facing labels where possible.
- Package inspection is helpful but reads like implementation detail. It should remain visible, but the export panel should lead with "what you get" and "what is blocking export".

## What blocks a non-MJML user

- There is no single "apply my content changes" summary that explains which tokens changed before regenerating source.
- Field-level validation exists indirectly through QA, but quick edits need immediate validation, changed indicators, and reset controls.
- Structure editing needs an explicit note that it regenerates MJML locally and requires review before export.
- Users can complete many QA items, but there is no group-level "mark complete" action for manual checks.

## Improvements for this sprint

Highest-value improvements that stay within the local-only, before-send boundary:

- Extract the remaining large panels so Studio is maintainable enough for v1 iteration.
- Add clearer quick edit validation, changed indicators, field reset, reset all, and apply summary.
- Add a structure reset action and explicit structure-to-source note.
- Improve compile metadata with duration, last success, last failure, and stale preview messaging.
- Add QA group progress, reset group, and mark group complete.
- Deepen platform handoff without implying API integration.
- Expand the export package with `change-summary.md`, `readme.md`, hashes, source origin, compile timestamps, changed tokens, and included sections.
- Add local project snapshots if it can be done without changing storage architecture.
- Add paste-only MJML import before file upload, because paste is lower risk and keeps the boundary clear.
