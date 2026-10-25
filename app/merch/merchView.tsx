import { CONTACT_EMAIL } from "../lib/contact";
import type { Product } from "../lib/products";
import { FREE_SHIPPING_FROM_EUR, SHIPPING_FLAT_EUR } from "../lib/shipping";
import MerchStoreClient from "./merchStoreClient";
import styles from "./merch.module.css";

/* products === null means the catalogue could not be loaded */
export default function MerchView({ products }: { products: Product[] | null }) {
  const facts = [
    products ? `${String(products.length).padStart(2, "0")} items` : null,
    "Requested by email",
    `Shipping estimate ${SHIPPING_FLAT_EUR} € — free from ${FREE_SHIPPING_FROM_EUR} €`,
  ].filter(Boolean);

  const mastheadContent = (
    <>
      <h1 className={styles.word}>Merch</h1>
      <p className={`meta ${styles.facts}`}>{facts.join(" — ")}</p>
      <p className={styles.notice}>
        Add items to a request and send it. We confirm availability, shipping and payment by
        email. No payment is taken on the site.
      </p>
    </>
  );
  const hasStore = products !== null && products.length > 0;

  return (
    <div className={styles.page}>
      {/* With a catalogue, the client store renders the masthead so it can hold the order action */}
      {hasStore ? null : <header className={styles.masthead}>{mastheadContent}</header>}

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
        <MerchStoreClient products={products} masthead={mastheadContent} />
      )}

      <footer className={styles.questions}>
        <p>
          Questions about sizes or shipping?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.mail}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </footer>
    </div>
  );
}
