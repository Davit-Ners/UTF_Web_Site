import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const css = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

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
