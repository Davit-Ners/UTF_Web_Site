import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { register } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SESSION_KEYS } from "../app/privacy/privacyFacts";

/*
 * CSS modules resolve to their class names and next/image renders nothing,
 * so the real components render in Node.
 */
register(
  "data:text/javascript," +
    encodeURIComponent(`
      const image = "data:text/javascript," + encodeURIComponent("export default () => null;");
      export async function resolve(specifier, context, next) {
        if (specifier === "next/image") return { url: image, shortCircuit: true };
        return next(specifier, context);
      }
      export async function load(url, context, next) {
        if (url.endsWith(".css")) {
          return { format: "module", shortCircuit: true, source: "export default new Proxy({}, { get: (_, key) => String(key) });" };
        }
        return next(url, context);
      }
    `)
);

const noop = () => {};

test("documented session storage keys match the keys the forms actually use", async () => {
  const booking = await readFile(new URL("./booking-attempt.ts", import.meta.url), "utf8");
  const merch = await readFile(new URL("./merch-order-attempt.ts", import.meta.url), "utf8");
  assert.match(booking, new RegExp(`STORAGE_KEY = "${SESSION_KEYS.booking}"`));
  assert.match(merch, new RegExp(`STORAGE_KEY = "${SESSION_KEYS.merch}"`));
});

test("privacy page renders complete English and French policies with the contact address", async () => {
  const { default: PrivacyPage } = await import("../app/privacy/page");
  const markup = renderToStaticMarkup(createElement(PrivacyPage));
  assert.match(markup, /<h1[^>]*>Privacy<\/h1>/);
  assert.match(markup, /<section id="privacy-en" lang="en"/);
  assert.match(markup, /<section id="privacy-fr" lang="fr"/);
  assert.match(markup, /Last updated 25 October 2026/);
  assert.match(markup, /Dernière mise à jour 25 octobre 2026/);
  assert.ok((markup.match(/mailto:contact@untiltheyfall.com/g) ?? []).length >= 4);
  for (const key of Object.values(SESSION_KEYS)) {
    assert.equal((markup.match(new RegExp(key, "g")) ?? []).length, 2);
  }
  assert.doesNotMatch(markup, /type="checkbox"/);
});

test("booking form shows an information-only privacy notice before submitting", async () => {
  const { default: BookingForm } = await import("../app/components/bookingPage/bookingForm");
  const markup = renderToStaticMarkup(createElement(BookingForm, {
    error: null, fieldErrors: {}, handleFieldBlur: noop, validationAttempt: 0, handleSubmit: noop,
    loading: false, savedResult: null, onTurnstileTokenChange: noop, onTurnstileUnavailable: noop,
    submitDisabled: false, turnstileResetCounter: 0, turnstileSiteKey: "",
  }));
  assert.match(markup, /We use these details to handle your booking request and to organise the show if it goes\s+ahead\./);
  assert.match(markup, /href="\/privacy" target="_blank"/);
  assert.ok(markup.indexOf("Privacy Policy") < markup.indexOf('type="submit"'));
  assert.doesNotMatch(markup, /type="checkbox"/);
});

test("merch order panel shows an information-only privacy notice before submitting", async () => {
  const { default: OrderPanel } = await import("../app/components/merch/orderPanel/orderPanel");
  const markup = renderToStaticMarkup(createElement(OrderPanel, {
    items: [], subtotal: 0, onUpdateQty: noop, onRemove: noop,
    onRequestOrder: async () => false, orderStatus: { type: "idle" }, hasSizedItem: false,
  }));
  assert.match(markup, /We use your details to handle your merch request and to contact you about availability,\s+payment and delivery\./);
  assert.match(markup, /href="\/privacy" target="_blank"/);
  assert.ok(markup.indexOf("Privacy Policy") < markup.indexOf('type="submit"'));
  assert.doesNotMatch(markup, /type="checkbox"/);
});

test("featured video explains YouTube before playback without loading the player", async () => {
  const { default: FeaturedVideo } = await import("../app/components/homePage/featuredVideo/featuredVideo");
  const markup = renderToStaticMarkup(createElement(FeaturedVideo, { videoId: "9Wvpovk_Tg4", title: "Sent To Die" }));
  assert.match(markup, /Pressing play loads the video from YouTube \(Google\)/);
  assert.match(markup, /href="\/privacy"/);
  assert.doesNotMatch(markup, /<iframe/);
  assert.doesNotMatch(markup, /youtube-nocookie/);
});

test("footer links to the privacy page", async () => {
  const { default: Footer } = await import("../app/components/footer/footer");
  assert.match(renderToStaticMarkup(createElement(Footer)), /<a[^>]*href="\/privacy"[^>]*>Privacy<\/a>/);
});
