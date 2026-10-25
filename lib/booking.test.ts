import assert from "node:assert/strict";
import { test } from "node:test";
import { getBookingFieldErrors, parseBookingPayload, validateBookingPayload, type BookingField } from "./booking";

const valid = parseBookingPayload({ name: "Promoter", email: "promoter@example.com", date: "2027-05-02", message: "A booking enquiry" });

test("Booking identifies every existing required field and no optional fields", () => {
  const payload = parseBookingPayload({});
  assert.deepEqual(Object.keys(getBookingFieldErrors(payload)), ["name", "email", "date", "message"]);
  const result = validateBookingPayload(payload);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error, "Please fill all required fields.");
    assert.deepEqual(result.fieldErrors, getBookingFieldErrors(payload));
  }
  assert.deepEqual(getBookingFieldErrors(valid), {});
  assert.equal(validateBookingPayload(valid).ok, true);
});

test("Booking reports invalid email, date and short message against their controls", () => {
  for (const [field, value, message] of [
    ["email", "not-an-email", "Please provide a valid email address."],
    ["date", "02/05/2027", "Please provide a valid date."],
    ["message", "Too short", "Please add a few more details (at least 10 characters)."],
  ] as const) {
    const payload = { ...valid, [field]: value };
    assert.deepEqual(getBookingFieldErrors(payload), { [field]: message });
    assert.equal(validateBookingPayload(payload).ok, false);
    assert.deepEqual(getBookingFieldErrors({ ...payload, [field]: valid[field] }), {});
  }
  assert.equal(validateBookingPayload({ ...valid, message: "x".repeat(10) }).ok, true);
});

for (const [field, limit] of Object.entries({ name: 120, email: 320, org: 160, type: 120, city: 160, capacity: 80, budget: 80, message: 5000 })) {
  test(`Booking preserves ${field}'s existing ${limit}-character limit`, () => {
    const value = (length: number) => field === "email" ? "x".repeat(length - "@example.com".length) + "@example.com" : "x".repeat(length);
    assert.equal(validateBookingPayload({ ...valid, [field]: value(limit) }).ok, true);
    const payload = { ...valid, [field]: value(limit + 1) };
    assert.deepEqual(getBookingFieldErrors(payload), { [field]: `Please use ${limit} characters or fewer.` });
    const result = validateBookingPayload(payload);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, "One or more fields are too long.");
    assert.equal(getBookingFieldErrors(payload)[field as BookingField], `Please use ${limit} characters or fewer.`);
  });
}

test("Booking retains normalization, success payload and general-error priority", () => {
  const normalized = parseBookingPayload({ name: " Promoter ", email: " PROMOTER@example.com ", date: " 2027-05-02 ", message: " A booking enquiry " });
  assert.deepEqual(normalized, valid);
  const { faxNumber, ...data } = valid;
  assert.equal(faxNumber, "");
  assert.deepEqual(validateBookingPayload(normalized), { ok: true, data });
  for (const [changes, error] of [
    [{ name: "", email: "invalid" }, "Please fill all required fields."],
    [{ email: "invalid", date: "invalid", message: "short" }, "Please provide a valid email address."],
    [{ date: "invalid", message: "short", name: "x".repeat(121) }, "Please provide a valid date."],
    [{ message: "short", name: "x".repeat(121) }, "Please add a few more details to your message."],
  ] as const) {
    const result = validateBookingPayload({ ...valid, ...changes });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, error);
  }
  assert.deepEqual(validateBookingPayload({ ...valid, faxNumber: "spam" }), { ok: false, spam: true });
});
