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
    "app/components/homePage/featuredVideo/featuredVideo.module.css",
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
  assert.match(header, /transition: opacity var\(--motion-ui\) var\(--ease-ui\), visibility 0s linear var\(--motion-ui\);/);
  const merch = await css("app/merch/merch.module.css");
  assert.match(merch, /animation: slideIn var\(--motion-ui\) var\(--ease-ui\);/);
});

test("R1 Plate and R3 Rule cut: transform-only primitives, hidden only while pending, static when reduced", async () => {
  const globals = await css("app/globals.css");
  assert.match(globals, /\.plate::after \{[^}]*position: absolute;[^}]*inset: 0;[^}]*background: var\(--plate-color\);[^}]*transform: scaleY\(0\);[^}]*transform-origin: 50% 100%;[^}]*pointer-events: none;/);
  assert.match(globals, /\.plate\[data-reveal="pending"\]::after \{\n  transform: scaleY\(1\);/);
  assert.match(globals, /\.plate\[data-reveal="done"\]::after \{\n  transition: transform var\(--plate-duration\) var\(--ease-press\);/);
  assert.match(globals, /\.rule-cut\[data-reveal\]::before \{[^}]*top: -1px;[^}]*height: 1px;[^}]*transform-origin: 0 50%;[^}]*pointer-events: none;/);
  assert.match(globals, /\.rule-cut\[data-reveal="pending"\]::before \{\n  transform: scaleX\(0\);/);
  assert.match(globals, /\.rule-cut\[data-reveal="done"\]::before \{\n  transition: transform var\(--rule-cut-duration\) var\(--ease-press\);/);
  assert.match(globals, /@media \(max-width: 720px\) \{\n  \.plate \{\n    --plate-duration: 360ms;/);
  assert.match(globals, /prefers-reduced-motion: reduce[\s\S]*\.plate::after \{\n    transform: scaleY\(0\) !important;[\s\S]*\.rule-cut\[data-reveal\]::before \{\n    transform: none !important;/);
  const primitives = globals.slice(globals.indexOf("=== R1 Plate"), globals.indexOf("=== Mono metadata"));
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
