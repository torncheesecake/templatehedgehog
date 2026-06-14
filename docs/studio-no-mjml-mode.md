# Studio No-MJML mode

No-MJML mode is the default Studio v2 editing experience. It lets users edit structured content without understanding MJML.

## Structured fields

Each workflow supports:

- Preheader.
- Headline.
- Subheading or body copy.
- CTA label.
- CTA URL.
- Brand name.
- Logo URL or path.
- Hero image URL or path.
- Hero image alt text.
- Support email.
- Footer legal line.
- Social links.
- Inserted components.

## Explicit generation

Structured edits do not silently change MJML source. Users must choose `Generate MJML`. Advanced MJML edits do not silently change structured fields.

This preserves both modes:

- Structured mode for marketers.
- Advanced MJML mode for developers and implementation specialists.

## Migration from v1

Existing workflow source remains valid. Studio migrates workflow metadata and quick-edit defaults into a structured v2 model. If a workflow cannot be represented structurally, Studio can still use source-only advanced mode.

## Local persistence

Structured drafts and saved structured content are stored in browser storage only. There is no backend persistence.
