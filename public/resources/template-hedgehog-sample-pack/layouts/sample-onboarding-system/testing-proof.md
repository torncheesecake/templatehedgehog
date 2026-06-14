# Email-client Testing Proof

Template Hedgehog does not claim to remove final platform testing. It gives you production-oriented artefacts and documented checks so testing starts from source, output, and known risks.

## Included Checks

- MJML source and compiled HTML are kept together.
- Responsive widths to inspect: 320px, 375px, 600px.
- Internal seed clients to test where available: Gmail, Outlook Desktop, Apple Mail.
- Edge cases to check: long names, long URLs, blocked images, dark mode, rewritten ESP HTML.

## Buyer Responsibility

Run a seed send inside your own ESP or campaign platform before production. Platform editors can rewrite HTML after import, so final QA must happen after upload.
