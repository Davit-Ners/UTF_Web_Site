# Until They Fall — Design System

This folder is the visual source of truth for the redesign of the **simple/public Until They Fall website**.

The goal is not to create a generic "modern metal website".
The goal is to create a fast, usable band website that clearly belongs to the same universe as:

- Until They Fall
- Gerard
- Tower Seven
- The Book of GG
- the Seven Deadly Sins era

The immersive `/world` experience can go much further later.
The simple website must remain immediately usable for fans, venues, bookers and people who only want music, dates, merch or contact information.

## Read order

Before changing frontend UI, read:

1. `creative-brief.md`
2. `design-rules.md`
3. `visual-language.md`
4. `homepage-direction.md`
5. `moodboard-guide.md`
6. `claude-workflow.md`

Do not start implementation from the moodboard alone.

The moodboard gives visual references.
The markdown files explain **why** those references matter and how they should be translated into UI.

## Folder structure

```text
design/
├── README.md
├── creative-brief.md
├── design-rules.md
├── visual-language.md
├── homepage-direction.md
├── moodboard-guide.md
├── claude-workflow.md
├── reference-analysis-template.md
├── references/
│   └── README.md
├── moodboard/
│   └── README.md
├── wireframes/
│   └── README.md
└── assets/
    └── README.md
```

## Core rule

**Do not let implementation decisions become art direction.**

React components, CSS utilities, UI libraries and existing sections must adapt to the art direction — not the opposite.
