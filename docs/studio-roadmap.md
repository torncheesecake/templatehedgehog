# Template Hedgehog Studio Roadmap

Template Hedgehog Studio is the local production-email workspace built around the existing Template Hedgehog library. It sits before sending platforms and helps teams assemble, inspect, compile, preview, QA check, and hand off email systems.

Studio is not Mailchimp. It does not send campaigns, manage audiences, run consent processes, operate unsubscribe lists, segment contacts, automate journeys, deliver campaigns, or report on campaign performance.

## Why Studio Does Not Replace Mailchimp

Mailchimp, Klaviyo, HubSpot, NetSuite, Salesforce, Customer.io, and similar platforms own recipient data, unsubscribe handling, consent records, automation, delivery, and reporting. Studio prepares production-ready source and HTML before that work begins in the sending platform.

This boundary keeps Studio focused on the parts Template Hedgehog already proves: MJML source, compiled HTML, workflow structure, QA notes, previews, and implementation handoff.

## Phases

### Phase 0: Static Studio Prototype in `/studio`

Create an isolated product workspace that reuses current Template Hedgehog workflows, layouts, components, MJML source, and compiled HTML outputs. Use local mock state for preview mode, platform guidance, and handoff preparation.

### Phase 1: Real Workflow Selection and Archive Browsing

Let users select real workflows, browse archive contents, and inspect linked layouts and components without exposing protected paid source outside the intended delivery model.

### Phase 2: Editable Source and Live Compile

Introduce controlled source editing and live MJML compile when the existing compile safety model is ready for interactive use. Keep validation visible and recoverable.

### Phase 3: Export Package Generation

Generate real handoff packages containing MJML source, compiled HTML, QA notes, implementation guidance, preview references, and platform notes.

### Phase 4: Platform-Specific Handoff Guides

Add richer handoff instructions for Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, Shopify-adjacent workflows, and other customer platforms.

### Phase 5: Optional Integrations

Consider optional integrations only where they reduce handoff friction without turning Studio into an audience, consent, or sending system.

### Phase 6: Automation and Analytics Only if Demand Proves It

Add automation or analytics concepts only if customer demand proves the need. Until then, keep Studio focused on everything before send.

## Eventual Integration Shape

Studio can eventually integrate with NetSuite, Shopify, Salesforce, HubSpot, Klaviyo, Customer.io, Mailchimp, and similar platforms by preparing platform-specific artefacts and guidance. Those platforms should continue to own audiences, campaign records, consent, unsubscribe, automation, delivery, and reporting.
