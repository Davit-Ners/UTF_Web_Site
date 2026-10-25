# Design Rules

These rules are mandatory unless a specific, justified design decision requires an exception.

---

## 1. Art direction before components

Never begin a section by asking:

> Which component should we use?

Begin with:

> What should the visitor see and feel here?

The implementation follows the composition.

---

## 2. Avoid the SaaS language

### Forbidden by default

Do not use:

- generic SaaS cards
- a rounded container around every content block
- glassmorphism
- decorative blur blobs
- generic purple/blue gradients
- three-column feature grids
- decorative Lucide-style icons
- pills used only to fill space
- repeated badge + heading + copy + CTA patterns
- identical sections stacked vertically
- excessive shadows
- floating dashboard-like panels
- "premium tech" aesthetics
- generic bento grids
- fake terminal UI everywhere
- random glitch effects
- generic cyberpunk neon

These patterns are not absolutely impossible, but they require a strong conceptual reason.

---

## 3. Prefer composition over containers

Content does not need to live inside a box.

Prefer:

- image + typography
- typography over image
- editorial columns
- full-bleed media
- strong alignment
- whitespace
- cropping
- asymmetry
- hard visual cuts
- thin rules
- oversized type

Bad mental model:

```text
[ card
  image
  title
  paragraph
  button
]
```

Better mental model:

```text
TITLE                    YEAR

        LARGE ARTWORK

META
                            LISTEN ↗
```

---

## 4. Typography is part of the artwork

Typography should create visual hierarchy, not merely label sections.

Use scale aggressively.

A release title can be enormous.
A year can be tiny.
A section number can become a graphic element.

Prefer:

- uppercase for selected display elements
- condensed or strong display type
- clear contrast between display and functional text
- oversized headlines
- short labels

Avoid:

- large paragraphs
- centered marketing copy everywhere
- excessive font weights
- decorative fonts for body text

---

## 5. Images carry the identity

Photography and artwork should be more visually important than UI chrome.

Prefer:

- full-width or oversized imagery
- aggressive crops
- live photography
- movement
- grain
- hard contrast
- monochrome or controlled grading
- album artwork shown with confidence

Avoid:

- tiny thumbnails trapped inside cards
- stock-looking imagery
- excessive overlays
- making every image the same ratio

---

## 6. Sharp geometry

The default geometry is:

- square
- sharp
- architectural
- hard-edged

Border radius should be rare.

If used, it must feel intentional, not inherited from a component library.

---

## 7. One dominant idea per section

Every section should have one main visual idea.

Examples:

- Latest release → artwork dominates
- Live → date typography dominates
- Video → frame dominates
- Gallery → image rhythm dominates
- Merch → product photography dominates
- Booking → clarity dominates

Do not make every section compete equally with:

- heading
- copy
- icons
- cards
- buttons
- decorations

---

## 8. Vary the rhythm

Do not create:

```text
section
section
section
section
```

with the same vertical padding and layout.

Use contrast:

- huge → compact
- image-heavy → text-light
- dense → empty
- dark → brighter accent
- centered → asymmetric
- full viewport → narrow strip

The scroll should feel composed.

---

## 9. UI must disappear

Buttons, links and navigation must be usable but should not dominate the visual identity.

Prefer:

- text links with arrows
- simple outlined or filled CTAs
- minimal navigation
- strong hover states
- no unnecessary iconography

---

## 10. The four-eye motif

The four-eye symbol may appear as:

- subtle watermark
- loading state
- section marker
- hover detail
- divider
- cursor interaction
- footer mark
- favicon / secondary symbol

Do not spam it.

The symbol is stronger when it appears deliberately.

---

## 11. Technical details must feel archival, not gamer-like

Tower Seven can inspire:

- coordinates
- timestamps
- system labels
- serial numbers
- chapter numbers
- temperature
- thin technical annotations
- classified-document typography
- inspection marks

Avoid turning the public site into a sci-fi HUD.

The technical layer should support the composition, not become the whole interface.

---

## 12. Motion

Principle: **80% quiet / 20% signature.** Motion behaves like print: plates, rules and registration. Hard edges, short travel, decisive ends, nothing floating.

Motion should be:

- deliberate
- heavy, but never slow to respond
- rare outside functional feedback

Language (approved; status per rule):

- **R4 Cut link** (implemented): the underline is a rule; on hover, keyboard focus and press it snaps to ember and the arrow steps 3px. No colour fades.
- **R6 Functional** (existing menu/drawer motion on shared tokens): fast, conventional, predictable.
- **R1 Plate** (implemented: `.plate` + `<Reveal>`; pilot on the homepage Latest Release cover): an ink shutter retracts from the top edge to uncover a major image or title. The content never moves or fades.
- **R2 Registration** (implemented: `.registration`; used only on the homepage Hero wordmark): one ember copy of the artwork prints 4px/−2px off-register (2px/−1px on phones) and steps into alignment in three hard steps (`steps(3)`), then disappears behind the clean wordmark. No glow, blur, RGB split, loop or jitter.
- **Hero sequence** (the homepage signature; CSS only, from the first paint): 0 ms the photo plate starts retracting top → bottom (R1, 480 ms; 360 ms on phones) while the photo itself stays static; ≈240 ms the wordmark registration prints and snaps (≈210 ms); everything is settled in ≈500 ms. Genre line and actions are static and usable at once. It plays on a real page load and not again on client navigation back to Home in the same tab.
- **R3 Rule cut** (implemented: `.rule-cut` + `<Reveal>`; pilot on the homepage Live top rule): a hairline draws from the left and stops dead; optionally a real label follows (label step not built yet).
- Editorial reveals (R1/R3) are limited to three per page, play once, and never hide content without JS.
- **R5 Four-eye registration** (planned, blocked until the four-eye SVG exists).

Timing tokens live in `app/globals.css` (`--motion-snap`, `--motion-ui`, `--motion-editorial`, `--motion-signature`, `--motion-stagger`, `--ease-press`, `--ease-ui`, `--ease-snap`).

Fixed decisions:

- grain is static, never animated
- no parallax, including subtle parallax
- no image distortion, hover zoom or hover dimming; images stay stable and the caption, action text or rule carries the interaction
- reduced motion removes all displacement and keeps every state and function

Avoid:

- fade-up or translate reveals on scroll
- bouncing and spring animations
- UI flying from every direction
- glitching, looping or random
- animation for every element

---

## 13. Accessibility and performance remain mandatory

Art direction must not break:

- semantic HTML
- readable contrast
- keyboard navigation
- focus states
- reduced motion support
- responsive layout
- image optimisation
- reasonable loading time

The simple website must remain the fast experience.

---

## 14. Copy comes later

During visual exploration:

- use short placeholders
- do not redesign around final copy
- do not invent marketing claims
- do not fill empty space with paragraphs

If a composition only works with a paragraph, reconsider the composition.
