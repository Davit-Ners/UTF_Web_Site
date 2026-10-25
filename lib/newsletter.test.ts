import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NEWSLETTER_SIGNUP_ENABLED } from "./newsletter";
import "./test-component-loader";

/* Fails on purpose if signup is switched on without the dedicated reactivation phase */
test("newsletter signup is disabled for launch", () => {
  assert.equal(NEWSLETTER_SIGNUP_ENABLED, false);
});

test("disabled newsletter endpoint refuses without reading the body or touching subscriber rows", async (t) => {
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  const { default: prisma } = await import("./prisma");
  const { POST } = await import("../app/api/newsletter/route");
  const subscriber = prisma.newsletterSubscriber;
  const methods = ["upsert", "create", "createMany", "update", "updateMany", "delete", "deleteMany", "findUnique", "findFirst", "findMany"] as const;
  const originals = Object.fromEntries(methods.map((name) => [name, subscriber[name]]));
  const calls: string[] = [];
  for (const name of methods) {
    Object.assign(subscriber, { [name]: async () => { calls.push(name); return {}; } });
  }
  t.after(() => {
    Object.assign(subscriber, originals);
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  });

  /* A new address, an address that might exist as UNSUBSCRIBED, and malformed input */
  for (const body of [JSON.stringify({ email: " Listener@Example.org " }), JSON.stringify({ email: "former@example.org" }), "{"]) {
    const request = new Request("https://example.org/api/newsletter", {
      method: "POST", headers: { "Content-Type": "application/json" }, body,
    });
    const response = await POST(request);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "Mailing list signup is not available.", code: "NEWSLETTER_DISABLED" });
    assert.equal(request.bodyUsed, false);
  }
  assert.deepEqual(calls, []);
});

test("homepage mailing list shows a clear unavailable state with no form controls", async () => {
  const { default: MailingList } = await import("../app/components/homePage/mailingList/mailingList");
  const markup = renderToStaticMarkup(createElement(MailingList));
  assert.match(markup, /<section[^>]*aria-labelledby="mailing-title"/);
  assert.match(markup, /<h2 id="mailing-title"[^>]*>Mailing list<\/h2>/);
  assert.match(markup, /Coming later\./);
  assert.match(markup, /Signup is not open yet\./);
  assert.doesNotMatch(markup, /<(form|input|button|textarea|select)\b/);
  assert.doesNotMatch(markup, /\/api\/newsletter|Join/);
});
