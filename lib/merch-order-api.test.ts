import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";

test("merch API separates persistence from notification delivery", async (t) => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  const previousEmailKey = process.env.RESEND_API_KEY;
  // No live service is used: every database operation and email send is mocked.
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.RESEND_API_KEY = "re_test_key";

  try {
    const { default: prisma } = await import("./prisma");
    const { Resend } = await import("resend");
    const { POST } = await import("../app/api/merch/order/route");
    const emailPrototype = Object.getPrototypeOf(new Resend("re_test_key").emails);
    const privateError = "PRIVATE_DATABASE_PROVIDER_STACK_AND_CREDENTIALS";
    let storageFails = false;
    let saves = 0;
    let sends = 0;
    let delivery: "sent" | "provider-error" | "reject" | "throw" = "sent";
    let failedRecipient: "customer" | "band" | "both" = "both";
    const customer = "customer@example.com";

    const originalFindMany = prisma.product.findMany;
    const originalCreate = prisma.customerOrder.create;
    const originalFindUnique = prisma.customerOrder.findUnique;
    const originalUpdate = prisma.customerOrder.update;
    const findMany = t.mock.fn(async () => [{ id: "p1", name: "Test tee", price: 25, stock: 5 }]);
    const create = t.mock.fn(async () => {
      if (storageFails) throw new Error(privateError);
      saves++;
      return { id: "saved-order-id" };
    });
    // Prisma delegates are proxies without method descriptors for mock.method().
    // The fixture returns only the fields selected by this handler, not every generic Prisma result.
    prisma.product.findMany = findMany as unknown as typeof prisma.product.findMany;
    prisma.customerOrder.create = create as unknown as typeof prisma.customerOrder.create;
    prisma.customerOrder.findUnique = t.mock.fn(async () => null) as unknown as typeof prisma.customerOrder.findUnique;
    prisma.customerOrder.update = t.mock.fn(async () => ({ id: "saved-order-id" })) as unknown as typeof prisma.customerOrder.update;
    assert.equal(prisma.product.findMany, findMany);
    assert.equal(prisma.customerOrder.create, create);
    t.after(() => {
      prisma.product.findMany = originalFindMany;
      prisma.customerOrder.create = originalCreate;
      prisma.customerOrder.findUnique = originalFindUnique;
      prisma.customerOrder.update = originalUpdate;
    });
    t.mock.method(emailPrototype, "send", (input: { to: string[] }) => {
      sends++;
      const isCustomer = input.to.includes(customer);
      const shouldFail = failedRecipient === "both" || (failedRecipient === "customer" ? isCustomer : !isCustomer);
      if (shouldFail) {
        if (delivery === "throw") throw new Error(privateError);
        if (delivery === "reject") return Promise.reject(new Error(privateError));
        if (delivery === "provider-error") return Promise.resolve({ error: { message: privateError } });
      }
      return Promise.resolve({ data: { id: "email-id" }, error: null });
    });

    const request = () => new Request("https://example.com/api/merch/order", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": randomUUID() },
      body: JSON.stringify({ name: "Customer", email: customer, country: "Belgium", notes: "M", items: [{ productId: "p1", quantity: 2 }] }),
    });

    for (const [label, recipient, outcome, bandSent, customerSent] of [
      ["both emails succeed", "both", "sent", true, true],
      ["customer email fails", "customer", "provider-error", true, false],
      ["band email fails", "band", "reject", false, true],
      ["both emails fail", "both", "provider-error", false, false],
      ["synchronous email failure still preserves the order", "band", "throw", false, true],
    ] as const) {
      await t.test(label, async () => {
        failedRecipient = recipient;
        delivery = outcome;
        const before = saves;
        const response = await POST(request());
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.success, true);
        assert.equal(body.stored, true);
        assert.equal(body.orderId, "saved-order-id");
        assert.match(body.orderNumber, /^UTF-\d{8}-[A-Z0-9]+$/);
        assert.equal(body.emailed, bandSent);
        assert.equal(body.confirmationEmailed, customerSent);
        assert.equal(body.notificationStatus, bandSent && customerSent ? "complete" : "incomplete");
        assert.equal(saves, before + 1);
        assert.equal(body.error, undefined);
        assert.doesNotMatch(JSON.stringify(body), new RegExp(privateError));
      });
    }

    await t.test("storage failure returns only a safe error and sends no emails", async () => {
      storageFails = true;
      const beforeSaves = saves;
      const beforeSends = sends;
      const response = await POST(request());
      const body = await response.json();
      assert.equal(response.status, 500);
      assert.equal(body.success, false);
      assert.equal(body.stored, false);
      assert.equal(body.orderNumber, undefined);
      assert.equal(saves, beforeSaves);
      assert.equal(sends, beforeSends);
      assert.doesNotMatch(JSON.stringify(body), new RegExp(privateError));
      assert.match(body.error, /could not be saved/);
    });
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
    if (previousEmailKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousEmailKey;
  }
});
