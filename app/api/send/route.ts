import { EmailTemplate } from "@/app/components/emailTemplate/emailTemplate";
import prisma from "@/lib/prisma";
import {
  bookingDateToDateTime,
  parseBookingPayload,
  type ValidBookingRequestPayload,
  validateBookingPayload,
} from "@/lib/booking";
import { Resend } from "resend";

export type EmailContent = ValidBookingRequestPayload;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const bookingFromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Until They Fall Booking <onboarding@resend.dev>";
const bookingToEmail =
  process.env.BOOKING_TO_EMAIL ?? "untiltheyfallband@gmail.com";

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
    const payload = parseBookingPayload(await req.json());
    const validation = validateBookingPayload(payload);

    if (!validation.ok) {
      if (validation.spam) {
        return Response.json({ success: true });
      }

      return Response.json(
        { error: validation.error ?? "Invalid request" },
        { status: 400 }
      );
    }

    const savedRequest = await prisma.bookingRequest.create({
      data: buildBookingRecord(validation.data),
      select: {
        id: true,
      },
    });

    let emailed = false;

    if (resend) {
      const { error } = await resend.emails.send({
        from: bookingFromEmail,
        to: [bookingToEmail],
        subject: `New booking request from ${validation.data.name}`,
        react: EmailTemplate(validation.data),
      });

      if (error) {
        console.error("EMAIL ERROR:", error);
      } else {
        emailed = true;
      }
    } else {
      console.warn("RESEND_API_KEY is missing. Booking request stored without email.");
    }

    return Response.json({
      success: true,
      stored: true,
      emailed,
      bookingRequestId: savedRequest.id,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
