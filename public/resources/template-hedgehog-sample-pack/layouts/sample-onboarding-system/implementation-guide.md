# Implementation Guide

## 1. Edit Source

Start from `source.mjml`. Replace sample content, merge variables, URLs, sender details, and legal copy.

## 2. Compile Output

Compile MJML to HTML using your preferred MJML build process. Keep `source.mjml` and `compiled.html` together so future edits do not happen only in compiled output.

## 3. Map Variables

Check all variables before send. The sample source uses:

- `user.first_name` — set an ESP-side default (e.g. "there") for empty values
- `account.verify_url` — primary activation destination
- `app_store_url` / `play_store_url` — app-download links (replace placeholder badge images too)
- `preferences_url` — manage-preferences / unsubscribe route
- sender address and legal copy in the footer

## 4. Run QA

Use `qa-notes.md` before upload. At minimum, test mobile width, long copy, blocked images, and internal seed sends.

## 5. Upload

Import the compiled HTML into your ESP, CRM, campaign platform, or implementation workflow. Re-test after upload because some editors rewrite HTML.
