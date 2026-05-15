import { BookingConfirmationTemplate } from "@/app/components/emailTemplate/bookingConfirmationTemplate";
import { EmailTemplate } from "@/app/components/emailTemplate/emailTemplate";
import {
  bookingDateToDateTime,
  parseBookingPayload,
  type ValidBookingRequestPayload,
  validateBookingPayload,
} from "@/lib/booking";
import prisma from "@/lib/prisma";
import { validateTurnstileToken } from "@/lib/turnstile";
import { BOOKING_TURNSTILE_ACTION } from "@/lib/turnstile.shared";
import { Resend } from "resend";

export type EmailContent = ValidBookingRequestPayload;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const bookingFromEmail =
  process.env.RESEND_FROM_EMAIL ??
  "Until They Fall Booking <contact@untiltheyfall.com>";
const bookingToEmail =
  process.env.BOOKING_TO_EMAIL ?? "contact@untiltheyfall.com";

function readTurnstileToken(input: unknown) {
  if (typeof input !== "object" || input === null) {
    return "";
  }

  const token = (input as Record<string, unknown>).turnstileToken;

  return typeof token === "string" ? token.trim() : "";
}

function logEmailError(label: string, error: unknown) {
  console.error(`${label} EMAIL ERROR:`, error);
}

async function sendBookingEmails(payload: ValidBookingRequestPayload) {
  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Booking request stored without email.");
    return { emailed: false, confirmationEmailed: false };
  }

  const [bookingEmailResult, confirmationEmailResult] =
    await Promise.allSettled([
      resend.emails.send({
        from: bookingFromEmail,
        to: [bookingToEmail],
        replyTo: payload.email,
        subject: `New booking request from ${payload.name}`,
        react: EmailTemplate(payload),
      }),
      resend.emails.send({
        from: bookingFromEmail,
        to: [payload.email],
        replyTo: bookingToEmail,
        subject: "We received your booking request - Until They Fall",
        react: BookingConfirmationTemplate({
          bookingEmail: bookingToEmail,
          request: payload,
        }),
      }),
    ]);

  let emailed = false;
  let confirmationEmailed = false;

  if (bookingEmailResult.status === "fulfilled") {
    if (bookingEmailResult.value.error) {
      logEmailError("BOOKING", bookingEmailResult.value.error);
    } else {
      emailed = true;
    }
  } else {
    logEmailError("BOOKING", bookingEmailResult.reason);
  }

  if (confirmationEmailResult.status === "fulfilled") {
    if (confirmationEmailResult.value.error) {
      logEmailError("CONFIRMATION", confirmationEmailResult.value.error);
    } else {
      confirmationEmailed = true;
    }
  } else {
    logEmailError("CONFIRMATION", confirmationEmailResult.reason);
  }

  return { emailed, confirmationEmailed };
}

function buildBookingRecord(payload: ValidBookingRequestPayload) {
  return {
    source: "PUBLIC_SITE" as const,
    name: payload.name,
    email: payload.email,
    organization: payload.org || null,
    eventType: payload.type || null,
    city: payload.city || null,
    venueCapacity: payload.capacity || null,
    requestedDate: bookingDateToDateTime(payload.date),
    budgetLabel: payload.budget || null,
    message: payload.message,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = parseBookingPayload(body);
    const turnstileToken = readTurnstileToken(body);
    const validation = validateBookingPayload(payload);

    if (!validation.ok) {
      if (validation.spam) {
        console.warn("BOOKING REQUEST REJECTED: honeypot field was filled.");
        return Response.json({ error: "Invalid request." }, { status: 400 });
      }

      return Response.json(
        { error: validation.error ?? "Invalid request" },
        { status: 400 }
      );
    }

    const turnstileValidation = await validateTurnstileToken({
      token: turnstileToken,
      request: req,
      expectedAction: BOOKING_TURNSTILE_ACTION,
    });

    if (!turnstileValidation.ok) {
      return Response.json(
        { error: turnstileValidation.error },
        { status: 400 }
      );
    }

    const savedRequest = await prisma.bookingRequest.create({
      data: buildBookingRecord(validation.data),
      select: {
        id: true,
      },
    });

    const { emailed, confirmationEmailed } = await sendBookingEmails(
      validation.data
    );

    return Response.json({
      success: true,
      stored: true,
      emailed,
      confirmationEmailed,
      bookingRequestId: savedRequest.id,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
