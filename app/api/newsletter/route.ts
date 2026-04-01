import prisma from "@/lib/prisma";

type NewsletterPayload = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
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
        source: "homepage-action-hub",
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("NEWSLETTER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
