import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/lib/products";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import { IMAGE_BLUR_DATA_URL, getOptimizedImagePath } from "@/app/lib/imageOptimization";
import { formatPrice } from "@/app/lib/formatPrice";
import { merchImage } from "@/app/lib/merchPresentation";
import styles from "./featuredMerch.module.css";

type Props = {
  items: Product[] | null;
};

/* Only states a buyer needs; marketing badges (New, Limited) are dropped */
function availability(product: Product) {
  if (product.stock === 0) return "Sold out";
  if (product.badge === "Pre-order") return "Pre-order";
  return null;
}

function MerchObject({ product, primary }: { product: Product; primary: boolean }) {
  const status = availability(product);
  const image = merchImage(product.image);

  return (
    <Link href="/merch" className={`${styles.object} ${primary ? styles.primary : styles.secondary}`}>
      {image ? (
        <span className={styles.frame}>
          <Image
            src={getOptimizedImagePath(image.src) ?? image.src}
            alt=""
            fill
            sizes={primary ? "(max-width: 900px) 100vw, 56vw" : "(max-width: 900px) 60vw, 26vw"}
            className={styles.image}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </span>
      ) : null}
      <span className={styles.caption}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>
          {formatPrice(product.price)}
          {status ? <span className={styles.status}>{status}</span> : null}
        </span>
      </span>
    </Link>
  );
}

export default function FeaturedMerch({ items }: Props) {
  if (items === null) {
    return (
      <section className={styles.merch} aria-labelledby="merch-title">
        <p className={`meta ${styles.index}`}>06 — Merch</p>
        <h2 id="merch-title" className={`${styles.title} ${styles.unavailableTitle}`}>Merch</h2>
        <div className={styles.unavailable}>
          <p className={styles.unavailableMessage}>Merch unavailable right now</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="action-link on-bone">{CONTACT_EMAIL}</a>
          <Link href="/merch" className="action-link on-bone">
            View merch <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }
  if (!items.length) return null;

  const [primary, secondary] = items;

  return (
    <section className={styles.merch} aria-labelledby="merch-title">
      <p className={`meta ${styles.index}`}>06 — Merch</p>

      <MerchObject product={primary} primary />

      <div className={styles.aside}>
        <div className={styles.head}>
          <h2 id="merch-title" className={styles.title}>
            Merch
          </h2>
          <Link href="/merch" className="action-link on-bone">
            View merch <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {secondary ? <MerchObject product={secondary} primary={false} /> : null}
      </div>
    </section>
  );
}
