import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

// Opt-in only: point at a disposable database with the Booking migration applied.
// Never falls back to DATABASE_URL or .env.local. Notifications are always mocked.
test("Booking idempotency enforced by PostgreSQL", { skip: !process.env.BOOKING_TEST_DATABASE_URL }, async (t) => {
  const databaseUrl = process.env.BOOKING_TEST_DATABASE_URL!;
  const url = new URL(databaseUrl);
  assert.ok(["127.0.0.1", "localhost"].includes(url.hostname));
  assert.match(url.pathname, /booking.*test/);
  process.env.DATABASE_URL = databaseUrl;
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
  process.env.TURNSTILE_SECRET_KEY = "";
  const { default: prisma } = await import("./prisma");
  const { Resend } = await import("resend");
  const { POST } = await import("../app/api/booking/route");
  let sends = 0;
  let bandFails = false;
  let promoterFails = false;
  let pauseEmails: Promise<void> | null = null;
  let releaseEmails: (() => void) | undefined;
  const privateError = "PRIVATE_EMAIL_PROVIDER_DETAIL";
  t.mock.method(console, "error", () => {});
  t.mock.method(Object.getPrototypeOf(new Resend("re_test_key").emails), "send", async (input: { to: string[] }) => {
    sends++;
    if (pauseEmails) await pauseEmails;
    const fails = input.to.includes("promoter@example.com") ? promoterFails : bandFails;
    return fails ? { error: { message: privateError } } : { data: { id: "email" }, error: null };
  });
  const contents = { name: "Promoter", email: "promoter@example.com", date: "2027-05-02", message: "Festival booking enquiry" };
  const request = (key: string, changes = {}) => new Request("https://booking.example/api/booking", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ ...contents, ...changes }),
  });
  const submit = async (key: string, changes = {}) => {
    const response = await POST(request(key, changes));
    return { status: response.status, body: await response.json() };
  };
  try {
    await t.test("migration preserves existing bookings without idempotency data", async () => {
      const legacy = await prisma.bookingRequest.findUnique({ where: { id: "legacy-booking" } });
      assert.ok(legacy);
      assert.equal(legacy.idempotencyKey, null);
      assert.equal(legacy.idempotencyRequestHash, null);
      assert.equal(legacy.bookingNotificationResult, null);
    });
    await t.test("new save, sequential replay, lost response and content binding", async () => {
      const key = randomUUID();
      const before = sends;
      const first = await submit(key);
      assert.equal(first.status, 200);
      assert.equal(first.body.notificationStatus, "complete");
      const replay = await submit(key); // Also models a discarded first response.
      assert.equal(replay.body.bookingRequestId, first.body.bookingRequestId);
      assert.equal(replay.body.alreadyProcessed, true);
      assert.equal(replay.body.notificationStatus, "complete");
      assert.equal(sends, before + 2);
      assert.equal(await prisma.bookingRequest.count({ where: { idempotencyKey: key } }), 1);
      const normalized = await submit(key, { name: " Promoter ", email: "PROMOTER@example.com", turnstileToken: "refreshed-token" });
      assert.equal(normalized.body.bookingRequestId, first.body.bookingRequestId);
      const conflict = await submit(key, { message: "Changed booking enquiry" });
      assert.equal(conflict.status, 409);
      assert.equal(conflict.body.stored, undefined);
      assert.doesNotMatch(JSON.stringify(conflict.body), new RegExp(key + "|" + privateError));
      assert.equal(sends, before + 2);
      const other = await submit(randomUUID());
      assert.notEqual(other.body.bookingRequestId, first.body.bookingRequestId);
      assert.equal(sends, before + 4);
    });
    await t.test("concurrent inserts create one row and send each email once", async () => {
      const key = randomUUID();
      const before = sends;
      // Force all eight API requests past their initial lookup before any insert.
      // The real database must arbitrate the race, not the preliminary lookup.
      const originalCreate = prisma.bookingRequest.create;
      let arrivals = 0;
      let uniqueConflicts = 0;
      let releaseInserts!: () => void;
      const barrier = new Promise<void>((resolve) => { releaseInserts = resolve; });
      prisma.bookingRequest.create = (async (args: Parameters<typeof originalCreate>[0]) => {
        if (++arrivals === 8) releaseInserts();
        await barrier;
        try { return await originalCreate(args); }
        catch (error) {
          if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") uniqueConflicts++;
          throw error;
        }
      }) as unknown as typeof originalCreate;
      pauseEmails = new Promise<void>((resolve) => { releaseEmails = resolve; });
      const submissions = Array.from({ length: 8 }, () => submit(key));
      try {
        // The winner stays in email processing; all duplicates must finish safely.
        for (let i = 0; i < 100 && sends === before; i++) await new Promise((resolve) => setTimeout(resolve, 10));
        const early = await submit(key);
        assert.equal(early.body.stored, true);
        assert.equal(early.body.alreadyProcessed, true);
        assert.equal(early.body.notificationStatus, "incomplete");
      } finally {
        releaseEmails!(); pauseEmails = null;
        prisma.bookingRequest.create = originalCreate;
      }
      const results = await Promise.all(submissions);
      assert.ok(results.every((result) => result.status === 200 && result.body.stored));
      assert.equal(new Set(results.map((result) => result.body.bookingRequestId)).size, 1);
      assert.equal(await prisma.bookingRequest.count({ where: { idempotencyKey: key } }), 1);
      assert.equal(sends, before + 2);
      assert.equal(uniqueConflicts, 7);
      assert.equal((await submit(key)).body.notificationStatus, "complete");
    });
    await t.test("notification-state write failure cannot fail storage or resend emails", async () => {
      const originalUpdate = prisma.bookingRequest.update;
      prisma.bookingRequest.update = (async () => { throw new Error(privateError); }) as typeof originalUpdate;
      const key = randomUUID();
      const before = sends;
      let first;
      try { first = await submit(key); }
      finally { prisma.bookingRequest.update = originalUpdate; }
      assert.equal(first.body.stored, true);
      const replay = await submit(key);
      assert.equal(replay.body.bookingRequestId, first.body.bookingRequestId);
      assert.equal(replay.body.stored, true);
      assert.equal(replay.body.notificationStatus, "incomplete");
      assert.equal(sends, before + 2);
    });
    await t.test("all delivery outcomes are replayed without duplicate email", async () => {
      for (const [band, promoter] of [[false, false], [true, false], [false, true], [true, true]]) {
        bandFails = band; promoterFails = promoter;
        const key = randomUUID();
        const before = sends;
        const first = await submit(key);
        const replay = await submit(key);
        assert.equal(replay.body.bookingRequestId, first.body.bookingRequestId);
        assert.equal(replay.body.emailed, !band);
        assert.equal(replay.body.confirmationEmailed, !promoter);
        assert.equal(replay.body.notificationStatus, band || promoter ? "incomplete" : "complete");
        assert.equal(sends, before + 2);
        assert.doesNotMatch(JSON.stringify(replay.body), new RegExp(key + "|" + privateError));
      }
    });
    await t.test("missing and malformed keys cannot create bookings", async () => {
      const response = await submit("invalid");
      assert.equal(response.status, 400);
      const noKey = request(randomUUID()); noKey.headers.delete("Idempotency-Key");
      assert.equal((await POST(noKey)).status, 400);
    });
    await t.test("first-time requests require Turnstile; saved replays do not consume another token", async () => {
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
      process.env.TURNSTILE_SECRET_KEY = "test-server-secret";
      const key = randomUUID();
      const missing = await submit(key);
      assert.equal(missing.status, 400);
      assert.equal(await prisma.bookingRequest.count({ where: { idempotencyKey: key } }), 0);
      const verification = t.mock.method(globalThis, "fetch", async () => Response.json({ success: true, hostname: "booking.example", action: "booking_form" }));
      try {
        const first = await submit(key, { turnstileToken: "test-token" });
        assert.equal(first.body.stored, true);
        const before = sends;
        const replay = await submit(key, { turnstileToken: "refreshed-token" });
        assert.equal(replay.body.bookingRequestId, first.body.bookingRequestId);
        assert.equal(replay.body.alreadyProcessed, true);
        assert.equal(verification.mock.callCount(), 1);
        assert.equal(sends, before);
      } finally {
        verification.mock.restore();
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
        process.env.TURNSTILE_SECRET_KEY = "";
      }
    });
  } finally {
    await prisma.$disconnect();
  }
});
