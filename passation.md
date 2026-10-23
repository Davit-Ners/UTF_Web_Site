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
| 8 | `/music` page ("Sleeve") | Done |
| 9 | `/music/[slug]` release page ("Booklet") | Done |
| 10 | `/concerts` ("Tour Poster") + `/concerts/past` redirect | Done |
| 11 | `/concerts/[slug]` show page ("Show Dossier") | Done |
| 12 | `/gallery` ("Photo Book"), photo catalogue cleanup, shared `PhotoViewer`, `/gallery/concert-photos` redirect | Done |
| 13 | `/about` ("Band Profile") | Done |
| 14 | `/merch` ("Band Catalogue") | Done; superseded in structure by 14.1 |
| 14.1 | `/merch` Hybrid: Featured + All items + order-request drawer | Done (14.2 included) |
| 15 | `/booking` ("Booking Sheet") + shared contact constant | Done, **not committed** |
| Next | `/concerts/[slug]/gallery` (still `GalleryFull`) in the old style; album line-up consistency pass; merch size/variant system; asset replacement | Not started; wait for go-ahead |

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
- `app/concerts/page.tsx`: try/catch around `getConcertBuckets` (Phase 10). It passes `null` to `TourPoster`, which shows "Dates unavailable right now" and "Archive unavailable right now". Real resilience: keep it.
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
  - it carries the photographer's handwritten signature (Laurent Henoumont, per the EXIF Artist/Copyright fields; the signature had been misread as "Henoumont T."), which is deliberately left visible.
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
- These photos also carry the Laurent Henoumont signature and are cover-cropped for the teaser; the full uncropped images remain on `/gallery`. The same credit/permission and clean-master request as the visual break applies.

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

## Phase 7.1: shared band profile links

- New `app/lib/links.ts` exports `BAND_PROFILES` (Spotify artist page, YouTube channel, Instagram, Facebook). It is the single source for official profile URLs.
- The footer uses all four. The header mobile menu now uses `BAND_PROFILES.spotify` and `BAND_PROFILES.youtube` instead of `latestRelease.spotifyUrl` / `youtubeMusicUrl` (the album and the album playlist). The Header design is unchanged.
- `latestRelease` URLs in `music.ts` remain the release-specific links (used by Hero "Listen" and the Release section), which is correct for those contexts.

## Phase 8: `/music` ("Sleeve")

**Structure** (`app/music/page.tsx`, `app/music/music.module.css`, new `app/components/music/releaseSleeve/*`)
- Compact masthead: `h1` "Music" plus mono "Discography — 01 release". It is deliberately small so the artwork owns the first screen.
- A release index (numbered anchor rows) renders only when `discography` has 2+ releases.
- One `ReleaseSleeve` per release, newest first by `releaseDate`. Alternate releases are mirrored (artwork on the right). Singles get a smaller front and no pinned link column.
- Each sleeve:
  - **Front (ink):** the 1875px `coverMaster`, square, uncropped, `min(cols 1–7, 74svh)`, bleeding off the page edge. No card, blur backdrop or offset.
  - **Back (ink):** mono meta line (type — DD.MM.YYYY — NN tracks — runtime, all computed), condensed title, tracklist as the main typography (mono index, condensed title, mono duration, ember "Single" text instead of a pill), "Total" rule, then streaming links as plain ruled rows (Spotify, Apple Music, YouTube Music; Bandcamp only if filled, currently empty so hidden).
  - **Liner notes (bone):** `story` in serif italic, and a colophon of confirmed `credits`, `airplay`, the line-up from `about.ts` (`members`), and "Live dates →".
- No iframe, cards, radii, glow, pills, "For fans of", "Sound" or "Inside the record".
- At 900px and below: full-bleed artwork, then meta, title, **streaming links before the tracklist** (listening is the main mobile action), tracklist, total, and stacked liner notes. Colophon rows stack label over value at ≤480px.
- SEO metadata is unchanged.

**Data model** (`app/lib/music.ts`)
- `Release.coverMaster?`: the high-resolution artwork path (`/album-cover.jpg`, 1875px) for large presentations; `cover` stays the 1000px optimized file used elsewhere.
- `Release.airplay?: { track, station }[]`: structured airplay data (Uprising — Classic 21; Wrath Of Gaia — Radio Panik), replacing the sentence form on `/music`.
- `credits` is documented as confirmed-only. Unchanged values: Recorded — Project Zero Studio; Produced — Yarne Heylen.
- The line-up is read from `about.ts`. The hard-coded `bandCredits` / `productionCredits` / `fanRefs` in the old page are gone.
- `recordingNotes` is **not** rendered on `/music`. It contains "Produced, mixed and mastered by Yarne Heylen", and mix/master is unconfirmed. It stays in the data because `/music/[slug]` (not modified) still uses it.

**Not changed in Phase 8:** `/music/[slug]` (rebuilt in Phase 9).

**Verification (Phase 8)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375 on `/music` plus a temporary multi-release preview (a mock single plus the mirrored album; since removed): no horizontal overflow, no errors, no iframes.
- The artwork is fully above the fold at 1440 and 1920.
- Links checked 22.10.2026: Spotify and Apple Music resolve to the album. The YouTube Music link resolves (HTTP 200) to the first track of the "Sent To Die" album playlist on the "Until They Fall - Topic" channel, so it works; normalization can wait.

**Unverified data (do not treat as confirmed)**
- **Track durations:** all seven, and therefore the 29:45 total. Two tracks share 4:11. Verify against the master or Spotify. Now displayed prominently on `/music/[slug]` as chapter durations too.
- **Mix/master credit:** still only in `recordingNotes`, used by `/music/[slug]`.
- **Artwork credit:** not published anywhere on `/music`. The old page's "Artwork: Until They Fall" is removed until confirmed.
- **Bandcamp:** hidden until the link is confirmed.
- **Line-up for the album:** the colophon shows the *current* line-up from `about.ts`. Confirm it matches who played on Sent To Die (2023), or label it differently later.

## Phase 9: `/music/[slug]` ("Booklet")

Hierarchy: homepage = teaser, `/music` = record sleeve, `/music/[slug]` = full booklet / archive entry.

**Composition** (`app/music/[slug]/page.tsx`, `releasePage.module.css`, both rewritten)
- Breadcrumb in mono (`Music / Sent To Die`, with `aria-current`).
- **I. Cover spread (ink):**
  - the `coverMaster` artwork as a centred, uncropped plate (`object-fit: contain`, `min(100%, 86svh)`);
  - a caption with a roman marker, a mono line (type — date — tracks — runtime) and the **only** `h1` (the release title);
  - a listen row directly under it: plain ruled links side by side on desktop, stacked 48px rows on mobile.
- **II. Songs (bone):** each track as an oversized numbered chapter: mono number, title as an `h2` in large condensed type, mono duration. A note line appears **only with real data**: "Single" (ember), "Airplay — station" (matched from `airplay`), "Video ↗" (from the new `videoId`).
- **III. Story (bone):** `release.story` in large serif italic, columns 4–10. It is not rendered without a story; there is no fallback copy.
- **IV. Credits (ink):** only confirmed data, in columns: Recording (`credits`) and Broadcast (`airplay`). **Personnel is omitted** until the 2023 recording line-up is confirmed. Mix/master, artwork, label and catalogue are omitted.
- **V. Archive (ink):** other releases as a typographic index (only when there are any), plus "Discography →" and "Merch →".
- Roman markers are computed from the parts that actually render, so they never skip a number.
- At 900px and below: the plate goes full-bleed, the listen links stack, and each song shows its number and duration on one line with the title below; the credit columns stack.
- Removed: all cards and rounded panels, the disabled Spotify iframe, the filler story copy, the "Book The Band" button, the hard-coded "Sent To Die era" merch card, `SectionHeading`, the "Single" pills, the `->` arrows, the duplicated title and year, and the unconfirmed `recordingNotes` sentence.
- Routing is preserved: `/music/[slug]`, and `notFound()` for unknown slugs (verified 404 on `/music/does-not-exist`). `params` is now typed as a Promise (Next 16).

**SEO** (new on this route)
- `generateStaticParams`: one static page per `discography` entry.
- `generateMetadata` per release:
  - title `Sent To Die (Album, 2023)`, which the layout template turns into "… | Until They Fall";
  - `description` = `release.blurb`;
  - canonical `/music/{id}`;
  - Open Graph `music.album` with the artwork (`coverMaster`), and a Twitter large card.
- Unknown slugs return empty metadata, plus the 404.
- Before this phase the route had no metadata of its own: it inherited the site's default title and the canonical "/".

**Shared helpers** (new `app/lib/release.ts`, pure functions)
- `formatReleaseDate`, `getRuntime` and `getListenLinks`, used by the release page, `releaseSleeve` (`/music`) and the homepage `featuredRelease`.
- Their local copies were removed. Output is identical (verified: `/music` meta line and homepage facts unchanged).
- No visual component was extracted (the Colophon cleanup is deferred).

**Data model** (`app/lib/music.ts`)
- `Track.videoId?`: the YouTube id of the track's official video. Set `9Wvpovk_Tg4` on "Sent To Die" (the official video, also featured on the homepage).
- `recordingNotes` and `highlightTrack` are now **not rendered anywhere**. `recordingNotes` contains the unconfirmed "Produced, mixed and mastered by Yarne Heylen". It is kept in the data for now; delete it, or split it into confirmed `credits`, once mix/master is confirmed.

**Deleted dead components** (no remaining imports, verified by grep before deletion)
- `app/components/music/musicFeaturedRelease/`
- `app/components/music/trackList/`
- `app/components/music/streamingRow/`
- `app/components/music/discographySection/`
- `app/components/music/musicHero/`
- `app/components/music/musicCredits/`
- `app/components/sectionHeading/`

`app/components/music/` now contains only `releaseSleeve/`.

**Verification (Phase 9)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375:
  - HTTP 200, no horizontal overflow, no errors, no iframes, a single `h1`;
  - correct title, description, canonical and `og:image`;
  - song notes render only for tracks 01, 03 and 04.
- `/music` and `/` still render with the same release facts.

## Phase 10: `/concerts` ("Tour Poster")

Hierarchy: homepage Live = next dates teaser; `/concerts` = complete dates plus the live archive.

**Composition** (new `app/components/concerts/tourPoster/*`; `app/concerts/page.tsx` rewritten, SEO metadata and `revalidate = 60` kept)
- **Masthead (ink):** "LIVE" as the `h1`, condensed display at about 26vw. A mono count line with real numbers only: `NN upcoming — NN shows since YYYY` (year = earliest past show).
- **Upcoming (ink),** by state:
  - **0 dates:** one ruled line, "No public dates" / "Next announcement soon" (wording from the wireframe). No card.
  - **1 date:** a featured spread. The poster at its natural ratio on columns 1–6 (or the text full width without a poster). "Next show", a giant "DD MON / YYYY", the city, the event title (only if useful), "with …" (real line-up), and a ruled facts list showing Venue and City, plus Doors / Show / Price **only when those fields exist**. The seeded 12:00 time is never shown. Then Tickets ↗ (if any) and Details →.
  - **2+ dates:** the date is the object (giant "DD.MM" with a mono "'YY"), the city plus a mono country, a mono venue, an optional "with …" (max 3 acts, then "+N"), and Tickets ↗ or Details →. Posters of upcoming shows sit in a column 9–12 at natural ratio.
  - **Data failure:** "Dates unavailable right now". No counts, no technical detail; the error is only logged on the server.
- **Archive (bone, `id="archive"`, `scroll-margin-top` = header height):** one chapter per year, newest first.
  - Each year has a giant numeral, a 2px ink rule and a real show count.
  - Ruled rows: date, city, venue, and the event title in serif italic only when `usefulTitle()` says it adds information (it drops trailing " - venue, city" segments and titles that only repeat the venue or city). Each row links to `/concerts/[slug]`.
  - That year's real posters are pinned in columns 9–12 at their **intrinsic aspect ratio**, never cropped (verified: rendered ratio equals natural ratio, Braine 1.00 and Arlon 1.91). There is no placeholder when a year has no poster.
  - **Past shows never show ticket actions** (verified: 0 external links inside `#archive` in every state).
- **End:** "Booking →" as a single ruled typographic row, replacing the old booking CTA card.
- **Ticket links (upcoming only):** external `<a target="_blank" rel="noopener noreferrer">` with screen-reader text, e.g. "Tickets for Brussels, 13.03.2027 (opens in a new tab)". The old code used `<Link>` without `target`.
- **At 900px and below:** upcoming rows stack (the date on its own line, then city/venue plus the action); archive rows become two lines (date + city / venue + title); posters follow their list at full width; the 1-date facts and actions stack with 48px rows.

**Shared helpers** (new `app/lib/concertFormat.ts`, pure functions): `concertDateParts`, `splitCity`, `supportingActs` (filters out "Until They Fall" itself), `usefulTitle` and `groupByYear`. Homepage `live.tsx` is **not** changed; it keeps its own local copies, which a later cleanup could switch to these helpers.

**Redirect** (`next.config.ts`): `/concerts/past` → `/concerts#archive`, permanent (308). Verified that the browser lands on `/concerts#archive` with the archive top at the header height. The homepage Live empty state, which links to `/concerts/past`, keeps working through the redirect.

**Deleted** (no remaining imports, verified by grep):
- Components: `app/components/concertCard/` (already unused), and `concerts/concertHero`, `concertCalendar`, `concertList`, `pastConcerts`, `concertBookingCTA`, `yearBlock`.
- Route files: `app/concerts/past/` (page + `archivePage.module.css`) and `app/concerts/concerts.module.css`.
- The stray duplicate poster `public/optimized/concerts/utf-arlon/utf-braine/utf-braine-optimized.webp` (no reference in the code, the seed or the rendered pages; the real page still loads the canonical `utf-braine/` file).

`concertDetails` and `concertGallery` are kept, because `/concerts/[slug]` uses them.

**Tested states (Phase 10)**
- **Real zero-upcoming state:** the local database was reachable during this phase. Live data gives "00 upcoming — 12 shows since 2024", with 2026 (5 shows), 2025 (2) and 2024 (5). The same result comes from the seed data split at 22.10.2026.
- **Mocked 1-date state and mocked 3-date state:** on a temporary preview route (since removed), with no fake dates added to data.
- **Data-failure state:** `null` data on the preview.
- 1920, 1440, 820 and 375: no horizontal overflow and no page errors in any state.
- `tsc` passes; eslint passes on the changed files.

## Phase 11: `/concerts/[slug]` ("Show Dossier")

Hierarchy: homepage Live = teaser; `/concerts` = tour poster / archive; `/concerts/[slug]` = the document for one show.

**Composition** (new `app/components/concerts/showDossier/*`; `app/concerts/[slug]/page.tsx` rewritten, `revalidate = 60` kept, no `generateStaticParams`)
- **Breadcrumb:** `Live / Archive / YYYY` for past shows (Archive links to `/concerts#archive`), `Live / Upcoming` otherwise.
- **I. Masthead (ink):**
  - optional kicker (short label-like `note` only, in ember mono);
  - **the date as the object**: giant "DD.MM" plus the year in display;
  - one mono line `Weekday — Archive|Upcoming` (weekday and status derived from the date);
  - the **city as the `h1`** with a mono country, the venue in mono, and `usefulTitle()` in serif only when it adds information.
  - With a poster: the date shrinks and the poster sits on columns 8–12 at its **intrinsic ratio** (verified: rendered = natural ratio). Without a poster the date runs at about 22vw, with no placeholder.
- **II. Ticket action:** upcoming shows with a real `ticketUrl` only. One large ruled row "TICKETS ↗" with the price beside it. It opens in a new tab with screen-reader text. **Past shows never show it**, even if a `ticketUrl` is stored.
- **III. Programme (bone):** rendered only if at least one of these exists:
  - the **Bill** (`lineup` exactly as stored: Until They Fall is shown only where the data includes it, with no added running order);
  - the **timetable** (Doors / Show / Entry, each only when filled; Entry moves next to the ticket action instead of repeating);
  - `description`;
  - the long `note`, **for upcoming shows only**;
  - "Event page ↗" (the Facebook link, past or upcoming).
- **IV. Photos (ink):** confirmed photos only (see the rule below), up to 5.
  - The first one is full-bleed; the rest form an offset sequence.
  - The photos keep their own ratio, with a 4% scale to trim the baked border.
  - "All N photos →" links to `/concerts/[slug]/gallery` when there are more than 5.
- **V. Neighbours:** previous and next show in chronological order (date plus city), and "All shows →" (to `/concerts#archive` for past shows).
- **Data failure:** a try/catch around `getPublishedConcerts()` (one query, shared with `generateMetadata` through React `cache`). On failure the page renders `ShowUnavailable` ("Show unavailable right now" plus All shows), **not** a 404, and without technical detail.
- **Unknown slug:** `notFound()` → 404 (verified).
- **Removed:** cards, pills, the date box, "Tickets / Info" on past shows, "Book The Band", the filler "About this show" copy, the "Line-up details will be added soon" filler, the duplicated "Quick recap" sidebar, the "Official poster" label, and every repeated fact.

**Rules encoded** (`app/lib/concertFormat.ts` additions, pure functions)
- `weekday(date)`: deterministic, no time zone.
- `isLabelNote(note)`: at most 60 characters with no sentence punctuation (label-like, e.g. "Tremplin Durbuy Rock Fest"). Longer, promotional notes are shown only for upcoming shows, never on archived ones.
- `reliableTimes(show)`: only `doorsTime` / `showTime`, never the seeded 12:00 start time. **If doors and show are identical, both are omitted** (not corrected). Currently this affects Braine (18:00 / 18:00).
- `formatLongDate`.

**Confirmed photos** (new `app/lib/concertPhotos.ts`)
- A concert gallery path is shown only when its entry in the photo catalogue (`app/lib/gallery.ts`) has `meta` naming the show's city. Uncatalogued paths, or paths catalogued elsewhere, are hidden.
- **Arlon:** only `band2` ("Arlon, BE") shows. `band1` (catalogued "Brussels, BE") and `bandall` ("Festival stage") are excluded.
- **Consequence:** future concert photos must be added to the catalogue with the city in `meta`, or a dedicated confirmation/credit field must be added to the data, before they appear.

**Photo viewer** (`showPhotos.tsx`, client)
- A native `<dialog>` opened with `showModal()`:
  - Escape closes it (native), and so does a backdrop click;
  - focus moves to "Close" on open and **returns to the photo that opened it** (verified);
  - Previous / Next buttons and arrow keys when there are 2+ photos;
  - a polite live caption "Arlon, 01.11.2025 — 01 / 01".
- Accessible labels combine the context with the catalogue description, e.g. "Arlon, 01.11.2025, photo 1 of 1: Until They Fall live crowd". There is no generic "Live photo N".
- The full-size image uses the 2048px original via the new `getOriginalImagePath()` in `imageOptimization.ts`.
- The viewer shows the full uncropped file, so the baked border is visible there.

**SEO / structured data**
- `generateMetadata` per show:
  - title "City — Venue, DD.MM.YYYY" (plus the template), e.g. "Arlon — L'Entrepot, 01.11.2025 | Until They Fall";
  - description = useful title plus a factual archive line;
  - canonical `/concerts/{slug}`;
  - OG/Twitter image = the poster only when one exists.
  - If the data fails it returns `{ title: "Concert" }`; an unknown slug returns `{}`.
- schema.org `MusicEvent` JSON-LD from stored fields only:
  - `name` (useful title, or "Venue, City");
  - `startDate` (date, plus a time only when `showTime` is reliable), and `doorTime` only when reliable;
  - `location` (Place, venue, locality, country);
  - `performer` only from the stored `lineup`;
  - `image` only from the poster;
  - `offers` (url, plus a price/currency only when the label parses as "N EUR") only for upcoming shows with a ticket URL.
  - **No** `eventStatus`, attendance mode, availability or organizer.
  - The JSON is serialized with `<` escaped.

**Deleted** (no remaining imports, verified):
- `app/components/concerts/concertDetails/` (`concertDetailsHero`, `concertDetailsContentGrid`);
- `app/components/concerts/concertGallery/`;
- `app/concerts/[slug]/concertDetail.module.css`.

**Kept:** `GalleryFull` (used by `/concerts/[slug]/gallery` and `/gallery/concert-photos`) and `/concerts/[slug]/gallery` itself, unchanged.

**Tested (Phase 11)**
- Real data (the local database was reachable):
  - **Arlon** (past, poster, programme, 1 confirmed photo);
  - **Braine** (past, poster, long note hidden, identical times omitted, entry only);
  - **Namur** (past, no poster, no programme: masthead plus neighbours only).
- Mocked, on a temporary preview (since removed): an upcoming show with tickets, poster, a long note and a full programme; an upcoming show with no ticket and no data; the data-failure state.
- An unknown slug returns 404.
- 1920, 1440, 820 and 375: no horizontal overflow and no page errors.
- `/concerts/utf-arlon/gallery` still returns 200.
- `tsc` passes; eslint passes on the changed files.

## Phase 12: `/gallery` ("Photo Book") + photo catalogue

**Catalogue rewrite** (`app/lib/gallery.ts`, the single source of truth for gallery and concert photos)
- New `GalleryPhoto`:
  - `id`;
  - `src` (the **2048px original**);
  - real `width` / `height`;
  - `alt` (visual description);
  - optional `caption` (short, visually defensible);
  - optional `event` (a concert slug, **only when the show is confirmed**);
  - optional `credit { name, source: "exif" | "watermark" }`;
  - `chapter`;
  - optional `bakedBorder` (trim flag).
- `galleryChapters`: `live-henoumont` (opener allowed), `live-vangelder` (no opener: watermark), `promo`.
- `SHOW_PHOTO_CREDITS` (currently `true`): **one switch hides every public photographer credit** (chapter credit lines, viewer captions, photographer count).
- `creditedPhotographers()` returns the unique credit names (empty when credits are off).
- Removed: `allConcertPhotos`, `galleryHeroPhotos`, the old `caption` / `meta` strings.

**Corrected or removed associations**
- **Removed** the contradictory event captions:
  - "Release show — Brussels, BE" (`band1`);
  - "Crowd release — Arlon, BE" (`band2`: there is no crowd in the image);
  - "VK - Brussels" (`dav1`);
  - "Club show" (`kev1`);
  - "Festival stage" (`bandall`);
  - "Live show" (`val1`).
- **The six Henoumont photos** (`bandall`, `band1`, `dav1`, `kev1`, `val1`, `band2`) are one visual session (same backdrop, rig and stage). They have **no** event, city or date until confirmed.
- New captions: Full band, Live, Lead guitar, Rhythm guitar, Bass / vocals, Live.
- **`utf-band-good`:** a Peter Vangelder live image (credit source: the baked watermark). No concert slug, city or date; the "HELL" backdrop is **not** used to infer Hell Diest. Never the full-bleed opener.
- **`band-test`:** the PROMO chapter, with no caption and no credit (no metadata).
- **Member portraits** (`band/krys-about`, `band/sabari-about`, EXIF "Vangelder Peter") are **not** in `/gallery`; they stay on About.
- **Credits stored:** Laurent Henoumont (EXIF Artist/Copyright on all six live photos; the hero `bandphoto.jpg` also carries it but is not in the gallery) and Peter Vangelder (watermark on `utf-band-good`).

**Show Dossier consequence** (`app/lib/concertPhotos.ts` rewritten)
- `confirmedPhotos(show)` now returns catalogue photos whose `event === show.id`. The `gallery` paths stored on the concert record are **no longer trusted**.
- No catalogue photo has an `event` today, so **every Show Dossier has no Photos section**.
- **Changed: Arlon** previously showed `band2`, based on the wrong "Arlon" caption. Its Photos section is now gone.
- Braine and Namur had no photos and are unchanged. Verified on Arlon, Braine and Namur.
- `/concerts/[slug]/gallery` now uses `confirmedPhotos()` too, so it returns 404 when a show has no confirmed photos (`/concerts/utf-arlon/gallery` is now 404). It had been showing the three unconfirmed Arlon photos.
- **To re-attach photos to a show:** set `event: "<concert-slug>"` on the catalogue entries once the venue and date of the Henoumont session are confirmed.
- The `gallery` arrays in `concerts.data.ts` / the database (Arlon: `band1`, `band2`, `bandall`) are now ignored and could be cleared in a data cleanup.

**`/gallery` composition** (new `app/components/gallery/photoBook/*`; `app/gallery/page.tsx` keeps the SEO metadata, with the OG height corrected to the real 1329)
- **Masthead (ink):** "GALLERY" (condensed, about 19vw, the `h1`) and a mono line of real counts: "08 photographs — 02 photographers". The photographer count shows only when credits are on.
- **Chapters,** each headed by a bone band with a roman numeral, the title in condensed display, the credit in serif italic ("Photographs by …", only when credits are on) and a mono photo count, over a 2px ink rule:
  - **I. Live — Laurent Henoumont (6):** full-bleed opener `bandall` (001), an offset pair `band1` (002, columns 1–7) plus `dav1` (003, columns 9–12, dropped lower), then a bone **contact strip** of `kev1`, `val1`, `band2` (004–006).
  - **II. Live — Peter Vangelder (1):** `utf-band-good` (007) in the wide pair slot (columns 2–8), never full-bleed.
  - **III. Promo (1):** `band-test` (008), wide slot.
- **Rules:**
  - an opener only when the chapter allows it, has 3+ photos and a landscape lead;
  - then a pair, then strip rows of up to 4.
  - Strip rows use a **justified natural-ratio row**: each item's flex-grow is its aspect ratio, so heights match and nothing is cropped.
  - **Page-wide numbering** 001–008, in visual order, shared by the captions, triggers and viewer.
  - Captions sit **under** the images in mono (number plus caption); there is no overlay or gradient.
  - Natural ratios come from real dimensions (verified: frame ratio = natural ratio at every width, so no layout shift). Baked borders are trimmed with a 4% scale.
  - No hover zoom (only a slight opacity change), no cards and no radius.
- The 2048px originals are served for the opener and pair (1920w at full-bleed; strip 640w at 1x).
- **End:** "Live archive →" to `/concerts#archive`.
- **At 900px and below:** the chapter head stacks (numeral and count / title / credit), and the pair stacks with the narrow photo at 84% right-aligned. **At 600px and below** the strip wraps 2 per row, still ratio-driven.

**Shared `PhotoViewer`** (new `app/components/photoViewer/*`, client)
- `<PhotoViewer photos>` provides one native `<dialog>`; `<PhotoTrigger index>` opens it.
- Navigation follows the `photos` order. On `/gallery` that is the **whole Photo Book in page order**, across chapters.
- Behaviour (verified keyboard-only):
  - Tab to a photo, then Enter opens it;
  - focus moves to **Close**;
  - ← / → step (and wrap); Home / End;
  - Escape closes; backdrop click closes;
  - **focus returns to the originating photo**.
- Visible caption, e.g. "003 / 008 — Live — Lead guitar — photograph by Laurent Henoumont" (the caption is skipped when it only repeats the chapter title; the credit only when credits are on).
- Accessible name, e.g. "Photo 3 of 8: <alt>. <context>". Full-resolution images.
- **The Show Dossier now uses the same viewer** (`showPhotos.tsx` rewritten). Its sequence styling is unchanged; the viewer CSS moved from `showDossier.module.css` into `photoViewer.module.css`. Verified with a temporary 3-photo preview (since removed): arrows, Escape and focus return work.

**Redirect** (`next.config.ts`): `/gallery/concert-photos` → `/gallery`, permanent (308). Verified.

**Deleted:**
- `app/gallery/galleryClient.tsx`, `app/gallery/gallery.module.css`, `app/gallery/concert-photos/page.tsx`;
- `app/components/gallery/galleryHero/` and `galleryStrip/` (both already unused).

**Kept:** `GalleryFull` and `galleryLightBox` (still used by `/concerts/[slug]/gallery`). They now use their own local `GalleryFullPhoto` type instead of the catalogue type.

**Verification (Phase 12)**
- 1920, 1440, 820 and 375: no horizontal overflow, no page errors, natural ratios preserved.
- Keyboard-only viewer navigation and focus return pass on `/gallery` and on the Show Dossier.
- The redirect works. The Show Dossiers were rechecked after the catalogue cleanup.
- `tsc` passes; eslint passes on the changed files.

## Phase 13: `/about` ("Band Profile")

**Data** (`app/lib/about.ts`, rewritten)
- **Added** `since` (join year, from `presskit.md`): Davit Nersesyan 2018, Sabari Diakite 2018, Kevin Estrada 2018, Valentin Coutant **2024**, Krys Bader **2025**.
- **Removed invented copy:**
  - `blurb` and `signature` on every member (the press kit has only "(bio + autres groupes)" placeholders: no member bios exist);
  - `highlightCards` (Sound / Record / Live);
  - `fanRefs` (the "For fans of" chips);
  - `storyFacts`;
  - `getInitials` (the initials fallback).
  - None was used outside `/about`.
- **Image data restructured:** `Member.image` is now `MemberImage { src (full-resolution original), width, height, alt, credit?: PhotoCredit, bakedBorder? }`. It reuses `PhotoCredit` from `gallery.ts`.
  - Davit → `/gallery/dav1.jpg` 2048×1360 (Henoumont, EXIF, border);
  - Sabari → `/band/sabari-about.jpg` 1536×2048 (Vangelder, EXIF plus watermark);
  - Kevin → `/gallery/kev1.jpg` 2048×1378 (Henoumont);
  - Valentin → `/gallery/val1.jpg` 2048×1377 (Henoumont);
  - Krys → `/band/krys-about.jpg` 1536×2048 (Vangelder).
  - These were previously hard-coded 1100px optimized paths.
- **Added** `festivals` (4) and `sharedBills` (12), exactly as in the press kit, with "Black Mirors" corrected to **Black Mirrors**. Nothing was added beyond the source.
- `members` keeps `name` / `role` for the homepage About teaser and `/music` (both unchanged).

**Biography source:** `copywriting.md` "Bio Moyenne" (the measured English version) for the lede and album facts, plus the press-kit facts (Project Zero Studio, 01.12.2023, airplay: Uprising on Classic 21, Wrath Of Gaia on Radio Panik, stages across Belgium and independent festivals) and the existing English live sentence, trimmed. The press kit's "fighting for its place among the biggest names" and similar phrasing is **not** used. "Unity in the chaos." appears once, as an unattributed closing statement.

**Composition** (`app/about/page.tsx` and `about.module.css`, rewritten)
- **I. Cover (ink):** `band-test` full-width at its natural ratio (1.50), with no overlay. Then the `h1` "Until They Fall" (condensed display) and the mono fact "Brussels, BE — formed 2018".
- **II. Story (bone):** a large serif-italic lede (columns 2–9), two body paragraphs (columns 5–9) with "Sent To Die" linking to `/music/sent-to-die`, and "Unity in the chaos." in display type as the close.
- **III. The band (ink):** **join years as ruled dividers** (2018 › Davit, Sabari, Kevin › 2024 › Valentin › 2025 › Krys).
  - Each member is a line of the page: the name in very large condensed display, the role in mono beneath, both bottom-aligned with the image.
  - The image sits at its natural ratio, and sides alternate. Landscape stage shots take 5 columns; the two vertical portraits take 3, so the different scales are intentional.
  - A mono "Photo — name" credit appears under an image only when `SHOW_PHOTO_CREDITS` is on and a credit exists.
  - No cards, no rounded portraits, no initials fallback (a member without an image renders the name line alone), no bios.
- **IV. On stage (bone):** Festivals (condensed display, a flowing dash-separated run), Shared bills (smaller run) and "Live archive →". `utf-band-good` appears only as a supporting image on columns 9–12 (credit: Peter Vangelder), never full-width.
- **V. End (ink):** ruled Music → / Live → / Booking →.
- **At 900px and below:** each member stacks image (84%, or 64% for portraits, alternating left/right), then name, then role; the On stage lists stack above the image; the end links stack as 56px rows.
- **OG/Twitter image** switched from the watermarked `utf-band-good` (which had a wrong 1365 height) to `band-test` with its real 2048×1363.

**Verification (Phase 13)**
- 1920, 1440, 820 and 375: no horizontal overflow and no page errors.
- Every image's rendered ratio equals its natural ratio (only the 4% border trim on the Henoumont files). The cover is served at 1920w on desktop.
- Member order and dividers verified.
- `tsc` passes; eslint passes on the changed files.

## Confirmed consistency issue: album line-up (to fix in a later pass)

The current line-up includes **Valentin Coutant (joined 2024)** and **Krys Bader (joined 2025)**. *Sent To Die* was released on 01.12.2023, so they **must not be presented as personnel on that album** unless separate historical recording credits are confirmed. The album was recorded with an earlier bassist and singer, whose names are not in the site sources (the singer in the official video is that earlier vocalist).
- **Affected:** `/music` (`releaseSleeve.tsx`), whose liner-notes colophon lists the current `members` under "Line-up" next to the 2023 album.
- **Not affected:** `/music/[slug]`, which already omits Personnel.
- **To do in the consistency pass:** remove the current line-up from the album colophon, or relabel it so it is clearly not album personnel, and add historical album personnel only if it is confirmed.
- No "Former members" section is planned until names are confirmed.

## Phase 14: `/merch` ("Band Catalogue")

**Live catalogue** (database, 6 active, order: featured, then sortOrder)
1. Gerard T-Shirt, 25 €
2. Until They Fall Patch (old), 5 €
3. "Sent To Die" Album CD, 15 €
4. Sticker Pack, 5 €
5. Album Artwork Tee, 28 € (**no image**)
6. Until They Fall Patch (New), 7 €

No product has `ProductVariant` rows or extra `ProductImage` rows.

**Composition** (`app/merch/page.tsx` server + metadata; new `app/merch/merchView.tsx`; `merchStoreClient.tsx` re-rendered; new `app/components/merch/catalogue/*` and `orderPanel/*`; `merch.module.css` rewritten)
- **Masthead (ink):** "MERCH" (about 22vw, the `h1`) and a mono fact line "06 items — Ordered by email — Shipping 7 € — free from 80 €" (count from the data; shipping from the shared constants). Below it, the existing no-payment explanation in serif italic between rules.
- **Catalogue (bone, columns 1–8 of 12):** a printed-catalogue rhythm. **Plate A** = one lead product (image on columns 1–5 of 8, label on 6–8). **Plate B** = two products at different scales (columns 1–4 and 6–8, the second dropped lower). The pattern repeats in product order.
- **Each product:**
  - mono catalogue number `001`;
  - name in condensed display;
  - the real `shortDesc`;
  - price in mono;
  - availability (only "Sold out" / "Pre-order", in ember mono);
  - for products that need a size, an ember-ruled mono line **"Size: add it in your order notes"**;
  - a ruled text button "Add to order +" with screen-reader text naming the product.
  - Sold-out products stay at full strength and show "Sold out" instead of the button.
- **Images:** the original files at their **natural ratio** (measured dimensions, so no layout shift and no crop). No cards, radius, hover lift or overlay badges.
- **Missing image** (Album Artwork Tee): a **text-only plate** (larger name, 4px ink rule). No `/logo.jpg` and no mockup.
- **Low-resolution image** (stickers, 1024px): shown smaller (narrower column in plate A, 72% in a pair, 64% on mobile).
- **CD second view:** `cd2.jpg` (the opened case) appears inside the CD's plate as a smaller second photo, right-aligned under the main one, with a mono caption "Open case". There is no carousel.
- **Order panel (ink, "Your order request", columns 9–12):**
  - the no-payment notice;
  - rows with a − / quantity / + stepper (44px, labelled) and Remove;
  - underlined form fields (Name*, Email*, Country*, Notes; autocomplete set);
  - totals; status messages in a `role="status"` live region;
  - an ember "Request order →" button.
  - When the order contains a sized product, the Notes label becomes "Notes — add your T-shirt size" (in ember).
  - **Desktop:** sticky at the header height + 16px, `max-height` = viewport − header − 32px with internal scrolling, so it never traps content (verified at 1440×900: the panel ends at 884px and scrolls internally).
- **Mobile (≤900px):** the catalogue stacks (pair items at 84%, alternating left/right); the order panel follows the catalogue at full width. A fixed bottom bar **"Order request (N) ↓"** appears only once an item has been added, and hides while the panel itself is on screen (IntersectionObserver).
- **End:** "Questions about sizes or shipping?" plus a mailto link.
- **Database failure:** a try/catch in `page.tsx`. `null` renders "Merch unavailable right now" plus the contact email, with no technical detail. An empty active catalogue renders "No merch online right now".
- **SEO:** `metadata` with title "Merch", a description, canonical `/merch`, and OG/Twitter image `/merch/cd1.jpg` (2048×2048, real product photo).

**Order logic preserved:**
- All handlers in `merchStoreClient.tsx` are kept verbatim: `getMaxQty` / `clampQty` (stock-capped, max 20), add, update quantity, remove, the `/api/merch/order` POST body (`name, email, country, notes, faxNumber, items[{productId, quantity}]`), error/success messages and clearing the order on success.
- `OrderPanel` keeps CartSidebar's form state, the hidden `faxNumber` spam trap, the reset on success, disabled states while loading or empty, and the subtotal / shipping / total maths.
- The `−` / `+` buttons call the same `onUpdateQty` (clamped).
- Verified with a mocked API at 1440 and 375:
  - one and multiple items (tee ×1 + CD ×3 = 70 €, shipping 7 €, total 77 €);
  - loading ("Sending…", disabled);
  - error message shown;
  - success shows the order number, clears the rows and form;
  - the payload matches the contract.

**Shared shipping source:** new `app/lib/shipping.ts` (`SHIPPING_FLAT_EUR = 7`, `FREE_SHIPPING_FROM_EUR = 80`, `calculateShipping`). It is used by the order API (`app/api/merch/order/route.ts`; the local copy was removed, logic identical), the order panel and the masthead.

**Presentation data** (new `app/lib/merchPresentation.ts`, no schema change)
- measured `IMAGE_DIMENSIONS` per image path;
- `LOW_RES_BELOW = 1500`;
- `SIZED_PRODUCTS` (slugs `tee-core-logo`, `tee-artwork`): patches are stored as category "apparel", so the size note is driven by this list rather than by category;
- `EXTRA_VIEWS` (`cd-std` → `cd2.jpg`).
- `getActiveMerchProducts()` now also returns `slug` (`Product.slug?` added in `products.ts`). The homepage is unaffected (verified).

**Badges:** "New", "Limited", "Low stock" and "In stock" are no longer displayed. The `badge` values stay in the database and the type; "Pre-order" is still shown when present.

**Deleted** (no remaining imports outside each other, verified):
- `app/components/productCard/`, `app/components/productGrid/` (legacy, already unused);
- `app/components/merch/merchHero/`, `merchFilters/`, `merchGrid/`, `productCard/`, `cartSiderbar/`.

**Verification (Phase 14):**
- the real live catalogue at 1920, 1440×900, 820 and 375: no horizontal overflow, no page errors, natural ratios (rendered = natural);
- the text-only plate for the Album Artwork Tee;
- mocked sold-out, pre-order and low-stock states (no urgency label);
- the data-failure state;
- the mobile jump bar;
- `tsc` passes; eslint passes on the changed files.

**Product-data uncertainties:**
- **Gerard T-Shirt:** the photo (`t-shirt.jpg`) shows an engraved creature over a pile of bodies, not the Gerard mascot. The name, description and image are kept unchanged until confirmed.
- **Album Artwork Tee:** active and in stock (25), but no photo.
- **Sizes:** no size data exists; sizes come in free-text notes. A `ProductVariant`-based size system (data, API and stock per size) is a separate functional phase.
- **Patches:** stored as category "apparel".
- **Naming:** "(old)" and "(New)" are part of the stored product names.

**Merch asset weaknesses:**
- `stickers.png` is a flat 1024px digital mockup on black, unlike the photographed products. **A real sticker photo is needed.**
- The Album Artwork Tee has no photo.
- The wooden-surface photos are consistent but casually lit phone-quality shots; a matched product shoot would lift the catalogue.

## Phase 14.1: `/merch` Hybrid (scalability pass)

Goal: keep the Band Catalogue identity as the top of the page, add a practical layer that scales to 15–30+ products, and stop the order request from taking a permanent column.

**Structure:** MERCH masthead (unchanged) → **Featured** (bone) → **All items** (ink) → order-request **drawer**.

**Featured** (`catalogue/catalogue.tsx`, the same plate language as Phase 14)
- At most 3 products with `featured = true` (now exposed: `featured` added to `getActiveMerchProducts()` and `Product`).
- Live: Gerard T-Shirt (plate A), Patch (old) + CD with the "Open case" view (plate B).
- Plates now span all 12 columns: A = image on columns 1–6, label on 8–11; B = columns 1–5 and 8–11.
- The section is hidden when no product is featured.

**All items** (new `allItems/*`): the complete list, featured products included.
- One aligned row per product: a natural-ratio thumbnail (112px, contained, never cropped) | mono catalogue number | name (condensed) + short description + the size note when needed | price (mono) + availability | "Add to order +".
- Products without an image become text rows: an empty thumb cell with a hairline rule, so the alignment is kept.
- **Mobile:** thumbnail (72px) on the left; name, description and size note; then price and Add on one line. The number is hidden on mobile.
- **Category-ready:** rows render through `groupItems()`, which today returns one unlabeled group. When the catalogue reaches about 10+ products with at least 2 categories of 3+, return one group per category and add an anchor line of group labels above the list. Rows and page structure stay the same. **No categories now** (6 products; patches are also mis-filed as "apparel", so fix the data first).
- **Same catalogue number** for a product in Featured and All items (its index in the full list).

**Shared parts** (new `merch/productParts.tsx` / `.module.css`): `formatPrice`, `isSoldOut`, `availability` (Sold out / Pre-order only), `catalogueNumber`, and `AddButton`.
- **In-place feedback:** "Added ✓" for 2s after a click, then "Add to order" with the current quantity ("2 +").
- **Sold out** replaces the button.
- **`tone="bone"`** uses the darker ember for contrast on bone.

**Order request** (`merchStoreClient.tsx`; the order logic is verbatim from Phase 14)
- The permanent sticky column and the mobile jump bar are **removed**.
- **Persistent trigger:**
  - desktop: fixed top-right under the header;
  - ≤900px: a fixed full-width bottom bar (the page gets a 56px bottom padding so the bar never covers content);
  - **always visible**, quiet as "Order request (0)"; once items are added it shows the count (units) and the subtotal, with an ember rule.
- **Adding never opens the drawer.** It shows in-place feedback, updates the count and total, and announces it in a polite live region ("Added Gerard T-Shirt. 2 items in your order request.", or "maximum quantity reached").
- **Drawer:** a native `<dialog>` opened with `showModal()`.
  - Desktop: slides in from the right, `min(480px, 100vw)` wide, full height, scrolls internally.
  - ≤900px: a full-screen sheet.
  - Focus moves to "Close" on open; Escape and backdrop click (desktop) close it; **focus returns to the trigger**; the page behind is inert.
  - It contains the unchanged `OrderPanel` (its item count now counts units, matching the trigger).
- **Preserved:** add, quantity limits (stock, max 20), − / + / typed quantity, remove, the form fields, spam trap, the subtotal/shipping/total from `app/lib/shipping.ts`, loading/success/error, and the `/api/merch/order` payload.

**Verification (Phase 14.1)**
- The live 6-product catalogue at 1920, 1440×900, 820 and 375: no horizontal overflow, no page errors.
- Featured = the 3 featured products; All items = all 6, with the Album Artwork Tee as a text row.
- **Flows** at 1440 and 375:
  - the empty request ("Order request (0)", submit disabled);
  - add, then a repeated add (feedback, announcement, quantity shown on the button in both sections);
  - three units → trigger "(3) 65 €", the drawer not auto-opened;
  - keyboard open → focus on Close; + quantity, remove → totals update (30 € + 7 € = 37 €);
  - Escape → closed, focus back on the trigger;
  - backdrop click closes on desktop.
- The submission flow is unchanged from Phase 14 (tested there with a mocked API).
- `tsc` passes; eslint passes on the changed files.

**Remaining weaknesses (Phase 14.1)**
- ~~The desktop trigger floats over content~~: resolved in 14.2.
- Featured products appear twice (Featured plus All items). This is intentional, so the list is complete.

### Phase 14.2: desktop order trigger + end spacing

- **Masthead action (desktop, >900px):** the client store now renders the masthead. `MerchView` passes the masthead content as a `masthead` prop when a catalogue exists; the unavailable and empty states still render it server-side. It ends with a normal in-flow button, "Order request (N) [subtotal] ▸", which is never sticky and is always present, so the flow is discoverable at 0.
- **Edge tab (desktop):** shown **only while the order is not empty**.
  - A vertical tab fixed to the right viewport edge at mid-height, its text reading bottom to top.
  - Count and subtotal; an ember rule with no right border, attached to the edge.
  - Its width is `min(var(--margin), 48px)`, so it lives in the page gutter. Verified at 1920, 1440, 1100 and 920: the tab's left edge is at or beyond the right edge of every visible image, heading, row and button (8px clear at 1920/1440, flush at 1100/920), so there is **no overlap**.
  - It disappears when the order becomes empty again; the masthead action remains.
- **Focus return** after closing the drawer: the opener if it is still rendered, otherwise the visible order control. Visibility is tested with `getClientRects()`, because `offsetParent` is always null for fixed elements. Emptying the order inside the drawer and closing it returns focus to the masthead action (verified).
- **Mobile (≤900px) unchanged:** the masthead action is hidden; the persistent bottom bar and the full-screen sheet are as approved.
- **End spacing:** All items bottom padding is now `clamp(32px, 4vw, 56px)` (was `--space-m`, up to 160px) and the questions line has no top padding (was `--space-s`). The last row → "Questions about sizes or shipping?" gap is 56px at 1440/1920, about 33px on mobile (was about 250px).
- The drawer and all order behaviour are unchanged. `tsc` passes; eslint passes on the changed files.

## Phase 15: `/booking` ("Booking Sheet")

**Contact centralised** (new `app/lib/contact.ts`)
- `CONTACT_EMAIL = "contact@untiltheyfall.com"`, the single source for the public address.
- It is now used by: the Header mobile menu, the Footer, the homepage Booking section, `/merch` (`merchView.tsx`), the `/booking` page and form, and the **API fallbacks** in `app/api/send/route.ts` (booking) and `app/api/merch/order/route.ts` (merch, sender and recipient). No other hard-coded copy remains in `app/` or `lib/` (grep verified).
- **Internal destinations stay environment-controlled and are not assumed equal to the public address:** `BOOKING_TO_EMAIL`, `MERCH_TO_EMAIL`, `RESEND_FROM_EMAIL` (set in `.env.local`; values not inspected or exposed).
- `TECH_RIDER = { href, version: "18.02.2026", pages: 5, sizeLabel: "206 KB" }` in the same file, used by `/booking` and the homepage Booking section.
- **Open conflict:** `presskit.md` lists `untiltheyfallband@gmail.com`. `untiltheyfall.com` has OVH MX records (mail can be received by the domain), but whether `contact@` is read, and whether the Gmail address is old or still monitored, needs confirmation from the band.

**Composition** (`app/booking/page.tsx` is now a server component; `bookingClient.tsx` now renders only the request form, with its submit logic verbatim; `booking.module.css` rewritten)
- **I. Contact (ink):**
  - "BOOKING" (about 19vw, the `h1`);
  - mono identity line "Melodic death metal — Brussels, BE — 5 members";
  - **`contact@untiltheyfall.com` as the dominant element** (display type, a mailto link, ember underline);
  - two ruled actions: "Booking request ↓" (anchor `#booking-request`, landing below the header) and "Tech rider PDF ↗" (new tab, `noopener`), with mono "v. 18.02.2026 — 5 pages — 206 KB".
- **II. Technical sheet (bone):**
  - "Technical summary", labelled "Technical rider — v. 18.02.2026";
  - ruled label/value rows **derived only from the rider**: Line-up 5 members · Backline own or venue · Guitars Line 6 Helix / Helix Stomp · Bass Ampeg PF-500 via DI · Sample pad via DI · Monitoring all members on IEM, own digital mixer and splitter · Inputs 19 channels · Venue provides PA and required drum microphones · Vocal mics 3 × SM58 or similar · Backdrop 1.80 × 2.00 m · Optional smoke machine and 2 EgoRisers;
  - "Full rider: input list and stage plot ↗".
  - **Secondary "Stage history"** (columns 9–12): the real show count from the concert data ("12 shows since 2024"; omitted if the database is unavailable), festivals and shared bills (from `about.ts`), airplay (from `music.ts`), and "Live archive →".
- **III. Booking request (ink):**
  - the existing form, restyled: underlined sharp fields in two columns (one column at ≤900px), each label showing "Required" (ember) or "Optional";
  - an ember "Send booking request →";
  - "Or email contact@untiltheyfall.com" beside the submit;
  - status messages in a `role="status"` live region.

**Removed unsupported claims:** "30–60 min" set length, "across Belgium and Europe", "fast changeovers", "Modern metal sound", the slogans ("A heavy set built for the room", "tech rider ready") and the FAQ repeating them. No fee range, hospitality, travel or response-time promise is shown. Geography is limited to Brussels, BE.

**Form-default fix:** "Event type" and "Budget" start empty ("Select event type" / "Select budget", `value=""`), so nothing is submitted unless chosen. Previously they silently sent "Festival" and ">= 1000". Both remain optional; the API already accepts empty strings.
- **Everything else unchanged:** field names (`name, email, org, type, city, capacity, date, budget, message, faxNumber`), client and server validation (`lib/booking.ts`), spam trap, Turnstile (`bookingTurnstile.tsx` untouched), `/api/booking` → `/api/send`, the `BookingRequest` database storage, the band and promoter emails, and the loading/success/error behaviour and form reset.

**SEO:**
- Title unchanged ("Booking").
- The description no longer carries "tech rider ready" and adds no marketing claims.
- OG/Twitter image is now `/gallery/band-test.jpg` (2048×1363, correct dimensions; it was the watermarked `utf-band-good.jpg` with a wrong 1365 height).
- New schema.org `MusicGroup` JSON-LD with confirmed fields only: name, url, genre "Melodic death metal", foundingDate 2018, foundingLocation Brussels, Belgium, email `CONTACT_EMAIL`, and `sameAs` from `BAND_PROFILES`.

**Deleted:** `bookingPage/bookingHero.tsx`, `whyBookUs.tsx` + `whyBookUs.module.css`, `bookingFAQ.tsx` (no references, verified). **Kept:** `bookingForm.tsx` (restyled), `bookingTurnstile.tsx`, the client submit logic, the API, validation and email templates.

**Verification (Phase 15)**
- 1920, 1440×900, 820 and 375: no horizontal overflow, no page errors.
- The mailto link is correct; the rider returns HTTP 200 (PDF) and opens in a new tab; the anchor lands the form under the header.
- Event type and Budget are empty by default, and a mocked submission sends `type: ""` and `budget: ""`.
- **Client validation:** an empty submit shows "Please fill all required fields."
- **Mocked success** (API intercepted in the browser, Turnstile mocked): loading "Sending…", then "Thanks. We'll get back to you shortly.", and the form resets.
- **Server validation** on the real API: missing fields → 400 "Please fill all required fields."; **spam trap** → 400 "Invalid request." Both are rejected before Turnstile, the database or email. No valid payload was sent to the real API (to avoid creating a real booking or sending email).
- **Client spam trap:** "Invalid request. Please try again." with no API call.
- **Turnstile enabled:** the widget block renders; with the script blocked (no token), submit stays disabled; with a mocked token, submit is enabled and the token is sent. **Turnstile disabled** (empty site key): the widget is skipped and submit is not token-gated (code path unchanged; not toggled here, because the dev server reads the key from `.env.local`).
- No rider phone numbers appear on the page. `tsc` passes; eslint passes on the changed files.

**Remaining contact / rider uncertainties**
- **Email:** `contact@untiltheyfall.com` (site) vs `untiltheyfallband@gmail.com` (press kit). Which is monitored, and does `BOOKING_TO_EMAIL` deliver to a read inbox?
- **The public rider contains personal mobile numbers** (Sabari Diakite, Davit Nersesyan) on pages 1–2 of `UTF_technical_rider_2026.pdf`. **The band should consciously decide** whether to keep them in a publicly downloadable document. The PDF was not edited, and the numbers are not reproduced on the page.
- **Set length, touring geography beyond Belgium, fees, hospitality, travel, response time:** not shown until confirmed.
- **Promoter downloads:** no press-kit PDF or press-photo pack exists yet.
- The rider is v. 18.02.2026, with the current line-up. When it changes, update `TECH_RIDER` (version and size) together with the file.

### Phase 15.1: Turnstile site-key guard

- `bookingClient.tsx` checks the shape of `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (`/^[0-3]x[A-Za-z0-9_-]+$/`, i.e. `0x…` live keys or `1x…`/`2x…`/`3x…` Cloudflare test keys).
- **A malformed key no longer crashes the widget** ("Invalid input for parameter sitekey"). The widget is skipped and a clear `console.error` explains what to fix.
- Cause found locally: line 7 of `.env.local` held a URL instead of a site key, and `NEXT_PUBLIC_SITE_URL` is declared twice (lines 5–6). `.env.local` was not edited.
- **For local development,** use Cloudflare's paired test keys (site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`) and restart the dev server.
- With the widget skipped but a real `TURNSTILE_SECRET_KEY` set, the server still requires a token, so submissions return the existing verification error (no silent bypass).

### Phase 15.2: fail-safe Booking / Turnstile configuration

- Supersedes the partial-configuration behaviour in Phase 15.1. The Booking page and API now use one configuration resolver: both keys absent = intentionally disabled; usable-looking public site key plus server secret = enabled; any partial/malformed configuration = unavailable. Only the public state and enabled site key reach the browser; the secret stays server-side.
- **Disabled:** the existing form remains usable without Turnstile. **Enabled:** the existing fields, layout, token requirement and server-side verification are preserved. **Unavailable:** the request section shows “Online booking requests are temporarily unavailable. Please email us directly.” and a prominent `mailto:contact@untiltheyfall.com` link, with no fillable form or submit action and no configuration details.
- Widget script errors, a 15-second script-load timeout, render failures and widget error callbacks also show the email fallback. Normal challenge expiration still clears the token and permits verification again. The API rejects partial configuration before storage/email with HTTP 503 and `BOOKING_UNAVAILABLE`; the client handles that code with the same fallback. Provider-reported invalid/missing server secrets are also unavailable, never bypassed.
- Verification: `node --import tsx --test lib/turnstile.test.ts` passes (both keys absent, normal pair, missing site + secret, malformed site + secret, site + missing secret, malformed site alone, rejected secret and invalid token). Browser checks pass for disabled and enabled forms with unchanged field names and intercepted submissions, the current malformed configuration's fallback/mailto, widget error callback, render failure, script-load error and script-load timeout. Both `/api/booking` and `/api/send` return 503 `BOOKING_UNAVAILABLE` for the current partial configuration before storage/email. Cloudflare verification is mocked; no real booking/email was created. Type-check and full-repository lint pass.
- **Environment requirement remains:** `.env.local` was not edited. Its malformed `NEXT_PUBLIC_TURNSTILE_SITE_KEY` still needs manual replacement with a real site key paired with `TURNSTILE_SECRET_KEY` (or paired Cloudflare test keys for local development), followed by a dev-server restart / deployment rebuild. Remove both only when intentionally disabling verification. Credentials cannot be proven to match from their shape; Cloudflare must validate real tokens. No other audit findings were changed.

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

- **About imagery (Phase 13):**
  - The member images are a mixed set: three landscape stage crops from the Henoumont session (baked border plus signature) and two vertical Vangelder portraits with large baked watermarks.
  - The cover (`band-test`) is the same image as the homepage About teaser, and the Henoumont crops also appear in `/gallery` and the homepage.
  - `band-test` has no known photographer.
  - A matched portrait session of the five members would be the single biggest improvement.

- **Photo attribution and permission (Phase 12):**
  - The Henoumont session's venue and date are unknown, so no show can display photos until confirmed.
  - Credits are stored from EXIF (Henoumont) and a watermark (Vangelder); **publication permission and credit wording are unconfirmed**. Flip `SHOW_PHOTO_CREDITS` to `false` to hide all credits.
  - `band-test` (promo) has no photographer metadata.
  - The "HELL" backdrop on `utf-band-good` is a visual clue only.
- **Gallery assets (Phase 12):**
  - only 8 photos, 6 from one session;
  - 4 are already prominent elsewhere (`band1` visual break; `dav1`, `val1`, `band2` homepage teaser), and `band-test` is in the About teaser;
  - baked signatures, borders and a watermark;
  - 2048px maximum, so the full-bleed opener is slightly soft at 1920.
- **Gallery rhythm (Phase 12):** chapters II and III hold one photo each, so the lower half of the page is two single images with a lot of ink around them. It will improve as more sets are added.

- ~~`/concerts` detail pages~~: resolved (Phase 11).
- **Show pages without data (Phase 11):** 10 of 12 shows have only date, city and venue. Their pages are the masthead plus neighbours: a single ink plane with no bone section. This is intentional, but sparse.
- **`/concerts/[slug]/gallery` (Phase 11, not redesigned):** still uses `GalleryFull` (old style) and shows **all** stored gallery paths, including the unconfirmed `band1` / `bandall` for Arlon. It is not linked from the show page unless there are more than 5 confirmed photos. Redesign it, or apply `confirmedPhotos()`, in the gallery phase.
- **Concert data to verify (Phase 11):**
  - Braine doors = show = 18:00 (both omitted until confirmed);
  - Arlon's line-up omits Until They Fall while Braine's includes it;
  - Namur's note "Tremplin Durbuy Rock Fest" is the same label as Arlon's (correct?);
  - the Arlon gallery association (`band1`, `bandall`) is unconfirmed;
  - photo credits have no data field yet.
- **`/concerts` zero state (Phase 10):** with no dates, the giant "LIVE" sits above a single ruled line and the bone archive becomes the real content. This is intentional, but the top half is sparse.
- **`/concerts` archive poster anchoring (Phase 11.1):**
  - Archive year posters now hang from the year rule: poster top = rule = top of the first show row, left edge on the column 9 grid line (measured at 1920 and 1440).
  - Each poster carries a mono caption from real data ("Poster — DD.MM.YYYY — City"). No frame, shadow or card.
  - The year numerals keep a 10–18px gap above the rule on desktop and tablet.
  - Fixed a class collision: the archive chapter was `.year`, the same class as the upcoming date's small year label. It is now `.chapter`.
- **`/concerts` archive poster on tablet:** at 820px the poster stacks full width under the list (about 750px tall). It could be capped later.
- **`/concerts` archive alignment (Phase 10):** years with posters have narrower rows (columns 1–8) than years without (full width), so the venue column shifts between 2025 and 2024.
- **Concert posters (Phase 10):** both are third-party festival artwork (magenta, yellow, cyan) that clash with ink/bone/ember. Only 2 of 12 shows have one. Do posters exist for the other shows?
- **Concert data (Phase 10, not cleaned):** inconsistent `title`s (handled at display time by `usefulTitle()`); a long promotional `note` on Braine (not shown in lists); "Bruxelles" vs "Brussels" used for the same city in different rows; the Arlon `ticketUrl` points at a generic Utick catalogue (irrelevant now, since past shows show no ticket action).

- **`/music` artwork (Phase 8):** as the dominant object, the saturated, AI-looking digital cover is even more prominent than on the homepage. The physical CD engraving would suit the direction better once a clean scan and credit exist.
- **`/music` desktop (Phase 8):** at 1920 there is a wide ink gap between the artwork and the tracklist column, and the bone liner notes have empty space under the story. Both read as deliberate, but could be tightened.
- ~~`/music` → `/music/sent-to-die`~~: resolved, the release page is rebuilt (Phase 9).
- **Release page cover spread (Phase 9):** at 1920×1080 the plate fills the viewport height, so the title and listen row sit just below the fold. That is intentional (the artwork as the object), but the main listen action needs one scroll on large screens.
- **Release page archive (Phase 9):** with one release, the archive part is only two links on a full ink band. It will fill out when more releases exist.
- **Contact email conflict (open, see Phase 15):** the public site address is `contact@untiltheyfall.com` (now one constant). `presskit.md` still lists `untiltheyfallband@gmail.com`. **The band must confirm whether the Gmail address is old or still monitored.**

- **TEMPORARY: video poster (Phase 5).** A 640px YouTube still, soft at desktop widths; a local 1920px+ still is needed (see Phase 5).
- **TEMPORARY: signed gallery photography (Phases 4–5).** The visual break and gallery teaser photos carry the photographer's signature (Laurent Henoumont) and a baked border. Confirm the credit and permission, and get clean high-resolution masters.
- ~~Merch product imagery (Phase 6): screenshot tee / AI hoodie~~ — **correction (Phase 14):** that note described the **seed** products (`scripts/seed-merch.ts`: Core Logo Tee `core-tee.jpg`, Skull Hoodie `skull-hoodie.png`), not the live catalogue.
  - The **live** database shows real product photos on a consistent wooden surface. The homepage Merch section shows the first two live products: Gerard T-Shirt (`t-shirt.jpg`) and Until They Fall Patch (old) (`patch-1.jpg`).
  - Remaining merch asset issues are listed under Phase 14.
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
- ~~Header mobile menu links~~: resolved in Phase 7.1. The header and footer share `BAND_PROFILES`.
- **Local merch section:** while the local database is down, Merch renders nothing, so About is followed directly by the Mailing list (both ink). In production, with products, the bone Merch plane sits between them.
- **Tickets link:** untested with real data, because the database is unavailable locally.
- **Dev only:** the Next.js dev badge overlaps the lower-left corner on mobile.
