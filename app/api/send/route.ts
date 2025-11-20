import { EmailTemplate } from "@/app/components/emailTemplate/emailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailContent = {
    name: string;
    email: string;
    org: string;
    type: string;
    city: string;
    capacity: string;
    date: string;
    budget: string;
    message: string;
};

export async function POST(req: Request) {
    try {
        const body: EmailContent = await req.json();

        const { data, error } = await resend.emails.send({
            from: "UTF Booking <onboarding@resend.dev>",
            to: ["untiltheyfallband@gmail.com"],
            subject: `New booking request from ${body.name}`,
            react: EmailTemplate(body),
        });

        if (error) {
            console.error("EMAIL ERROR:", error);
            return Response.json({ error }, { status: 500 });
        }

        return Response.json({ success: true, data });
    } catch (err) {
        console.error("SERVER ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
};
