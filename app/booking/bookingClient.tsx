"use client";

import { useCallback, useRef, useState } from "react";
import { completeBookingAttempt, getBookingAttempt } from "@/lib/booking-attempt";
import { buildBookingPayload, getBookingFieldErrors, validateBookingPayload, type BookingField, type BookingFieldErrors } from "@/lib/booking";
import { readSavedBookingResult, type SavedBookingResult } from "@/lib/booking-result";
import BookingForm from "../components/bookingPage/bookingForm";
import { BOOKING_UNAVAILABLE_MESSAGE, type BookingTurnstileConfig } from "@/lib/turnstile.shared";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import styles from "./booking.module.css";

export default function BookingClient({ turnstileConfig }: { turnstileConfig: BookingTurnstileConfig }) {
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);
  const [savedResult, setSavedResult] = useState<SavedBookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);
  const [verificationUnavailable, setVerificationUnavailable] = useState(false);
  const handleTurnstileUnavailable = useCallback(() => setVerificationUnavailable(true), []);

  const turnstileEnabled = turnstileConfig.state === "enabled";
  const unavailable = turnstileConfig.state === "unavailable" || verificationUnavailable;
  const turnstileSiteKey = turnstileConfig.state === "enabled" ? turnstileConfig.siteKey : "";

  function handleFieldBlur(e: React.FocusEvent<HTMLFormElement>) {
    if (!validationAttempt || loading) return;
    const target = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    const payload = buildBookingPayload(new FormData(e.currentTarget));
    if (target.name === "faxNumber" || !Object.prototype.hasOwnProperty.call(payload, target.name)) return;
    const field = target.name as BookingField;
    const message = getBookingFieldErrors(payload)[field];
    setFieldErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (unavailable || submitting.current) return;
    setLoading(true);
    setSavedResult(null);
    setError(null);
    setFieldErrors({});

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

      setFieldErrors(validation.fieldErrors ?? {});
      setValidationAttempt((current) => current + 1);
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setLoading(false);
      setError("Please complete the verification challenge.");
      return;
    }

    try {
      submitting.current = true;
      const attemptKey = getBookingAttempt(window.sessionStorage);
      const res = await fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          turnstileToken,
        }),
        headers: { "Content-Type": "application/json", "Idempotency-Key": attemptKey },
      });

      const result = await res.json().catch(() => null);

      if (result?.code === "BOOKING_UNAVAILABLE") {
        setVerificationUnavailable(true);
        return;
      }

      const saved = readSavedBookingResult(result);
      if (!saved) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Something went wrong. Please try again or email us directly."
        );
      }

      setSavedResult(saved);
      setFieldErrors({});
      setValidationAttempt(0);
      setTurnstileToken("");
      setTurnstileResetCounter((current) => current + 1);
      form.reset();
      // Storage cleanup must never turn a confirmed save into a failed request.
      try {
        completeBookingAttempt(window.sessionStorage, attemptKey);
      } catch {
        // Retaining the key is safer than losing the saved-request confirmation.
      }
    } catch (error) {
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
      submitting.current = false;
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
        error={Object.keys(fieldErrors).length ? "Please check the highlighted fields." : error}
        fieldErrors={fieldErrors}
        handleFieldBlur={handleFieldBlur}
        validationAttempt={validationAttempt}
        loading={loading}
        savedResult={savedResult}
        onTurnstileTokenChange={setTurnstileToken}
        onTurnstileUnavailable={handleTurnstileUnavailable}
        submitDisabled={loading || (turnstileEnabled && !turnstileToken)}
        turnstileResetCounter={turnstileResetCounter}
        turnstileSiteKey={turnstileSiteKey}
      />
  );
}
