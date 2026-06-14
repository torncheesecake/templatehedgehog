# Template Hedgehog Soft Launch Verification

Date: 2026-06-05

This checklist records what has been verified locally and what still needs a production purchase test. Do not treat local route, unit test, or build proof as evidence that a live Stripe payment and production download have been completed.

## Soft Launch Scope

Controlled soft launch means a real buyer can:

- Understand that Template Hedgehog is a source-to-handoff email production archive, not an ESP.
- Choose Core, Pro, or Team without treating Core as the default.
- Buy Pro or Core through Stripe Checkout.
- Reach the success page after checkout.
- Download the matching signed archive.
- Inspect the sample pack before buying.
- Understand that Template Hedgehog Studio - Private Alpha is included with Pro and Team while it is in alpha.
- Understand that Studio covers everything before send and does not send email, manage audiences, manage consent, handle unsubscribe, automate campaigns, provide reporting, or replace Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or another ESP.

## Purchase Path Checklist

| Area | Status | Evidence | Production action |
| --- | --- | --- | --- |
| Homepage route | Verified locally and live | `http://localhost:3000/` and `https://templatehedgehog.co.uk/` returned 200 in browser QA. The live page shows "Where Template Hedgehog fits", Pro as the main buying path, and Studio Private Alpha copy. | Monitor after production purchase test. |
| Pricing route | Verified locally and live | `http://localhost:3000/pricing` and `https://templatehedgehog.co.uk/pricing` returned 200 in browser QA. The live page shows Core, Pro, and Team, a Buy Pro - £179 CTA, Studio Private Alpha positioning, one Pro checkout form, one Core checkout form, and no disabled checkout buttons. | Run live checkout test. |
| Studio route | Verified locally and live | `http://localhost:3000/studio` and `https://templatehedgehog.co.uk/studio` returned 200 in browser QA. It is labelled Template Hedgehog Studio - Private Alpha, Included with Pro and Team, and Everything before send. | Continue ensuring it does not imply sending, audiences, consent, unsubscribe, automation, reporting, or ESP replacement. |
| Components route | Verified locally and live | `http://localhost:3000/components` and `https://templatehedgehog.co.uk/components` returned 200 in browser QA. It explains reusable blocks for real email workflows and reinforces Core archive essentials plus Pro recurring-production coverage. | Monitor for catalogue-style drift. |
| Layouts route | Verified locally and live | `http://localhost:3000/layouts` and `https://templatehedgehog.co.uk/layouts` returned 200 in browser QA. It explains deployable email systems, Core coverage, and Pro coverage. | Monitor for catalogue-style drift. |
| Docs route | Verified locally and live | `http://localhost:3000/docs` and `https://templatehedgehog.co.uk/docs` returned 200 in browser QA. It includes Studio boundary copy and platform compatibility guidance. | Keep compatibility copy limited to handoff, not native integrations. |
| Checkout route | Verified by code and tests | `/api/checkout` builds Stripe Checkout Sessions and unit tests verify canonical success URL and pricing metadata. | Run a live low-risk purchase or Stripe test-mode purchase against the deployed app. |
| Stripe configuration | Partly verified | `.env.example` documents `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, and download-token requirements. | Confirm production secrets are present on the deployment target. Do not infer from local env files. |
| Success route | Verified locally and live | `http://localhost:3000/success` and `https://templatehedgehog.co.uk/success` returned 200 in browser QA. No-session state shows safe navigation to pricing and support. | Confirm real `session_id` state after live checkout. |
| Signed download route | Verified by tests | `/api/downloads/[token]` tests cover valid token redirect, token reuse rejection, and empty token rejection. | Confirm live signed link is issued from `/success?session_id=...` and downloads the matching paid archive. |
| Download route | Verified by tests | `/api/download` tests cover provider HEAD/GET success, missing session rejection, and provider env failure. | Confirm production storage mode, provider bucket, object prefix, and archive object permissions. |
| Archive generation | Verified locally and on production host | `npm run build` rebuilt Core, Pro, and Team archives locally. `npm run deploy:pi` rebuilt the same archive filenames under `/srv/templatehedgehog/current/private/downloads/` on the production Pi. | Confirm live signed delivery serves the matching purchased archive. |
| Paid archive contents | Verified locally | `template-hedgehog-starter-pack.zip` has 60 files. `template-hedgehog-pack.zip` has 323 files. `template-hedgehog-enterprise-pack.zip` has 323 files. | Spot-check live downloaded archive against the purchased tier. |
| Sample pack | Verified locally and live | `http://localhost:3000/sample-pack` and `https://templatehedgehog.co.uk/sample-pack` returned 200 in browser QA. `https://templatehedgehog.co.uk/resources/template-hedgehog-sample-pack.zip` returned 200 as `application/zip`. The page states the sample pack is public inspection material, not the paid Core, Pro, or Team archive. | Periodically spot-check public ZIP contents after rebuilds. |
| Support path | Verified locally and live | `http://localhost:3000/support` and `https://templatehedgehog.co.uk/support` returned 200 in browser QA. It gives direct support guidance, purchase/download help, Studio boundaries, support boundaries, and refund expectations. | Confirm support mailbox is monitored before inviting buyers. |
| Refund and download help | Verified locally and live | `/support` explains failed signed links, inaccessible archives, purchase verification, and refund expectation when delivery cannot be resolved. | Confirm support can resolve or refund against a real Stripe receipt. |

## Live Production Status

Checked on 2026-06-05 against `https://templatehedgehog.co.uk` after `npm run deploy:pi`.

| Route | Live status | Notes |
| --- | --- | --- |
| `/` | 200 | Live homepage includes "Where Template Hedgehog fits" and Studio Private Alpha positioning. |
| `/pricing` | 200 | Live pricing includes Core, Pro, Team, Studio Private Alpha positioning, two checkout forms, and no disabled checkout buttons. |
| `/studio` | 200 | Live route is reachable and labelled Private Alpha, Included with Pro and Team, and Everything before send. |
| `/components` | 200 | Live route responds and renders without runtime errors. |
| `/layouts` | 200 | Live route responds and renders without runtime errors. |
| `/docs` | 200 | Live route includes the latest compatibility guidance. |
| `/support` | 200 | Live route responds and renders download, refund, and support guidance. |
| `/success` | 200 | No-session page responds. Real checkout `session_id` state remains unverified. |
| `/sample-pack` | 200 | Live route responds and links to the public sample ZIP. |

`npm run deploy:pi:dry-run` completed successfully on 2026-06-05. `npm run deploy:pi` then created remote backup `/srv/templatehedgehog/backups/current.20260605T092506+0100`, synced the current app, rebuilt content and archives on the Pi, restarted `templatehedgehog.service`, and left the service active with `MainPID=11097`. The deploy script's immediate route check briefly returned `502` while the service was still starting; follow-up checks returned 200 for all listed public routes.

## Production Host Configuration Observed

Checked on 2026-06-05 without printing secret values.

| Setting | Status | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Set | `https://templatehedgehog.co.uk`. |
| `STRIPE_SECRET_KEY` | Set | Checkout can be configured, but no live checkout session was created during this pass. |
| `STRIPE_WEBHOOK_SECRET` | Missing | Webhook handling is not verified. This is not a blocker for redirect-based checkout testing, but it is a blocker if purchase fulfilment depends on webhook events. |
| `DOWNLOAD_TOKEN_SECRET` | Set | Required for signed download links. |
| `DOWNLOAD_TOKEN_REPLAY_STORE` | Set to `memory` | Production memory replay is explicitly enabled for the single Pi deployment. This is acceptable for a controlled founder-led launch, but Redis is still safer for durable replay protection. |
| `DOWNLOAD_TOKEN_MEMORY_REPLAY_ENABLED` | Set to `true` | Allows memory replay protection in production. |
| `DOWNLOAD_STORAGE_MODE` | Set to `filesystem` | Production filesystem delivery is explicitly enabled for the single Pi deployment. |
| `DOWNLOAD_FILESYSTEM_ENABLED` | Set to `true` | Allows local archive delivery from the Pi. |
| Provider bucket and region | Missing | S3/provider delivery is not configured. This is acceptable only if the Pi remains the deliberate single-server delivery host. |

Malformed live download requests were checked on 2026-06-05: `/api/download?session_id=not_a_session` returned 400 and `/api/downloads/not-a-token` returned 400. No private archive was exposed by those checks.

## Production Stripe Test

Run this as a real end-to-end test on the production deployment before wider traffic:

1. Confirm production environment variables are set on the deployed host.
2. Open `/pricing` on the production domain.
3. Start the Pro checkout path.
4. Complete payment in the intended Stripe mode.
5. Confirm the Stripe Checkout Session contains the Pro product metadata.
6. Confirm Stripe redirects to `/success?session_id=...`.
7. Confirm the success page displays Pro, the paid amount, archive filename, version, and update window.
8. Confirm support can identify the purchase from the purchase email or Stripe receipt.

## Success Page Test

1. Visit `/success` without `session_id`.
2. Confirm no private archive details or unusable paid download link are shown.
3. Visit `/success?session_id=...` after a real checkout.
4. Confirm the page shows the matching purchased tier.
5. Confirm archive filename, version, support route, and next steps are visible.

## Signed Download Test

1. Click the signed archive link from a valid success page.
2. Confirm the file downloads.
3. Confirm the archive opens locally.
4. Confirm the archive matches the purchased tier.
5. Confirm a replayed signed link is rejected if production replay protection is enabled.
6. Confirm support can recover access if delivery fails.

## Sample Pack Check

1. Open `/sample-pack`.
2. Download `public/resources/template-hedgehog-sample-pack.zip`.
3. Confirm the ZIP contains source MJML, compiled HTML, preview references, QA notes, testing proof, implementation guidance, workflow notes, and licence reference.
4. Confirm the page clearly says the sample pack is inspection material and not the full paid archive.

## Archive Contents Check

1. Download each paid archive through its production delivery path, not from the local filesystem.
2. Confirm Core contains the essential archive starter: 11 components, 3 layouts, 3 workflows, MJML, compiled HTML, previews, and setup docs.
3. Confirm Pro contains the full production archive: 82 components, 18 layouts, 13 workflows, QA notes, implementation guidance, version metadata, and 6 months of updates.
4. Confirm Team contains the Pro archive plus licence and support context for commercial reuse, white-label/internal deployment, reusable generation framework, priority support, and 12 months of updates.
5. Confirm Studio Private Alpha is presented as an included Pro and Team bonus, not as the archive itself and not as a paid standalone SaaS.

## Support Contact Check

1. Confirm `support@templatehedgehog.co.uk` is monitored.
2. Confirm support can receive purchase email, Stripe receipt, selected tier, archive filename, and error details.
3. Confirm support has a practical process for failed checkout, failed signed download, inaccessible archive, licence question, and Studio private-alpha question.

## Refund And Download Help Check

1. Confirm `/support` states what to send when a signed link fails.
2. Confirm `/support` states what to send when an archive cannot be opened.
3. Confirm refund language is clear: if the paid archive cannot be delivered, is inaccessible, or materially differs from the described tier contents, support will resolve the issue or refund the purchase.
4. Confirm no public page promises a formal SLA during founder-led soft launch.

## Manual Production Purchase Test Summary

Run this before broader public paid traffic:

1. Deploy the current app with production environment variables set.
2. Open `/pricing`.
3. Start checkout for Core or Pro.
4. Complete payment in the intended Stripe mode.
5. Confirm Stripe redirects to `/success?session_id=...`.
6. Confirm the success page shows the purchased tier, amount, archive name, version, and signed archive link.
7. Click the signed archive link once.
8. Confirm the archive downloads and opens.
9. Confirm a second click is rejected if single-use replay protection is enabled.
10. Confirm support can identify the purchase from the purchase email or Stripe receipt.

### Final Paid-Path Pass Criteria

Treat the paid path as passed only when all of the following are true:

1. `/pricing` starts the intended Pro checkout without showing disabled or confusing purchase states.
2. Stripe Checkout completes in the intended live or test mode.
3. Stripe redirects back to `https://templatehedgehog.co.uk/success?session_id=...`.
4. The success page shows the purchased tier, amount, archive filename, archive version, update window, and support route.
5. The signed download link is present only after a valid paid session.
6. The signed download link downloads the matching paid archive from the production delivery path.
7. The archive opens locally and contains the expected tier contents.
8. A malformed or replayed token does not expose the archive.
9. Support can identify the purchase from the buyer email or Stripe receipt.

### Final Paid-Path Failure Map

Use this mapping if the paid test fails:

| Failure | Likely area |
| --- | --- |
| Pricing button does not reach Stripe | `/api/checkout`, Stripe secret, product lookup, or checkout form payload. |
| Stripe succeeds but does not return to `/success?session_id=...` | Checkout success URL or `NEXT_PUBLIC_APP_URL`. |
| `/success?session_id=...` cannot read the session | Stripe secret, session id, payment status, or amount/product metadata mismatch. |
| Success page renders but no signed link appears | Download token creation or `DOWNLOAD_TOKEN_SECRET`. |
| Signed link returns 503 | Replay store configuration or filesystem/provider delivery configuration. |
| Signed link downloads wrong archive | Product-to-pack mapping or archive filename resolution. |
| Archive is missing expected files | Pack build inputs or generated archive contents. |
| Support cannot identify purchase | Stripe dashboard workflow, support mailbox, or internal purchase lookup process. |

## Required Production Environment

Minimum production checks:

- `NEXT_PUBLIC_APP_URL` points to the deployed app URL.
- `STRIPE_SECRET_KEY` is set for the intended Stripe mode.
- `STRIPE_WEBHOOK_SECRET` is set if webhooks are enabled.
- `DOWNLOAD_TOKEN_SECRET` is set.
- `DOWNLOAD_TOKEN_REPLAY_STORE` is production-safe, preferably Redis.
- `REDIS_URL` is set if Redis replay protection is used.
- `DOWNLOAD_STORAGE_MODE` is set to `provider`, or filesystem delivery is deliberately enabled for a single-server deployment.
- Provider bucket, region, credentials, and optional prefix point to the paid archive objects.

## Preview Quality Audit

Public v3 preview scan:

- Scope: `public/email-shots-v3/`, including 18 layout previews.
- Total PNG assets scanned: 120.
- Missing or unreadable files: 0.
- Near-blank files detected: 0.
- Pale or low-contrast files flagged by thumbnail metrics: 43.

The scan flags images that are technically valid but can look weak when shown as small catalogue thumbnails. Many are white-background email previews, so this is a quality ranking rather than proof of broken files.

### High Priority

- `public/email-shots-v3/header-light-utility.png`
- `public/email-shots-v3/header-title-logo-right.png`
- `public/email-shots-v3/header-centred-brand.png`
- `public/email-shots-v3/product-grid-4up.png`
- `public/email-shots-v3/transactional-receipt.png`
- `public/email-shots-v3/layouts/receipt-system.png`

Reason: very pale at thumbnail size, which can make public cards feel blank or less premium.

### Medium Priority

- `public/email-shots-v3/privacy-note-icon-left.png`
- `public/email-shots-v3/alert-notice-banner.png`
- `public/email-shots-v3/footer-onboarding-legal.png`
- `public/email-shots-v3/header-brand-row.png`
- `public/email-shots-v3/footer-privacy-light.png`
- `public/email-shots-v3/footer-app-legal.png`
- `public/email-shots-v3/logo-grid-trust-wall.png`
- `public/email-shots-v3/newsletter-editor-note.png`
- `public/email-shots-v3/product-update-digest.png`
- `public/email-shots-v3/lifecycle-usage-summary.png`
- `public/email-shots-v3/order-status-update.png`

Reason: valid previews, but low visual contrast could weaken trust in lower public listings.

### Low Priority

- Remaining pale flags in transactional, lifecycle, support, and newsletter blocks.

Reason: these are valid white-background email artefacts. They are less urgent than the high-priority assets shown in more commercially important paths.

## Trust Review Notes

### Feels Trustworthy

- Homepage clearly explains the product as a source-to-handoff workflow.
- Pricing explains what arrives after purchase before asking buyers to compare counts.
- Component and layout detail pages now lead with production role and workflow context.
- Docs explain source, compile, preview, QA, and handoff boundaries.
- Support now explains what happens if download or archive access fails.
- Founder proof is visible from the homepage and about page.

### Remaining Trust Issues

- No live production purchase has been verified in this document.
- No public customer proof or case study exists yet.
- Some previews still look pale in small cards.
- Support is founder-led and does not yet have a formal SLA.
- Platform-specific claims remain intentionally limited because Template Hedgehog does not integrate with ESPs.

## Soft Launch Decision

The product is ready for founder-led soft launch only after the manual production purchase test above is completed. Until then, the public path is locally verified and build-verified, but the live paid delivery chain remains unproven.
