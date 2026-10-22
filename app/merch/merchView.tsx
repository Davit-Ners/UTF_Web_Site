import type { Product } from "../lib/products";
import { FREE_SHIPPING_FROM_EUR, SHIPPING_FLAT_EUR } from "../lib/shipping";
import MerchStoreClient from "./merchStoreClient";
import styles from "./merch.module.css";

const CONTACT_EMAIL = "contact@untiltheyfall.com";

/* products === null means the catalogue could not be loaded */
export default function MerchView({ products }: { products: Product[] | null }) {
  const facts = [
    products ? `${String(products.length).padStart(2, "0")} items` : null,
    "Ordered by email",
    `Shipping ${SHIPPING_FLAT_EUR} € — free from ${FREE_SHIPPING_FROM_EUR} €`,
  ].filter(Boolean);

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.word}>Merch</h1>
        <p className={`meta ${styles.facts}`}>{facts.join(" — ")}</p>
        <p className={styles.notice}>
          No payment on the site. We confirm stock, shipping and payment details by email.
        </p>
      </header>

      {products === null ? (
        <section className={styles.unavailable}>
          <p className={styles.unavailableMain}>Merch unavailable right now</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.mail}>
            {CONTACT_EMAIL}
          </a>
        </section>
      ) : products.length === 0 ? (
        <section className={styles.unavailable}>
          <p className={styles.unavailableMain}>No merch online right now</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.mail}>
            {CONTACT_EMAIL}
          </a>
        </section>
      ) : (
        <MerchStoreClient products={products} />
      )}

      <footer className={styles.questions}>
        <p>
          Questions about sizes or shipping?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.mail}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </footer>
    </main>
  );
}
