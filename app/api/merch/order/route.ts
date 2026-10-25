import {
  MerchOrderConfirmationTemplate,
  MerchOrderTemplate,
} from "@/app/components/emailTemplate/merchOrderTemplate";
import {
  parseMerchOrderPayload,
  type ValidMerchOrderPayload,
  validateMerchOrderPayload,
} from "@/lib/merch-order";
import prisma from "@/lib/prisma";
import { calculateShipping } from "@/app/lib/shipping";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import type { StoredMerchOrderResponse } from "@/lib/merch-order-result";
import { createHash } from "node:crypto";
import { isMerchIdempotencyKey } from "@/lib/merch-order-attempt";

/* Only these business-validation messages are safe to return to a customer. */
class MerchAvailabilityError extends Error {}

const MAX_QTY_PER_ITEM = 20;
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const merchFromEmail =
  process.env.RESEND_FROM_EMAIL ??
  `Until They Fall Merch <${CONTACT_EMAIL}>`;
const merchToEmail =
  process.env.MERCH_TO_EMAIL ??
  process.env.BOOKING_TO_EMAIL ??
  CONTACT_EMAIL;

export type MerchOrderSummary = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  email: string;
  country: string;
  notes: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

function buildOrderNumber() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `UTF-${stamp}-${suffix}`;
}

async function buildOrderSummary(
  payload: ValidMerchOrderPayload
): Promise<Omit<MerchOrderSummary, "orderId" | "orderNumber">> {
  const productIds = payload.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });

  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = payload.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new MerchAvailabilityError("One or more products are no longer available.");
    }

    const maxQty =
      typeof product.stock === "number"
        ? Math.max(0, Math.min(product.stock, MAX_QTY_PER_ITEM))
        : MAX_QTY_PER_ITEM;

    if (maxQty <= 0) {
      throw new MerchAvailabilityError(`${product.name} is sold out.`);
    }

    const quantity = Math.min(item.quantity, maxQty);
    const lineTotal = product.price * quantity;

    return {
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = calculateShipping(subtotal);

  return {
    customerName: payload.name,
    email: payload.email,
    country: payload.country,
    notes: payload.notes,
    subtotal,
    shipping,
    total: subtotal + shipping,
    items,
  };
}

async function sendMerchEmails(order: MerchOrderSummary) {
  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Merch order stored without email.");
    return {
      emailed: false,
      confirmationEmailed: false,
      errors: ["RESEND_API_KEY is missing."],
    };
  }

  const [orderEmailResult, confirmationEmailResult] =
    await Promise.allSettled([
      Promise.resolve().then(() => resend.emails.send({
        from: merchFromEmail,
        to: [merchToEmail],
        replyTo: order.email,
        subject: `New merch order request ${order.orderNumber}`,
        react: MerchOrderTemplate({ order }),
      })),
      Promise.resolve().then(() => resend.emails.send({
        from: merchFromEmail,
        to: [order.email],
        replyTo: merchToEmail,
        subject: `We received your merch request - ${order.orderNumber}`,
        react: MerchOrderConfirmationTemplate({
          merchEmail: merchToEmail,
          order,
        }),
      })),
    ]);

  let emailed = false;
  let confirmationEmailed = false;
  const errors: string[] = [];

  if (orderEmailResult.status === "fulfilled") {
    if (orderEmailResult.value.error) {
      console.error("MERCH EMAIL ERROR:", orderEmailResult.value.error);
      errors.push("Internal merch email failed.");
    } else {
      emailed = true;
    }
  } else {
    console.error("MERCH EMAIL ERROR:", orderEmailResult.reason);
    errors.push("Internal merch email failed.");
  }

  if (confirmationEmailResult.status === "fulfilled") {
    if (confirmationEmailResult.value.error) {
      console.error(
        "MERCH CONFIRMATION EMAIL ERROR:",
        confirmationEmailResult.value.error
      );
      errors.push("Customer confirmation email failed.");
    } else {
      confirmationEmailed = true;
    }
  } else {
    console.error(
      "MERCH CONFIRMATION EMAIL ERROR:",
      confirmationEmailResult.reason
    );
    errors.push("Customer confirmation email failed.");
  }

  return { emailed, confirmationEmailed, errors };
}

async function findProcessedOrder(idempotencyKey: string) {
  return prisma.customerOrder.findUnique({
    where: { idempotencyKey },
    select: { id: true, orderNumber: true, idempotencyRequestHash: true, merchNotificationResult: true },
  });
}

function processedOrderResponse(order: NonNullable<Awaited<ReturnType<typeof findProcessedOrder>>>, requestHash: string) {
  if (order.idempotencyRequestHash !== requestHash) {
    return Response.json({ error: "This checkout attempt was already used for different order details. Please contact the band if you need to change the request." }, { status: 409 });
  }
  if (!order.orderNumber) throw new Error("Stored merch order is missing its reference.");
  const result = order.merchNotificationResult;
  const known = result !== null && typeof result === "object" && !Array.isArray(result)
    && typeof result.emailed === "boolean" && typeof result.confirmationEmailed === "boolean";
  const emailed = known && result.emailed === true;
  const confirmationEmailed = known && result.confirmationEmailed === true;
  return Response.json({
    success: true, stored: true, orderId: order.id, orderNumber: order.orderNumber,
    emailed, confirmationEmailed, alreadyProcessed: true,
    notificationStatus: !known ? "pending" : emailed && confirmationEmailed ? "complete" : "incomplete",
  } satisfies StoredMerchOrderResponse);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = parseMerchOrderPayload(body);
    const validation = validateMerchOrderPayload(payload);

    if (!validation.ok) {
      if (validation.spam) {
        console.warn("MERCH ORDER REJECTED: honeypot field was filled.");
        return Response.json({ error: "Invalid request." }, { status: 400 });
      }

      return Response.json(
        { error: validation.error ?? "Invalid request" },
        { status: 400 }
      );
    }

    const key = req.headers.get("Idempotency-Key")?.trim();
    if (!isMerchIdempotencyKey(key)) {
      return Response.json({ error: "This checkout attempt is invalid. Please refresh the page and try again." }, { status: 400 });
    }
    const idempotencyKey = key.toLowerCase();
    const requestHash = createHash("sha256").update(JSON.stringify({
      ...validation.data,
      items: [...validation.data.items].sort((a, b) => a.productId.localeCompare(b.productId) || a.quantity - b.quantity),
    })).digest("hex");
    const existing = await findProcessedOrder(idempotencyKey);
    if (existing) return processedOrderResponse(existing, requestHash);

    const orderNumber = buildOrderNumber();
    const summary = await buildOrderSummary(validation.data);

    let savedOrder: { id: string };
    try {
      savedOrder = await prisma.customerOrder.create({
        data: {
          idempotencyKey,
          idempotencyRequestHash: requestHash,
          orderNumber,
          status: "PENDING_PAYMENT",
          source: "PUBLIC_SITE",
          currency: "EUR",
          subtotalAmount: summary.subtotal,
          shippingAmount: summary.shipping,
          totalAmount: summary.total,
          customerName: summary.customerName,
          email: summary.email,
          shippingCountry: summary.country,
          notes: summary.notes || null,
          items: {
            create: summary.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
              productNameSnapshot: item.name,
            })),
          },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        // The unique index chooses one winner; losing requests replay its row.
        const winner = await findProcessedOrder(idempotencyKey);
        if (winner) return processedOrderResponse(winner, requestHash);
      }
      throw error;
    }

    const order: MerchOrderSummary = {
      ...summary,
      orderId: savedOrder.id,
      orderNumber,
    };

    let emailed = false;
    let confirmationEmailed = false;
    try {
      ({ emailed, confirmationEmailed } = await sendMerchEmails(order));
    } catch (error) {
      // Once persisted, even an unexpected notification error cannot fail the order.
      console.error("MERCH NOTIFICATION ERROR:", error);
    }

    try {
      await prisma.customerOrder.update({
        where: { id: savedOrder.id },
        data: { merchNotificationResult: { emailed, confirmationEmailed } },
        select: { id: true },
      });
    } catch (error) {
      // Never resend on replay when delivery status could not be recorded.
      console.error("MERCH NOTIFICATION STATUS ERROR:", error);
    }

    return Response.json({
      success: true,
      stored: true,
      emailed,
      confirmationEmailed,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      alreadyProcessed: false,
      notificationStatus: emailed && confirmationEmailed ? "complete" : "incomplete",
    } satisfies StoredMerchOrderResponse);
  } catch (error) {
    console.error("MERCH ORDER ERROR:", error);

    return Response.json(
      {
        success: false,
        stored: false,
        error:
          error instanceof MerchAvailabilityError
            ? error.message
            : "Order request could not be saved. Please try again.",
      },
      { status: 500 }
    );
  }
}
