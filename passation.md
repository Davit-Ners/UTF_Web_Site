# Passation — Homepage redesign

Branch: `redesign/simple-site-v1`. Source of truth for art direction: `utf-design/`.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Design audit | Done |
| 2 | Visual foundation + Header / Hero / Latest Release compositions | Approved: Direction B "Monograph" backbone, Direction A for Live, Direction C as a subtle detail layer only |
| 3 | Implementation: foundation, Header, Hero, Latest Release | Done, committed in `257ef71` |
| 3.1 | Calibration pass on Header, Hero, Latest Release | Done, **not committed** |
| Next | Live, Gallery, Merch, About, Mailing list, Booking, Footer | Not started; wait for go-ahead |

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
- `app/components/homePage/actionHub/actionHub.tsx`: `getNextConcert().catch(() => null)`.
- These were added because the local Postgres was not running. Decide whether to keep them as real resilience, which is recommended for the homepage, or remove them once the database setup is sorted.
- `/merch` and `/concerts` still crash without the database.

## Known weaknesses / open items

- **Hero photo:** 1920px source, scaled 1.1× to crop out a baked-in border and signature. It is slightly soft on large screens. A clean high-resolution master is needed; swap it via `HERO_IMAGE` in `hero.tsx`, and set `bleed: 1` if it has no border.
- **Logo vs band:** on tablet portrait the logo still crosses the guitarist's legs and the monitor wedge. It is acceptable, but a photo with more empty space on the left would be better.
- **Header mark:** Gerard at 28px is still a smudge. It needs the four-eye SVG; don't invent a new symbol in the meantime.
- **Bone column at 1920:** below the platforms, the bone column runs empty next to the lower cover and the title. It now reads as an open plane rather than a gap, but it could be revisited when the next section is designed.
- **Cover artwork:** its saturated, AI-looking style dominates the section. This is a content issue, not a layout one.
- **Style clash below:** ActionHub, FeaturedVideo and FeaturedMerch still use the old rounded and card styling. They are out of scope until the next phases.
- **Tickets link:** untested with real data, because the database is unavailable locally.
- **Dev only:** the Next.js dev badge overlaps the lower-left corner on mobile.
