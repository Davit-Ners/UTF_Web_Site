# Passation — Homepage redesign

Branch: `redesign/simple-site-v1`. Source of truth for art direction: `utf-design/`.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Design audit | Done |
| 2 | Visual foundation + Header / Hero / Latest Release compositions | Approved: Direction B "Monograph" backbone, Direction A for Live, Direction C as a subtle detail layer only |
| 3 | Implementation: foundation, Header, Hero, Latest Release | Done, committed in `257ef71` |
| 3.1 | Calibration pass on Header, Hero, Latest Release | Done and approved. Header, Hero and Release are frozen for now |
| 4 | Live + Band / Live visual break (+ `#live` anchor and fetch-failure state) | Done |
| 5 | Featured Video + Gallery teaser | Done and approved |
| 5.1 | Video side-column and gallery tablet refinements | Done |
| 6 | About + Merch (homepage) | Done and approved |
| 7 | ActionHub removal, Mailing list, Booking / Contact, Footer refinement, page rhythm review | Done, **not committed**. The homepage structure is now complete |
| Next | Asset replacement (see the temporary list), internal pages (`/music`, `/about`, `/concerts`, `/merch`, `/gallery`, `/booking`) still in the old card style | Not started; wait for go-ahead |

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
- ~~`actionHub.tsx`: `getNextConcert().catch(() => null)`~~. Gone with ActionHub (Phase 7).
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

## Phase 5: Featured Video + Gallery teaser

Homepage order is now Hero → Release → Live → Visual break → Video → Gallery → (old) ActionHub → Featured Merch, following `utf-design/inventory.md`.

**Featured Video** (`app/components/homePage/featuredVideo/*`, rewritten)
- Removed: the neon frame, glow, rounded container, decorative orbs/corners, "4K available" and the subtitle copy. Props are now `{ videoId, title, label }`; the homepage passes "Sent To Die" / "Official video".
- Layout on ink: mono "03 — Video". The poster spans columns 1–9 at 16:9 and dominates. Columns 10–12 are bottom-aligned with the label, the title in condensed display type, and "YouTube ↗".
- At 900px and below the poster goes full-bleed and the text stacks under it.
- The play action is the poster itself: one `<button>` with a typographic "PLAY ▶" (ember underline) in the lower-left corner. Its accessible name is "Play Sent To Die".
- Privacy is kept: the iframe (`youtube-nocookie.com`, autoplay) only mounts after the click. The poster goes through `next/image`, so the server fetches it. Verified: zero YouTube or ytimg requests from the browser before the click.
- **TEMPORARY POSTER.** No local high-quality still exists. The best YouTube still is `sddefault` (640×480, letterboxed; the 16:9 frame crops the bars; there is no `maxresdefault`). At 1440 it is upscaled about 1.5× and at 1920 about 2.1×, so it is visibly soft. **To do:** export a 1920px+ still from the video master and use it as the poster (local file, swap in `posterFor`).
- Content question: the singer in the video still differs from the current live photos. Confirm this is still the video to feature.

**Gallery teaser** (`app/components/homePage/galleryTeaser/*`, new)
- 3 real photos, using the 2048px originals in `public/gallery/`:
  - **Dominant: `dav1`.** Guitarist, head back, blue/amber light; the most editorial portrait, and a member other than the singer.
  - **Support: `val1`.** Bassist at the mic, from the same cool lighting session.
  - **Support: `band2`.** Singer mid-headbang in red, the warm counterpoint with full-stage energy.
  - **Not used:**
    - `band1`: already the visual break;
    - `bandall`: full band small on a wide stage, repeating the hero;
    - `utf-band-good`: large watermark;
    - `band-test`: posed black-and-white promo, off-tone.
- Layout on bone, irregular, with no frames or cards:
  - top row: `dav1` on columns 1–8 (3:2), then `val1` on columns 10–12 (4:5), set lower;
  - bottom row: "GALLERY" in display type on columns 1–4, `band2` offset on columns 5–10 (16:10), and "View gallery →" to `/gallery` on columns 11–12.
- At 900px and below it stacks with offsets:
  - the lead goes full-bleed at 4:5;
  - `val1` is right-aligned at 64% width and overlaps the lead's lower edge;
  - `band2` is left-aligned at 84% width;
  - then the title and the link.
- Border trim `1.04` and per-photo focal points are in the `PHOTOS` config. `sizes` accounts for the portrait cover-crops, so no file is upscaled at any tested width.
- These photos also carry the "Henoumont T." signature and are cover-cropped for the teaser; the full uncropped images remain on `/gallery`. The same credit/permission and clean-master request as the visual break applies.

**Verification (Phase 5)**
- `tsc` passes; eslint passes on the changed files.
- Playwright on the real homepage at 1920, 1440, 820 and 375: no horizontal overflow, no page errors.
- Clicking play mounts the youtube-nocookie iframe.

## Phase 5.1: refinements

- **Video side column:** "Official video" and the title now read from the poster's top edge, and "YouTube ↗" sits at the bottom, level with "PLAY" (`margin-top: auto`). The existing title is set larger (`clamp(2rem, 5.4vw, 7rem)`, two lines on desktop), so type carries the column instead of a void. Nothing was added.
- **Gallery at tablet widths (601–900px):**
  - the lead photo is 4:3 instead of 4:5 (about 615px tall at 820 instead of 1025px);
  - `val1` is 46% wide and `band2` 70%;
  - the stagger and overlap are kept, with no grid.
- Phones (≤600px) keep the 4:5 lead.

## Phase 6: About + Merch

Homepage order is now Hero → Release → Live → Visual break → Video → Gallery → About → Merch → (old) ActionHub, following `inventory.md`. ActionHub sits where Mailing list / Booking will go.

**About teaser** (`app/components/homePage/aboutTeaser/*`, new)
- On ink. `public/gallery/band-test.jpg` (2048px): a black-and-white posed portrait of all five members, the only real photo of the current line-up together, with no border and no signature. It spans columns 1–7 at 3:2 and bleeds off the left page edge.
- Columns 9–12:
  - "Unity in the chaos." in Newsreader italic (existing `/about` copy);
  - the one-sentence intro reused from the `/about` hero ("Formed in 2018…");
  - a ruled mono line-up list (name, role) from `members` in `app/lib/about.ts`;
  - "About →" to `/about`.
- No new copy was written. The full biography stays on `/about`.
- At 900px and below: the photo goes full-bleed, and the text sits below it, indented 14% (10% at ≤480px) for asymmetry. There is no text over the image. On phones each line-up entry stacks name over role.

**Merch** (`app/components/homePage/featuredMerch/*`, rewritten)
- Still data-driven: `getActiveMerchProducts(2)`, so the first item is the primary and the second the secondary. Routing to `/merch` is unchanged. `/merch` itself was not touched.
- On bone, as an editorial spread:
  - the primary product is a square frame on columns 1–7 (`min(100%, 76svh)`), with its name in condensed display type and the price in mono on a ruled caption below the image;
  - columns 9–12 hold a giant "MERCH" and "Shop →" at the top, and the secondary product (`min(78%, 40svh)`) at the bottom, level with the primary's base.
- Each product is a single link to `/merch`; its accessible name is the product name and price.
- Removed:
  - rounded cards, overlays and hover lift (hover is now a slight image fade plus an ember underline on the name);
  - category pills and the "Official merch / Shipped from Brussels" pills;
  - "N pieces featured";
  - the marketing copy;
  - the "New" and "Limited" badges.
- Availability is shown only when it matters: "Sold out" when stock is 0, or "Pre-order", in mono ember next to the price.
- Square frames match the square product shots, so the object isn't cropped, and a 4% trim removes mockup and screenshot edges.
- At 900px and below: "MERCH" and "Shop →" go on one line, the primary goes full width (74% on tablet), and the secondary sits right-aligned at 60% (46% on tablet).
- If there are no products, the section renders nothing, as before. Locally that is always the case, because the database is down.

**Verification (Phase 5.1 / 6)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375, on the real homepage (Video, Gallery, About) and on a temporary preview route with the two seeded featured products (Merch; since removed):
  - no horizontal overflow;
  - no page errors.
- The merch link names read correctly ("Core Logo Tee (Black) 25 €").

## Phase 7: ActionHub removal, Mailing list, Booking, Footer, rhythm

Final homepage order: Hero → Release → Live → Visual break → Video → Gallery → About → Merch → Mailing list → Booking → Footer.

Colour planes:

| Section | Plane |
| --- | --- |
| Hero | ink (photo) |
| Release | ink/bone split |
| Live | ink |
| Visual break | photo |
| Video | ink |
| Gallery | bone |
| About | ink |
| Merch | bone |
| Mailing list | ink |
| Booking | bone |
| Footer | ink |

**ActionHub: removed completely.** `app/components/homePage/actionHub/` is deleted, with nothing left of "Start here", cards, rail pills, icons, the booking card, the newsletter card or the duplicate next-show block. Its responsibilities moved:
- next show → Live;
- newsletter → Mailing list;
- booking → Booking.

Nothing else imported it.

**Mailing list** (`app/components/homePage/mailingList/*`, new; `newsLetterForm/*` restyled)
- On ink: mono "07 — Mailing list", a giant "JOIN THE LIST" on columns 1–5, and on columns 7–12 the existing ActionHub line ("New dates, videos and merch drops straight from the band.", serif italic) with the form.
- `NewsletterForm` behaviour is unchanged: the same state machine (idle/loading/ok/err), the same `POST /api/newsletter` with `{ email }`, the same success and error messages, the field cleared on success.
- Presentation and accessibility changes only:
  - a visible `<label>` ("Email", tied by `useId`), `autoComplete="email"`, `type="submit"`;
  - the status sits in a `role="status"` / `aria-live="polite"` region, and the form gets `aria-busy` while loading;
  - the loading label is "Joining…" and the button is disabled meanwhile.
- Look: label, field and "JOIN →" share one bone underline, which turns ember on `:focus-within` (the focus indicator for the field). No box, radius or glow.
- At 640px and below, the field (52px) stacks above a full-width "JOIN →" row (52px).
- Verified with a mocked API at 1440 and 375: loading disables the button, success shows "Subscribed…", and a 500 shows "Subscription failed…".

**Booking / Contact** (`app/components/homePage/bookingContact/*`, new)
- On bone: mono "08 — Booking", a giant "BOOKING", and `contact@untiltheyfall.com` as large condensed display type (a mailto link with an ember underline).
- On columns 9–12, ruled rows: "Book the band →" to `/booking`, and "Tech rider PDF ↗" to `/docs/UTF_technical_rider_2026.pdf`, the real file, opening in a new tab.
- No pills, cards, icons or lore.

**Footer** (`app/components/footer/*`, refined; it appears on every page)
- Removed: the blur, the semi-transparent `color-mix` surface, the 56px top margin, and the single crowded inline row.
- Now flat ink with a hairline top rule:
  - the wordmark (condensed display) plus mono "Melodic death metal — Brussels" on columns 1–5;
  - site links in a vertical list on columns 8–9;
  - external links on columns 10–12;
  - a base row with "© year Until They Fall" and the email.
- At 720px and below the two lists sit side by side under the wordmark.
- **Link corrections:**
  - "YouTube" pointed to the album playlist (`youtubeMusicUrl`); it now goes to the band channel (`youtube.com/channel/UCIXxu9KHo8HvETKE3oZ0UNA`).
  - "Spotify" pointed to the album; it now goes to the artist page (`open.spotify.com/artist/3NJKrEkHCtimOPbvBUW82L`).
  - Added Instagram (`instagram.com/until_they_fall/`) and Facebook (`facebook.com/profile.php?id=100090155035708`).
  - All of these come from `presskit.md`, with the tracking parameters (`si=`, `igsh=`, `intl-fr`) removed. Each returned HTTP 200 on 22.10.2026.
  - Bandcamp is not linked: `music.ts` leaves `bandcampUrl` empty and the press-kit URL refuses automated checks (403). Add it if it is confirmed live.
- No symbol was added. The four-eye mark can sign the footer once the real SVG exists.

**Page rhythm review**
- Every completed section uses the same `--space-m` vertical padding (Release ends on `--space-s`; the footer uses `--space-s` top), so there is no accidental doubling.
- There are no same-colour collisions after Gallery: the planes alternate ink/bone down to the footer.
- The only long ink run is Live → Visual break (photo) → Video. It is broken by the photograph, and was approved earlier, so it was left as is.
- No spacing changes were needed in the completed sections.
- Internal pages: the last content still has its own bottom padding before the new footer (checked on `/about`, `/music` and `/gallery`).

**Verification (Phase 7)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375 on a temporary full-homepage preview with the seeded merch (since removed), plus internal pages:
  - no horizontal overflow;
  - no page errors.

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

- **TEMPORARY: video poster (Phase 5).** A 640px YouTube still, soft at desktop widths; a local 1920px+ still is needed (see Phase 5).
- **TEMPORARY: signed gallery photography (Phases 4–5).** The visual break and gallery teaser photos carry the photographer's signature ("Henoumont T.") and a baked border. Confirm the credit and permission, and get clean high-resolution masters.
- **TEMPORARY: merch product imagery (Phase 6). This is the weakest asset on the homepage.**
  - `core-tee.webp` is a phone screenshot of a mockup: teal UI arrows at the left edge, a status-bar edge at the top, and only 700px wide (872px source). It is upscaled in the primary slot at desktop widths.
  - `skull-hoodie` is a dark, AI-looking mockup (1024px) that reads as an almost black square on bone.
  - The product shots don't share a background or lighting, so the spread looks inconsistent.
  - **To do:** shoot the real products (same background, same light, square, 2000px+), then update the image paths in the database.
- **Video side column (Phase 5.1):** at 1920 a gap remains between the large title and "YouTube ↗". It now reads as heading/action spacing rather than an accident.
- **About line-up:** taken from `about.ts`. Make sure it matches the people in the `band-test` photo and the current line-up.

- ~~Duplicate next-show block~~: resolved, ActionHub removed (Phase 7).
- **Live list at 1920 (Phase 4):** a wide empty band between the city and venue columns. It is acceptable as poster air, but could be tightened.
- **Featured Live state (Phase 4):** tested only with the Braine 1:1 poster. A wide poster (e.g. Arlon, 1400×733) will render shorter next to the giant date; check it once real data exists.
- **TEMPORARY: visual break asset.** `band1.jpg` stays until a confirmed, credited, clean high-resolution master is available (see Phase 4).

- **Hero photo:** 1920px source, scaled 1.1× to crop out a baked-in border and signature. It is slightly soft on large screens. A clean high-resolution master is needed; swap it via `HERO_IMAGE` in `hero.tsx`, and set `bleed: 1` if it has no border.
- **Logo vs band:** on tablet portrait the logo still crosses the guitarist's legs and the monitor wedge. It is acceptable, but a photo with more empty space on the left would be better.
- **Header mark:** Gerard at 28px is still a smudge. It needs the four-eye SVG; don't invent a new symbol in the meantime.
- **Bone column at 1920:** below the platforms, the bone column runs empty next to the lower cover and the title. It now reads as an open plane rather than a gap, but it could be revisited when the next section is designed.
- **Cover artwork:** its saturated, AI-looking style dominates the section. This is a content issue, not a layout one.
- ~~Homepage style clash~~: resolved; every homepage section is now redesigned. The **internal pages** still use the old rounded/card styling (with the ember remap) and now clash with the new header and footer.
- **Header mobile menu links (out of scope in Phase 7):** its Spotify/YouTube links still use `latestRelease` (the album and the album playlist), while the footer now uses the artist page and channel. Align them when the header is next touched.
- **Local merch section:** while the local database is down, Merch renders nothing, so About is followed directly by the Mailing list (both ink). In production, with products, the bone Merch plane sits between them.
- **Tickets link:** untested with real data, because the database is unavailable locally.
- **Dev only:** the Next.js dev badge overlaps the lower-left corner on mobile.
