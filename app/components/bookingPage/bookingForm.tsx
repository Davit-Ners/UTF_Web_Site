"use client";
import styles from '../../booking/booking.module.css';

export default function BookingForm({ handleSubmit, error, ok, loading }:
    { 
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
        error: null | string,
        ok: null | boolean,
        loading: boolean
    }) {
    return (
        <section className={styles.formSection}>
            <div className="container">
            <div className={`${styles.formCard} card`}>
                <div className={styles.formIntro}>
                <h2 className={styles.formTitle}>Request a booking</h2>
                <p className="text-muted">Give us a few details and we’ll get back to you fast.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                {/* Honeypot */}
                <input type="text" name="website" className={styles.honey} tabIndex={-1} autoComplete="off" />

                <div className={styles.grid}> 
                    <div className={styles.group}>
                    <label htmlFor="name">Your name <span className={styles.req}>*</span></label>
                    <input id="name" name="name" placeholder="Jane Doe" />
                    </div>
                    <div className={styles.group}>
                    <label htmlFor="email">Email <span className={styles.req}>*</span></label>
                    <input id="email" name="email" type="email" placeholder="you@company.com" />
                    </div>
                    <div className={styles.group}>
                    <label htmlFor="org">Company / Organizer</label>
                    <input id="org" name="org" placeholder="Venue, festival, agency…" />
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
                    <input id="capacity" name="capacity" placeholder="500" />
                    </div>
                    <div className={styles.group}>
                    <label htmlFor="date">Date <span className={styles.req}>*</span></label>
                    <input id="date" name="date" type="date" />
                    </div>
                    <div className={styles.group}>
                    <label htmlFor="budget">Budget (EUR)</label>
                    <select id="budget" name="budget" defaultValue=">= 1000">
                        <option value="< 500">&lt; 500</option>
                        <option value="500–1000">500–1000</option>
                        <option value=">= 1000">≥ 1000</option>
                        <option value=">= 2000">≥ 2000</option>
                    </select>
                    </div>
                </div>

                <div className={styles.group}>
                    <label htmlFor="message">Message <span className={styles.req}>*</span></label>
                    <textarea id="message" name="message" rows={6} placeholder="Tell us about the gig (set length, backline, schedule, etc.)" />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {ok && <p className={styles.success}>Thanks! We’ll reply shortly.</p>}

                <div className={styles.actionsRow}>
                    <button className="button" disabled={loading}>
                    {loading ? "Sending…" : "Send request"}
                    </button>
                    <p className={`${styles.altContact} text-muted`}>
                    Or email us: <a href="mailto:untiltheyfallband@gmail.com">untiltheyfallband@gmail.com</a>
                    </p>
                </div>
                </form>
            </div>
            </div>
        </section>
    );
};
