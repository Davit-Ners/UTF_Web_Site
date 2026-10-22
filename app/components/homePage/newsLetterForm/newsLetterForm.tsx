"use client";

import { useId, useState } from "react";
import styles from "./newsletterForm.module.css";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
    const inputId = useId();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        setState("loading");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Newsletter request failed");

            setState("ok");
            setEmail("");
        } catch {
            setState("err");
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className={styles.form}
            aria-label="Subscribe to the Until They Fall mailing list"
            aria-busy={state === "loading"}
        >
            <div className={styles.row}>
                <label htmlFor={inputId} className={styles.label}>
                    Email
                </label>
                <input
                    id={inputId}
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.submit} disabled={state === "loading"}>
                    {state === "loading" ? "Joining…" : "Join"}
                    <span className={styles.arrow} aria-hidden="true">→</span>
                </button>
            </div>

            <p className={styles.status} role="status" aria-live="polite">
                {state === "ok" && (
                    <span className={styles.msgOk}>Subscribed. See you before the next show.</span>
                )}
                {state === "err" && (
                    <span className={styles.msgErr}>Subscription failed. Try again.</span>
                )}
            </p>
        </form>
    );
}
