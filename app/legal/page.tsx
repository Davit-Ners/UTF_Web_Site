import type { Metadata } from "next";
import { socialMetadata } from "@/app/lib/seo";
import LegalEn from "./legalEn";
import LegalFr from "./legalFr";
import { LEGAL_UPDATED } from "./legalFacts";
import styles from "../privacy/privacy.module.css";

const description =
  "Legal notice for the official Until They Fall website: who runs it, how to contact the band, and the use of its content. In English and French.";

export const metadata: Metadata = {
  title: "Legal notice",
  description,
  alternates: { canonical: "/legal" },
  ...socialMetadata({ title: "Legal notice | Until They Fall", description, path: "/legal" }),
};

/* Same document pattern as /privacy: one page, two complete language sections */
export default function LegalPage() {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.word}>Legal</h1>
        <p className={`meta ${styles.updated}`}>
          Last updated {LEGAL_UPDATED.en}{" "}
          <span lang="fr">— Dernière mise à jour {LEGAL_UPDATED.fr}</span>
        </p>
        <nav className={styles.languages} aria-label="Language / Langue">
          <a href="#legal-en" className="action-link">
            English <span className="arrow" aria-hidden="true">↓</span>
          </a>
          <a href="#legal-fr" className="action-link" lang="fr">
            Français <span className="arrow" aria-hidden="true">↓</span>
          </a>
        </nav>
      </header>

      <LegalEn />
      <LegalFr />
    </div>
  );
}
