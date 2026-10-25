import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import NewTabLink from "../app/components/newTabLink";
import { formatPrice } from "../app/lib/formatPrice";

test("new-tab links preserve their label and announce the destination behaviour once", () => {
  const markup = renderToStaticMarkup(createElement(NewTabLink, { href: "https://example.org", className: "action-link" }, "Listen"));
  assert.match(markup, /href="https:\/\/example.org"/);
  assert.match(markup, /target="_blank"/);
  assert.match(markup, /rel="noopener noreferrer"/);
  assert.match(markup, /Listen<span class="srOnly"> \(opens in a new tab\)<\/span>/);
  assert.equal((markup.match(/opens in a new tab/g) ?? []).length, 1);
});

test("shared catalogue price formatting preserves cents and compact whole euros", () => {
  assert.equal(formatPrice(25), "25\u00a0€");
  assert.equal(formatPrice(24.5), "24,50\u00a0€");
  assert.equal(formatPrice(24.95), "24,95\u00a0€");
  assert.equal(formatPrice(0), "0\u00a0€");
});

/* Newsletter API behaviour is covered by lib/newsletter.test.ts (launch-disabled state). */
