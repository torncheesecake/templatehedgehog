# Template Hedgehog Homepage Blueprint

## Purpose
Define one clear homepage blueprint that drives users from first visit to paid intent.

Primary conversion action:
- `Get Hedgehog Core - £79`

Primary objection to answer:
- `Why not build this myself?`

## Audience
- Primary: developers and technical email builders.
- Secondary: agencies and lifecycle teams working with developers.
- Skill level: intermediate to advanced.

## Positioning Guardrails
- Workflow-first system, not a template gallery.
- Production-ready MJML delivery, not design-first marketing.
- Focus on speed, reliability, consistency, and handoff clarity.
- Use British English and direct practical language.

## Core Message Stack
1. Stop rebuilding the same emails every project.
2. Start from workflows, not blank MJML files.
3. Hedgehog Core reduces QA loops and delivery friction.
4. £79 is cheaper than one avoidable rebuild cycle.

## Page Narrative
Use this sequence on the homepage:

1. Hero  
Explain the product in one screen and show a real system visual.

2. Workflow-first section  
Show real workflow entry points and outcomes.

3. Build from scratch vs Hedgehog  
Handle the main objection with practical comparisons.

4. Technical proof  
Show MJML source, compiled HTML, and pack structure.

5. What you get  
Summarise paid value as a complete system.

6. Final CTA  
Close with a decisive buy action and one secondary path.

## Section Blueprint

### 1. Hero
Pattern:
- Wide split layout (roughly 45/55 or 50/50).

Left content:
- Eyebrow: `Hedgehog Core`
- H1: `Stop rebuilding the same emails every project`
- Support line: `Start from workflows, not blank MJML files, with structure and output mapped before your team edits copy.`
- Primary CTA: `Get Hedgehog Core - £79`
- Secondary CTA: `Explore workflows`
- One concise trust line under CTAs.

Right content:
- Product system visual:
  - workflow -> layout -> component stack -> output
  - MJML snippet and compiled HTML snippet
  - mapped delivery path line

Acceptance checks:
- Headline resolves in 2 to 3 lines on desktop.
- Primary CTA is the strongest visual action.
- Visual feels integrated, not a floating generic card.

### 2. Workflow-first Section
Pattern:
- Full-width intro above content.

Intro:
- Title: `Start from a workflow, not a blank email`
- Supporting line focused on time saved and production readiness.

Content:
- One featured workflow card.
- Supporting workflow cards for:
  - onboarding
  - password reset
  - billing
  - reporting
  - notifications
- Each card includes:
  - workflow name
  - outcome-focused description
  - linked layout context
  - CTA `View workflow`

Supporting CTA:
- `View all workflows`

Acceptance checks:
- Workflows read as product entry points, not a catalogue list.
- Card spacing and hierarchy are consistent.

### 3. Comparison Section
Pattern:
- Full-width intro above two equal cards.

Title:
- `Build it yourself vs Hedgehog`

Rows:
- time
- QA passes
- consistency
- handoff friction

Visual weighting:
- `Using Hedgehog` side is visually stronger.
- `Build from scratch` side is intentionally muted.

Acceptance checks:
- Two cards align in height.
- Differences are concrete and measurable.

### 4. Technical Proof Section
Pattern:
- Balanced split as one composed feature block.

Left:
- MJML to compiled HTML pairing.

Right:
- Pack file tree excerpt.
- Workflow mapping path.

Mandatory proof artefacts:
- `src/workflows/*`
- `src/layouts/*`
- `src/components/*`
- `compiled/*.html`

Acceptance checks:
- No decorative filler panels.
- Proof content is readable and technically plausible.

### 5. What You Get Section
Pattern:
- Full-width intro above structured content.

Include:
- 81 components
- 18 layouts
- 13 workflows (and growing)
- technical documentation
- compiled HTML outputs

Tone:
- concise and practical
- no fluffy feature claims

Acceptance checks:
- Paid pack feels complete, not partial.
- This section reinforces value, not just counts.

### 6. Final CTA Section
Pattern:
- Centred close.

Copy:
- Headline: `Get Hedgehog Core - £79`
- Support line: `Less than one avoidable rebuild session.`

Actions:
- Primary CTA: `Get Hedgehog Core - £79`
- Secondary CTA: `Explore workflows` or `Browse components` (choose one only).

Acceptance checks:
- One dominant buy action.
- Minimal competing controls.

## Visual and Interaction Rules
- Red is reserved for primary purchase actions.
- Keep dark/light section rhythm deliberate, not random.
- Avoid repeating generic card-on-background patterns.
- Use spacing rhythm consistently:
  - section padding: large and even
  - heading to content gap: clear and repeatable
  - CTA groups: tight and intentional
- Keep nav and footer linked to the same design system.

## CTA Language Rules
Use one paid CTA label everywhere:
- `Get Hedgehog Core - £79`

Do not mix alternatives like:
- `View pricing`
- `Buy now`
- `Get full system`

## Analytics and Tracking
Track at minimum:
- `view_homepage`
- `homepage_hero_primary_click`
- `homepage_hero_secondary_click`
- `homepage_workflow_click`
- `homepage_comparison_view`
- `homepage_proof_view`
- `homepage_final_cta_click`
- `homepage_to_pricing`

Event payload minimum:
- `path`
- `section`
- `cta_label` (for CTA clicks)
- `workflow_slug` (for workflow clicks)

## Content Do and Do Not
Do:
- Use practical developer language.
- Explain outcomes and reduced risk.
- Make workflow entry explicit.

Do not:
- Drift into design gallery messaging.
- Overload sections with long paragraphs.
- Use vague SaaS claims with no proof.

## Definition of Done
The homepage is done when:
- value is obvious within 5 seconds
- workflow-first model is clear above the fold
- objection handling is explicit and practical
- technical proof is visible and credible
- CTA language is consistent across the page
- the page reads as one premium product story, not stacked fragments

---

# Template Hedgehog – Homepage Blueprint

This document defines the exact layout, composition, and intent of the homepage.

Codex MUST follow this. Do not improvise layouts.

---

## DESIGN PRINCIPLES

- Product-first, not marketing-first
- Fewer sections, stronger sections
- Every section must feel like a composed block
- Avoid “heading + paragraph + cards” repetition
- Visuals must explain the product, not decorate

---

## PAGE STRUCTURE (STRICT ORDER)

---

## 1. HERO (PRODUCT ENTRY)

**Goal:** Explain the product instantly

**Layout:** Split (50/50)

LEFT:
- Headline (2–3 lines max)
- Support line (1 sentence)
- CTA group
- ONE supporting line (not bullets)

RIGHT:
- System visual showing:
  workflow → layout → components → output
  MJML → HTML
  mapping path

**Rules:**
- No bullet lists
- Visual must feel integrated, not a card

---

## 2. WORKFLOW ENTRY SECTION

**Goal:** Show how users start

**Layout:** Full-width intro + structured grid

TOP:
- Heading
- One-line explanation

BELOW:
- 1 featured workflow (larger)
- 4 supporting workflows (grid)

**Rules:**
- Featured card must feel dominant
- Not a flat grid of equal cards

---

## 3. COMPARISON (CORE SELLING SECTION)

**Goal:** Sell the product clearly

**Layout:** Full-width intro + two panels

TOP:
- Heading (centred or wide)
- Short supporting line

BELOW:
- Left: Build from scratch (muted)
- Right: Hedgehog (stronger)

**Rules:**
- Hedgehog side visually dominant
- This must feel like a key section, not a utility block

---

## 4. TECHNICAL PROOF (FLAGSHIP SECTION)

**Goal:** Build trust with devs

**Layout:** Split (not card grid)

LEFT:
- MJML → HTML transformation

RIGHT:
- File structure
- Workflow mapping

**Rules:**
- Must feel like ONE composed feature
- Not separate boxes

---

## 5. WHAT YOU GET (PACK VALUE)

**Goal:** Show what’s included

**Layout:** Full-width intro + structured grid

TOP:
- Heading
- Short value statement

BELOW:
- Grouped content (not random cards):
  - components
  - layouts
  - workflows
  - docs

**Rules:**
- Must feel like a system, not a checklist

---

## 6. FINAL CTA (CONVERSION)

**Goal:** Close the sale

**Layout:** Centred

- Strong headline
- Price clarity
- CTA
- Trust line

---

## GLOBAL RULES

### 1. Section separation REQUIRED
Every section must use:
- spacing
- background shift
- OR elevation

No sections should touch directly.

---

### 2. No repeated layouts
Avoid repeating:
- identical card grids
- identical intro patterns

---

### 3. Visual hierarchy
- One dominant element per section
- Everything else supports it

---

### 4. Product-first visuals
Use:
- system diagrams
- MJML vs HTML
- workflow flows

Avoid:
- empty decorative blocks

---

## FAILURE CONDITIONS

The implementation is wrong if:

- sections look similar to before
- layouts feel repetitive
- everything is still “cards in boxes”
- no strong visual differences appear
