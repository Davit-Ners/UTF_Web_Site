import NewsletterForm from "../newsLetterForm/newsLetterForm";
import styles from "./mailingList.module.css";

export default function MailingList() {
  return (
    <section className={styles.mailing} aria-labelledby="mailing-title">
      <p className={`meta ${styles.index}`}>07 — Mailing list</p>

      <h2 id="mailing-title" className={styles.title}>
        Join the list
      </h2>

      <div className={styles.body}>
        <p className={styles.lede}>New dates, videos and merch drops straight from the band.</p>
        <NewsletterForm />
      </div>
    </section>
  );
}
