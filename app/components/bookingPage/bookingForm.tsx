"use client";

import { CONTACT_EMAIL } from "@/app/lib/contact";
import { type SavedBookingResult } from "@/lib/booking-result";
import BookingTurnstile from "./bookingTurnstile";
import styles from "../../booking/booking.module.css";

type BookingFormProps = {
  error: null | string;
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

export default function BookingForm({
  error,
  handleSubmit,
  loading,
  savedResult,
  onTurnstileTokenChange,
  onTurnstileUnavailable,
  submitDisabled,
  turnstileResetCounter,
  turnstileSiteKey,
}: BookingFormProps) {
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

      <form onSubmit={handleSubmit} className={styles.form}>
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
            <input id="name" name="name" autoComplete="name" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="email" required>
              Email
            </Label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@venue.com" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="org">Venue / festival / organiser</Label>
            <input id="org" name="org" autoComplete="organization" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="type">Event type</Label>
            {/* Starts empty: nothing is submitted unless the promoter chooses */}
            <select id="type" name="type" defaultValue="">
              <option value="">Select event type</option>
              <option>Festival</option>
              <option>Club show</option>
              <option>Support slot</option>
              <option>Private</option>
              <option>Other</option>
            </select>
          </div>
          <div className={styles.group}>
            <Label htmlFor="city">City / country</Label>
            <input id="city" name="city" placeholder="Brussels, BE" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="capacity">Venue capacity</Label>
            <input id="capacity" name="capacity" inputMode="numeric" placeholder="250" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="date" required>
              Date
            </Label>
            <input id="date" name="date" type="date" />
          </div>
          <div className={styles.group}>
            <Label htmlFor="budget">Budget (EUR)</Label>
            <select id="budget" name="budget" defaultValue="">
              <option value="">Select budget</option>
              <option value="< 500">&lt; 500</option>
              <option value="500-1000">500–1000</option>
              <option value=">= 1000">≥ 1000</option>
              <option value=">= 2000">≥ 2000</option>
            </select>
          </div>
        </div>

        <div className={`${styles.group} ${styles.full}`}>
          <Label htmlFor="message" required>
            Message
          </Label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Line-up, set length, backline, schedule, fee range, hospitality…"
          />
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
