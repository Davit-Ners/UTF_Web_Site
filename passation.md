# Passation — Homepage redesign

Branch: `redesign/simple-site-v1`. Source of truth for art direction: `utf-design/`.

## Status

The summaries below describe the current state. Phase implementation and verification notes are historical: they preserve what was true at each stage, not additional active blockers. Deployment/environment requirements remain separate from completed code fixes.

### Resolved audit findings

- Booking Turnstile partial-configuration resilience (Phase 15.2); saved/email outcome separation (15.3); server-enforced idempotency (15.4); field errors/native required semantics/focus (15.5).
- Merch saved/email outcome separation (14.3) and server-enforced idempotency (14.4). Same-key retries are protected; different keys deliberately represent separate submissions.
- Sent To Die: eight tracks and derived 41:25 runtime (9.1); current-member personnel implication removed and four confirmed historical recording personnel added. Production-credit uncertainties remain separate.
- Header mobile-menu desktop-resize cleanup, shared focus contrast, one root main landmark and global native skip link.
- Concert dossier links/time consistency/poster dimensions, gallery outage handling and resilient canonical sitemap (follow-up below).
- Final cleanup: release booklet heading hierarchy, linked sleeve title, shared new-tab announcement, homepage Merch price/photo policy and verified obsolete code/labels (details below).

### Still unresolved / deployment requirements

- **Database deployment:** confirm application of both additive migrations (`20261023120000_merch_order_idempotency`, `20261025120000_booking_idempotency`), client generation and rebuild/restart. Last recorded implementation runs did not migrate the configured database. Follow `prisma/migrations/README.md`; the repository lacks an original baseline. No migration/schema/database changes were made in this cleanup.
- **Turnstile environment:** code resilience is resolved. The last recorded local configuration had an unusable public key; manual correction to a matched site/secret pair and restart/rebuild still needs confirmation. No environment values were inspected or changed in this cleanup.
- **Contact:** `contact@untiltheyfall.com` is confirmed as actively monitored (2026-10-25). Still confirm the configured notification inboxes (`BOOKING_TO_EMAIL`/`MERCH_TO_EMAIL`) and resolve the differing Gmail address in `presskit.md`.
- **Factual content:** retain the documented concert time/line-up/note/city/photo-association questions, product name/category questions, and unconfirmed mix/master/artwork/Bandcamp details. Do not infer replacements.
- **Assets:** dedicated mobile Hero, high-resolution video still/logo, clean credited gallery/member images and product photography remain pending; photo permission/credit wording remains unconfirmed. Detailed limitations are retained at the end.
- **Merch variants/sizes:** still a separate functional phase; order notes remain the current size mechanism.
- **Rider/press:** the band has decided to keep the personal rider phone numbers public for now (PDF unchanged); no public press-kit PDF/press-photo pack exists yet.
- **Privacy/GDPR (open items, see Privacy core below):** no legal entity exists, so the controller is described as the band's members; retention periods are policy commitments with no automated deletion; Vercel/Resend processing and retention details and most transfer safeguards are unconfirmed.
- **Operator identity / legal-commercial setup (unresolved):** the band has no legal entity, enterprise (BCE/KBO) number, VAT number, registered office, public business address or professional phone. `/legal` and `/privacy` publish only the band name, Brussels, Belgium and `contact@untiltheyfall.com`, and say plainly that no separate entity exists. Belgian e-commerce rules (art. XII.6 CDE, as read by FPS Economy) expect a service provider's name, geographic address, contact details and, where registered, enterprise/VAT numbers; consumer distance sales (art. VI.45 CDE) also expect a geographic address and phone. Merch sales terms cannot be completed until the band decides who operates and sells (members, one member, or a new ASBL/company) and which address/phone can be published. Get legal/accounting advice; do not fill these gaps with placeholders.
- **Newsletter:** disabled for launch (see Newsletter launch-safe state below).
- **Domain / SEO launch (external steps):** canonical origin is `https://untiltheyfall.com` (hard-coded for production builds; see SEO launch pass below). In Vercel, attach both `untiltheyfall.com` and `www.untiltheyfall.com` to the production project and set `www` to **redirect (308) to `untiltheyfall.com`**; the code-level host redirect is only a safety net. Then follow the post-deployment checklist in the SEO section. No email addresses are collected; reactivation is a dedicated phase with the requirements listed there.
- **Deferred phases:** Legal notice, Merch consumer-law terms/withdrawal, newsletter rework, the broader SEO review, asset replacement and motion are not implemented. Existing motion is unchanged.

### SEO launch pass (2026-10-25)

- **Canonical strategy:** `lib/site.ts` exports `PRODUCTION_SITE_URL = "https://untiltheyfall.com"`. `getSiteUrl()` returns it whenever `NODE_ENV === "production"` (Vercel production **and** preview builds, `next start`), so metadataBase, canonicals, OG URLs, sitemap, robots and JSON-LD can never use a deployment URL; the old `SITE_URL`/`VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` fallbacks are removed. In development only, `NEXT_PUBLIC_SITE_URL` may override the origin, otherwise `http://localhost:3000`. **Production environment:** no site-URL variable is required; `NEXT_PUBLIC_SITE_URL` is ignored in production builds.
- **www → apex:** `next.config.ts` adds a permanent redirect for requests whose host is exactly `www.untiltheyfall.com` → `https://untiltheyfall.com/:path*` (path and query preserved; the apex host never matches, so no loop). The primary mechanism must be the Vercel domain setting above.
- **Inheritance fix:** the root layout no longer sets `alternates.canonical: "/"` or `openGraph.url: "/"`; the homepage now declares its own canonical/OG. Routes without explicit metadata no longer inherit the homepage canonical (the 404 has none and is `noindex`).
- **Metadata fixes:** `/privacy` and `/legal` gain OG/Twitter title, description, URL and the clean `band-test.jpg` share image (2048×1363) via the new `app/lib/seo.ts` `socialMetadata()` helper; both stay indexable and are now in the sitemap. `/concerts/[slug]/gallery` gets `generateMetadata` (shared React-cached loader): eligible galleries use "Photos — City — Venue, dd.mm.yyyy", a factual description, self canonical/OG URL and the first confirmed photo with its real size; unknown/ineligible slugs return `{}` and the page stays 404; outage → "Concert photos" with self canonical. `/concerts/[slug]` outage → title "Concert", "Concert details from the Until They Fall live archive.", self canonical/OG URL, no venue/city/date. Release page description now built from release data ("Sent To Die, the debut album by Until They Fall, melodic death metal from Brussels. 8 tracks, released 01.12.2023."). Share-image sizes corrected to the files: `/music` album cover 1875×1875 (was 1200), `/concerts` `band1.jpg` 2048×1329 (was 1365); concert OG posters now carry measured dimensions when known. Other titles/descriptions reviewed and kept.
- **Merch:** description → "Official Until They Fall merch catalogue. Send a request directly to the band; availability, shipping and payment are confirmed by email." (OG/Twitter: "…Requests are handled directly with the band by email."). Homepage Featured Merch link "Shop →" → "View merch →" (same label as the section's unavailable state, avoiding "MERCH / MERCH"). No Product/Offer schema.
- **JSON-LD (`app/lib/structuredData.ts`):** one band entity `MusicGroup` `@id https://untiltheyfall.com/#band` (name, url, genre, foundingDate 2018, foundingLocation Brussels/BE, `band-test.jpg` image, contact email, the five current members from `app/lib/about.ts` as `OrganizationRole` with role and join year, `album` → Sent To Die `@id`, `sameAs` from `BAND_PROFILES`). Rendered on the homepage (authoritative) and reused unchanged on Booking (same `@id`, replacing Booking's narrower duplicate). No logo property: the header Gerard mark is documented as temporary. `MusicAlbum` on `/music/sent-to-die` (`#album` id, `byArtist` → band id, `AlbumRelease`, datePublished 2023-12-01, `/album-cover.jpg`, 8 `MusicRecording` items in order with ISO durations, `sameAs` Spotify/Apple Music/YouTube Music); no label, catalogue number, producer, studio or offers. `MusicEvent` moved to the shared module: Until They Fall always first performer (by `@id`), supporting acts from the stored line-up, `EventScheduled` (only PUBLISHED shows are loaded; cancelled is a separate status), `OfflineEventAttendanceMode`, start/door times with the Europe/Brussels offset (+01:00/+02:00 by date) or date-only when times are missing/unreliable, offers only for future shows with a stored ticket URL (made absolute) and a price only when the stored label is "N EUR"; no availability, organiser or sold-out state. Note: every currently published show is in the past, so live pages currently emit no offers.
- **Sitemap:** adds `/privacy` and `/legal`; otherwise unchanged (DB-resilient, dossiers when available, eligible galleries only, no redirect aliases or API routes, no `lastModified`). **Robots:** `Allow: /`, `Disallow: /api/`, `Sitemap: https://untiltheyfall.com/sitemap.xml`; the non-standard `Host:` line was dropped. No `noindex` on any production page except the 404; no `X-Robots-Tag` emitted by the app (Vercel preview deployments are expected to add their own noindex — verify once).
- **404:** new `app/not-found.tsx` + `not-found.module.css`: large display "404" (`h1`, with screen-reader "— page not found"), one serif line "This page doesn't exist, or it has moved.", action links Home / Music / Live; title "Page not found", `robots: noindex`.
- **Internal linking:** the homepage Live empty state linked to the redirect alias `/concerts/past`; now `/concerts#archive`. Other checked paths were already present (home → Music/Live/Merch, `/music` → booklet, lists → dossiers, dossier → archive, Booking/Merch → Privacy, Footer → Privacy/Legal).
- **Files:** new `app/lib/seo.ts`, `app/lib/structuredData.ts`, `app/not-found.tsx`, `app/not-found.module.css`, `lib/seo.test.ts`; edited `lib/site.ts`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/booking/page.tsx`, `app/concerts/page.tsx`, `app/concerts/[slug]/page.tsx`, `app/concerts/[slug]/gallery/page.tsx`, `app/music/page.tsx`, `app/music/[slug]/page.tsx`, `app/merch/page.tsx`, `app/privacy/page.tsx`, `app/legal/page.tsx` (metadata only), `app/robots.ts`, `app/sitemap.ts`, `app/components/homePage/featuredMerch/featuredMerch.tsx`, `app/components/homePage/live/live.tsx`, `lib/concert-resilience.test.ts` (expected static count 7 → 9 plus privacy/legal assertions).
- **Verification:** `lib/seo.test.ts` (13 tests: origin rules incl. production with deployment URLs set; www redirect shape and no apex match; production robots; production outage sitemap exact apex URL list; layout no longer owns canonical/og:url; privacy/legal/merch metadata; MusicGroup members/sameAs/album; MusicAlbum tracks/durations/order and absence of label/catalogue/producer/offers; MusicEvent winter/summer offsets, performer, status, mode, future offer vs past none, unreliable times, absolute ticket URL; concert outage metadata; gallery eligible/ineligible/outage metadata; 404 links/noindex; homepage merch label and archive link) plus all suites: 82/82 pass. `next build` succeeds. On `next start` (production): 200 for all public routes; true 404 for `/music/does-not-exist`, `/concerts/does-not-exist`, `/concerts/does-not-exist/gallery`, `/concerts/utf-arlon/gallery` and a random route; 308 for both redirect aliases; `Host: www.untiltheyfall.com` → 308 `https://untiltheyfall.com/music/sent-to-die?x=1`, apex host 200; robots/sitemap (HTTP 200, apex, privacy/legal, 12 live dossiers, no aliases) as above; every major route has its own canonical, og:url, og:title and twitter:title; JSON-LD: one MusicGroup id on Home and Booking, MusicAlbum on the release, past MusicEvents without offers; the 404 has no canonical and `noindex`. Browser at 1440, 820 and 375: branded 404 on all three 404 cases with Home/Music/Live, no overflow, Live link navigates; homepage merch link and layout unchanged apart from the label. Type-check and full ESLint pass. No commit or push.
- **After deployment (launch checklist):**
  1. Open `https://untiltheyfall.com` and confirm it serves the production build over HTTPS.
  2. Confirm `https://www.untiltheyfall.com/any/path?x=1` returns a single 308 to `https://untiltheyfall.com/any/path?x=1`.
  3. Check `https://untiltheyfall.com/robots.txt` (Allow /, Disallow /api/, apex sitemap) and that no production page sends `X-Robots-Tag: noindex`.
  4. Check `https://untiltheyfall.com/sitemap.xml` (HTTP 200, apex URLs, `/privacy`, `/legal`, release and dossier pages).
  5. Add a Google Search Console **Domain property** for `untiltheyfall.com` with the DNS TXT record (DNS at OVH).
  6. Submit `https://untiltheyfall.com/sitemap.xml`.
  7. URL-inspect `/`, `/music`, `/music/sent-to-die`, `/concerts`, `/merch`, `/booking` (live test: canonical = apex URL, indexable, structured data detected).
  8. Request indexing for those pages where appropriate.
  9. Optionally import the Search Console property into Bing Webmaster Tools.
  10. Spot-check real production 404s (`/music/x`, `/concerts/x`, a random path) and canonical tags on a dossier and a release page; run the homepage, release and one dossier through the Rich Results Test / Schema Markup Validator.

### Merch request positioning (2026-10-25)

- **Current launch model:** `Catalogue → non-binding request → band confirmation by email → possible later payment/agreement.` The site takes no payment, concludes no sale, issues no invoice and guarantees neither final availability, final shipping cost nor a delivery date. Payment after contact may later be bank transfer, PayPal or cash (not stated on the site). Stock checks, quantity limits, prices, the €7/free-from-€80 shipping rule, API, storage, idempotency and email sending are unchanged. This documents product behaviour only; it does **not** mean the band is exempt from consumer-law obligations if sales are concluded at a distance (see the audit and the operator-identity item above).
- **Wording changed:** masthead facts "Ordered by email" → "Requested by email" and "Shipping 7 €…" → "Shipping estimate 7 € — free from 80 €"; masthead note → "Add items to a request and send it. We confirm availability, shipping and payment by email. No payment is taken on the site."; product action "Add to order" → "Add to request" ("Added ✓" unchanged); size hint → "Size: add it in your request notes"; drawer notice "stock" → "availability"; totals "Total" → "Estimated total" ("Subtotal" and "Shipping estimate" unchanged, no calculation change); submit "Request order" → "Send request" ("Sending…" unchanged); saved message → "Request saved. Reference {ref}. We'll follow up by email. No payment has been taken." and replay → "Request already received. Reference {ref}. …". Unchanged: "Order request (n)" triggers, "Your order request" drawer title, both delivery-warning messages (reference, "don't submit it again", "Keep this reference", contact fallback), failure messages.
- **Submit clarification:** new line above the existing privacy notice and the button: "Sending this request does not complete a purchase. We'll confirm availability, shipping and payment with you by email." No checkbox, no terms acceptance.
- **Customer email:** "We received your merch request for Until They Fall. This is a request, not a completed purchase: no payment has been taken. We will confirm availability, shipping and payment with you by email."; detail label "Order" → "Request reference"; footer "Merch requests - Until They Fall". Subject, item summary, estimated total and structure unchanged. Band notification email unchanged (already "New merch order request", "Shipping estimate", "Estimated total").
- **Not changed (out of scope):** API error strings "This checkout attempt is invalid…/already used…" (shown only on invalid key or conflicting replay); homepage Featured Merch "Shop →" link; `/merch` metadata description ("ordered directly from the band by email", SEO phase).
- **Files:** `app/merch/merchView.tsx`, `app/components/merch/productParts.tsx`, `allItems/allItems.tsx`, `catalogue/catalogue.tsx`, `orderPanel/orderPanel.tsx` + `.module.css` (`.nextStep`), `lib/merch-order-result.ts` (success copy only), `app/components/emailTemplate/merchOrderTemplate.tsx` (customer template copy), new `lib/merch-wording.test.ts`.
- **If Merch becomes structured e-commerce later (dedicated phase):** seller identity (who sells; address/phone/enterprise/VAT as applicable), shipping rules per destination and carrier, payment terms and methods, contract formation (when the customer is bound; "order with obligation to pay" button if the site click becomes binding), 14-day withdrawal information, model form and online withdrawal function, legal guarantee notice, the remaining consumer-law pre-contract and confirmation information, and proper product variants/sizes instead of free-text notes.
- **Verification:** `lib/merch-wording.test.ts` (5 tests: next-step line precedes the privacy notice and submit; "Send request"; no checkout wording or checkbox; totals 25 + 7 = 32 and free shipping at 80 unchanged, labelled estimates; masthead/catalogue wording; exact saved/replay messages and unchanged warning message; customer email request wording, "Request reference", estimated total, internal labels intact) plus all suites: 69/69 pass. Browser at 1440, 820 and 375 with intercepted submissions (no DB write or email), 48 checks pass: masthead wording, no checkout wording on the page or in the drawer, no overflow, totals arithmetic, element order, exact saved message, warning flow keeps reference/do-not-resubmit/contact, unchanged payload keys, cart cleared after save. Screenshots show unchanged layout. Type-check and full ESLint pass.

### Legal notice (2026-10-25)

- **Scope:** new `/legal` (EN + FR) and a footer Legal link. No changes to Privacy text, Header, Booking, Merch, Newsletter, APIs, product data, assets, motion or migrations. No commit or push.
- **Files:** new `app/legal/page.tsx`, `legalEn.tsx`, `legalFr.tsx`, `legalFacts.ts`, `legal.module.css`, new `lib/legal.test.ts`; edited `app/components/footer/footer.tsx` + `footer.module.css`. The page reuses `app/privacy/privacy.module.css` for the shared document layout (imported, not modified); `legal.module.css` only styles the identity list.
- **Structure:** same pattern as `/privacy`. Masthead `h1` Legal, "Last updated 25 October 2026 — Dernière mise à jour 25 octobre 2026", EN/FR anchors, then `section#legal-en[lang=en]` ("Legal notice — English") and `section#legal-fr[lang=fr]` ("Mentions légales — Français"), each with the same 8 `h3` topics: this website (identity list), who runs it, contact, technical services (points to `/privacy`; no French-style "hébergeur" section, which the Belgian audit did not support), name/logo/content, external links, accuracy, privacy.
- **Exact identity published:** "This is the official website of the band Until They Fall." Band: Until They Fall · Based in: Brussels, Belgium (FR: Bruxelles, Belgique) · Contact: `contact@untiltheyfall.com`. Operation: "The website is run by the members of Until They Fall. The band does not currently operate through a separate legal entity, such as a non-profit association or a company." No company name, legal form, BCE/KBO, VAT, registered office, postal address, phone or member personal details. The page also does not claim the band has no enterprise/VAT number (unconfirmed), only that there is no separate entity.
- **Content wording:** band name, logo and original texts belong to the band unless stated otherwise (ask before reuse). Photographs, concert posters and artwork by others remain their authors' work: photographers are credited where known, posters belong to their organisers/designers, and reuse permission must come from those owners. External services operate under their own terms/privacy policies. Accuracy: details can change; check with the organiser/ticket seller. No sweeping liability or accuracy guarantees.
- **Footer:** the base row now holds `© year Until They Fall` · an `aria-label="Legal"` list with PRIVACY and LEGAL (uppercase mono, 24 px gap, 24 px minimum target) · the contact email.
- **Metadata:** title "Legal notice | Until They Fall", own description, `canonical: /legal`. As on `/privacy`, Open Graph `og:url`/title still inherit the root defaults; left for the SEO phase, which also decides sitemap inclusion for `/privacy` and `/legal`.
- **Limitation:** see "Operator identity / legal-commercial setup" in the unresolved list above. No warning banner is shown on the public site.
- **Verification:** `lib/legal.test.ts` (3 tests: both language sections with equal topics, the confirmed identity, no-entity statement, contact and privacy links; no enterprise/VAT-like number, phone-like number, street/postcode address or registration terms in the rendered text; footer list order Privacy → Legal) plus all existing suites: 64/64 pass. Browser checks on the dev server at 1440, 820 and 375 (27 pass): `/legal` returns 200 with route-specific title, description and canonical; lang sections with 8/8 topics; FR anchor lands under the header; no horizontal overflow; the Privacy link from `/legal` opens `/privacy`, whose canonical stays `/privacy`; footer Legal and Privacy links navigate; screenshots show a coherent identity list and a quiet footer row. Type-check and full ESLint pass.

### Newsletter launch-safe state (2026-10-25)

- **Decision:** the newsletter is disabled for launch. There are no production subscribers, and no new addresses are collected until the compliant flow exists. Supersedes the "Mailing list (unresolved)" note in the Privacy core section below.
- **Homepage:** `MailingList` keeps its section, grid and `07 — Mailing list` index. Its `h2` (`#mailing-title`, the section's accessible name) now reads "Mailing list", with the serif lede "Coming later." and a mono status line: "Signup is not open yet. Until then, new dates and releases go out on Instagram and Facebook" (existing `BAND_PROFILES` links via `NewTabLink`). No form, input, button or disabled control is rendered. `NewsletterForm` is unmounted but kept unchanged for the future phase.
- **API:** `lib/newsletter.ts` exports `NEWSLETTER_SIGNUP_ENABLED = false`, a code constant on purpose rather than an env flag (no existing feature-flag pattern; no deployment setting can switch collection on). `POST /api/newsletter` checks it first and returns `503 { error: "Mailing list signup is not available.", code: "NEWSLETTER_DISABLED" }` before reading the body or touching Prisma, so it cannot create or reactivate rows (including `UNSUBSCRIBED`). The original handler below the guard, the Prisma model and statuses (`PENDING`/`ACTIVE`/`UNSUBSCRIBED`/`BOUNCED`) and the route are retained. No existing rows were read, deleted or changed.
- **Privacy page:** only the mailing-list wording changed (EN + FR): the mailing-list paragraph (signup not open, no newsletter sent, future signup requires explicit consent, address confirmation and an unsubscribe link in every email), its retention bullet (no sign-ups accepted; periods stated before opening) and the consent-withdrawal right, which no longer cites a mailing-list example. "Last updated" stays 25 October 2026 (same day).
- **Files:** `lib/newsletter.ts` (new), `app/api/newsletter/route.ts`, `app/components/homePage/mailingList/mailingList.tsx` + `.module.css`, `app/privacy/policyEn.tsx`, `app/privacy/policyFr.tsx`, `lib/newsletter.test.ts` (new), `lib/test-component-loader.ts` (new, shared CSS/`next/image` test loader, now also used by `lib/privacy.test.ts`), `lib/public-presentation.test.ts` (old upsert test removed; it asserted the pre-launch behaviour).
- **Before reactivation (all required, dedicated phase):** an informed consent statement at the form (purpose, sender, frequency, privacy link; no pre-ticked box, no bundling); double opt-in with a single-use, expiring confirmation token, the row remaining `PENDING` until confirmed; consent evidence (wording/version, source, request and confirmation timestamps) stored on the subscriber; a working one-click unsubscribe link and the sender identity in every email; unsubscribe sets `UNSUBSCRIBED` immediately and keeps a minimal suppression record; re-subscription of an `UNSUBSCRIBED`/`BOUNCED` address only through a fresh confirmed opt-in, never via upsert; bot/abuse protection on the endpoint; a sending provider with a DPA, listed in `/privacy`; retention for subscriptions stated in `/privacy`; then replace the guarded handler (the retained upsert sets `ACTIVE` and reactivates, so it must not be re-enabled as is), remount a new form and set the flag to `true` together with updated tests. The current "signup is disabled" test is intended to fail if the flag is flipped outside that phase.
- **Verification:** `node --import tsx --test` across `lib/newsletter.test.ts`, `privacy.test.ts`, `public-presentation.test.ts` and the booking/merch/turnstile/concert suites: 61/61 pass. Covered: flag is false; three direct POSTs (new address, possible former subscriber, malformed body) all return the 503 without consuming the body and with zero calls to any `newsletterSubscriber` method; the homepage section renders a level-2 heading and status with no form controls, no `/api/newsletter` reference and no "Join"; both privacy languages state the disabled wording and no longer claim the form records addresses. On the running dev server: direct `POST /api/newsletter` returned the 503 JSON; at 1440, 820 and 375 the homepage has zero forms and email inputs, the section has no controls, no request to `/api/newsletter` is made, the accessibility tree reads region "Mailing list" → heading level 2 → status text and two links, no horizontal overflow, and the layout matches the existing section grid. Type-check and full ESLint pass. No commit or push.

### Privacy / GDPR core (2026-10-25)

- **Scope:** `/privacy` with complete English and French policies, information-only notices on the Booking and Merch forms, a YouTube notice before playback, and a footer Privacy link. No changes to form fields, API routes, newsletter code, schema/migrations, the rider PDF, sitemap, existing metadata, assets or motion. No commit or push.
- **Files:** new `app/privacy/page.tsx`, `policyEn.tsx`, `policyFr.tsx`, `privacyFacts.ts`, `privacy.module.css`, new `lib/privacy.test.ts`; edited `app/components/bookingPage/bookingForm.tsx` + `app/booking/booking.module.css`, `app/components/merch/orderPanel/orderPanel.tsx` + `.module.css`, `app/components/homePage/featuredVideo/featuredVideo.tsx` + `.module.css`, `app/components/footer/footer.tsx` + `.module.css`.
- **Page structure:** one route, no localisation routing. Masthead (`h1` Privacy, "Last updated 25 October 2026 — Dernière mise à jour 25 octobre 2026", EN/FR anchor links), then `section#privacy-en[lang=en]` and `section#privacy-fr[lang=fr]`, each with an `h2` and 13 identical `h3` topics: who we are, in short, booking, merch, mailing list, emails, homepage video, cookies/storage, recipients, transfers, retention, rights, changes. Shared facts (date, session keys, retention months, APD contact, external policy URLs) live in `privacyFacts.ts` so both languages state the same values; a test checks the session keys against `lib/booking-attempt.ts` / `lib/merch-order-attempt.ts`. The page has its own title, description and `canonical: /privacy` (needed so it does not inherit the root `canonical: "/"`); it is **not** added to the sitemap (SEO phase).
- **Notices:** Booking — "We use these details to handle your booking request and to organise the show if it goes ahead. See our Privacy Policy." above the submit row. Merch — "We use your details to handle your merch request and to contact you about availability, payment and delivery. See our Privacy Policy." above "Request order". Both are paragraphs, no checkbox; the links open `/privacy` in a new tab (`NewTabLink`) so a typed booking message or the in-memory cart is not lost. The Booking notice is part of the form, so it is not shown in the Turnstile-unavailable fallback, which collects nothing.
- **YouTube:** "Pressing play loads the video from YouTube (Google), which may then process your data and store identifiers on your device. Privacy Policy" sits under the poster (after the title/YouTube link on mobile). Click-to-load is unchanged: no iframe and no request to any Google host before Play; Play mounts the same `youtube-nocookie.com` iframe.
- **No cookie banner (decision):** no analytics/advertising/social trackers exist; the site sets no cookies (no `Set-Cookie` on `/`, `/privacy`, `/booking`, `/merch`, `/music`, `/concerts`, `/gallery`, `/about` locally; empty `document.cookie`/localStorage). The two sessionStorage UUID keys are strictly necessary for the submission the user started; Turnstile is treated as security for the requested form (defensible, not settled — Cloudflare also uses signals as controller to improve bot detection, which the policy discloses); YouTube is click-to-load with prior notice. A banner becomes necessary if analytics or other non-essential storage is ever added. Re-check production response headers once after deployment.
- **Controller identity (unresolved):** no legal entity, enterprise number, VAT number, postal address or professional phone exists or is invented. The policy says the band does not operate through a separate entity and that its members are responsible, with `contact@untiltheyfall.com` for all requests. GDPR Art. 13(1)(a) expects the controller's identity and contact details; naming the responsible members (or creating an entity) would make this complete. Legal advice recommended.
- **Mailing list (unresolved, behaviour intentionally untouched):** the homepage form is live and `POST /api/newsletter` stores addresses as `ACTIVE`. The policy therefore states truthfully that no newsletter is sent and no newsletter service with confirmation/unsubscribe exists, that the form records the address, and that removal is available by email; it does not describe a marketing flow. Before anything is sent: consent wording/privacy link at the form, double opt-in, unsubscribe in every message, no silent reactivation, and a decision on addresses already collected without information.
- **Retention:** policy periods chosen for the band (not statutory): booking without show 24 months after last exchange; booking with show 24 months after the show; uncompleted merch 12 months after last exchange; completed merch 24 months after delivery; idempotency key/hash kept and deleted with their record; mailing-list addresses until removal request or if no newsletter launches. Accounting/tax retention is stated as conditional on a future setup. **Deletion is manual:** the policy commits to a review at least once a year; no automated job exists.
- **Processors — known:** Vercel (hosting/functions/logs; also fetches the YouTube poster server-side), Railway (database, Ireland region), Resend (emails; DPA provides for EU SCCs), Cloudflare Turnstile (processor for securing the form, controller for improving bot detection per its Turnstile privacy addendum; receives the visitor IP server-side), Google/YouTube (independent controller, only after Play), OVH (email infrastructure for the domain). Access: Davit has database access; current members have access to the band mailbox. **Unknown (stated as unconfirmed on the page):** Vercel processing locations/log retention, Resend storage location/log retention, transfer safeguards other than Resend's SCCs, Cloudflare retention.
- **Minor accessibility note:** `NewTabLink` appends an English "(opens in a new tab)" screen-reader text, including inside the French section.
- **Verification:** `node --import tsx --test lib/privacy.test.ts` (6 tests: session keys match the libs; both language sections, dates and contact render; booking and merch notices precede submit with no checkbox; video renders the notice and no iframe/no `youtube-nocookie` before Play; footer link) plus the existing suites — 59/59 pass. 40 browser checks on the running dev server at 1440 and 375 pass: privacy heading/lang sections/13-13 topic parity/no overflow/FR anchor; footer link navigates; no Google-host request, iframe, cookie or storage before Play, notice visible, `youtube-nocookie` player after Play (no third-party cookies observed in that headless run); no cookie banner; merch notice above submit, new-tab link, no checkbox, intercepted submission payload keys unchanged (`name,email,country,notes,faxNumber,items`) with Idempotency-Key and the session key cleared after save; no cookies/storage on Booking load. The local Booking form shows its Turnstile-unavailable fallback (known local key issue), so the live Booking form notice was verified by rendering the real component, not in the browser; Booking client/API code is unchanged and its tests pass. Merch submission was intercepted: no database write or email. Type-check, full ESLint and `git diff --check` pass.

### Final small cleanup (2026-10-25)

- Booklet: Songs, Story, Credits and Archive are `h2` section headings; tracks are `h3`, under the existing sole album `h1`. Existing classes remain; section-label line-height/case are explicitly retained to neutralize global heading defaults. The sleeve title is the single new internal release-details link, with inherited colour and a restrained hover underline. No facts, credits/personnel, metadata strategy or layout changed.
- Every intentional public new-tab anchor uses `NewTabLink`, which preserves its children/href/classes, sets `target="_blank"` and `rel="noopener noreferrer"`, and appends one screen-reader-only “(opens in a new tab)”. Existing contextual song/show/PDF descriptions remain without duplicate announcements. Internal links, Header behaviour and Booking/Concert reliability logic are unchanged.
- Homepage Merch shares the existing catalogue currency policy through pure `app/lib/formatPrice.ts` (re-exported from `productParts` for existing consumers): integer prices stay compact, fractional euros retain cents. `merchImage()` decides whether a real product photo exists on both surfaces; missing/unrecognized photos become text-only, without a logo or empty photo frame. Existing photographed-product composition/CSS is unchanged.
- Verified cleanup: removed unused `.bg-accent`, `.concertsSection`, `.concertsGrid`; removed unconsumed `recordingNotes` type/data duplication while preserving all structured confirmed credits/airplay/personnel; changed newsletter create-source to `homepage-mailing-list`, matching its current sole form consumer. No existing subscriber records are rewritten.
- Intentionally retained: `.text-muted` (Turnstile consumer), legacy `.container`/other utilities with consumers, dormant `GalleryFull` (eligible concert galleries), `highlightTrack` metadata, and separate two-decimal order/email amount formatters. No broad component/token cleanup.
- Verification: nine automated checks pass (`lib/public-presentation.test.ts` and the existing Concerts resilience tests), including real shared-link markup, fractional/whole-euro prices, the newsletter's mocked normalized upsert and unchanged concert policies. Forty-four isolated browser cases at 1920, 1440 × 900, 820 and 375 cover Music headings, preserved credits/personnel/runtime, exactly one sleeve-details link, external/internal link behaviour and matching homepage/catalogue photo/price policies. Twenty-four before/after comparisons of the actual source and CSS against HEAD retain identical geometry and computed typography/colours (existing animations settled in the test only); 188 visible new-tab link names are verified in the accessibility tree. The fixture uses controlled products/shows, native anchor/image substitutes for Next wrappers and consistent fallback fonts; no database writes or emails. A pre-existing Booking overflow with those fixture fonts is unchanged in the baseline comparison, not fixed here. Repository-wide consumer searches confirm the removed selectors/field/label are unused, and the newsletter form remains the endpoint's sole public consumer. Type-check, full lint and diff whitespace checks pass. No commit or push.

### Concerts / resilience audit follow-up (2026-10-25)

- **Scope:** only dossier navigation, consistent time presentation, poster intrinsic sizing, concert-gallery outage handling and sitemap resilience. No concert facts, photo associations, assets, redirects, Booking, Merch or Music behaviour changed.
- **Navigation:** homepage Live and Tour Poster multi-date upcoming lists now link the city to `/concerts/[slug]` even when Tickets is present. The city retains its existing colour/type with a restrained hover underline. Tickets remains a separate external anchor; the archive's existing dossier row links and past-ticket suppression are unchanged.
- **Times:** homepage featured Live and Tour Poster featured show now use the existing `reliableTimes()` helper, as the dossier and Event structured data already do. Identical doors/show times are omitted consistently, without changing or inventing source times.
- **Posters:** `app/lib/concertPosters.ts` holds measured metadata; `mapConcert()` attaches `posterDimensions` for the actual served URL, after optimization mapping. Shared `ConcertPoster` renders all three surfaces with real intrinsic dimensions. Sharp metadata confirms Arlon optimized WebP **1400 × 733**, Arlon original JPEG **1920 × 1005**, Braine WebP **1440 × 1440**. No assets were edited. Unknown future URLs deliberately use a natural-ratio native image without invented dimensions; add verified metadata for those files to reserve their space before loading. On mobile/tablet only, dossier `.poster` and archive `.yearPosters` explicitly reserve their existing full width: pending images otherwise allowed these flex items to shrink. Final rendered size, natural ratio and colours remain unchanged.
- **Concert gallery:** retrieval exceptions are logged server-side and render “Photos temporarily unavailable”, using the existing Show Unavailable composition with links to the show and Live archive. Unknown shows and known shows with zero `confirmedPhotos()` still return 404. Eligibility still requires an explicit catalogue `event` equal to the show slug; stored generic gallery paths alone never qualify. The legacy viewer is unchanged.
- **Sitemap:** concert-query exceptions are logged server-side; static routes and known release routes still return successfully. Dynamic entries are omitted during an outage. `/concerts/past` and `/gallery/concert-photos` redirect-only aliases are omitted; redirects themselves are unchanged. Gallery entries use the same `confirmedPhotos()` eligibility as the route. Generated `lastModified` values are removed because no truthful per-page modification timestamps are available in the presentation data.
- **Verification:** six automated checks in `lib/concert-resilience.test.ts` cover time policy, metadata against actual image files, optimized-path mapping, sitemap eligibility/redirect exclusion and database outage fallback. Isolated rendering of the actual components/route additionally checks gallery outage, unknown/ineligible 404s, an explicitly associated fixture photo, separate ticket/dossier links, reliable/identical times and past ticket suppression. Forty browser cases at **1920, 1440 × 900, 820 and 375** verify no horizontal overflow or nested anchors and stable image boxes before/after loading (image requests paused through CDP). The outage sitemap uses Next's actual XML serializer; the local fixture responds HTTP 200 and the browser parses its eight static/release entries without XML errors. These outage/eligible-gallery scenarios use controlled test data, not production DB changes; no current catalogue photos have a confirmed show association. Type-check, lint and diff whitespace checks pass. No commit or push.
- **Remaining data uncertainty:** Braine's identical times, Arlon/Braine line-up discrepancies, Namur's note, Brussels/Bruxelles naming and unconfirmed photo/event associations remain separate content tasks. No facts were corrected here.

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
| 7 | ActionHub removal, Mailing list, Booking / Contact, Footer refinement, page rhythm review | Done. The homepage structure is complete |
| 8 | `/music` page ("Sleeve") | Done |
| 9 | `/music/[slug]` release page ("Booklet") | Done |
| 10 | `/concerts` ("Tour Poster") + `/concerts/past` redirect | Done |
| 11 | `/concerts/[slug]` show page ("Show Dossier") | Done |
| 12 | `/gallery` ("Photo Book"), photo catalogue cleanup, shared `PhotoViewer`, `/gallery/concert-photos` redirect | Done |
| 13 | `/about` ("Band Profile") | Done |
| 14 | `/merch` ("Band Catalogue") | Done; superseded in structure by 14.1 |
| 14.1 | `/merch` Hybrid: Featured + All items + order-request drawer | Done (14.2 included) |
| 15 | `/booking` ("Booking Sheet") + shared contact constant | Done |
| Next | Remaining deployment/environment confirmations; Legal/RGPD/SEO; merch sizes/variants; press pack; assets; motion | Deferred; see current unresolved summary above. Album personnel and concert resilience are resolved |

## Visual foundation (Phase 3)

- Fonts: Archivo (display/body, `wdth` axis loaded), Newsreader italic (serif accents), IBM Plex Mono (metadata). The `next/font` variable classes sit on `<html>`; they must stay there because the `:root` tokens reference them.
- Palette in `app/globals.css`: `--ink #0b0b0a`, `--char`, `--bone #e8e3d9`, `--bone-dim`, `--grey`, `--ember #a8321c` (fills), `--ember-text #e0563a` (text and focus).
- Legacy tokens remapped globally: accent becomes ember, radius becomes 0, glow and shadow are removed. Hard-coded radii in untouched components still show.
- Grid: 12 columns, `--margin clamp(16px, 4vw, 56px)`, `--gap clamp(12px, 1.6vw, 24px)`, spacing `--space-s/m/l`.
- Grain: static `public/textures/grain.png` on `body::after`, opacity 0.06.
- Global helpers: `.action-link` (with `.on-bone`), `.meta`, `.srOnly`, flat `.button`.

### Shared focus-outline contrast correction

- **Cause:** the global `:focus-visible` outline used `--ember-text` (#e0563a) regardless of surface. Its contrast against bone (#e8e3d9) is 2.952:1, below 3:1.
- **Strategy:** the single global outline rule now uses inherited `--focus-outline`, defaulting to existing bright `--ember-text` on dark surfaces. Existing bone-surface rules and `.action-link.on-bone` set it to existing dark `--ember` (#a8321c). The homepage release's transparent metadata sheet gets the light-context token because its bone plane is a separate positioned sibling. No arbitrary colours, duplicated focus rules, new markup/classes or component logic were added. Width stays 2px and offset stays 3px.
- **CSS files:** `app/globals.css`; light-context token declarations only in `app/about/about.module.css`, `app/booking/booking.module.css`, `app/merch/merch.module.css`, `app/music/[slug]/releasePage.module.css`, `app/components/concerts/tourPoster/tourPoster.module.css`, `app/components/concerts/showDossier/showDossier.module.css`, `app/components/gallery/photoBook/photoBook.module.css`, `app/components/music/releaseSleeve/releaseSleeve.module.css`, and homepage `bookingContact`, `featuredMerch`, `featuredRelease`, `galleryTeaser` module styles. Dark dialogs remain outside the light scopes and retain the bright token. No Header/menu logic, Booking/Merch/Music behaviour/data, layout or other accessibility findings changed.
- **Contrast:** dark ember on bone = **5.233:1**; bright ember on ink = **5.215:1**, on char = **4.830:1**, on legacy dark surface #1f1d1b = **4.450:1** (sRGB relative-luminance calculation). Existing Booking/Merch/newsletter field overrides intentionally keep their underline focus treatment; it uses bright ember on dark backgrounds and was not altered.
- **Verification:** 30 representative keyboard-mode focus checks on server-rendered `/`, `/music`, `/music/sent-to-die`, `/concerts`, `/gallery`, `/about`, `/merch`, `/booking` pass for inherited colours, `:focus-visible`, unchanged 2px/3px geometry and the existing newsletter underline. These stylesheet checks blocked client bundles to avoid focus shifts during dev hydration. An isolated interactive fixture of the actual Merch/Booking/Gallery components and CSS adds 16 passing desktop/mobile checks: bone product buttons, dark order trigger/dialog controls and field underlines, a usable Booking form, photo triggers on ink and bone, and dark viewer controls without light-token leakage. Photo indicators remain offset outside the images on their surrounding section surface. The fixture used mock products and disabled Booking verification only through component props; no configuration edits or submissions. Pointer-click focus behaviour also passes. A normalized comparison of all 13 changed CSS files against HEAD proves that hover/active rules, geometry, component overrides and layout are unchanged apart from focus-colour tokens. No existing focus-specific test suite was present. Type-check (`tsc --noEmit --incremental false`), full ESLint and `git diff --check` pass. No commits or pushes.

### Shared main landmark and native skip link

- **Cause/ownership:** the homepage returned sections without a main landmark, while other routes each owned a main; no global skip link existed. `app/layout.tsx` now renders one `<main id="main-content" tabIndex={-1}>` around page children, between the unchanged shared Header and Footer. This provides the same target for public pages and their empty/unavailable/not-found content. No nested mains remain in application source.
- **Route reconciliation:** existing `<main>` wrappers became `<div>` with identical classes/props/children in `app/about/page.tsx`, `app/booking/page.tsx`, `app/music/page.tsx`, `app/music/[slug]/page.tsx`, `app/merch/merchView.tsx`, `app/concerts/[slug]/gallery/page.tsx`, `app/components/concerts/tourPoster/tourPoster.tsx`, `app/components/concerts/showDossier/showDossier.tsx` (including ShowUnavailable), and `app/components/gallery/photoBook/photoBook.tsx`. A source comparison confirms these nine files changed only those tags. Homepage composition needed no edits; its existing fragment is now inside the layout's main.
- **Skip link:** the first focusable element in the root body is the native anchor “Skip to content” → `#main-content`. New `.skip-link` CSS in `app/globals.css` positions it off-canvas normally and reveals it on `:focus-visible`, fixed at 12px from the top and the existing page margin, with z-index 100 above Header (60) and grain (90). Compact mono text, sharp 1px ember border, ink background and bone text use the existing palette. Text contrast is 15.397:1 and existing focus/border ember contrast is 5.215:1 on ink. Global focus-colour logic and outline geometry were not modified.
- **Native focus/scroll:** negative tab index makes main a focus destination without adding a regular Tab stop. Native anchor activation focuses main; the next Tab starts in content (or Footer on a noninteractive 404). `#main-content` uses `scroll-margin-top: calc(var(--header-h) + 16px)` for Header clearance, with the existing responsive Header-height token. No client JavaScript/event handlers were added. Existing `#live`, `#booking-request` and archive anchors/redirects are unchanged.
- **Verification:** 34 passing desktop/mobile cases at 1440/375px: live `/`, `/music`, `/music/sent-to-die`, `/concerts`, `/concerts/utf-arlon`, `/gallery`, `/about`, `/merch`, `/booking`, and standard unknown-route 404 (20 cases); isolated SSR fixtures using the actual RootLayout and actual Merch unavailable/empty, Concerts unavailable/empty, ShowUnavailable and Booking unavailable components (12 cases); and the installed Next.js default not-found component inside actual RootLayout (2 cases). Checks cover first Tab, readable/visible link above Header, native Enter activation/main focus without client scripts, the next Tab bypassing navigation, one DOM/accessibility-tree main, no nesting, Header/Footer outside main, hidden link on pointer/page-load state, and content clear of Header. Before/after geometry of Header, Footer, headings and sections matches within pixel rounding across the 20 live cases; no desktop/mobile overflow or composition changes. Existing Home Live and Booking request anchors pass at both widths; `/concerts/past` and `/gallery/concert-photos` redirects retain one main/skip link. No existing landmark-specific automated suite was present. Type-check, full ESLint and `git diff --check` pass.
- **Verification limitation:** live dynamic `notFound()` requests (`/music/does-not-exist` and the currently unavailable legacy concert gallery URL) returned the dev server's empty client-fallback shell, so their full browser rendering could not be verified, including in a fresh browser with client scripts enabled. The standard 404 and the installed default not-found component rendered with the actual root layout both passed. No unrelated routing/framework changes were made.
- Only root markup, skip/target CSS, the listed wrapper tags and this note changed. Booking validation/Turnstile/idempotency, Merch/Music data and behaviour, Header behaviour/appearance, existing focus-colour logic and other audit findings were untouched. No commits or pushes.

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

### Header mobile-menu resize cleanup

- **Cause:** `header.module.css` hides the mobile panel/toggle above 980px, but the React menu state stayed open. Its scroll-lock effect therefore retained `body.style.overflow = "hidden"` and the menu keyboard listener on desktop.
- **Fix:** `app/components/header/header.tsx` now observes `matchMedia("(max-width: 980px)")` while open, exactly matching the existing Header CSS query (no shared breakpoint source existed). The initial check and media-query change callback close the menu when it no longer matches. There are no new CSS rules or visual/navigation/animation changes.
- **Cleanup ownership:** the existing `[open]` effect remains the sole owner of the body's inline overflow value. Closing normally, clicking a navigation link, Escape, crossing into desktop, or unmounting restores the captured previous value and removes the keyboard and media-query listeners. Closed state also removes `panelOpen`, restores `inert` and sets `aria-expanded` false through the existing JSX. Returning to mobile starts closed and can open normally.
- **Verification:** isolated browser tests of the actual Header and CSS, with SSR hydration and stubbed Next navigation, pass open/lock, normal close, navigation close, Escape, unmount, previous inline overflow restoration, and repeated 375→981→375, 820→1440→820, 980→981→980 and 375→1200→375 cycles. The menu stays open/locked at exactly 980px, closes above it, desktop wheel scrolling works, and all tracked open-menu keyboard/media listeners are removed. Desktop primary navigation remains visible and the toggle hidden. No hydration/resize warnings. The running Next dev page was slow to attach client handlers, so these interaction checks used the isolated hydrated Header fixture. No existing Header-specific automated tests were present. Type-check (`tsc --noEmit --incremental false`), full ESLint and `git diff --check` pass.
- Only the Header state/cleanup code and this handoff note changed. No Booking, Merch, Music, layout, unrelated accessibility/styles or other audit work. No commits or pushes.

## Resilience retained (resolved)

- Homepage Merch, `/merch`, homepage Live and `/concerts` retain their fetch guards and distinct unavailable states. Homepage Merch receives `null` on a failure, not an empty list, so its email/catalogue fallback remains visible.
- Dossier/gallery and sitemap outage handling are resolved in the Concerts follow-up. These guards are intentional production resilience, not temporary local-DB workarounds to remove.
- ActionHub and its duplicate next-show block were removed in Phase 7.

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
  - **Liner notes (bone):** `story` in serif italic, and a colophon of confirmed `credits`, `airplay`, release-specific Recording personnel, and "Live dates →". The original Phase 8 current-member block was replaced by the confirmed historical personnel correction below.
- No iframe, cards, radii, glow, pills, "For fans of", "Sound" or "Inside the record".
- At 900px and below: full-bleed artwork, then meta, title, **streaming links before the tracklist** (listening is the main mobile action), tracklist, total, and stacked liner notes. Colophon rows stack label over value at ≤480px.
- SEO metadata is unchanged.

**Data model** (`app/lib/music.ts`)
- `Release.coverMaster?`: the high-resolution artwork path (`/album-cover.jpg`, 1875px) for large presentations; `cover` stays the 1000px optimized file used elsewhere.
- `Release.airplay?: { track, station }[]`: structured airplay data (Uprising — Classic 21; Wrath Of Gaia — Radio Panik), replacing the sentence form on `/music`.
- `credits` is documented as confirmed-only. Unchanged values: Recorded — Project Zero Studio; Produced — Yarne Heylen.
- Current state: recording personnel comes only from the shared release record, never `about.ts`. The old hard-coded `bandCredits` / `productionCredits` / `fanRefs` remain removed.
- Historical `recordingNotes` was superseded by structured credits/airplay in Phase 9 and its unused type/data was removed in the final cleanup. Unconfirmed mix/master claims are not rendered.

**Not changed in Phase 8:** `/music/[slug]` (rebuilt in Phase 9).

**Verification (Phase 8)**
- `tsc` passes; eslint passes on the changed files.
- Playwright at 1920, 1440, 820 and 375 on `/music` plus a temporary multi-release preview (a mock single plus the mirrored album; since removed): no horizontal overflow, no errors, no iframes.
- The artwork is fully above the fold at 1440 and 1920.
- Links checked 22.10.2026: Spotify and Apple Music resolve to the album. The YouTube Music link resolves (HTTP 200) to the first track of the "Sent To Die" album playlist on the "Until They Fall - Topic" channel, so it works; normalization can wait.

**Unverified data (do not treat as confirmed)**
- **Tracklist/durations:** corrected to the supplied audited eight-track edition and derived 41:25 runtime in Phase 9.1 below; supersedes the previous seven-track/29:45 data.
- **Mix/master credit:** unconfirmed and not rendered; deleting unused `recordingNotes` does not establish those roles as facts.
- **Artwork credit:** not published anywhere on `/music`. The old page's "Artwork: Until They Fall" is removed until confirmed.
- **Bandcamp:** hidden until the link is confirmed.
- **Line-up for the album:** the misleading current-member colophon was removed in the album personnel correction below. Subsequently confirmed historical performers are now rendered separately as Recording personnel (see below).

## Phase 9: `/music/[slug]` ("Booklet")

Hierarchy: homepage = teaser, `/music` = record sleeve, `/music/[slug]` = full booklet / archive entry.

**Composition** (`app/music/[slug]/page.tsx`, `releasePage.module.css`, both rewritten)
- Breadcrumb in mono (`Music / Sent To Die`, with `aria-current`).
- **I. Cover spread (ink):**
  - the `coverMaster` artwork as a centred, uncropped plate (`object-fit: contain`, `min(100%, 86svh)`);
  - a caption with a roman marker, a mono line (type — date — tracks — runtime) and the **only** `h1` (the release title);
  - a listen row directly under it: plain ruled links side by side on desktop, stacked 48px rows on mobile.
- **II. Songs (bone):** each track as an oversized numbered chapter: mono number, title as an `h3` beneath the Songs `h2` in large condensed type (semantic cleanup; appearance unchanged), mono duration. A note line appears **only with real data**: "Single" (ember), "Airplay — station" (matched from `airplay`), "Video ↗" (from the new `videoId`).
- **III. Story (bone):** `release.story` in large serif italic, columns 4–10. It is not rendered without a story; there is no fallback copy.
- **IV. Credits (ink):** only confirmed data, in columns: Recording (`credits`) and Broadcast (`airplay`). Personnel was initially omitted; the four subsequently confirmed 2023 performers now render as release-specific Recording personnel (see correction below). Mix/master, artwork, label and catalogue are omitted.
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
- `recordingNotes` was not rendered after Phase 9 and its unused type/data was removed in the final cleanup. Structured confirmed credits, airplay and historical personnel remain authoritative. `highlightTrack` remains non-rendered metadata, intentionally untouched.

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

### Phase 9.1: Sent To Die tracklist and runtime correction

- Only the authoritative release record in `app/lib/music.ts` changed: `27-09-2020` (1:08), `Sent To Die` (5:08), `Doppelgänger` (3:40), `Uprising` (5:19), `Wrath Of Gaïa` (6:01), `Free` (7:41), `Armenia` (6:14), `One Final Ode` (6:14), in that order. The existing `getRuntime` in `app/lib/release.ts` already sums track durations, so all three surfaces inherit **41:25** without a second stored total or helper/component changes.
- Existing track IDs `t1`–`t7` remain attached to their original songs; the intro uses the unique ID `t0` and has no single/video/airplay metadata. Release slug `sent-to-die` is unchanged. The single flag and official video `9Wvpovk_Tg4` remain on `Sent To Die`, now track 02. `Uprising` / Classic 21 remains track 04; `Wrath Of Gaïa` / Radio Panik remains track 05. The latter title is corrected in the airplay entry and existing recording-note sentence so exact-title association still works. Streaming destinations, artwork, release date, story and confirmed credits are unchanged. No album personnel/current-line-up work was done.
- Verification: assertions against the supplied audited edition pass for exact order, Unicode, all eight durations, unique track/release IDs, derived runtime, no invented intro metadata, and preservation of existing IDs/video/single flags and other release metadata. No existing release-specific test suite was present and no test files were added for this data-only correction. Browser checks on the running site pass at 1440, 820 and 375px: homepage Latest Release shows 08 tracks / 41:25; `/music` and `/music/sent-to-die` render all eight songs with correct lengths and 41:25; the official video and both airplay associations stay on the correct songs. No horizontal overflow or overlapping track rows. Type-check (`tsc --noEmit --incremental false`), full ESLint and `git diff --check` pass.
- Facts follow the edition supplied in the audit request; no additional release facts were inferred or independently researched. Existing personnel and unconfirmed-credit questions remain deferred. No layout, motion, accessibility, Booking or Merch changes; no commits or pushes.

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

**Confirmed photos** (historical Phase 11 implementation; superseded by Phase 12 and the Concerts follow-up)
- Current rule: only catalogue photos with an explicit `event` equal to the show slug qualify. No current photos have that confirmed association. The city-based behaviour recorded below is historical, not a current eligibility rule.
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

**Kept at Phase 11:** `GalleryFull` and the concert gallery route. Current state: only eligible `/concerts/[slug]/gallery` uses the viewer; `/gallery/concert-photos` is a redirect, and outage/eligibility handling is resolved.

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

## Album personnel correction (resolved)

The current member data includes **Valentin Coutant (joined 2024)** and **Krys Bader (joined 2025)**, after the 01.12.2023 album release. Current membership is not evidence of recording personnel.
- Removed the complete "Line-up" definition list and `members` import from `app/components/music/releaseSleeve/releaseSleeve.tsx`. At that removal stage `/music` omitted album personnel instead of importing the current band; the confirmed historical list was subsequently added below. No replacement heading, disclaimer or guessed former members were added. The existing flex stack closes the removed block's space without CSS/layout changes.
- At the removal stage, `/music/sent-to-die` already omitted Personnel and needed no code changes. No verified performer list was available then; the subsequent confirmed recording-personnel addition is documented below. Confirmed Recorded — Project Zero Studio and Produced — Yarne Heylen credits, airplay, tracklist/runtime and all other release data remained unchanged.
- `/about`, `app/lib/about.ts`, current-member listings, homepage/current-band identity and Booking's five-member facts were not edited. Historical performers were left omitted until the release-specific confirmation below.
- Verification: browser checks at 1440, 820 and 375px confirm both Music pages contain no current-member personnel or empty personnel heading, retain the exact recording/production credits, eight songs and 41:25, and have no horizontal overflow. `/music` has only the remaining credit list and Live dates link in its colophon, separated by the existing CSS gap, with no empty personnel spacer. `/about` still displays Valentin and Krys at all three widths. No existing tests target this presentation; no test files were added for the block removal. Type-check (`tsc --noEmit --incremental false`), full ESLint and `git diff --check` pass. No commits or pushes.

### Confirmed Sent To Die (2023) recording personnel

- Added optional release-level `recordingPersonnel: { name: string; role: string }[]` to `Release` in `app/lib/music.ts`. The shared Sent To Die record contains exactly the user-confirmed 2023 recording credits: Remy Vanbruaene — Vocals; Davit Nersesyan — Guitars, Bass; Kevin Estrada — Guitar; Sabari Diakite — Drums.
- `/music` renders the list as **Recording personnel** inside the existing liner-note colophon; `/music/sent-to-die` renders it as another metadata list inside the existing Credits area. Both use the existing typography/classes and render only when this release-specific array is nonempty. Their enclosing notes/credits conditions also support personnel-only release data. No current `members` import or generic Line-up heading is reintroduced, and no historical performer is inferred from current membership.
- Existing production credits, release story, tracks/runtime, video/airplay associations and all other release values are unchanged. `/about`, member data/join years, current-band surfaces, Booking's five-member fact, Merch, CSS/layout and accessibility were not changed.
- Verification: browser checks pass for both Music pages at 1440, 820 and 375px: one Recording personnel block, the four exact names/roles, no Valentin/Krys or conflicting Line-up heading, unchanged production credits/eight songs/41:25, no empty rows or overlapping personnel rows, and no horizontal overflow. Temporary rendering checks against the actual sleeve/booklet components verify absent/empty personnel produces no heading/block. A data comparison confirms all prior release values are unchanged except the new personnel array. No existing Music-specific tests were present. Type-check, full ESLint and `git diff --check` pass. No commits or pushes.

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

### Phase 14.3: saved merch requests with incomplete email delivery

- **Root cause fixed:** an order could be stored successfully, then receive HTTP 502 because an email failed. The client treated the request as failed and retained its cart, encouraging another submission.
- `/api/merch/order` now returns HTTP 200 with `success: true`, `stored: true`, `orderId`, `orderNumber`, existing per-email flags (`emailed` = band notification; `confirmationEmailed` = customer confirmation), and `notificationStatus: "complete" | "incomplete"` for every confirmed saved order. Either or both failed emails produce incomplete notification delivery, not an order failure. Synchronous email/template errors are isolated too. Storage failures return `success: false`, `stored: false` with a safe public message; provider/database diagnostics remain server-side. Stock, price, shipping, schema and email content are unchanged.
- The client prioritises confirmed persistence, including legacy saved/502 responses, and uses a distinct `success-with-warning` state. It displays the saved reference, explains that not all order emails were delivered, says not to submit again and to keep the reference, and offers the shared public contact email. Normal success retains its existing message.
- **Cart choice:** reuse the existing normal-success behaviour as soon as the server confirms storage: clear the cart and reset customer fields. The request can no longer be resubmitted from that cart; the saved reference/warning remains visible in the drawer, including after closing/reopening it. Genuine storage failure retains the cart and fields. No layout/CSS or pre-submission quantity-control changes.
- **Verified:** 10 automated API/response-state checks covering both emails sent, each individual failure, both failures, synchronous email failure, storage failure, reference retention and safe public responses. The actual client/drawer passed 12 isolated browser scenarios at 1440px and 375px, covering those delivery combinations, retained cart on storage failure, and legacy saved/502 responses. Database/email calls were mocked; browser submissions were intercepted. Type-check and full-repository lint pass.
- **At this phase:** idempotency / duplicate-order protection was deliberately deferred. It is now addressed in Phase 14.4 below.

### Phase 14.4: server-enforced Merch order idempotency

- Each checkout attempt generates an internal UUID v4 before submission and sends it in the `Idempotency-Key` header. The client retains it after network/API uncertainty; session storage retains only the opaque key across reloads (no customer/cart data). A confirmed saved response clears the key along with the existing cart/form reset. Starting the next checkout creates a new key. When session storage is blocked, retries still retain the key while the component remains mounted. Simultaneous client submits also share an in-flight guard; database uniqueness is the actual guarantee.
- **Schema/migration:** `CustomerOrder.idempotencyKey String? @unique`, `idempotencyRequestHash String?`, `merchNotificationResult Json?`. Migration: `prisma/migrations/20261023120000_merch_order_idempotency/migration.sql`. The change is additive and leaves existing orders with NULL keys. The request hash binds a key to the normalized customer/cart details; changing those details after that key has been stored returns a safe 409 instead of silently replacing an order.
- **Server:** validates new attempts using the existing customer, stock, pricing and shipping logic. The order/items and key are created atomically in the existing nested create. A duplicate finds the original row; concurrent unique-key conflicts (`P2002`) also resolve to that row. Responses retain the original public reference, include `alreadyProcessed: true`, and never expose the internal key/hash. Different keys may create legitimate identical orders.
- **Notifications:** only the request that creates the row sends the existing band/customer email pair. Delivery flags are recorded on the order for replay. Duplicates never automatically resend either email, even after incomplete delivery. While the first request is still processing, or if it stopped before recording delivery status, replay reports saved with `notificationStatus: "pending"`, the original reference and a restrained message that email status is not yet confirmed. An interrupted notification process requires separate operational follow-up; a retry cannot trigger duplicate emails. Existing complete/incomplete delivery handling and cart clearing remain intact.
- **Verified:** real disposable PostgreSQL tests cover new/sequential/concurrent (16 simultaneous requests), lost-response retries, separate identical checkouts, changed-payload conflicts, incomplete/pending notification replay, server prices, stock rejection/capping and shipping. Browser → actual API → disposable PostgreSQL checks dropped a saved response, retried after reload with the same key/reference and no extra order/email, then completed a new checkout with a new key. Internal keys were absent from the rendered UI. Notification sends were mocked; no real emails or production orders were created. API/helper tests, type-check, full-repository lint and Prisma schema validation pass.
- **Deployment requirement:** migration created and Prisma client regenerated locally, but the site's configured database was not changed. Apply the additive migration before deploying/running this API. There was no previous migration history in this repository; see `prisma/migrations/README.md` for the existing-database/baselining caveat. No destructive operations, Booking/Music/layout changes, commits or pushes.

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

### Phase 15.1: Turnstile site-key guard (historical; superseded by 15.2)

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

### Phase 15.3: Booking saved request / incomplete email delivery

- **Cause:** the API already returned separate band/promoter email booleans, but the client ignored them and displayed the same success for every HTTP success. A synchronous email-send/template exception could also escape the delivery handling after storage.
- **API:** `/api/booking` (the existing `/api/send` handler) returns HTTP 200 with `success: true`, `stored: true`, the existing `bookingRequestId`, `emailed` (band), `confirmationEmailed` (promoter), and `notificationStatus: "complete" | "incomplete"`. Either/both failed deliveries remain saved outcomes. Each email operation is deferred inside `Promise.allSettled`, including synchronous errors; provider details remain in server logs. Storage failure remains the safe HTTP 500 error, now explicitly `success: false, stored: false`; no emails are attempted.
- **Client/form:** only explicit saved confirmation resets the form. Complete delivery preserves the existing success message and adds the reference. Incomplete delivery uses the existing result area/styles to say the request was saved, email delivery was incomplete, do not submit again, keep the reference, and contact `contact@untiltheyfall.com` via a mailto link if needed. The reset form retains the result/reference until another submission starts. Storage failure preserves entered data for retry. No fields, validation, CSS/layout, email content, or Turnstile behaviour/configuration changed.
- **Reference:** reuse the existing opaque CUID returned as `bookingRequestId`, labelled “Booking reference”. It identifies the saved row directly for support; it is already exposed by this endpoint and grants no access to request data. No additional public lookup endpoint, schema change, migration, or environment correction is needed for this fix.
- **Verification:** `node --import tsx --test lib/booking-api.test.ts lib/turnstile.test.ts` passes (18 tests), covering all four email outcomes, synchronous email failure, storage failure/no email attempts, safe responses, explicit persistence parsing, and existing Turnstile checks. An isolated browser fixture using the real client/form/widget with mocked network/provider runs all five outcomes with Turnstile enabled and disabled (10 passing flows): correct reference/warning/mailto, unchanged fields, no retry message for saved requests, reset after storage and preserved data after storage failure, token submission and widget reset. No real booking/email was sent. Type-check (`tsc --noEmit --incremental false`) and full ESLint pass.
- **Historical Phase 15.3 limitation, resolved by Phase 15.4:** duplicate protection was deliberately absent in that pass. Same-key retries are now protected server-side; different keys remain distinct attempts.

### Phase 15.4: Booking duplicate-submission protection

- **Strategy:** the client generates a UUID v4 before sending a validated Booking request, sends it as `Idempotency-Key`, and retains it in session storage through network/API uncertainty and reloads within the same tab. Only the UUID is stored locally, never promoter details. A confirmed saved result retires it; the next Booking gets a fresh UUID. A synchronous submission guard also prevents accidental double dispatch. If session storage is unavailable, the client does not send an unpersisted attempt. The key never appears in visitor-facing output; the existing booking reference and saved/warning UI remain unchanged.
- **Server and binding:** normal form validation still runs. A SHA-256 hash of the normalized validated fields binds the UUID to the request, excluding the Turnstile token/honeypot. Existing matching keys return HTTP 200 with the original `bookingRequestId`, stored delivery outcome and `alreadyProcessed: true`; changed contents return a safe HTTP 409 without changing or creating a booking. Missing/invalid keys return a safe HTTP 400. New keys still require the existing Turnstile verification before persistence. Saved retries do not consume another verification token or resend emails. Different keys with identical details remain separate legitimate bookings.
- **Concurrency:** PostgreSQL's unique index on the nullable Booking `idempotencyKey` is authoritative. The request and hash are inserted together. A concurrent unique-key loser reads the winner, checks the hash and replays the saved result; no process-local cache or time/content heuristic is used.
- **Notification replay:** only the request that inserted the row sends the band/promoter emails. Its safe result is recorded in `bookingNotificationResult`. Duplicate requests never send either email, including after incomplete delivery. If notification processing is in flight/interrupted or its result could not be recorded, replay conservatively reports saved + incomplete delivery with the original reference. Failure to record notification status cannot turn confirmed persistence into a failed request. No automatic notification recovery/retry is added; the existing public email fallback remains available.
- **Schema/deployment:** `20261025120000_booking_idempotency/migration.sql` adds three nullable columns to `booking_request`: unique `idempotencyKey`, `idempotencyRequestHash`, and JSONB `bookingNotificationResult`. Existing rows retain NULL values and remain valid. The Prisma client was regenerated locally. **The configured database was not migrated. Apply this additive migration before using/deploying the updated API, regenerate the client, and rebuild/restart the application.** As documented in `prisma/migrations/README.md`, this repository has no original schema migration/baseline: incremental migrations do not initialize an empty database. For an existing database, use the established additive deployment process or baseline it correctly before adopting Prisma Migrate; never reset production to establish migration history.
- **Verification:** Booking API/attempt/Turnstile unit tests pass. Opt-in `lib/booking-idempotency.integration.test.ts` passes against a disposable localhost PostgreSQL database, covering the actual migration over a legacy row; new/sequential/lost-response submissions; a forced eight-insert race (one row, seven unique-key conflicts, two sends); request-content conflicts and normalization; distinct keys with identical data; all notification outcome replays; pending/missing delivery state; notification-state write failure; invalid/missing keys; first-time Turnstile enforcement and token-free saved replay. An isolated browser using the real client, real API and disposable database passes lost HTTP response, double-submit, content conflict, reload/retry with the original UUID/reference, no duplicate email, a fresh UUID/new booking after completion, and no keys in displayed text. Emails were mocked throughout. Type-check, full ESLint and Prisma schema validation pass.
- Supersedes Phase 15.3's outstanding duplicate-protection note for retries carrying the same key. Clearing tab storage/closing the tab or deliberately starting with a different key creates a separate attempt; there is no cross-device/content-based merging. No Merch, Music, Booking layout/form fields, email templates or Turnstile implementation changes. No commits or pushes.

### Phase 15.5: Booking field validation and accessible feedback

- **Scope/cause:** required markers were visual only and invalid submissions exposed only a general message. Added native `required` to the existing required name/email/date/message controls and `noValidate` to the form, preserving email/date types while keeping the custom validation experience authoritative. No additional fields became required.
- **Shared validation:** `lib/booking.ts` now produces field issues once for both validation and field-level feedback (`BookingFieldErrors` / `getBookingFieldErrors`). Required rules, regexes, message minimum (10), all existing maximum lengths (including optional fields), trimming/email normalization, honeypot handling, successful payload construction and general-error priority/messages are unchanged. The Booking API was not edited and still exposes its existing safe general errors, not the internal field map; no API-contract expansion or provider/database detail exposure was added.
- **Form/client:** each invalid visible control receives `aria-invalid="true"` and `aria-describedby="booking-{field}-error"` pointing to a nearby concise error using existing status/error typography. Valid controls omit both attributes; optional fields get feedback only for their existing validation failures. The existing status area says “Please check the highlighted fields” alongside those messages. Errors appear on submit, then update/clear per field on blur after an invalid attempt, with no validation on every keystroke. Updating a field does not move focus. A post-commit effect, triggered only by an invalid-submit counter, focuses the first invalid control in DOM/form order after its description is present. Non-field spam, Turnstile and safe server errors retain general handling without assigning false field errors or redirecting field focus.
- **Preserved flows:** saved requests clear validation tracking with the existing form reset and retain their success/warning/reference; blur checks are suspended while sending so edits during an in-flight request cannot leave stale errors beside a saved result. Storage failure still preserves entered values. Turnstile configuration/widget logic, idempotency logic, result-state contracts, API/database, field labels/order/Required–Optional markers, CSS/global focus styling and layout rules were not changed.
- **Files:** `app/components/bookingPage/bookingForm.tsx`, `app/booking/bookingClient.tsx`, `lib/booking.ts`, new `lib/booking.test.ts`, and this note.
- **Verification:** 31 automated tests pass with `node --import tsx --test lib/booking.test.ts lib/booking-api.test.ts lib/booking-attempt.test.ts lib/turnstile.test.ts`, including exact required fields, email/date/message errors, every length boundary, normalization/general-error priority, saved/email outcomes, attempt lifecycle and verification. A temporary comparison with the previous validator passes 1,705 cases with identical acceptance, success data, honeypot results and general errors after excluding the new internal field map. Browser keyboard checks of the actual client/form/widget in an isolated fixture pass empty Enter submission, all four errors and native required semantics, no native invalid bubbles, name focus with its error in the accessibility-tree description, blur-only correction/no typing focus jumps, email and short-message feedback, stable error associations/removal, optional org errors preceding a later invalid date in form order, mobile overflow, and clean saved reset even after edits while the response is pending. All 10 enabled/disabled Turnstile × complete/band-failed/promoter-failed/both-failed/storage-failed result flows still pass; missing-token and unavailable states remain non-field conditions. Network/provider responses were mocked; no real booking/email or environment edit. Type-check (`tsc --noEmit --incremental false`), full ESLint (no warnings) and `git diff --check` pass. No commits or pushes.

## Unresolved: mobile Hero visual is temporary

- The current live photograph works on desktop, but its mobile crop is not satisfactory.
- A dedicated mobile hero visual will be selected or created later. Candidates:
  - a dedicated vertical live photo;
  - a Gerard visual;
  - a Tower Seven visual;
  - another UTF-specific portrait composition.
- Do not try to solve this further with aggressive `object-position` or cropping.
- The Hero must stay ready to take a dedicated mobile asset. `HERO_IMAGE` in `hero.tsx` is the single place to add it, e.g. a `srcMobile` rendered through `<picture>` / art direction at ≤720px. The layout does not depend on the asset.

## Remaining asset/content limitations and deferred design observations

These notes preserve genuine content/asset questions and accepted composition observations. Resolved code findings are listed in the current summary, not active blockers here.

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

- **Show pages without data (Phase 11):** 10 of 12 shows have only date, city and venue. Their pages are the masthead plus neighbours: a single ink plane with no bone section. This is intentional, but sparse.
- **`/concerts/[slug]/gallery` (not redesigned):** still uses legacy `GalleryFull`, but now accepts only explicit `confirmedPhotos()` associations (no generic DB gallery paths); unknown/ineligible shows return 404 and database failures render the restrained unavailable state. It is linked from the dossier only when more than five confirmed photos exist. Viewer redesign remains outside this batch.
- **Concert data to verify (Phase 11):**
  - Braine doors = show = 18:00 (both omitted until confirmed);
  - Arlon's line-up omits Until They Fall while Braine's includes it;
  - Namur's note "Tremplin Durbuy Rock Fest" is the same label as Arlon's (correct?);
  - the Arlon gallery association (`band1`, `bandall`) is unconfirmed;
  - photo credits now have catalogue fields; permissions, wording and show associations still require confirmation.
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

- **Live list at 1920 (Phase 4):** a wide empty band between the city and venue columns. It is acceptable as poster air, but could be tightened.
- **Featured Live state:** both square Braine and wide Arlon poster ratios were checked in the Concerts follow-up, including reserved sizes before loading. The shorter natural wide-artwork height is intentional.
- **TEMPORARY: visual break asset.** `band1.jpg` stays until a confirmed, credited, clean high-resolution master is available (see Phase 4).

- **Hero photo:** 1920px source, scaled 1.1× to crop out a baked-in border and signature. It is slightly soft on large screens. A clean high-resolution master is needed; swap it via `HERO_IMAGE` in `hero.tsx`, and set `bleed: 1` if it has no border.
- **Logo vs band:** on tablet portrait the logo still crosses the guitarist's legs and the monitor wedge. It is acceptable, but a photo with more empty space on the left would be better.
- **Header mark:** Gerard at 28px is still a smudge. It needs the four-eye SVG; don't invent a new symbol in the meantime.
- **Bone column at 1920:** below the platforms, the bone column runs empty next to the lower cover and the title. It now reads as an open plane rather than a gap, but it could be revisited when the next section is designed.
- **Cover artwork:** its saturated, AI-looking style dominates the section. This is a content issue, not a layout one.
- **Homepage Merch state (resolved):** database failure now retains the bone unavailable section with contact/catalogue links; only a genuinely empty product list omits the section.
- **Ticket verification:** rendering, separate dossier navigation and past-ticket suppression are covered by controlled browser fixtures. External ticket checkout itself has not been exercised.
- **Dev only:** the Next.js dev badge overlaps the lower-left corner on mobile.
