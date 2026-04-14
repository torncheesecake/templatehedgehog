# Template Hedgehog Homepage Growth Loop

This file defines a repeatable conversion learning loop for the homepage.

## Core Metrics

- Hero primary CTA CTR: `hero_primary_cta_click / homepage_view`
- Hero tertiary proof CTR: `hero_tertiary_cta_click / homepage_view`
- Workflow card CTR: `workflow_card_click / workflows_section_view`
- Technical proof to pricing CTR: `licence_click(source=technical_proof) / technical_proof_view`
- Final CTA CTR: `final_cta_click / pricing_section_view`
- Checkout start rate: `checkout_start / final_cta_click`
- Purchase conversion rate: `purchase_complete / checkout_start`
- Reassurance click rate: `(docs_click + licence_click + changelog_click) / homepage_view`

## What Good Looks Like

- Hero primary CTA CTR: `>= 8%`
- Hero tertiary proof CTR: `2% to 6%`
- Workflow card CTR: `>= 18%`
- Technical proof to pricing CTR: `>= 12%`
- Final CTA CTR: `>= 10%`
- Checkout start rate: `>= 45%`
- Purchase conversion rate: `>= 25%`
- Reassurance click rate: `4% to 12%`

## Trigger Thresholds

- If hero primary CTA CTR is `< 6%`, test trust strip language and CTA framing.
- If hero tertiary proof CTR is `> 8%` and checkout start is low, tighten offer clarity near proof.
- If workflow card CTR is high and final CTA CTR is low, strengthen workflow to offer transition.
- If reassurance click rate is `> 12%`, surface key answers earlier in hero and objection block.
- If checkout start is high and purchase conversion is low, audit pricing friction and checkout clarity.

## Rule Of 100 Iteration Model

- Run one change at a time.
- Collect at least 100 relevant events before deciding.
- Record result and ship only proven wins.

## Experiment Log Template

Use this template for each test:

- Hypothesis:
- Change made:
- Metric targeted:
- Time window:
- Sample size:
- Result:
- Decision (`keep`, `kill`, `iterate`):
- Next action:

## Experiment Log

### Experiment 001

- Hypothesis: Adding trust points under hero CTA increases primary CTA CTR.
- Change made: Added compact trust strip and included summary near hero CTA.
- Metric targeted: Hero primary CTA CTR.
- Time window: Pending first live measurement window.
- Sample size: Pending.
- Result: Pending.
- Decision: Pending.
- Next action: Compare against previous baseline once 100 homepage views are reached.
