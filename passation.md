# Passation — Homepage redesign

Branch: `redesign/simple-site-v1`. Source of truth for art direction: `utf-design/`.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Design audit | Done |
| 2 | Visual foundation + Header / Hero / Latest Release compositions | Approved: Direction B "Monograph" backbone, Direction A for Live, Direction C as a subtle detail layer only |
| 3 | Implementation: foundation, Header, Hero, Latest Release | Done, committed in `257ef71` |
| 3.1 | Calibration pass on Header, Hero, Latest Release | Done and approved. Header, Hero and Release are frozen for now |
| 4 | Live + Band / Live visual break | Done, **not committed** |
| Next | Featured Video, Gallery, About, Merch, Mailing list, Booking, Footer | Not started; wait for go-ahead |

## Visual foundation (Phase 3)

- Fonts: Archivo (display/body, `wdth` axis loaded), Newsreader italic (serif accents), IBM Plex Mono (metadata). The `next/font` variable classes sit on `<html>`; they must stay there because the `:root` tokens reference them.
- Palette in `app/globals.css`: `--ink #0b0b0a`, `--char`, `--bone #e8e3d9`, `--bone-dim`, `--grey`, `--ember #a8321c` (fills), `--ember-text #e0563a` (text and focus).
- Legacy tokens remapped globally: accent becomes ember, radius becomes 0, glow and shadow are removed. Hard-coded radii in untouched components still show.
- Grid: 12 columns, `--margin clamp(16px, 4vw, 56px)`, `--gap clamp(12px, 1.6vw, 24px)`, spacing `--space-s/m/l`.
- Grain: static `public/textures/grain.png` on `body::after`, opacity 0.06.
- Global helpers: `.action-link` (with `.on-bone`), `.meta`, `.srOnly`, flat `.button`.

## Phase 3.1 calibration

**Header** (`app/components/header/header.module.css`)
- The header stays transparent over the hero. A local top scrim sits on `.overlay::before`: an ink gradient of 0.86 → 0.62 → 0 over the header height plus 64px. No blur, no glow.
- Nav links render in full `--bone` while over the hero, instead of `--bone-dim`.
- The scrim fades out when the header turns solid after the hero, so the solid ink header is unchanged.
- The hero's own top scrim was removed so the darkening isn't applied twice.

**Hero** (`app/components/homePage/hero/*`)
- Coordinates removed; nothing replaces them.
- Logo reduced and sized against viewport height so it stays in proportion with the band:
  - desktop: `min(5 cols, 46svh)`
  - tablet: `min(8 cols, 38svh)`
  - mobile: 80% width
- The logo now sits in the dark audience band at the lower left. All four musicians stay readable at 1440 and 1920.
- The "Sent To Die" block, the genre line and the Listen / Live links are unchanged.

**Latest Release** (`app/components/homePage/featuredRelease/featuredRelease.module.css`)
- Split moved from 8/4 to 7/5: the bone plane starts at the gutter between columns 7 and 8.
- The cover spans columns 2–9, right-aligned, and crosses the seam by about a third of its width. Its size is `min(..., 70svh)`.
- The cover has a hard ink offset (`box-shadow: var(--offset) var(--offset) 0 var(--ink)`, 8–14px). It is invisible on the ink plane and prints only where the cover sits on bone. No blur, no radius, no frame.
- The cover's top edge aligns with the first fact rule.
- The sheet is no longer stretched with `space-between`: the facts, "Debut album", actions and platforms now sit together as one block, so the large gap under the metadata is gone.
- Section padding reduced from `space-l / space-m` to `space-m / space-s`.
- Title: Archivo `font-stretch: 80%`, size `clamp(3.5rem, 9vw, 10.5rem)`, tracking -0.015em. On mobile it is `17vw` and fits on one line at 375px.
- At 900px and below (stacked layout):
  - the cover is `min(content width, 560px)`, left-aligned, with the same offset;
  - the bone sheet overlaps 40% of the cover's height;
  - the bottom padding is tighter.

## Verification (Phase 3.1)

- `tsc --noEmit` passes; eslint passes on the changed files.
- Playwright against `localhost:3000` at 1920×1080, 1440×900, 820×1180 and 375×812:
  - no horizontal overflow at any width;
  - fonts load;
  - the mobile menu keeps focus inside it, and Escape closes it (the panel gets `inert` back).
- The only console errors are the logged "database unreachable" messages from the temporary guards below.
- Screenshots are in the session scratchpad, `shots2/` (temporary).

## Temporary code to revisit

- `app/page.tsx`: try/catch around `getActiveMerchProducts`. The empty list is shown when the database is down.
- `app/page.tsx`: try/catch around `getConcertBuckets`. On failure it passes `null` to Live, which shows the neutral unavailable state, not "No public dates". This is worth keeping as real resilience.
- `app/components/homePage/actionHub/actionHub.tsx`: `getNextConcert().catch(() => null)`.
- These were added because the local Postgres was not running. Decide whether to keep them as real resilience, which is recommended for the homepage, or remove them once the database setup is sorted.
- `/merch` and `/concerts` still crash without the database.

## Phase 4: Live + visual break

Homepage order is now Hero → Latest Release → Live → Visual break → (old) ActionHub → Featured Video → Featured Merch.

**Live** (`app/components/homePage/live/*`, Direction A "Poster Run")
- Presentational component `Live({ shows })` on ink. It has no cards, no date boxes and no icons; only type and hairline rules. It sets `id="live"`.
- Data: `app/page.tsx` passes `getConcertBuckets().upcoming`, wrapped in a try/catch. `shows: null` means the fetch failed and `[]` means there are genuinely no upcoming shows; the two states are kept distinct.
- **Unavailable state** (fetch failed): "02 — Live", the big "LIVE", the mono line "Dates unavailable right now" and "All concerts →". No technical details are shown; the error is only logged server-side.
- States:
  - **0 dates:** a giant condensed "LIVE" (Archivo `font-stretch: 80%`) on the left. On the right, under a rule: "No public dates", "Next announcement soon" (mono) and "Concert archive →" to `/concerts/past`. The wording comes from `utf-design/wireframes/home-functional.md`.
  - **1 date:** meta "02 — Next live". The poster sits on columns 1–5 at its natural ratio and is never cropped. Opposite it: a giant "DD MON / YYYY", the event name, a ruled mono facts list (Venue, City, Doors, Show, Price, each only if the data exists), then Tickets ↗, Details → and All dates →. Without a poster the event block takes the full width.
  - **2+ dates:** "LIVE" with a real "NN upcoming" count, then a ruled tour list: date (DD.MM.YY, tabular), city plus a small mono country code, venue in mono, and Tickets ↗ (or Details → when there is no ticket URL). "All dates →" follows the list. At most 5 rows. Ticket links carry screen-reader-only context ("for Brussels, 07.11.2026").
- At 900px and below, rows become two lines (date + city / venue + action), and the featured state stacks date → poster → name → facts → links.
- The hero's "Live →" link points to `#live`. The section has `scroll-margin-top: var(--header-h)`, so the anchor lands just below the sticky header. Verified at 1440 and 375: the section top equals the header height.

**Visual break** (`app/components/homePage/visualBreak/*`)
- `public/gallery/band1.jpg` (2048×1329, warm backlit stage shot: singer plus two guitarists), full-bleed. No copy.
- Desktop and tablet: the frame keeps the photo's own ratio, so nothing is cropped except the baked border (`trim: 1.045`). Mobile: a 4:5 crop centred on the singer (`positionMobile`).
- The served file is never upscaled: 2048 at 1920 wide, and `sizes` covers the 4:5 mobile crop.
- The asset, crop, trim and credit live in the `BREAK_IMAGE` config, so the photo can be swapped without touching the layout.
- **TEMPORARY ASSET, still to be replaced.** It is the strongest available photo, but:
  - its maximum resolution is 2048px, slightly soft on large retina screens;
  - it has a baked border, trimmed off;
  - it carries the photographer's handwritten signature (reads roughly "Henoumont T."), which is deliberately left visible.
  - **To do:** confirm the photographer's name and permission, ask for a clean high-resolution master, then set `credit` (mono "Photo — Name").
- Other candidates in `public/gallery/`:
  - `band2` (red, hair-flying singer);
  - `utf-band-good` (the only full five-piece stage shot, but with a large "Peter Vangelder / musika.be" watermark; same request applies).

**Verification (Phase 4)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375, all three states rendered through a temporary preview route with mock data (since removed):
  - no horizontal overflow anywhere;
  - no page errors.
- The real homepage shows the 0-dates state: the local database is unreachable, and the last seeded show is 17.10.2026, which is already past.

## Unresolved: mobile Hero visual is temporary

- The current live photograph works on desktop, but its mobile crop is not satisfactory.
- A dedicated mobile hero visual will be selected or created later. Candidates:
  - a dedicated vertical live photo;
  - a Gerard visual;
  - a Tower Seven visual;
  - another UTF-specific portrait composition.
- Do not try to solve this further with aggressive `object-position` or cropping.
- The Hero must stay ready to take a dedicated mobile asset. `HERO_IMAGE` in `hero.tsx` is the single place to add it, e.g. a `srcMobile` rendered through `<picture>` / art direction at ≤720px. The layout does not depend on the asset.

## Known weaknesses / open items

- **TEMPORARY: duplicate next-show block.** The old ActionHub, untouched, still contains its own "next show" card right after the visual break, so it duplicates Live. It will be removed when the Mailing list / Booking phase replaces ActionHub.
- **Live list at 1920 (Phase 4):** a wide empty band between the city and venue columns. It is acceptable as poster air, but could be tightened.
- **Featured Live state (Phase 4):** tested only with the Braine 1:1 poster. A wide poster (e.g. Arlon, 1400×733) will render shorter next to the giant date; check it once real data exists.
- **TEMPORARY: visual break asset.** `band1.jpg` stays until a confirmed, credited, clean high-resolution master is available (see Phase 4).

- **Hero photo:** 1920px source, scaled 1.1× to crop out a baked-in border and signature. It is slightly soft on large screens. A clean high-resolution master is needed; swap it via `HERO_IMAGE` in `hero.tsx`, and set `bleed: 1` if it has no border.
- **Logo vs band:** on tablet portrait the logo still crosses the guitarist's legs and the monitor wedge. It is acceptable, but a photo with more empty space on the left would be better.
- **Header mark:** Gerard at 28px is still a smudge. It needs the four-eye SVG; don't invent a new symbol in the meantime.
- **Bone column at 1920:** below the platforms, the bone column runs empty next to the lower cover and the title. It now reads as an open plane rather than a gap, but it could be revisited when the next section is designed.
- **Cover artwork:** its saturated, AI-looking style dominates the section. This is a content issue, not a layout one.
- **Style clash below:** ActionHub, FeaturedVideo and FeaturedMerch still use the old rounded and card styling. They are out of scope until the next phases.
- **Tickets link:** untested with real data, because the database is unavailable locally.
- **Dev only:** the Next.js dev badge overlaps the lower-left corner on mobile.
