# Onboarding activation

This sample mirrors the workflow artefact style used across Template Hedgehog.

## Intent

Move new users from account creation to first product action without rewriting the same welcome flow.

## Trigger

Sent after a user creates an account but before activation milestones are complete.

## Goal

Drive first meaningful action and reduce first-week drop-off.

## Linked Layout

SaaS Welcome System

## Required Fields

| Field | Purpose | Example |
| --- | --- | --- |
| `user.first_name` | Recipient personalisation for the opening line. | `Amelia` |
| `account.verify_url` | Primary activation destination. | `https://app.example.com/verify?token=abc123` |
| `support.contact_url` | Fallback support route for blocked users. | `https://app.example.com/support` |

## Variants

- No-activity reminder: Follow-up send when activation has not happened within 48 hours.
- Partially complete profile: Alternative copy when setup started but was not finished.

## Deliverables

- Editable MJML source
- Compiled HTML output
- Preview reference
- QA notes
- Implementation guide
- Workflow notes

## QA Risks

- Long first names can wrap in hero lines on narrow mobile clients.
- Verification links with long query strings can force horizontal overflow in some ESP editors.

## Handoff Steps

1. Edit MJML source.
2. Compile HTML.
3. Replace merge variables.
4. Run internal seed tests.
5. Upload compiled HTML to the sending platform.
