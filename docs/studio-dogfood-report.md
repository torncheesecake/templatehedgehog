# Studio dogfood report

Date: 4 June 2026

## Scope

Dogfooded Studio as a local-first before-send workspace. This pass did not test or add auth, cloud storage, sending, automation, analytics, CRM integrations, or team features.

Tested loop for every workflow:

```text
select workflow
-> edit structured fields
-> apply to source
-> compile
-> check desktop and mobile preview
-> complete QA
-> select platform handoff
-> export ZIP
-> inspect ZIP contents
-> create and restore local snapshot
```

## Evidence

Browser QA output:

- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-browser-qa.json`

Screenshots:

- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-start.png`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-product-launch.png`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-onboarding.png`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-password-reset.png`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-weekly-digest.png`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-mobile.png`

Export ZIPs:

- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-product-launch.zip`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-onboarding.zip`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-password-reset.zip`
- `/Users/matthewhillman/Documents/TemplateHedgehog/templatehedgehog/output/dogfood/studio-dogfood-weekly-digest.zip`

All four ZIPs contained:

- `mjml/source.mjml`
- `html/compiled.html`
- `docs/qa-notes.md`
- `docs/implementation-guide.md`
- `docs/workflow-notes.md`
- `docs/platform-handoff.md`
- `docs/change-summary.md`
- `docs/readme.md`
- `metadata.json`

## Fixes made

1. Export panel file list now matches the actual ZIP package. It includes `docs/change-summary.md` and `docs/readme.md`.
2. Export panel status copy now uses neutral `Studio status` instead of saying `Export package prepared` for blocked or non-export messages.
3. Snapshot deletion now updates the local status message so the previous snapshot-saved state does not linger after deletion.

## Product launch

What worked:

- Workflow selection, structured edits, source generation, local compile, preview toggles, QA completion, snapshot restore, and Mailchimp export all completed.
- Exported `source.mjml` contained the dogfood headline, body copy, CTA label, CTA URL, and footer copy.
- ZIP package was useful for handoff because it included source, compiled HTML, QA notes, implementation guide, platform handoff, readme, and metadata.

What felt confusing:

- The readiness state can be `100%` and still `warn`, because blockers are complete but warning checks remain. The warning state is defensible, but the percentage/status pairing needs clearer explanation.

What felt too technical:

- The package inspector and content QA still expose implementation-oriented language. It is useful, but a less technical customer may not know which warnings are safe to accept.

What felt slow:

- Completing QA group by group is acceptable, but the right-side panel requires scanning several sections before export.

Potential paying-customer blocker:

- Product launch should feel campaign-specific. Generated structured output is useful but less rich than the original archive layout after applying structured content.

Export usefulness:

- Useful. The Mailchimp handoff package had the right files and metadata.

## Onboarding

What worked:

- Structured edit, apply, compile, mobile preview, QA, snapshot restore, Customer.io platform selection, and export worked.
- Export metadata matched `workflowId: onboarding`, `selectedPlatform: Customer.io`, successful compile, 100% QA completion, and local-only status.

What felt confusing:

- Switching workflows with unsaved generated source asks for confirmation. That is safe, but a user may wonder whether the previous export remains available.

What felt too technical:

- The source panel remains prominent. For onboarding customers who only want copy edits, the MJML area still feels like a developer surface.

What felt slow:

- None beyond normal QA scanning.

Potential paying-customer blocker:

- None severe. The workflow is understandable and the exported package is handoff-ready.

Export usefulness:

- Useful. Customer.io handoff instructions and package docs were coherent.

## Password reset

What worked:

- The full loop worked with HubSpot selected as the manual handoff target.
- Snapshot restore was useful here because transactional copy is risky and reverting a local state is reassuring.

What felt confusing:

- Password reset is security-sensitive, but the generic structured fields do not strongly reinforce security review beyond QA.

What felt too technical:

- CTA URL and platform boundaries are understandable, but less technical users may need more prominent security wording before handoff.

What felt slow:

- Compile and preview were fast. QA is the only meaningful time cost.

Potential paying-customer blocker:

- Transactional/security copy may need stronger workflow-specific QA prompts before v1 is sold as a serious password reset production workflow.

Export usefulness:

- Useful, but the implementation guide should eventually become more transactional-email specific.

## Weekly digest

What worked:

- The workflow completed with Klaviyo selected, and the exported source included the edited digest headline, body, CTA, URL, and footer copy.
- ZIP contents and metadata were valid.

What felt confusing:

- Weekly digest has newsletter expectations, but the structured generator currently creates the same simplified hero/body/CTA/footer shape as the other workflows.

What felt too technical:

- The handoff package is clear for implementers, but a non-technical marketer may expect more digest-specific content sections.

What felt slow:

- Workflow switching, compile, preview, and export were quick. Finding the right QA/export state still takes scanning.

Potential paying-customer blocker:

- Digest-specific structure is not yet rich enough. A weekly digest customer may expect multiple items, repeated sections, or a clearer content checklist.

Export usefulness:

- Useful as a basic handoff package, but less convincing as a finished weekly digest system.

## Cross-workflow findings

What worked:

- Every workflow completed the local before-send loop.
- Local compile was fast.
- Failed states stayed local.
- Snapshot restore worked across workflows.
- Export ZIPs were inspectable and consistent.
- Platform handoff remained manual and did not imply integrations.

What felt confusing:

- `100%` readiness with `warn` status needs clearer UI copy.
- Export status and general Studio status were sharing the same message area. The neutral status title reduces confusion, but long-term this should be split.
- Structured generation is safe but users need to understand that structured edits must be applied before export.

What felt too technical:

- MJML still dominates the centre of the workspace.
- Package inspector and metadata are valuable, but they read as implementation proof rather than customer-facing readiness.

What felt slow:

- The right rail is dense. It works for repeated use, but first-time users will scan slowly to understand QA, readiness, export, handoff, metadata, and archive browser.

Potential paying-customer blockers:

- Workflow-specific structured generation is still too generic.
- Warning states need clearer explanation.
- Transactional and digest workflows need more tailored QA prompts.

## Readiness summary

| Workflow | Loop completed | ZIP valid | Export useful | v1 readiness |
| --- | --- | --- | --- | --- |
| Product launch | Yes | Yes | Yes | Ready with warning-copy improvements |
| Onboarding | Yes | Yes | Yes | Closest to v1-ready |
| Password reset | Yes | Yes | Yes | Needs stronger transactional QA before paid positioning |
| Weekly digest | Yes | Yes | Basic | Needs richer digest-specific structure |

## Recommended next phase

Do not add cloud or integrations next. Improve the local product:

1. Make warning reasons clearer in the readiness summary.
2. Add workflow-specific QA prompts, especially for password reset and weekly digest.
3. Make structured generator output more workflow-specific.
4. Separate general Studio status from export package status.
5. Keep reducing technical density in the first-time user path without hiding MJML from power users.
