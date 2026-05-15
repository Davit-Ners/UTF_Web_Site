"use client";

import BookingTurnstile from "./bookingTurnstile";
import styles from "../../booking/booking.module.css";

type BookingFormProps = {
  error: null | string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  ok: null | boolean;
  onTurnstileTokenChange: (token: string) => void;
  submitDisabled: boolean;
  turnstileResetCounter: number;
  turnstileSiteKey: string;
};

export default function BookingForm({
  error,
  handleSubmit,
  loading,
  ok,
  onTurnstileTokenChange,
  submitDisabled,
  turnstileResetCounter,
  turnstileSiteKey,
}: BookingFormProps) {
  return (
    <section className={styles.formSection}>
      <div className="container">
        <div className={`${styles.formCard} card`}>
          <div className={styles.formIntro}>
            <h2 className={styles.formTitle}>Send a booking request</h2>
            <p className="text-muted">
              Send the date, city, event type and any useful production details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Honeypot */}
            <input
              type="text"
              name="faxNumber"
              className={styles.honey}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className={styles.grid}>
              <div className={styles.group}>
                <label htmlFor="name">
                  Your name <span className={styles.req}>*</span>
                </label>
                <input id="name" name="name" placeholder="Your name" />
              </div>
              <div className={styles.group}>
                <label htmlFor="email">
                  Email <span className={styles.req}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@venue.com"
                />
              </div>
              <div className={styles.group}>
                <label htmlFor="org">Venue / Festival / Organizer</label>
                <input
                  id="org"
                  name="org"
                  placeholder="Venue, festival, agency..."
                />
              </div>
              <div className={styles.group}>
                <label htmlFor="type">Event type</label>
                <select id="type" name="type" defaultValue="Festival">
                  <option>Festival</option>
                  <option>Club show</option>
                  <option>Support slot</option>
                  <option>Private</option>
                  <option>Other</option>
                </select>
              </div>
              <div className={styles.group}>
                <label htmlFor="city">City / Country</label>
                <input id="city" name="city" placeholder="Brussels, BE" />
              </div>
              <div className={styles.group}>
                <label htmlFor="capacity">Venue capacity</label>
                <input id="capacity" name="capacity" placeholder="250, 500, 1000..." />
              </div>
              <div className={styles.group}>
                <label htmlFor="date">
                  Date <span className={styles.req}>*</span>
                </label>
                <input id="date" name="date" type="date" />
              </div>
              <div className={styles.group}>
                <label htmlFor="budget">Budget (EUR)</label>
                <select id="budget" name="budget" defaultValue=">= 1000">
                  <option value="< 500">&lt; 500</option>
                  <option value="500-1000">500-1000</option>
                  <option value=">= 1000">&gt;= 1000</option>
                  <option value=">= 2000">&gt;= 2000</option>
                </select>
              </div>
            </div>

            <div className={styles.group}>
              <label htmlFor="message">
                Message <span className={styles.req}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us about the show: lineup, set length, backline, schedule, fee range, hospitality..."
              />
            </div>

            {turnstileSiteKey ? (
              <BookingTurnstile
                siteKey={turnstileSiteKey}
                resetCounter={turnstileResetCounter}
                onTokenChange={onTurnstileTokenChange}
              />
            ) : null}

            {error && <p className={styles.error}>{error}</p>}
            {ok && <p className={styles.success}>Thanks. We&apos;ll get back to you shortly.</p>}

            <div className={styles.actionsRow}>
              <button className="button" disabled={submitDisabled}>
                {loading ? "Sending..." : "Send Booking Request"}
              </button>
              <p className={`${styles.altContact} text-muted`}>
                Or email us:{" "}
                <a href="mailto:contact@untiltheyfall.com">
                  contact@untiltheyfall.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
