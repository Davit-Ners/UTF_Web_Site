import { NEWSLETTER_DISABLED_RESPONSE, NEWSLETTER_SIGNUP_ENABLED } from "@/lib/newsletter";
import prisma from "@/lib/prisma";

type NewsletterPayload = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  // Launch-disabled: refuse before parsing or any database access.
  if (!NEWSLETTER_SIGNUP_ENABLED) {
    return Response.json(NEWSLETTER_DISABLED_RESPONSE, { status: 503 });
  }

  try {
    const body = (await req.json()) as NewsletterPayload;
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        status: "ACTIVE",
        unsubscribedAt: null,
      },
      create: {
        email,
        status: "ACTIVE",
        source: "homepage-mailing-list",
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("NEWSLETTER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
