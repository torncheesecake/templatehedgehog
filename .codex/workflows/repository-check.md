# Repository Check Workflow

1. Inspect `git status --short`.
2. Read `AGENTS.md`, `CURRENT_STATE.md`, and relevant `.codex/rules`.
3. Search before editing with `rg`.
4. Make the smallest coherent change.
5. Run targeted tests.
6. Run `npm run check`.
7. Run `npm run validate` for release-level changes.
8. Update `CURRENT_STATE.md`, `TASKS.md`, or `CHANGELOG_AI.md` if repository health or standards changed.
