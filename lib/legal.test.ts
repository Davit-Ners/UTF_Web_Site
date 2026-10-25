import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import "./test-component-loader";

test("legal notice renders English and French sections with only the confirmed identity", async () => {
  const { default: LegalPage } = await import("../app/legal/page");
  const markup = renderToStaticMarkup(createElement(LegalPage));
  assert.match(markup, /<h1[^>]*>Legal<\/h1>/);
  assert.match(markup, /<section id="legal-en" lang="en"/);
  assert.match(markup, /<section id="legal-fr" lang="fr"/);
  const en = markup.slice(markup.indexOf('id="legal-en"'), markup.indexOf('id="legal-fr"'));
  const fr = markup.slice(markup.indexOf('id="legal-fr"'));
  assert.equal((en.match(/<h3>/g) ?? []).length, (fr.match(/<h3>/g) ?? []).length);
  assert.match(en, /official website of the band Until They Fall/);
  assert.match(en, /<dd>Brussels, Belgium<\/dd>/);
  assert.match(fr, /<dd>Bruxelles, Belgique<\/dd>/);
  assert.match(en, /The band does not currently operate\s+through a separate legal entity/);
  assert.ok((markup.match(/mailto:contact@untiltheyfall.com/g) ?? []).length >= 4);
  assert.ok((markup.match(/href="\/privacy"/g) ?? []).length >= 4);
});

test("legal notice publishes no enterprise number, VAT number, postal address or phone", async () => {
  const { default: LegalPage } = await import("../app/legal/page");
  const text = renderToStaticMarkup(createElement(LegalPage)).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /\b(BE)?\s?0?\d{3}[.\s]?\d{3}[.\s]?\d{3}\b/, "enterprise/VAT-like number");
  assert.doesNotMatch(text, /\+32|\b0\d{1,3}[\s/.]\d{2}/, "phone-like number");
  assert.doesNotMatch(text, /\b\d{4}\s+(Brussels|Bruxelles)\b|\b(rue|avenue|chaussée|straat|laan)\b/i, "postal address");
  assert.doesNotMatch(text, /\b(BCE|KBO|SRL|BV|SPRL|ASBL n°)\b/, "registration details");
});

test("footer links to both privacy and legal pages", async () => {
  const { default: Footer } = await import("../app/components/footer/footer");
  const markup = renderToStaticMarkup(createElement(Footer));
  assert.match(markup, /<ul[^>]*aria-label="Legal"[^>]*><li><a[^>]*href="\/privacy"[^>]*>Privacy<\/a><\/li><li><a[^>]*href="\/legal"[^>]*>Legal<\/a><\/li><\/ul>/);
});
