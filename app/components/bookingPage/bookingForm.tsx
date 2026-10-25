"use client";

import { CONTACT_EMAIL } from "@/app/lib/contact";
import { useEffect, useRef } from "react";
import { type BookingField, type BookingFieldErrors } from "@/lib/booking";
import { type SavedBookingResult } from "@/lib/booking-result";
import BookingTurnstile from "./bookingTurnstile";
import styles from "../../booking/booking.module.css";

type BookingFormProps = {
  error: null | string;
  fieldErrors: BookingFieldErrors;
  handleFieldBlur: (e: React.FocusEvent<HTMLFormElement>) => void;
  validationAttempt: number;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  savedResult: SavedBookingResult | null;
  onTurnstileTokenChange: (token: string) => void;
  onTurnstileUnavailable: () => void;
  submitDisabled: boolean;
  turnstileResetCounter: number;
  turnstileSiteKey: string;
};

function Label({ htmlFor, children, required = false }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      <span>{children}</span>
      <span className={required ? styles.req : styles.optional}>{required ? "Required" : "Optional"}</span>
    </label>
  );
}

function FieldError({ field, errors }: { field: BookingField; errors: BookingFieldErrors }) {
  return errors[field] ? (
    <p id={`booking-${field}-error`} className={`${styles.status} ${styles.error}`}>{errors[field]}</p>
  ) : null;
}

export default function BookingForm({
  error,
  fieldErrors,
  handleFieldBlur,
  validationAttempt,
  handleSubmit,
  loading,
  savedResult,
  onTurnstileTokenChange,
  onTurnstileUnavailable,
  submitDisabled,
  turnstileResetCounter,
  turnstileSiteKey,
}: BookingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (validationAttempt) {
      // Runs after errors/ARIA have committed, only on an invalid submit.
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [validationAttempt]);

  function fieldAttributes(field: BookingField) {
    return {
      "aria-invalid": fieldErrors[field] ? true : undefined,
      "aria-describedby": fieldErrors[field] ? `booking-${field}-error` : undefined,
    };
  }
  return (
    <section id="booking-request" className={styles.request} aria-labelledby="booking-request-title">
      <header className={styles.requestHead}>
        <h2 id="booking-request-title" className={styles.requestTitle}>
          Booking request
        </h2>
        <p className={styles.requestIntro}>
          Send the date, city, event type and any useful production details.
        </p>
      </header>

      <form ref={formRef} noValidate onSubmit={handleSubmit} onBlur={handleFieldBlur} className={styles.form}>
        {/* Honeypot */}
        <input
          type="text"
          name="faxNumber"
          className={styles.honey}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className={styles.grid}>
          <div className={styles.group}>
            <Label htmlFor="name" required>
              Your name
            </Label>
            <input id="name" name="name" autoComplete="name" required {...fieldAttributes("name")} />
            <FieldError field="name" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="email" required>
              Email
            </Label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@venue.com" required {...fieldAttributes("email")} />
            <FieldError field="email" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="org">Venue / festival / organiser</Label>
            <input id="org" name="org" autoComplete="organization" {...fieldAttributes("org")} />
            <FieldError field="org" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="type">Event type</Label>
            {/* Starts empty: nothing is submitted unless the promoter chooses */}
            <select id="type" name="type" defaultValue="" {...fieldAttributes("type")}>
              <option value="">Select event type</option>
              <option>Festival</option>
              <option>Club show</option>
              <option>Support slot</option>
              <option>Private</option>
              <option>Other</option>
            </select>
            <FieldError field="type" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="city">City / country</Label>
            <input id="city" name="city" placeholder="Brussels, BE" {...fieldAttributes("city")} />
            <FieldError field="city" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="capacity">Venue capacity</Label>
            <input id="capacity" name="capacity" inputMode="numeric" placeholder="250" {...fieldAttributes("capacity")} />
            <FieldError field="capacity" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="date" required>
              Date
            </Label>
            <input id="date" name="date" type="date" required {...fieldAttributes("date")} />
            <FieldError field="date" errors={fieldErrors} />
          </div>
          <div className={styles.group}>
            <Label htmlFor="budget">Budget (EUR)</Label>
            <select id="budget" name="budget" defaultValue="" {...fieldAttributes("budget")}>
              <option value="">Select budget</option>
              <option value="< 500">&lt; 500</option>
              <option value="500-1000">500–1000</option>
              <option value=">= 1000">≥ 1000</option>
              <option value=">= 2000">≥ 2000</option>
            </select>
            <FieldError field="budget" errors={fieldErrors} />
          </div>
        </div>

        <div className={`${styles.group} ${styles.full}`}>
          <Label htmlFor="message" required>
            Message
          </Label>
          <textarea
            id="message"
            name="message"
            required
            {...fieldAttributes("message")}
            rows={6}
            placeholder="Line-up, set length, backline, schedule, fee range, hospitality…"
          />
          <FieldError field="message" errors={fieldErrors} />
        </div>

        {turnstileSiteKey ? (
          <BookingTurnstile
            siteKey={turnstileSiteKey}
            resetCounter={turnstileResetCounter}
            onTokenChange={onTurnstileTokenChange}
            onUnavailable={onTurnstileUnavailable}
          />
        ) : null}

        <p className={styles.status} role="status" aria-live="polite">
          {error ? <span className={styles.error}>{error}</span> : null}
          {savedResult ? (
            <span className={styles.success}>
              {savedResult.notificationStatus === "complete" ? (
                <>Thanks. We&apos;ll get back to you shortly.</>
              ) : (
                <>
                  Your booking request was saved. We couldn&apos;t deliver all notification emails.
                  Please don&apos;t submit the form again. Keep this reference and email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you want to confirm reception.
                </>
              )}{" "}
              Booking reference: <strong>{savedResult.bookingRequestId}</strong>.
            </span>
          ) : null}
        </p>

        <div className={styles.actionsRow}>
          <button type="submit" className={styles.submit} disabled={submitDisabled}>
            <span>{loading ? "Sending…" : "Send booking request"}</span>
            <span aria-hidden="true">→</span>
          </button>
          <p className={styles.altContact}>
            Or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </form>
    </section>
  );
}
