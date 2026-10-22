import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/lib/products";
import { IMAGE_BLUR_DATA_URL, getOptimizedImagePath } from "@/app/lib/imageOptimization";
import styles from "./featuredMerch.module.css";

type Props = {
  items: Product[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* Only states a buyer needs; marketing badges (New, Limited) are dropped */
function availability(product: Product) {
  if (product.stock === 0) return "Sold out";
  if (product.badge === "Pre-order") return "Pre-order";
  return null;
}

function MerchObject({ product, primary }: { product: Product; primary: boolean }) {
  const status = availability(product);

  return (
    <Link href="/merch" className={`${styles.object} ${primary ? styles.primary : styles.secondary}`}>
      <span className={styles.frame}>
        <Image
          src={getOptimizedImagePath(product.image) || "/logo.jpg"}
          alt=""
          fill
          sizes={primary ? "(max-width: 900px) 100vw, 56vw" : "(max-width: 900px) 60vw, 26vw"}
          className={styles.image}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
      </span>
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
            Shop <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {secondary ? <MerchObject product={secondary} primary={false} /> : null}
      </div>
    </section>
  );
}
