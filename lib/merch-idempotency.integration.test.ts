import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";

const testUrl = process.env.MERCH_IDEMPOTENCY_TEST_DATABASE_URL;

test("Merch idempotency against a disposable PostgreSQL database", { skip: !testUrl }, async (t) => {
  const url = new URL(testUrl!);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.pathname, "/utf_merch_idempotency_test");
  const previousDatabaseUrl = process.env.DATABASE_URL;
  const previousEmailKey = process.env.RESEND_API_KEY;
  process.env.DATABASE_URL = testUrl;
  process.env.RESEND_API_KEY = "re_test_key";

  try {
    const { default: prisma } = await import("./prisma");
    const { Resend } = await import("resend");
    const { POST } = await import("../app/api/merch/order/route");
    let emails = 0;
    let emailFails = false;
    let emailGate: Promise<void> | null = null;
    t.mock.method(Object.getPrototypeOf(new Resend("re_test_key").emails), "send", async () => {
      emails++;
      if (emailGate) await emailGate;
      return emailFails ? { error: { message: "PRIVATE_PROVIDER_DETAIL" } } : { data: { id: randomUUID() }, error: null };
    });
    t.after(async () => { await prisma.$disconnect(); });

    const product = await prisma.product.create({
      data: { name: "Idempotency test CD", category: "music", status: "ACTIVE", price: 25, stock: 5 },
    });
    const payload = { name: "Test customer", email: `test-${randomUUID()}@example.com`, country: "Belgium", notes: "", items: [{ productId: product.id, quantity: 1 }] };
    const request = (key: string, input: object = payload) => new Request("https://example.com/api/merch/order", {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input),
    });
    const count = (key: string) => prisma.customerOrder.count({ where: { idempotencyKey: key } });
    let firstKey: string;
    let originalReference: string;

    await t.test("missing or invalid keys cannot create an unprotected order", async () => {
      const before = await prisma.customerOrder.count();
      for (const key of ["", "not-a-checkout-key"]) {
        assert.equal((await POST(request(key))).status, 400);
      }
      assert.equal(await prisma.customerOrder.count(), before);
    });

    await t.test("new request creates one row using server prices and shipping", async () => {
      firstKey = randomUUID();
      const response = await POST(request(firstKey, { ...payload, price: 0 }));
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.alreadyProcessed, false);
      assert.equal(body.notificationStatus, "complete");
      assert.equal(await count(firstKey), 1);
      originalReference = body.orderNumber;
      const saved = await prisma.customerOrder.findUniqueOrThrow({ where: { idempotencyKey: firstKey }, include: { items: true } });
      assert.equal(saved.subtotalAmount, 25);
      assert.equal(saved.shippingAmount, 7);
      assert.equal(saved.totalAmount, 32);
      assert.equal(saved.items[0].unitPrice, 25);
      assert.equal(emails, 2);
      assert.ok(!JSON.stringify(body).includes(firstKey));
    });

    await t.test("sequential retry returns the original reference and never resends emails", async () => {
      const before = emails;
      const body = await (await POST(request(firstKey))).json();
      assert.equal(body.orderNumber, originalReference);
      assert.equal(body.alreadyProcessed, true);
      assert.equal(body.notificationStatus, "complete");
      assert.equal(await count(firstKey), 1);
      assert.equal(emails, before);
    });

    await t.test("16 concurrent requests create one row and one pair of emails", async () => {
      const key = randomUUID();
      const before = emails;
      const responses = await Promise.all(Array.from({ length: 16 }, () => POST(request(key))));
      const bodies = await Promise.all(responses.map((response) => {
        assert.equal(response.status, 200);
        return response.json();
      }));
      assert.equal(new Set(bodies.map((body) => body.orderNumber)).size, 1);
      assert.equal(bodies.filter((body) => body.alreadyProcessed === false).length, 1);
      assert.equal(await count(key), 1);
      assert.equal(emails - before, 2);
      const saved = await prisma.customerOrder.findUniqueOrThrow({ where: { idempotencyKey: key }, include: { items: true } });
      assert.equal(saved.items.length, 1);
    });

    await t.test("lost response replay recovers the database reference", async () => {
      const key = randomUUID();
      await POST(request(key)); // Simulate a response that never reaches the customer.
      const saved = await prisma.customerOrder.findUniqueOrThrow({ where: { idempotencyKey: key } });
      const before = emails;
      const replay = await (await POST(request(key))).json();
      assert.equal(replay.orderNumber, saved.orderNumber);
      assert.equal(replay.alreadyProcessed, true);
      assert.equal(await count(key), 1);
      assert.equal(emails, before);
    });

    await t.test("different keys allow legitimate identical orders", async () => {
      const keys = [randomUUID(), randomUUID()];
      const bodies = await Promise.all(keys.map(async (key) => (await POST(request(key))).json()));
      assert.notEqual(bodies[0].orderNumber, bodies[1].orderNumber);
      for (const key of keys) assert.equal(await count(key), 1);
    });

    await t.test("a key cannot be reused to replace an order's customer/cart details", async () => {
      const before = emails;
      const response = await POST(request(firstKey, { ...payload, notes: "Changed request" }));
      assert.equal(response.status, 409);
      assert.equal(await count(firstKey), 1);
      assert.equal(emails, before);
      assert.ok(!JSON.stringify(await response.json()).includes(firstKey));
    });

    await t.test("email failures are replayed without retrying notifications", async () => {
      const key = randomUUID();
      emailFails = true;
      try {
        const first = await (await POST(request(key))).json();
        const before = emails;
        const replay = await (await POST(request(key))).json();
        assert.equal(first.notificationStatus, "incomplete");
        assert.equal(replay.notificationStatus, "incomplete");
        assert.equal(replay.orderNumber, first.orderNumber);
        assert.equal(replay.emailed, false);
        assert.equal(replay.confirmationEmailed, false);
        assert.equal(emails, before);
        assert.doesNotMatch(JSON.stringify(replay), /PRIVATE_PROVIDER_DETAIL/);
      } finally { emailFails = false; }
    });

    await t.test("in-flight replay reports saved/pending and does not send another email", async () => {
      const key = randomUUID();
      let release!: () => void;
      emailGate = new Promise<void>((resolve) => { release = resolve; });
      const original = POST(request(key));
      try {
        for (let i = 0; i < 100 && !(await count(key)); i++) await new Promise((resolve) => setTimeout(resolve, 10));
        const replay = await (await POST(request(key))).json();
        assert.equal(replay.stored, true);
        assert.equal(replay.alreadyProcessed, true);
        assert.equal(replay.notificationStatus, "pending");
        assert.equal(await count(key), 1);
      } finally {
        release();
        emailGate = null;
      }
      const first = await (await original).json();
      const after = await (await POST(request(key))).json();
      assert.equal(first.orderNumber, after.orderNumber);
      assert.equal(after.notificationStatus, "complete");
    });

    await t.test("first-time stock validation still rejects sold-out products; old requests still replay", async () => {
      await prisma.product.update({ where: { id: product.id }, data: { stock: 0 } });
      const key = randomUUID();
      const response = await POST(request(key));
      assert.equal(response.status, 500);
      assert.match((await response.json()).error, /sold out/);
      assert.equal(await count(key), 0);
      assert.equal((await (await POST(request(firstKey))).json()).orderNumber, originalReference);
    });

    await t.test("a first-time request retains the existing stock cap and free-shipping calculation", async () => {
      await prisma.product.update({ where: { id: product.id }, data: { stock: 5 } });
      const key = randomUUID();
      assert.equal((await POST(request(key, { ...payload, items: [{ productId: product.id, quantity: 8 }] }))).status, 200);
      const saved = await prisma.customerOrder.findUniqueOrThrow({ where: { idempotencyKey: key }, include: { items: true } });
      assert.equal(saved.items[0].quantity, 5);
      assert.equal(saved.subtotalAmount, 125);
      assert.equal(saved.shippingAmount, 0);
      assert.equal(saved.totalAmount, 125);
    });
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
    if (previousEmailKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousEmailKey;
  }
});
