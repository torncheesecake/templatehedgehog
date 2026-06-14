# Studio state model

Date: 4 June 2026

Studio is a local-first before-send workspace. Its state model is intentionally browser-scoped and must not imply accounts, cloud storage, sending, audience management, consent handling, automation, reporting, or platform API integration.

## State flow

```text
workflow selection
-> source state
-> structured content and brand tokens
-> generated MJML
-> compile state
-> preview state
-> QA state
-> export readiness
-> export metadata
```

The canonical UI owner is `useStudioWorkspaceState`. `StudioWorkspace.tsx` should render state, derived state, and actions from that hook, not mutate cross-workflow state directly.

## Canonical ownership

| Value | Owner | User-authored | Generated | Derived | Persisted | Exportable |
| --- | --- | --- | --- | --- | --- | --- |
| `selectedWorkflowSlug` | Hook state | Yes | No | No | Yes | Metadata only |
| `sourceOrigins` | Hook state | No | Yes | No | Yes | Metadata |
| `sourceDrafts` current source | Hook state | Yes | Yes | No | Yes | MJML source |
| `savedSources` saved source | Hook state | Yes | No | No | Yes | No |
| `structuredDrafts` | Hook state | Yes | Migrated from workflow | No | Yes | Metadata and generated MJML |
| `savedStructuredDrafts` | Hook state | Yes | No | No | Yes | Metadata comparison |
| `brandTokens` | Hook state | Yes | Defaults generated from product | No | Yes | Metadata and generated MJML |
| Workflow structure | `structuredDrafts.components` | Yes | Defaults generated from workflow | No | Yes | Metadata and generated MJML |
| `compiledHtml` | Hook state | No | Yes | No | Yes | Compiled HTML |
| `compileStates` | Hook state | No | Yes | No | No | Metadata |
| `qaStates` | Hook state | Yes | Local checks update some items | No | Yes | QA notes and readiness |
| `platforms` | Hook state | Yes | Defaults from workflow | No | Yes | Handoff docs and metadata |
| `snapshots` | Hook state | Yes | No | No | Yes | No direct export |
| `readiness` | Hook derived state | No | No | Yes | No | Metadata |

## Initialisation

The hook initialises workflow-shaped records from product data first, then hydrates browser storage in an effect. Corrupt JSON returns an empty stored state and does not crash the workspace.

Initialisers:

- `buildInitialRecord` creates workflow-keyed source and compiled HTML records.
- `buildInitialStructuredRecord` creates structured content from workflow data.
- `buildInitialQa` migrates legacy boolean QA values to `unchecked`, `pass`, or `fail`.
- `buildInitialPlatform` selects each workflow's first recommended platform.
- `normaliseStudioSnapshots` filters corrupt snapshot shapes and versions valid snapshots.
- `createCompileState` marks bundled compiled HTML as preloaded but not a current local compile.

## Mutation map

| Action | Mutates | Recalculates or clears |
| --- | --- | --- |
| `selectWorkflow` | `selectedWorkflowSlug`, preview mode, inline edit state | Selection persistence |
| `updateSource` | `sourceDrafts`, `sourceOrigins`, `compileStates` | Clears `lastCompiledAt`, `exportStatus`, compile QA |
| `saveSource` | `savedSources`, `lastSavedAt`, `revisions`, `compileStates` | Marks source saved locally |
| `resetSource` | Source, saved source, structured content, compiled HTML, QA, revision, origin | Clears compile timestamp and export status |
| `updateStructuredField` | `structuredDrafts` | Clears export status and marks structured source out of sync |
| `applyStructuredToMjml` | `sourceDrafts`, `sourceOrigins`, compile state | Clears compile timestamp, export status, and compile QA |
| `updateBrandToken` | `brandTokens` | Clears export status and marks generated source out of sync |
| Component structure actions | `structuredDrafts.components`, source | Regenerates MJML and clears compile/export state |
| `compileSource` | `compileStates`, `compiledHtml`, `lastCompiledAt`, compile QA | Preserves previous valid preview on failure |
| `updateQa` and `setQaValues` | `qaStates` | Updates readiness through derived state |
| `setSelectedPlatform` | `platforms`, QA | Marks platform selected |
| `createSnapshot` | `snapshots` | Captures local state with `version: 1` |
| `restoreSnapshot` | Source, saved source, compiled HTML, structured content, brand tokens, QA, platform, origin, compile state | Clears export status and recalculates readiness through derived state |
| `deleteSnapshot` | `snapshots` | No compile change |
| `exportPackage` | `exportStatus`, QA | Blocks stale source, failed readiness, package failures, and source drift |

## Derived state

The hook derives:

- selected workflow, guidance, source, structured content, compiled HTML, QA state, and platform
- dirty source state
- source statistics
- QA progress
- compile match state
- structured dirty state
- brand token validation
- content QA, link review, image review, package inspection
- source drift diagnostics
- export readiness
- workflow status labels

The most important derived guard is source drift:

```text
sourceOrigin != manual
and source does not match generateMjmlFromStructuredContent(structuredContent, brandTokens)
and structured content changed, brand tokens changed, or source was previously generated
= sourceOutOfSync
```

This blocks export until the user applies structured or brand token edits to MJML and compiles the current source.

## Drift points

Known drift risks and protections:

- Source edited after compile: `updateSource` clears compile timestamp and export status, then marks compile QA unchecked.
- Structured tokens edited before apply: source drift diagnostic fails readiness.
- Brand token edited before apply: source drift diagnostic fails readiness.
- Workflow structure edited: MJML is regenerated locally and compile/export state is cleared.
- Failed compile: previous compiled HTML stays available, but the compile message states that the preview is previous valid output.
- Snapshot restore: export status is cleared because snapshots do not store an export event.
- Reset source: source, saved source, structured content, compiled HTML, QA, origin, and export status are reset together.
- Export: blocked if current source does not match the successful compile snapshot.

## Local persistence

Browser storage uses `template-hedgehog-studio:v1`. Stored data is namespaced, JSON parse failures are ignored safely, and unavailable storage shows a local warning while keeping in-memory state for the session.

Snapshots are stored as `version: 1`. Old valid snapshots without a version are migrated to version 1. Corrupt snapshots with missing source, compiled HTML, workflow slug, platform, structured content, brand tokens, QA state, or source origin are dropped.

## Export dependencies

Export uses the same canonical state as the UI:

- current source from `sourceDrafts`
- compiled HTML from `compiledHtml`
- compile metadata from `compileStates`
- source origin from `sourceOrigins`
- QA state from `qaStates`
- platform guidance from `platforms`
- readiness from the derived readiness score
- package inspection from the fixed export file list

The export button can be clicked at any time, but `exportPackage` blocks packaging unless compile status, source match, source drift, readiness, and package inspection are acceptable.

## Remaining risk

`useStudioWorkspaceState` is intentionally explicit but still large. The next safe split is to separate persistence helpers, source and compile actions, structured content actions, snapshot actions, and export actions after this state contract has settled.
