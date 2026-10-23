import assert from "node:assert/strict";
import { test } from "node:test";
import { getSavedMerchOrderStatus } from "./merch-order-result";

test("a saved order retains its reference and never becomes a retryable email failure", () => {
  const orderNumber = "UTF-20261023-TEST01";
  for (const [emailed, confirmationEmailed] of [[true, true], [true, false], [false, true], [false, false]]) {
    const result = getSavedMerchOrderStatus({ stored: true, orderNumber, emailed, confirmationEmailed });
    assert.ok(result);
    assert.equal(result.orderNumber, orderNumber);
    assert.match(result.message, new RegExp(orderNumber));
    assert.equal(result.type, emailed && confirmationEmailed ? "success" : "success-with-warning");
    assert.doesNotMatch(result.message, /try again|retry|request failed/i);
    if (result.type === "success-with-warning") {
      assert.match(result.message, /received and saved/);
      assert.match(result.message, /don't submit it again/);
      assert.match(result.message, /Keep this reference/);
    }
  }
});

test("legacy saved-error responses discard technical error text", () => {
  const result = getSavedMerchOrderStatus({
    success: false, stored: true, orderNumber: "UTF-SAVED", emailed: false,
    confirmationEmailed: false, error: "Resend secret infrastructure error stack",
  });
  assert.equal(result?.type, "success-with-warning");
  assert.doesNotMatch(JSON.stringify(result), /Resend|infrastructure|stack|secret/);
});

test("failed storage and unconfirmed responses are not accepted as saved", () => {
  for (const result of [null, {}, { stored: false, orderNumber: "UTF-NOT-SAVED" }, { stored: true }, { stored: true, orderNumber: " " }]) {
    assert.equal(getSavedMerchOrderStatus(result), null);
  }
});
