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

test("newsletter subscription still normalizes/upserts the address with the current homepage source", async (t) => {
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  const { default: prisma } = await import("./prisma");
  const { POST } = await import("../app/api/newsletter/route");
  const original = prisma.newsletterSubscriber.upsert;
  t.after(() => {
    prisma.newsletterSubscriber.upsert = original;
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  });
  const upsert = t.mock.fn(async () => ({}));
  prisma.newsletterSubscriber.upsert = upsert as unknown as typeof original;
  const response = await POST(new Request("https://example.org/api/newsletter", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: " Listener@Example.org " }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(upsert.mock.calls[0].arguments, [{
    where: { email: "listener@example.org" },
    update: { status: "ACTIVE", unsubscribedAt: null },
    create: { email: "listener@example.org", status: "ACTIVE", source: "homepage-mailing-list" },
  }]);
});
