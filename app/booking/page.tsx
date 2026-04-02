"use client";

import { useState } from "react";
import { buildBookingPayload, validateBookingPayload } from "@/lib/booking";
import styles from "./booking.module.css";
import BookingForm from "../components/bookingPage/bookingForm";
import BookingFAQ from "../components/bookingPage/bookingFAQ";
import BookingHero from "../components/bookingPage/bookingHero";
import WhyBookUs from "../components/bookingPage/whyBookUs";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);

  const turnstileEnabled = Boolean(turnstileSiteKey);

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
        setTurnstileToken("");
        setTurnstileResetCounter((current) => current + 1);
        form.reset();
        return;
      }

      setError(validation.error ?? "Please check the form and try again.");
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setLoading(false);
      setError("Please complete the verification challenge.");
      return;
    }

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          turnstileToken,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Something went wrong. Please try again or email us directly."
        );
      }

      setOk(true);
      setTurnstileToken("");
      setTurnstileResetCounter((current) => current + 1);
      form.reset();
    } catch (error) {
      setOk(false);
      setTurnstileToken("");

      if (turnstileEnabled) {
        setTurnstileResetCounter((current) => current + 1);
      }

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <BookingHero />

      <WhyBookUs />

      <BookingForm
        handleSubmit={handleSubmit}
        error={error}
        loading={loading}
        ok={ok}
        onTurnstileTokenChange={setTurnstileToken}
        submitDisabled={loading || (turnstileEnabled && !turnstileToken)}
        turnstileResetCounter={turnstileResetCounter}
        turnstileSiteKey={turnstileSiteKey}
      />

      <BookingFAQ />
    </main>
  );
}
