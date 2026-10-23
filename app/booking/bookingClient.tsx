"use client";

import { useCallback, useState } from "react";
import { buildBookingPayload, validateBookingPayload } from "@/lib/booking";
import BookingForm from "../components/bookingPage/bookingForm";
import { BOOKING_UNAVAILABLE_MESSAGE, type BookingTurnstileConfig } from "@/lib/turnstile.shared";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import styles from "./booking.module.css";

export default function BookingClient({ turnstileConfig }: { turnstileConfig: BookingTurnstileConfig }) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);
  const [verificationUnavailable, setVerificationUnavailable] = useState(false);
  const handleTurnstileUnavailable = useCallback(() => setVerificationUnavailable(true), []);

  const turnstileEnabled = turnstileConfig.state === "enabled";
  const unavailable = turnstileConfig.state === "unavailable" || verificationUnavailable;
  const turnstileSiteKey = turnstileConfig.state === "enabled" ? turnstileConfig.siteKey : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (unavailable) return;
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
        setError("Invalid request. Please try again.");
        setTurnstileToken("");
        setTurnstileResetCounter((current) => current + 1);
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
      const res = await fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          turnstileToken,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json().catch(() => null);

      if (result?.code === "BOOKING_UNAVAILABLE") {
        setVerificationUnavailable(true);
        return;
      }

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

  /* The request section only; the page around it is server-rendered */
  if (unavailable) {
    return (
      <section id="booking-request" className={styles.request} aria-labelledby="booking-request-title">
        <header className={styles.requestHead}>
          <h2 id="booking-request-title" className={styles.requestTitle}>Booking request</h2>
        </header>
        <div className={styles.form} role="status">
          <p>{BOOKING_UNAVAILABLE_MESSAGE}</p>
          <p className={styles.altContact}>
            <a href={`mailto:${CONTACT_EMAIL}`} className="action-link">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>
    );
  }
  return (
      <BookingForm
        handleSubmit={handleSubmit}
        error={error}
        loading={loading}
        ok={ok}
        onTurnstileTokenChange={setTurnstileToken}
        onTurnstileUnavailable={handleTurnstileUnavailable}
        submitDisabled={loading || (turnstileEnabled && !turnstileToken)}
        turnstileResetCounter={turnstileResetCounter}
        turnstileSiteKey={turnstileSiteKey}
      />
  );
}
