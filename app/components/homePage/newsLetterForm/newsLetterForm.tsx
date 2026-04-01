"use client";

import { useState } from "react";
import styles from "./newsletterForm.module.css";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

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
        >
            <div className={styles.row}>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    aria-label="Email address"
                />
                <button className="button small" disabled={state === "loading"}>
                    {state === "loading" ? "..." : "Join"}
                </button>
            </div>

            {state === "ok" && (
                <span className={styles.msgOk}>Subscribed. See you in the inbox.</span>
            )}
            {state === "err" && (
                <span className={styles.msgErr}>Subscription failed. Try again.</span>
            )}
        </form>
    );
}
