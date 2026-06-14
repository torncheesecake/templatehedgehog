# QA Notes

Use these checks before moving a compiled email into production.

## Structure

- Confirm the MJML compiles without warnings.
- Confirm the compiled HTML contains a viewport meta tag.
- Confirm table structure does not overflow at 320px, 375px, and 600px preview widths.
- Confirm CTA copy remains readable if border radius is flattened by Outlook.

## Content

- Test long first names and long CTA URLs.
- Replace sample sender, legal, preference, and support copy.
- Confirm merge variables match the ESP or campaign platform.

## Rendering

- Send internal seeds to Gmail, Outlook Desktop, and Apple Mail where possible.
- Check dark-mode behaviour if the campaign is likely to be read in dark-mode clients.
- Confirm blocked images do not remove the primary message or CTA.
- Re-test after ESP upload because some editors rewrite HTML.

## Handoff

- Store final source and compiled output together.
- Attach implementation notes to the handoff so future edits do not start from the compiled HTML alone.
