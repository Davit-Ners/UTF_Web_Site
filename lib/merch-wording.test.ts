import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Product } from "../app/lib/products";
import { getSavedMerchOrderStatus } from "./merch-order-result";
import "./test-component-loader";

/* Checkout language for actions the site does not perform */
const CHECKOUT_WORDING = /buy now|checkout|place order|pay now|purchase now|order with obligation|add to order|request order/i;
const tee: Product = { id: "p1", slug: "tee-core-logo", name: "Core Logo Tee", price: 25, category: "apparel", stock: 10, featured: true };
const noop = () => {};

async function renderPanel(subtotal: number) {
  const { default: OrderPanel } = await import("../app/components/merch/orderPanel/orderPanel");
  return renderToStaticMarkup(createElement(OrderPanel, {
    items: [{ product: tee, quantity: 1 }], subtotal, onUpdateQty: noop, onRemove: noop,
    onRequestOrder: async () => false, orderStatus: { type: "idle" }, hasSizedItem: true,
  }));
}

test("order panel explains the non-binding request before the privacy notice and the submit action", async () => {
  const markup = await renderPanel(25);
  const nextStep = markup.indexOf("Sending this request does not complete a purchase.");
  const privacy = markup.indexOf("We use your details to handle your merch request");
  const submit = markup.indexOf('type="submit"');
  assert.ok(nextStep > 0 && nextStep < privacy && privacy < submit);
  assert.match(markup, /We&#x27;ll confirm availability,\s+shipping and payment with you by email\./);
  assert.match(markup, /No payment is taken on the site\./);
  assert.match(markup, /<span>Send request<\/span>/);
  assert.doesNotMatch(markup, CHECKOUT_WORDING);
  assert.doesNotMatch(markup, /type="checkbox"/);
});

test("totals keep their calculation and read as estimates", async () => {
  const flat = await renderPanel(25);
  assert.match(flat, /<dt>Subtotal<\/dt><dd>25,00 €<\/dd>/);
  assert.match(flat, /<dt>Shipping estimate<\/dt><dd>7,00 €<\/dd>/);
  assert.match(flat, /<dt>Estimated total<\/dt><dd>32,00 €<\/dd>/);
  const free = await renderPanel(80);
  assert.match(free, /<dt>Shipping estimate<\/dt><dd>Free<\/dd>/);
  assert.match(free, /<dt>Estimated total<\/dt><dd>80,00 €<\/dd>/);
  assert.doesNotMatch(flat, /<dt>Total<\/dt>/);
});

test("merch masthead and catalogue describe a request confirmed by email", async () => {
  const { default: MerchView } = await import("../app/merch/merchView");
  const markup = renderToStaticMarkup(createElement(MerchView, { products: [tee] }));
  assert.match(markup, /Requested by email/);
  assert.match(markup, /Shipping estimate 7 € — free from 80 €/);
  assert.match(markup, /Add items to a request and send it\. We confirm availability, shipping and payment by\s+email\. No payment is taken on the site\./);
  assert.match(markup, /Add to request/);
  assert.match(markup, /Size: add it in your request notes/);
  assert.doesNotMatch(markup, CHECKOUT_WORDING);
});

test("saved-request messages show the reference and that no payment was taken", () => {
  const base = { stored: true, orderNumber: "UTF-20261025-ABC123", emailed: true, confirmationEmailed: true, notificationStatus: "complete" };
  const fresh = getSavedMerchOrderStatus({ ...base, alreadyProcessed: false });
  const replay = getSavedMerchOrderStatus({ ...base, alreadyProcessed: true });
  assert.equal(fresh?.message, "Request saved. Reference UTF-20261025-ABC123. We'll follow up by email. No payment has been taken.");
  assert.equal(replay?.message, "Request already received. Reference UTF-20261025-ABC123. We'll follow up by email. No payment has been taken.");
  /* Delivery-warning wording is unchanged */
  const warning = getSavedMerchOrderStatus({ ...base, confirmationEmailed: false, notificationStatus: "incomplete", alreadyProcessed: false });
  assert.equal(warning?.message, "Your order request was received and saved as #UTF-20261025-ABC123. Not all order notification emails could be delivered. Please don't submit it again. Keep this reference.");
});

test("customer confirmation email describes a request, not a completed purchase", async () => {
  const { MerchOrderConfirmationTemplate, MerchOrderTemplate } = await import("../app/components/emailTemplate/merchOrderTemplate");
  const order = {
    orderId: "o1", orderNumber: "UTF-20261025-ABC123", customerName: "Alex", email: "alex@example.org", country: "Belgium",
    notes: "", subtotal: 25, shipping: 7, total: 32, items: [{ productId: "p1", name: "Core Logo Tee", quantity: 1, unitPrice: 25, lineTotal: 25 }],
  };
  const customer = renderToStaticMarkup(MerchOrderConfirmationTemplate({ order, merchEmail: "contact@untiltheyfall.com" }));
  assert.match(customer, /We received your merch request for/);
  assert.match(customer, /This is a request, not a completed purchase: no payment has been taken\./);
  assert.match(customer, /<strong>Request reference:<\/strong> UTF-20261025-ABC123/);
  assert.match(customer, /<strong>Estimated total:<\/strong> 32,00 €/);
  assert.match(customer, /Requested items/);
  assert.doesNotMatch(customer, /order confirmed|thank you for your purchase|payment received|invoice/i);
  /* Internal notification keeps its useful labels */
  const internal = renderToStaticMarkup(MerchOrderTemplate({ order }));
  assert.match(internal, /New Merch Order Request/);
  assert.match(internal, /<strong>Shipping estimate:<\/strong>/);
  assert.match(internal, /<strong>Estimated total:<\/strong>/);
});
