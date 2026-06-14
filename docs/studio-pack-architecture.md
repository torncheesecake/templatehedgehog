# Studio pack architecture

Studio v2 defines a local commercial pack model. It is product architecture only and does not enforce payment, auth, or backend entitlement.

## Packs

- Core pack.
- Pro pack.
- Team pack.

## Manifest fields

Each pack manifest defines:

- Components.
- Layouts.
- Workflows.
- Export capabilities.
- Docs.
- Version compatibility.

## Local entitlement checks

Studio can check whether a workflow, component, or export capability belongs to the selected local pack manifest. These checks are used for product clarity and future architecture.

They are not security controls. They do not replace checkout, delivery tokens, or paid download protection.

## Current intent

The local pack model helps Studio explain which product tier a capability belongs to without adding accounts, databases, or cloud state.
