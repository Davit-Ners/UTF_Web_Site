import type { Metadata } from "next";
import { socialMetadata } from "@/app/lib/seo";
import PolicyEn from "./policyEn";
import PolicyFr from "./policyFr";
import { PRIVACY_UPDATED } from "./privacyFacts";
import styles from "./privacy.module.css";

const description =
  "How the Until They Fall website handles booking and merch requests, browser storage, Cloudflare Turnstile and the YouTube video. In English and French.";

export const metadata: Metadata = {
  title: "Privacy",
  description,
  alternates: { canonical: "/privacy" },
  ...socialMetadata({ title: "Privacy | Until They Fall", description, path: "/privacy" }),
};

/* One page, two complete policies; each section carries its own lang */
export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.word}>Privacy</h1>
        <p className={`meta ${styles.updated}`}>
          Last updated {PRIVACY_UPDATED.en}{" "}
          <span lang="fr">— Dernière mise à jour {PRIVACY_UPDATED.fr}</span>
        </p>
        <nav className={styles.languages} aria-label="Language / Langue">
          <a href="#privacy-en" className="action-link">
            English <span className="arrow" aria-hidden="true">↓</span>
          </a>
          <a href="#privacy-fr" className="action-link" lang="fr">
            Français <span className="arrow" aria-hidden="true">↓</span>
          </a>
        </nav>
      </header>

      <PolicyEn />
      <PolicyFr />
    </div>
  );
}
