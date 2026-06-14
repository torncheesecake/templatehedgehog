# Studio security boundaries

Template Hedgehog Studio v2 is a local-first workspace for everything before send. It edits structured content, generates MJML, compiles, previews, checks, inspects, and packages email workflow artefacts. It does not send email, manage audiences, manage consent, manage unsubscribes, run automation, provide reporting, or connect to sending-platform APIs.

## Local and Studio-scoped compile

The Studio compile endpoint is `/api/studio/local-compile`. It exists only for Studio's local MJML compile workflow and rejects non-loopback hosts. It does not enable the disabled production compile route and it keeps untrusted MJML safety checks enabled.

Current compile boundaries:

- Localhost or loopback request only.
- JSON body only.
- MJML source is required.
- MJML input size is capped.
- `mj-include`, file URLs, and unsafe remote font usage remain blocked by the shared untrusted MJML compiler checks.
- Errors are returned as readable JSON for the Studio UI.

## No cloud storage in v2

Studio v2 stores drafts, saved source, structured content, brand tokens, pack selection, compiled HTML, QA state, platform target, timestamps, revision labels, local snapshots, and export status in the user's browser storage. There is no account, user table, customer workspace, server database, object storage, or cloud persistence.

This keeps v2 useful without creating security, privacy, retention, or tenancy obligations before the product has proven demand.

## Structured mode and tokens

No-MJML mode stores a local structured content model and local brand tokens. Generating MJML from that model is an explicit user action. Advanced MJML edits do not silently overwrite structured fields, and structured generation does not silently overwrite MJML source.

Brand tokens are local defaults plus user edits. They are validated locally for required values, hex colours, logo references, and support email format. Tokens are not synced, uploaded, or sent to any platform API.

## Local pack manifests

Core, Pro, and Team pack manifests are local product architecture metadata. They describe workflow, component, export, docs, and version compatibility. They are not payment enforcement, auth, or server-side entitlements.

## No sending or integrations in v1

Studio prepares the email system. The sending platform sends, automates, manages consent and unsubscribes, handles audiences, and reports performance.

The platform handoff mode is manual guidance only. Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, and Other are not connected through APIs in v1.

## Export ZIP safety notes

Studio generates a local ZIP in the browser. Export paths are fixed to a safe structure:

- `/mjml/source.mjml`
- `/html/compiled.html`
- `/docs/qa-notes.md`
- `/docs/implementation-guide.md`
- `/docs/workflow-notes.md`
- `/docs/platform-handoff.md`
- `/docs/change-summary.md`
- `/docs/readme.md`
- `metadata.json`

The workflow folder and file names are sanitised. User-controlled raw paths are not accepted. Export content is limited to the visible MJML source, compiled HTML, generated docs, and metadata.

The package inspector checks the fixed export files before download and blocks export if critical files are missing or empty.

## Internal checklist

- Input limits are enforced on local compile.
- Filename sanitisation is used for export names.
- ZIP paths are fixed and do not use user-provided folder paths.
- Studio does not read arbitrary local files.
- Studio does not write to arbitrary local paths.
- Export is generated in memory and handed to the browser download flow.
- Compile uses untrusted MJML safety checks.
- Platform handoff copy does not claim direct integration.
- Structured generation is explicit.
- Brand tokens are local only.
- Pack manifests are local architecture metadata only.
- Package inspection blocks missing critical files.

## Future risks before cloud features

Before cloud compile, auth, team workspaces, or integrations, the product needs:

- Clear tenancy model and access control.
- Persistent storage threat model.
- Rate limits and abuse protection for compile.
- Audit logging and retention policy.
- Secure secret storage for any platform API credentials.
- Explicit consent and unsubscribe boundary for any send-related functionality.
- Tests proving production compile safeguards were not weakened.
