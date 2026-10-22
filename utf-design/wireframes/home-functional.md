# Homepage Wireframe — Functional Structure

This wireframe defines **content order, relative visual weight and responsive behavior only**.

It is **not** a final design and must not be interpreted as a component specification.
Claude / coding agents are expected to propose visual compositions inside this structure while respecting the rest of the design folder.

---

# Desktop Rhythm

```text
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ Logo / Music / Concerts / Merch / Gallery / About / Booking │
│ Tickets when relevant                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         HERO                                 │
│                       ~100vh                                 │
│                                                              │
│                 EXISTING LIVE IMAGE                          │
│                  LARGE UTF LOGO                              │
│                                                              │
│                LISTEN      LIVE                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    LATEST RELEASE                            │
│                  HIGH VISUAL WEIGHT                          │
│                                                              │
│   [                LARGE ARTWORK                ]             │
│                                            TITLE / YEAR      │
│                                            LISTEN ↗          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ LIVE                                                         │
│ VARIABLE HEIGHT DEPENDING ON STATE                           │
│                                                              │
│ 0 dates     → restrained empty state                         │
│ 1 date      → featured-show composition                      │
│ 2+ dates    → typographic tour list                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     VISUAL BREAK                             │
│                     ~70–100vh                                │
│                                                              │
│                 FULL-WIDTH LIVE PHOTO                        │
│                 little or no copy                            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     FEATURED VIDEO                           │
│                                                              │
│           [          LARGE VIDEO POSTER          ]            │
│                                                              │
│       TITLE                                      PLAY ↗      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     GALLERY TEASER                           │
│                                                              │
│       [ LARGE IMAGE ]        [ SMALL IMAGE ]                  │
│                              [ SMALL IMAGE ]                  │
│                                                              │
│                                        VIEW GALLERY ↗        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         ABOUT                                │
│                                                              │
│   SHORT INTRO                           [ BAND PHOTO ]        │
│   ABOUT ↗                                                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         MERCH                                │
│                                                              │
│       [ LARGE PRODUCT ]           [ SECOND PRODUCT ]          │
│                                                              │
│       NAME / PRICE                         SHOP ↗             │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ MAILING LIST                                                 │
│                                                              │
│ JOIN THE LIST                                                │
│ [ email________________________________ ]   JOIN              │
├──────────────────────────────────────────────────────────────┤
│ BOOKING / CONTACT                                            │
│                                                              │
│ contact@untiltheyfall.com                                    │
│ BOOKING ↗             TECH RIDER ↗ if available              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ socials / music platforms / legal / four-eye signature       │
└──────────────────────────────────────────────────────────────┘
```

---

# Section Weight

The page must not feel like eleven equally sized stacked sections.

Suggested pacing:

| Section | Relative weight |
|---|---|
| Hero | Very high |
| Latest Release | Very high |
| Live | Variable / medium |
| Visual Break | Very high visually, very low information |
| Featured Video | High |
| Gallery | Medium-high |
| About | Medium |
| Merch | High |
| Mailing List | Low |
| Booking | Low-medium |
| Footer | Low |

The visitor should experience alternating moments of **impact, information and breathing room**.

---

# Live States

## State A — No public shows

Do not create a large empty card.

```text
LIVE

NO PUBLIC DATES
NEXT ANNOUNCEMENT SOON

CONCERT ARCHIVE ↗
```

The section should remain visually intentional but compact.

## State B — Exactly one show

Treat it as an event, not a one-row table.

```text
NEXT LIVE

17 OCT 2026
EVENT / VENUE
CITY

[ POSTER OR STRONG LIVE IMAGE ]

TICKETS ↗
```

The exact composition is open to exploration.

## State C — Multiple shows

Use a poster/tour-list approach.

```text
LIVE

07.11.26    BRUSSELS    VENUE                  TICKETS ↗
18.12.26    ANTWERP     VENUE                  TICKETS ↗
04.02.27    GHENT       VENUE                  TICKETS ↗

ALL DATES ↗
```

Do not convert each date into a rounded card.

---

# Mobile Structure

Mobile is not a scaled-down desktop screenshot.

Target baseline: **375 px width**.

```text
┌────────────────────────────┐
│ HEADER                     │
│ logo              menu     │
├────────────────────────────┤
│                            │
│ HERO                       │
│ full-height visual         │
│                            │
│ large UTF logo             │
│                            │
│ LISTEN    LIVE             │
├────────────────────────────┤
│ LATEST RELEASE             │
│                            │
│ [ LARGE ARTWORK ]          │
│                            │
│ TITLE                      │
│ LISTEN ↗                   │
├────────────────────────────┤
│ LIVE                       │
│ vertically stacked info    │
├────────────────────────────┤
│ [ FULL-WIDTH PHOTO ]       │
├────────────────────────────┤
│ VIDEO                      │
│ [ POSTER ]                 │
│ PLAY ↗                     │
├────────────────────────────┤
│ GALLERY                    │
│ [ LARGE IMAGE ]            │
│ [ IMAGE ] [ IMAGE ]        │
├────────────────────────────┤
│ ABOUT                      │
│ [ PHOTO ]                  │
│ short text                 │
├────────────────────────────┤
│ MERCH                      │
│ [ PRODUCT ]                │
│ optional second product    │
├────────────────────────────┤
│ MAILING LIST               │
├────────────────────────────┤
│ BOOKING                    │
├────────────────────────────┤
│ FOOTER                     │
└────────────────────────────┘
```

## Mobile rules

- Never depend on hover.
- No four-column concert table at mobile width.
- Critical typography must not be clipped.
- Text over photography must preserve readability.
- Preserve strong image scale rather than shrinking everything into cards.
- Large decorative typography may crop, but never the information needed to use the site.
- CTAs should remain easy to tap.
- Avoid long animations during navigation.
- Respect `prefers-reduced-motion`.

---

# Composition Freedom

Claude may propose different visual solutions for each section.

It is explicitly allowed to:

- overlap type and images;
- shift content off the central grid;
- use oversized typography;
- crop imagery aggressively;
- change background treatment between sections;
- use negative space;
- use the four-eye / Tower Seven language subtly;
- make the visual-break section almost entirely photographic.

It is **not** allowed to change the homepage into a repeated series of cards simply because that is easier to implement.

---

# What This Wireframe Does Not Decide

This file does NOT decide:

- final fonts;
- final colours;
- exact spacing;
- exact CTA styling;
- image crop;
- transition style;
- final copy;
- final texture treatment;
- precise placement of lore motifs.

Those decisions should emerge from the approved references, real UTF assets and design rules.

---

# Implementation Principle

Use this wireframe as a **constraint, not a mockup to reproduce literally**.

The target is:

> Preserve the information architecture and visual hierarchy while finding an authored, non-generic composition for each section.
