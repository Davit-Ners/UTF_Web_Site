import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { readSavedBookingResult } from "./booking-result";

test("Booking separates saved requests from email delivery", async (t) => {
  const envNames = ["DATABASE_URL", "RESEND_API_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"] as const;
  const previous = envNames.map((name) => process.env[name]);
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
  process.env.TURNSTILE_SECRET_KEY = "";
  try {
    const { default: prisma } = await import("./prisma");
    const { Resend } = await import("resend");
    const { POST } = await import("../app/api/booking/route");
    const originalCreate = prisma.bookingRequest.create;
    const originalFind = prisma.bookingRequest.findUnique;
    const originalUpdate = prisma.bookingRequest.update;
    prisma.bookingRequest.findUnique = t.mock.fn(async () => null) as unknown as typeof prisma.bookingRequest.findUnique;
    prisma.bookingRequest.update = t.mock.fn(async () => ({ id: "cmbookingrequestreference" })) as unknown as typeof prisma.bookingRequest.update;
    const reference = "cmbookingrequestreference";
    const privateError = "PRIVATE_PROVIDER_DATABASE_STACK";
    let storageFails = false;
    let bandFails = false;
    let promoterFails = false;
    let synchronousFailure = false;
    let sends = 0;
    let saves = 0;
    const create = t.mock.fn(async () => {
      if (storageFails) throw new Error(privateError);
      saves++;
      return { id: reference };
    });
    prisma.bookingRequest.create = create as unknown as typeof prisma.bookingRequest.create;
    assert.equal(prisma.bookingRequest.create, create);
    t.after(() => {
      prisma.bookingRequest.create = originalCreate;
      prisma.bookingRequest.findUnique = originalFind;
      prisma.bookingRequest.update = originalUpdate;
    });
    t.mock.method(console, "error", () => {});
    t.mock.method(Object.getPrototypeOf(new Resend("re_test_key").emails), "send", (input: { to: string[] }) => {
      sends++;
      const fails = input.to.includes("promoter@example.com") ? promoterFails : bandFails;
      if (fails && synchronousFailure) throw new Error(privateError);
      if (fails && bandFails) return Promise.reject(new Error(privateError));
      return Promise.resolve(fails ? { error: { message: privateError } } : { data: { id: "email" }, error: null });
    });
    const request = (token = "") => new Request("https://booking.example/api/booking", {
      method: "POST", headers: { "Content-Type": "application/json", host: "booking.example", "Idempotency-Key": randomUUID() },
      body: JSON.stringify({ name: "Promoter", email: "promoter@example.com", date: "2027-05-02", message: "Festival booking enquiry", turnstileToken: token }),
    });
    for (const [label, band, promoter, sync] of [
      ["both emails sent", false, false, false],
      ["band notification fails", true, false, false],
      ["promoter confirmation fails", false, true, false],
      ["both emails fail", true, true, false],
      ["synchronous email error cannot fail a stored request", true, false, true],
    ] as const) {
      await t.test(label, async () => {
        bandFails = band; promoterFails = promoter; synchronousFailure = sync;
        const response = await POST(request());
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.deepEqual(body, {
          success: true, stored: true, bookingRequestId: reference,
          emailed: !band, confirmationEmailed: !promoter,
          notificationStatus: band || promoter ? "incomplete" : "complete",
        });
        assert.deepEqual(readSavedBookingResult(body), body);
        assert.doesNotMatch(JSON.stringify(body), new RegExp(privateError));
      });
    }
    await t.test("storage failure remains a safe failure and sends no emails", async () => {
      storageFails = true;
      const before = sends;
      const response = await POST(request());
      assert.equal(response.status, 500);
      const body = await response.json();
      assert.deepEqual(body, { success: false, stored: false, error: "Server error" });
      assert.equal(readSavedBookingResult(body), null);
      assert.equal(sends, before);
      storageFails = false;
    });
    await t.test("Turnstile still blocks missing tokens and verifies valid tokens before storage", async () => {
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
      process.env.TURNSTILE_SECRET_KEY = "server-secret";
      const before = saves;
      const missing = await POST(request());
      assert.equal(missing.status, 400);
      assert.equal(saves, before);
      const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({ success: true, hostname: "booking.example", action: "booking_form" }));
      const valid = await POST(request("test-token"));
      assert.equal(valid.status, 200);
      assert.equal((await valid.json()).stored, true);
      assert.equal(saves, before + 1);
      assert.equal(fetchMock.mock.callCount(), 1);
      fetchMock.mock.restore();
    });
  } finally {
    envNames.forEach((name, i) => {
      if (previous[i] === undefined) delete process.env[name];
      else process.env[name] = previous[i];
    });
  }
});

test("Booking client requires explicit storage and treats missing delivery flags as incomplete", () => {
  assert.equal(readSavedBookingResult({ success: true }), null);
  assert.equal(readSavedBookingResult({ stored: false, bookingRequestId: "ref" }), null);
  assert.equal(readSavedBookingResult({ stored: true }), null);
  assert.equal(readSavedBookingResult({ stored: true, bookingRequestId: "ref" })?.notificationStatus, "incomplete");
});
