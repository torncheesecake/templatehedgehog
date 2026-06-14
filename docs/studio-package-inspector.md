# Studio package inspector

The package inspector checks the final local export package before ZIP download.

## Fixed package paths

Studio v2 preserves the v1 ZIP structure:

- `/mjml/source.mjml`
- `/html/compiled.html`
- `/docs/qa-notes.md`
- `/docs/implementation-guide.md`
- `/docs/workflow-notes.md`
- `/docs/platform-handoff.md`
- `metadata.json`

## File status

Each file shows:

- Included or missing.
- Generated timestamp where available.
- Pass, warn, or fail status.
- Explanation.
- Safe preview/open hint.

## Blocking rules

Export is blocked when critical files are missing or empty:

- MJML source.
- Compiled HTML.
- Metadata.

Docs should also be included, but missing docs are surfaced through the inspector and tests so the package structure remains stable.

## Safety

Studio uses fixed export paths and sanitised folder names. It does not accept user-controlled raw paths and does not read or write arbitrary local files.
