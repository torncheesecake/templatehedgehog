# Studio token model

Studio v2 has a local brand token layer used when generating MJML from structured content.

## Token shape

```ts
type StudioBrandTokens = {
  brandName: string;
  primaryColour: string;
  accentColour: string;
  backgroundColour: string;
  textColour: string;
  fontFamily: string;
  logoUrl: string;
  supportEmail: string;
  footerCompanyLine: string;
};
```

## Defaults

Defaults are safe local values for Template Hedgehog. Users can change them in the Studio workspace. Token edits are stored locally in browser storage.

## Validation

Studio validates:

- Required brand name.
- Hex colour format.
- Logo URL or path presence.
- Support email format.

Validation is local only. Studio does not upload logos, optimise assets, verify remote resources, or call any platform API.

## Injection

Tokens are injected into generated MJML only after the user chooses `Generate MJML`. Token changes do not silently mutate source.
