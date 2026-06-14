# NetSuite Template Delivery Checklist

## Discovery Questions

- What type of NetSuite marketing campaign is this for?
- Is this a one-off campaign, a recurring newsletter, or a reusable template system?
- What currently breaks or slows the team down?
- Who edits the template after handoff?
- Does the team need compiled HTML only, editable MJML plus HTML, or both?
- Are campaign upload, list setup, and send configuration handled by the customer?
- Are there legal, footer, unsubscribe, preference, or sender-address requirements?

## Asset Checklist

- Current template HTML or MJML.
- Screenshots of current desktop and mobile rendering.
- Brand guidelines, logo files, colours, fonts, and spacing rules.
- Final or draft copy.
- Image files or NetSuite-hosted image URLs.
- Button URLs and tracking requirements.
- Example emails the customer likes.
- Footer, company address, support, privacy, and preference links.

## Build Checklist

- Confirm package: Starter Template, Campaign Kit, or Email System.
- Set campaign purpose and core content blocks.
- Build responsive HTML structure with valid html/body output after compile.
- Keep editable copy and image areas clear.
- Use absolute image URLs or customer-approved hosted assets.
- Avoid fragile custom scripting or NetSuite-specific implementation assumptions.
- Keep reusable sections consistent across related templates.
- Replace all placeholders before handoff.
- Remove unused demo copy, demo images, and test links.

## QA Checklist

- Compile MJML without validation errors.
- Review compiled HTML structure for opening and closing tags.
- Check desktop width, mobile stacking, button spacing, and image scaling.
- Confirm all links are real, intentional, and customer-approved.
- Confirm all image URLs load outside the local development environment.
- Check preheader, title, sender-facing copy, and footer compliance text.
- Test with long copy, short copy, and missing optional image areas where relevant.
- Run a final visual check before handoff.

## Handoff Checklist

- Provide compiled HTML ready for NetSuite campaign template use.
- Provide MJML source if included in the package.
- Include short handoff notes for editable areas, image swaps, and repeated sections.
- State clearly that the customer remains responsible for uploading and configuring campaigns in NetSuite unless separately agreed.
- Include package scope, revision window, and any support terms.

## Revision Process

- One revision round is included in Starter Template.
- Campaign Kit includes consolidated feedback across the three templates.
- Email System revisions should be grouped by layout, section, and handoff notes.
- Ask for marked-up screenshots or line-level feedback where possible.
- Separate template defects from new scope requests.
- Confirm final approval before preparing the final handoff files.
