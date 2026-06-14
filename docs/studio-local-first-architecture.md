# Studio local-first architecture

Studio v1 is intentionally local-first. It gives users a useful before-send workflow without requiring accounts, tenancy, cloud storage, platform credentials, or background services.

## Local state

Studio stores the following in browser storage:

- selected workflow
- MJML drafts and saved source
- structured content and saved structured content
- brand tokens
- selected pack metadata
- editor mode
- source origin
- compiled HTML
- QA checklist state
- selected handoff platform
- save, compile, export, and revision metadata
- local snapshots

If browser storage is unavailable, Studio keeps changes in memory for the current session and shows a storage warning.

## Compile path

Studio uses `/api/studio/local-compile` for local development and review. The route rejects non-loopback hosts and uses the shared untrusted MJML safety checks. It is separate from production compile routes and does not weaken production compile safeguards.

## Product boundary

Studio handles preparation only:

- local editing
- MJML generation
- local compile
- preview
- local QA
- platform handoff guidance
- local ZIP export

The sending platform handles:

- campaign creation
- audience and list management
- consent
- unsubscribe settings
- automation
- send execution
- reporting and analytics

## Why not cloud yet

Cloud features would introduce authentication, tenancy, access control, retention, abuse prevention, rate limits, platform secrets, and support obligations. Those should wait until the local workflow proves repeated customer value.
