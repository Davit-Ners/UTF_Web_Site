import assert from "node:assert/strict";
import { test } from "node:test";
import { getBookingTurnstileConfig, validateTurnstileToken } from "./turnstile";
import { BOOKING_TURNSTILE_ACTION, BOOKING_UNAVAILABLE_MESSAGE } from "./turnstile.shared";

test("booking configuration and verification stay consistent without exposing the secret", async (t) => {
  const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  const originalFetch = globalThis.fetch;
  const siteKey = "1x00000000000000000000AA";
  const secret = "test-server-secret";
  const request = new Request("https://booking.example/booking", { headers: { host: "booking.example" } });
  let calls = 0;
  let response: object = { success: true, action: BOOKING_TURNSTILE_ACTION, hostname: "booking.example" };
  globalThis.fetch = async (_input, init) => {
    calls++;
    assert.equal((init?.body as FormData).get("secret"), secret);
    assert.equal((init?.body as FormData).get("response"), "test-token");
    return Response.json(response);
  };

  try {
    for (const [label, site, server, state] of [
      ["both keys absent", "", "", "disabled"],
      ["normal configuration", siteKey, secret, "enabled"],
      ["site missing, secret present", "", secret, "unavailable"],
      ["site unusable, secret present", "https://invalid.example", secret, "unavailable"],
      ["site present, secret absent", siteKey, "", "unavailable"],
      ["malformed site alone cannot disable verification", "invalid", "", "unavailable"],
    ]) {
      await t.test(label, async () => {
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = site;
        process.env.TURNSTILE_SECRET_KEY = server;
        const config = getBookingTurnstileConfig();
        assert.equal(config.state, state);
        assert.ok(!JSON.stringify(config).includes(secret));
        const before = calls;
        const result = await validateTurnstileToken({ request, token: "" });
        assert.equal(calls, before);
        if (state === "disabled") assert.deepEqual(result, { ok: true, skipped: true });
        else if (state === "unavailable") {
          assert.deepEqual(result, { ok: false, unavailable: true, error: BOOKING_UNAVAILABLE_MESSAGE });
          const withToken = await validateTurnstileToken({ request, token: "test-token" });
          assert.equal(withToken.ok, false);
          assert.equal(calls, before);
        } else {
          assert.equal(result.ok, false);
          assert.deepEqual(await validateTurnstileToken({ request, token: "test-token" }), { ok: true, skipped: false });
          assert.equal(calls, before + 1);
        }
      });
    }

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKey;
    process.env.TURNSTILE_SECRET_KEY = secret;
    await t.test("provider rejects an unusable server secret", async () => {
      response = { success: false, "error-codes": ["invalid-input-secret"] };
      assert.deepEqual(await validateTurnstileToken({ request, token: "test-token" }), {
        ok: false, unavailable: true, error: BOOKING_UNAVAILABLE_MESSAGE,
      });
    });
    await t.test("invalid tokens never bypass verification", async () => {
      response = { success: false, "error-codes": ["invalid-input-response"] };
      const result = await validateTurnstileToken({ request, token: "test-token" });
      assert.equal(result.ok, false);
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalSiteKey === undefined) delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
    if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = originalSecret;
  }
});
