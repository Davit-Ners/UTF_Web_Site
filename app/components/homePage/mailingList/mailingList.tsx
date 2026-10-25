import NewTabLink from "@/app/components/newTabLink";
import { BAND_PROFILES } from "@/app/lib/links";
import styles from "./mailingList.module.css";

/*
 * Launch-disabled state: no form, no input, nothing that looks submittable.
 * NewsletterForm is kept for the future compliant flow (lib/newsletter.ts).
 */
export default function MailingList() {
  return (
    <section className={styles.mailing} aria-labelledby="mailing-title">
      <p className={`meta ${styles.index}`}>07 — Mailing list</p>

      <h2 id="mailing-title" className={styles.title}>
        Mailing list
      </h2>

      <div className={styles.body}>
        <p className={styles.lede}>Coming later.</p>
        <p className={styles.status}>
          Signup is not open yet. Until then, new dates and releases go out on{" "}
          <NewTabLink href={BAND_PROFILES.instagram.href}>Instagram</NewTabLink> and{" "}
          <NewTabLink href={BAND_PROFILES.facebook.href}>Facebook</NewTabLink>.
        </p>
      </div>
    </section>
  );
}
