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
import { Resend } from "resend";

const MAX_QTY_PER_ITEM = 20;
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const merchFromEmail =
  process.env.RESEND_FROM_EMAIL ??
  "Until They Fall Merch <contact@untiltheyfall.com>";
const merchToEmail =
  process.env.MERCH_TO_EMAIL ??
  process.env.BOOKING_TO_EMAIL ??
  "contact@untiltheyfall.com";

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

function calculateShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= 80 ? 0 : 7;
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
      throw new Error("One or more products are no longer available.");
    }

    const maxQty =
      typeof product.stock === "number"
        ? Math.max(0, Math.min(product.stock, MAX_QTY_PER_ITEM))
        : MAX_QTY_PER_ITEM;

    if (maxQty <= 0) {
      throw new Error(`${product.name} is sold out.`);
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
    return { emailed: false, confirmationEmailed: false };
  }

  const [orderEmailResult, confirmationEmailResult] =
    await Promise.allSettled([
      resend.emails.send({
        from: merchFromEmail,
        to: [merchToEmail],
        replyTo: order.email,
        subject: `New merch order request ${order.orderNumber}`,
        react: MerchOrderTemplate({ order }),
      }),
      resend.emails.send({
        from: merchFromEmail,
        to: [order.email],
        replyTo: merchToEmail,
        subject: `We received your merch request - ${order.orderNumber}`,
        react: MerchOrderConfirmationTemplate({
          merchEmail: merchToEmail,
          order,
        }),
      }),
    ]);

  let emailed = false;
  let confirmationEmailed = false;

  if (orderEmailResult.status === "fulfilled") {
    if (orderEmailResult.value.error) {
      console.error("MERCH EMAIL ERROR:", orderEmailResult.value.error);
    } else {
      emailed = true;
    }
  } else {
    console.error("MERCH EMAIL ERROR:", orderEmailResult.reason);
  }

  if (confirmationEmailResult.status === "fulfilled") {
    if (confirmationEmailResult.value.error) {
      console.error(
        "MERCH CONFIRMATION EMAIL ERROR:",
        confirmationEmailResult.value.error
      );
    } else {
      confirmationEmailed = true;
    }
  } else {
    console.error(
      "MERCH CONFIRMATION EMAIL ERROR:",
      confirmationEmailResult.reason
    );
  }

  return { emailed, confirmationEmailed };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = parseMerchOrderPayload(body);
    const validation = validateMerchOrderPayload(payload);

    if (!validation.ok) {
      if (validation.spam) {
        return Response.json({ success: true });
      }

      return Response.json(
        { error: validation.error ?? "Invalid request" },
        { status: 400 }
      );
    }

    const orderNumber = buildOrderNumber();
    const summary = await buildOrderSummary(validation.data);

    const savedOrder = await prisma.customerOrder.create({
      data: {
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

    const order: MerchOrderSummary = {
      ...summary,
      orderId: savedOrder.id,
      orderNumber,
    };

    const { emailed, confirmationEmailed } = await sendMerchEmails(order);

    return Response.json({
      success: true,
      stored: true,
      emailed,
      confirmationEmailed,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("MERCH ORDER ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
