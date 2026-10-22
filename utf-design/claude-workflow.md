# Claude / Coding Agent Workflow

The coding agent is an implementer, not the art director.

Do not ask it to "make the site more modern" or "make it more metal".

Those prompts create generic design.

---

# Phase 1 — Audit only

Use a prompt like:

```text
Read the complete design folder before doing anything.

Analyse the current Until They Fall frontend.

Do not modify any files.

The current problem is that the site feels too much like a SaaS/product website:
cards, rounded containers, grids, pills, generic icons and repeated
eyebrow + title + paragraph + CTA patterns.

Using the design documents as the source of truth:

1. identify the current visual patterns that conflict with the new direction;
2. identify which existing content and functionality should be preserved;
3. propose a new visual grammar;
4. propose a homepage composition section by section;
5. explain how each section avoids generic card-based UI;
6. list reusable visual rules for the rest of the website.

Do not write final copy.
Do not code.
Do not redesign the immersive /world experience.
```

Review the answer manually.

---

# Phase 2 — Layout concepts

For important sections, ask for multiple compositions.

Example:

```text
Do not code yet.

Propose four radically different layouts for the Latest Release section.

Constraints:
- no card
- no rounded container
- artwork must dominate
- maximum two primary actions
- editorial composition
- consistent with the UTF design folder

Show each concept as a simple ASCII wireframe and explain the visual idea.
```

Choose one.

Repeat for Hero if necessary.

---

# Phase 3 — First implementation

Implement only:

- global visual foundation
- header
- hero
- latest release

Do not redesign the entire website at once.

Prompt:

```text
Implement only the approved Hero and Latest Release direction.

Before editing, re-read:
- design/design-rules.md
- design/visual-language.md
- design/homepage-direction.md

Do not touch later homepage sections unless required for shared styles.

Preserve existing functionality and routing.

Do not invent final marketing copy.
Use the current copy or short placeholders.

After implementation, report:
- files changed
- visual rules introduced
- any deviations from the design docs
- anything that still feels generic
```

Review visually.

---

# Phase 4 — Iterate visually

Do not ask:

> Make it better.

Give concrete visual feedback:

Bad:

```text
This still feels boring.
```

Good:

```text
The release section still feels like a centered product block.
Increase the artwork dominance, break the alignment,
remove the secondary background container and move the metadata
to the page edge.
```

---

# Phase 5 — Continue section by section

Recommended order:

1. Hero
2. Latest Release
3. Live
4. Photography break
5. Video
6. About
7. Merch
8. Booking
9. Footer
10. internal pages

---

# Agent self-check before committing UI

Ask the agent to evaluate:

```text
Before finalising, check the implementation against these questions:

- Did I create unnecessary cards?
- Did I use rounded containers by habit?
- Did I create a three-column grid because it was easy?
- Is photography large enough?
- Is typography doing visual work?
- Does this section have one dominant visual idea?
- Does the page rhythm change between sections?
- Could this page belong to a SaaS company if the images were replaced?
- Are the Tower Seven details subtle rather than turning the page into a game HUD?
- Did I preserve usability and accessibility?
```

If the answer to the SaaS question is yes, redesign before finalising.

---

# Important

Never let the agent redesign all pages in one unsupervised pass.

The design language should be learned and validated progressively.
