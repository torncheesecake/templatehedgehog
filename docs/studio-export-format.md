# Studio export format

Studio exports a local ZIP package generated in the browser. The package is intended for review and manual upload or paste into a sending platform.

## Package paths

Each export uses a sanitised folder name and fixed internal paths:

- `mjml/source.mjml`
- `html/compiled.html`
- `docs/qa-notes.md`
- `docs/implementation-guide.md`
- `docs/workflow-notes.md`
- `docs/platform-handoff.md`
- `docs/change-summary.md`
- `docs/readme.md`
- `metadata.json`

## Metadata

`metadata.json` records local production context:

- workflow id and title
- selected platform
- export timestamp
- Studio version and export package version
- source origin
- source and compiled HTML hashes
- compile status, last success, last failure, and compile duration
- QA completion percentage
- readiness score, blockers, and recommended next action
- changed structured tokens
- included sections
- brand token values
- revision and layout metadata
- `localOnly: true`

## Safety boundary

Export does not send email and does not call platform APIs. The ZIP contains only the visible source, compiled HTML, generated documentation, and metadata. User-controlled export paths are not accepted.

## Review expectation

Before handoff, review the compiled HTML in the target platform. Studio can verify local compile, local readiness, links, image references, and package completeness, but the sending platform owns final send settings, audience, consent, unsubscribe handling, automation, and reporting.
