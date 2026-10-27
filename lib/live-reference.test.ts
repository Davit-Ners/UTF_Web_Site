import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { liveReference, liveVideoLinks } from "../app/lib/liveReference";
import "./test-component-loader";

test("missing and malformed video IDs cannot create a player or fabricated URL", () => {
  for (const id of [null, "", "pending", "https://youtube.com/watch?v=invalid", "../bad-link"]) {
    assert.equal(liveVideoLinks(id), null);
  }
  assert.deepEqual(liveVideoLinks("9Wvpovk_Tg4"), {
    youtubeUrl: "https://www.youtube.com/watch?v=9Wvpovk_Tg4",
    embedUrl: "https://www.youtube-nocookie.com/embed/9Wvpovk_Tg4?autoplay=1&rel=0",
  });
});

test("both placements safely render the pending configuration without JS", async () => {
  const { default: LiveReference } = await import("../app/components/liveReference/liveReference");
  for (const variant of ["full", "compact"] as const) {
    const html = renderToStaticMarkup(createElement(LiveReference, { variant }));
    assert.match(html, /<button[^>]*disabled=""/);
    assert.match(html, /Live footage pending/);
    assert.match(html, /Temporary poster/);
    assert.match(html, /<noscript>/);
    assert.match(html, /href="\/privacy"/);
    assert.doesNotMatch(html, /<iframe|href="https:\/\/www.youtube|Winner|Tremplin|2026/);
  }
});

test("configured footage exposes a fallback link, but no iframe before a deliberate play", async () => {
  const { default: LiveReference } = await import("../app/components/liveReference/liveReference");
  const data = { ...liveReference, youtubeId: "9Wvpovk_Tg4", poster: null,
    posterTemporary: false, eventName: "Confirmed event", result: "Confirmed result" };
  const html = renderToStaticMarkup(createElement(LiveReference, { data }));
  assert.doesNotMatch(html, /disabled=|<iframe|youtube-nocookie|Temporary poster|Live footage pending/);
  assert.match(html, /href="https:\/\/www.youtube.com\/watch\?v=9Wvpovk_Tg4"/);
  assert.match(html, /Play live performance by Until They Fall — Confirmed event/);
  assert.match(html, /Confirmed result/);
  assert.match(html, /aria-describedby="live-reference-notice"/);
  assert.match(html, /<span class="fallback"/);
});
