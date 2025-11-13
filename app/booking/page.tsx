"use client";

import { useState } from "react";
import styles from "./booking.module.css";
import BookingForm from "../components/bookingPage/bookingForm";
import BookingFAQ from "../components/bookingPage/bookingFAQ";
import BookingHero from "../components/bookingPage/bookingHero";

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

        // Honeypot
        if ((data.get("website") as string)?.length) {
            setLoading(false);
            setOk(true);
            form.reset();
            return;
        }

        // Basic required validation
        const required = ["name", "email", "message", "date"] as const;
        for (const key of required) {
            const v = String(data.get(key) || "").trim();
            if (!v) {
                setError("Please fill all required fields.");
                setLoading(false);
                return;
            }
        }

        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(data as any)),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Request failed");
            setOk(true);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setOk(false);
            setError("Something went wrong. Please try again or email us directly.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.page}>
            <BookingHero />

            <BookingForm handleSubmit={handleSubmit} error={error} loading={loading} ok={ok}/>
            
            <BookingFAQ />

        </main>
    );
};
