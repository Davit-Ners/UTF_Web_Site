"use client";

import { useState } from "react";
import { buildBookingPayload, validateBookingPayload } from "@/lib/booking";
import styles from "./booking.module.css";
import BookingForm from "../components/bookingPage/bookingForm";
import BookingFAQ from "../components/bookingPage/bookingFAQ";
import BookingHero from "../components/bookingPage/bookingHero";
import WhyBookUs from "../components/bookingPage/whyBookUs";

export default function BookingPage() {
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState<null | boolean>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setOk(null);
        setError(null);

        const form = e.currentTarget;
        const data = new FormData(form);
        const payload = buildBookingPayload(data);
        const validation = validateBookingPayload(payload);

        if (!validation.ok) {
            setLoading(false);

            if (validation.spam) {
                setOk(true);
                form.reset();
                return;
            }

            setError(validation.error ?? "Please check the form and try again.");
            return;
        }

        try {
            const res = await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify(validation.data),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Request failed");
            setOk(true);
            (e.target as HTMLFormElement).reset();
        } catch {
            setOk(false);
            setError("Something went wrong. Please try again or email us directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <BookingHero />

            <WhyBookUs />

            <BookingForm handleSubmit={handleSubmit} error={error} loading={loading} ok={ok}/>
            
            <BookingFAQ />

        </main>
    );
};
