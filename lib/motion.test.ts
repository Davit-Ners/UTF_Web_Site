import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import "./test-component-loader";

/* Line-ending agnostic: the working tree may hold CRLF (core.autocrlf) */
const css = async (path: string) =>
  (await readFile(new URL(`../${path}`, import.meta.url), "utf8")).replace(/\r\n/g, "\n");

test("motion tokens are defined once in the global stylesheet", async () => {
  const globals = await css("app/globals.css");
  for (const [token, value] of [
    ["--motion-snap", "90ms"], ["--motion-ui", "200ms"], ["--motion-editorial", "480ms"],
    ["--motion-signature", "560ms"], ["--motion-stagger", "80ms"],
    ["--ease-press", "cubic-bezier(0.8, 0, 0.2, 1)"], ["--ease-ui", "cubic-bezier(0.2, 0, 0, 1)"],
    ["--ease-snap", "steps(1, jump-start)"],
  ]) {
    assert.match(globals, new RegExp(`${token}: ${value.replace(/[()]/g, "\\$&")};`), token);
  }
});

test("R4 cut link: hover, focus and press share the ember rule and a 3px arrow step; reduced motion drops the step", async () => {
  const globals = await css("app/globals.css");
  assert.match(globals, /\.action-link:hover,\n\.action-link:focus-visible,\n\.action-link:active \{\n  color: var\(--bone\);\n  text-decoration-color: var\(--ember-text\);/);
  assert.match(globals, /\.action-link:hover \.arrow,\n\.action-link:focus-visible \.arrow,\n\.action-link:active \.arrow \{\n  transform: translateX\(3px\);/);
  assert.match(globals, /transition: transform var\(--motion-snap\) var\(--ease-snap\);/);
  assert.doesNotMatch(globals, /0\.2s ease/);
  assert.match(globals, /:focus-visible \{\n  outline: 2px solid var\(--focus-outline\);/);
  assert.match(globals, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.action-link \.arrow \{\n    transform: none !important;/);
});

test("audited images no longer dim or zoom on hover", async () => {
  const files = [
    "app/components/liveReference/liveReference.module.css",
    "app/components/homePage/featuredMerch/featuredMerch.module.css",
    "app/components/gallery/photoBook/photoBook.module.css",
    "app/components/concerts/showDossier/showDossier.module.css",
    "app/components/gallery/galleryFull/galleryFull.module.css",
  ];
  for (const file of files) {
    const source = await css(file);
    assert.doesNotMatch(source, /:hover[^{]*\{[^}]*opacity/, `${file}: hover opacity`);
    assert.doesNotMatch(source, /:hover[^{]*(img|image|Image)[^{]*\{[^}]*transform/, `${file}: hover transform`);
    assert.doesNotMatch(source, /transition: (opacity|transform) 0\.\d+s/, `${file}: legacy image transition`);
  }
});

test("functional header and drawer motion run on the shared tokens", async () => {
  const header = await css("app/components/header/header.module.css");
  assert.match(header, /transition: background-color var\(--motion-ui\) var\(--ease-ui\), border-color var\(--motion-ui\) var\(--ease-ui\);/);
  /* Mobile menu: R6 top-down shutter (transform only), faster close, no opacity fade */
  assert.match(header, /\.panel \{[^}]*transform: translateY\(calc\(-1 \* var\(--panel-h\)\)\);[^}]*transition: transform var\(--panel-close\) var\(--ease-ui\), visibility 0s linear var\(--panel-close\);/);
  assert.match(header, /\.panelInner \{[^}]*transform: translateY\(var\(--panel-h\)\);/);
  assert.match(header, /\.panelOpen \{\n    visibility: visible;\n    transform: none;\n    transition: transform var\(--motion-ui\) var\(--ease-ui\);/);
  assert.doesNotMatch(header, /\.panel \{[^}]*opacity|\.panelOpen \{[^}]*opacity|\.panelInner \{[^}]*opacity/);
  const merch = await css("app/merch/merch.module.css");
  assert.match(merch, /animation: slideIn var\(--motion-ui\) var\(--ease-ui\);/);
});

test("R1 Plate and R3 Rule cut: transform-only primitives, hidden only while pending, static when reduced", async () => {
  const globals = await css("app/globals.css");
  assert.match(globals, /\.plate::after \{[^}]*position: absolute;[^}]*inset: 0;[^}]*background: var\(--plate-color\);[^}]*transform: scaleY\(0\);[^}]*transform-origin: 50% 100%;[^}]*pointer-events: none;/);
  assert.match(globals, /\.plate\[data-reveal="pending"\]::after \{\n  transform: scaleY\(1\);/);
  assert.match(globals, /\.plate\[data-reveal="done"\]::after \{\n  transition: transform var\(--plate-duration\) var\(--ease-press\);/);
  assert.match(globals, /\.rule-cut\[data-reveal\]::before,\n\.rule-cut\.rule-cut-load::before \{[^}]*top: -1px;[^}]*height: 1px;[^}]*transform-origin: 0 50%;[^}]*pointer-events: none;/);
  assert.match(globals, /\.rule-cut\[data-reveal="pending"\]::before \{\n  transform: scaleX\(0\);/);
  assert.match(globals, /\.rule-cut\[data-reveal="done"\]::before \{\n  transition: transform var\(--rule-cut-duration\) var\(--ease-press\);/);
  assert.match(globals, /@media \(max-width: 720px\) \{\n  \.plate \{\n    --plate-duration: 360ms;/);
  assert.match(globals, /prefers-reduced-motion: reduce[\s\S]*\.plate::after \{\n    animation: none !important;\n    transform: scaleY\(0\) !important;[\s\S]*\.rule-cut\[data-reveal\]::before,\n  \.rule-cut\.rule-cut-load::before \{\n    animation: none !important;\n    transform: none !important;/);
  /* R1 + R3 only (R2 legitimately translates its ghost and is checked separately) */
  const primitives = globals.slice(globals.indexOf("=== R1 Plate"), globals.indexOf("=== R2 Registration"));
  assert.doesNotMatch(primitives, /opacity|filter|clip-path|box-shadow|translate/);
});

test("pilot markup is visible as served: no data-reveal until the client decides", async () => {
  const { default: FeaturedRelease } = await import("../app/components/homePage/featuredRelease/featuredRelease");
  const { latestRelease } = await import("../app/lib/music");
  const release = renderToStaticMarkup(createElement(FeaturedRelease, { release: latestRelease }));
  assert.equal((release.match(/class="[^"]*\bplate\b/g) ?? []).length, 1);
  assert.match(release, /<div class="cover plate">/);
  assert.doesNotMatch(release, /data-reveal|rule-cut/);

  const { default: Live } = await import("../app/components/homePage/live/live");
  const empty = renderToStaticMarkup(createElement(Live, { shows: [] }));
  assert.match(empty, /<div class="empty rule-cut">/);
  const show = (id: string, date: string) => ({ id, date, city: "Brussels, BE", venue: "Venue", gallery: [] });
  const list = renderToStaticMarkup(createElement(Live, { shows: [show("a", "2027-01-01"), show("b", "2027-02-01")] }));
  assert.match(list, /<ol class="rows rule-cut">/);
  assert.equal((list.match(/rule-cut/g) ?? []).length, 1);
  for (const markup of [empty, list]) assert.doesNotMatch(markup, /data-reveal|\bplate\b/);
});

test("Hero: old settle and fade are gone; photo plate and wordmark registration replace them", async () => {
  const hero = await css("app/components/homePage/hero/hero.module.css");
  assert.doesNotMatch(hero, /animation|@keyframes|opacity: 0/);
  assert.match(hero, /--registration-mask: url\("\/_next\/image\?url=%2Foptimized%2Flogo-typo\.webp&w=640&q=75"\);/);
  assert.match(hero, /--registration-delay: calc\(var\(--motion-stagger\) \* 3\);/);
  const { default: Hero } = await import("../app/components/homePage/hero/hero");
  const markup = renderToStaticMarkup(createElement(Hero));
  assert.match(markup, /<section class="hero"[^>]*data-signature="hero"/);
  assert.equal((markup.match(/class="media plate plate-load"/g) ?? []).length, 1);
  assert.match(markup, /<div class="logo registration" aria-hidden="true">/);
  assert.match(markup, /<span hidden=""><\/span>/);
  assert.doesNotMatch(markup, /data-signature-played|data-reveal/);
});

test("R2 Registration primitive: one stepped ember copy, hidden when registered, static when reduced or already played", async () => {
  const globals = await css("app/globals.css");
  assert.match(globals, /\.registration::before \{[^}]*z-index: -1;[^}]*mask: var\(--registration-mask\) center \/ contain no-repeat;[^}]*visibility: hidden;[^}]*pointer-events: none;[^}]*animation: registration-snap var\(--registration-duration\) steps\(3, jump-end\) var\(--registration-delay\) forwards;/);
  assert.match(globals, /@keyframes registration-snap \{\n  from \{\n    visibility: visible;\n    transform: translate\(var\(--registration-x\), var\(--registration-y\)\);\n  \}\n  to \{\n    visibility: hidden;\n    transform: none;/);
  assert.match(globals, /--registration-x: 4px;\n  --registration-y: -2px;/);
  assert.match(globals, /\.registration \{\n    --registration-x: 2px;\n    --registration-y: -1px;/);
  assert.match(globals, /\.plate\.plate-load::after \{\n  animation: plate-open var\(--plate-duration\) var\(--ease-press\) both;/);
  assert.match(globals, /\[data-signature-played\] \.plate-load::after,\n\[data-signature-played\] \.registration::before \{\n  animation: none;/);
  assert.match(globals, /prefers-reduced-motion: reduce[\s\S]*\.plate::after \{\n    animation: none !important;\n    transform: scaleY\(0\) !important;[\s\S]*\.registration::before \{\n    animation: none !important;\n    visibility: hidden !important;/);
  const r2 = globals.slice(globals.indexOf("=== R2 Registration"), globals.indexOf("A signature already played"));
  assert.doesNotMatch(r2, /filter|blur|glow|infinite|opacity/);
});

test("Batch 4 primitive extensions: load/hybrid rule cut, label step, ink rules, text registration, reduced overrides", async () => {
  const globals = await css("app/globals.css");
  assert.match(globals, /\.rule-cut\.rule-cut-load::before \{\n  animation: rule-cut-draw var\(--rule-cut-duration\) var\(--ease-press\) var\(--rule-cut-delay\) both;/);
  assert.match(globals, /\.rule-cut\.rule-cut-load\[data-reveal\]::before \{\n  animation: none;/);
  assert.match(globals, /\.plate\.plate-load\[data-reveal\]::after \{\n  animation: none;/);
  assert.match(globals, /\.rule-cut\.rule-cut-label\.rule-cut-load \{\n  animation: rule-cut-label calc\(var\(--rule-cut-delay\) \+ var\(--rule-cut-duration\)\) steps\(1, jump-end\) both;/);
  assert.match(globals, /@media \(prefers-reduced-motion: no-preference\) \{\n  \.rule-cut\.rule-cut-label\[data-reveal="pending"\] \{\n    color: transparent;/);
  assert.match(globals, /\.rule-cut\.rule-cut-label\[data-reveal="done"\] \{\n  transition: color 0s linear var\(--rule-cut-duration\);/);
  assert.match(globals, /\.rule-cut\.rule-cut-ink \{\n  --rule-cut-color: var\(--rule-ink\);/);
  assert.match(globals, /\.after-plate \{\n  --rule-cut-delay: var\(--motion-editorial\);/);
  assert.match(globals, /\.after-plate \{\n    --rule-cut-delay: 360ms;/);
  assert.match(globals, /\.registration\.registration-text::before \{\n  content: attr\(data-registration\);\n  content: attr\(data-registration\) \/ "";[^}]*mask: none;/);
  assert.match(globals, /prefers-reduced-motion: reduce[\s\S]*\.rule-cut\.rule-cut-load::before \{\n    animation: none !important;\n    transform: none !important;[\s\S]*\.rule-cut\.rule-cut-label \{\n    animation: none !important;/);
});

/* Counts elements whose class list contains exactly this class name */
const classCount = (markup: string, cls: string) =>
  [...markup.matchAll(/class="([^"]*)"/g)].filter((m) => m[1].split(" ").includes(cls)).length;

test("route markup carries exactly the planned editorial motion, visible as served", async () => {
  const { latestRelease } = await import("../app/lib/music");
  const { default: ReleaseSleeve } = await import("../app/components/music/releaseSleeve/releaseSleeve");
  const first = renderToStaticMarkup(createElement(ReleaseSleeve, { release: latestRelease, motion: true }));
  assert.equal(classCount(first, "plate-load"), 1);
  assert.match(first, /<ol class="tracks rule-cut rule-cut-load after-plate">/);
  const later = renderToStaticMarkup(createElement(ReleaseSleeve, { release: latestRelease }));
  assert.equal(classCount(later, "plate") + classCount(later, "rule-cut"), 0);

  const { default: ReleasePage } = await import("../app/music/[slug]/page");
  const release = renderToStaticMarkup(await ReleasePage({ params: Promise.resolve({ slug: "sent-to-die" }) }));
  assert.equal(classCount(release, "plate"), 1);
  assert.match(release, /class="plate plate plate-load"/);
  assert.equal(classCount(release, "rule-cut"), 2);
  assert.match(release, /<ol class="songList rule-cut rule-cut-ink">/);
  assert.match(release, /<div class="creditHead rule-cut"><dt>Recording<\/dt><\/div>/);
  assert.equal(classCount(release, "registration"), 0);

  const { default: TourPoster } = await import("../app/components/concerts/tourPoster/tourPoster");
  const empty = renderToStaticMarkup(createElement(TourPoster, { data: { upcoming: [], past: [] } }));
  assert.match(empty, /<h1 class="live plate plate-load">Live<\/h1>/);
  assert.match(empty, /<div class="state rule-cut rule-cut-load after-plate">/);
  assert.equal(classCount(empty, "plate") + classCount(empty, "rule-cut"), 2);
  const show = (id: string, date: string) => ({ id, date, city: "Brussels, BE", venue: "Venue", gallery: [] });
  const list = renderToStaticMarkup(createElement(TourPoster, { data: { upcoming: [show("a", "2027-01-01"), show("b", "2027-02-01")], past: [show("c", "2024-01-01"), show("d", "2023-01-01")] } }));
  assert.match(list, /<ol class="dates rule-cut rule-cut-load after-plate">/);
  assert.equal(classCount(list, "rule-cut"), 1);

  const { default: ShowDossier } = await import("../app/components/concerts/showDossier/showDossier");
  const dossier = renderToStaticMarkup(createElement(ShowDossier, { show: { ...show("utf-x", "2025-11-01"), posterUrl: undefined }, isPast: true, previous: null, next: null }));
  assert.match(dossier, /<p class="meta status rule-cut rule-cut-load rule-cut-label">Saturday — Archive<\/p>/);
  assert.equal(classCount(dossier, "plate") + classCount(dossier, "rule-cut") + classCount(dossier, "registration"), 1);

  const { default: AboutPage } = await import("../app/about/page");
  const about = renderToStaticMarkup(createElement(AboutPage));
  assert.match(about, /<div class="coverFrame plate plate-load">/);
  assert.equal(classCount(about, "plate") + classCount(about, "rule-cut") + classCount(about, "registration"), 1);

  const { default: NotFound } = await import("../app/not-found");
  const notFound = renderToStaticMarkup(createElement(NotFound));
  assert.match(notFound, /<h1 class="code registration registration-text" data-registration="404">404<span class="srOnly"> — page not found<\/span><\/h1>/);
  assert.equal(classCount(notFound, "plate") + classCount(notFound, "rule-cut"), 0);

  for (const page of ["../app/privacy/page", "../app/legal/page"]) {
    const { default: Page } = await import(page);
    const markup = renderToStaticMarkup(createElement(Page));
    assert.equal(classCount(markup, "plate") + classCount(markup, "rule-cut") + classCount(markup, "registration"), 0, page);
  }

  for (const markup of [first, release, empty, list, dossier, about, notFound]) assert.doesNotMatch(markup, /data-reveal/);
});

test("Batch 5 functional motion: viewer shutters, backdrop fades, drawer without fade, gallery opener plate", async () => {
  const viewer = await css("app/components/photoViewer/photoViewer.module.css");
  assert.match(viewer, /\.viewer\[open\]::backdrop \{\n  animation: ui-backdrop-in 160ms var\(--ease-ui\) both;/);
  assert.match(viewer, /\.frame\[data-shutter="open"\]::after \{\n  transform-origin: 50% 100%;\n  animation: viewer-open var\(--motion-ui\) var\(--ease-press\) both;/);
  assert.match(viewer, /\.frame\[data-shutter="next"\]::after \{\n  transform-origin: 0 50%;\n  animation: viewer-step 120ms var\(--ease-ui\) both;/);
  assert.match(viewer, /\.frame\[data-shutter="prev"\]::after \{\n  transform-origin: 100% 50%;/);
  assert.match(viewer, /prefers-reduced-motion: reduce[\s\S]*animation: none !important;/);
  assert.doesNotMatch(viewer, /filter|blur|scale\(0\.|scale\(1\.|translate/);
  const merch = await css("app/merch/merch.module.css");
  assert.match(merch, /@keyframes slideIn \{\n  from \{\n    transform: translateX\(24px\);\n  \}\n  to \{\n    transform: none;\n  \}\n\}/);
  assert.match(merch, /\.drawer\[open\]::backdrop \{\n  animation: ui-backdrop-in 160ms var\(--ease-ui\) both;/);
  const globals = await css("app/globals.css");
  assert.match(globals, /\*, \*::before, \*::after, \*::backdrop \{/);
  const { default: PhotoBook } = await import("../app/components/gallery/photoBook/photoBook");
  const book = renderToStaticMarkup(createElement(PhotoBook));
  assert.equal(classCount(book, "plate"), 1);
  assert.match(book, /<span class="frame plate plate-load">/);
  assert.equal(classCount(book, "rule-cut") + classCount(book, "registration"), 0);
  assert.doesNotMatch(book, /data-reveal/);
});
