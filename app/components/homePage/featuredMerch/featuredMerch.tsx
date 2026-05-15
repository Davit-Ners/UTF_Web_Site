import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/lib/products";
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

export default function FeaturedMerch({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copyCard}>
            <span className={styles.eyebrow}>Store</span>
            <h2 className={styles.title}>Official merch from the band.</h2>
            <p className={styles.text}>
              Support the band directly. Grab the current merch, CDs and patches
              before the next show.
            </p>

            <div className={styles.metaRow}>
              <span className={styles.pill}>Official merch</span>
              <span className={styles.pill}>Shipped from Brussels</span>
            </div>

            <div className={styles.actions}>
              <Link href="/merch" className="button">
                Enter The Store
              </Link>
              <span className={styles.sideNote}>
                {items.length} pieces featured
              </span>
            </div>
          </div>

          <div className={styles.products}>
            {items.map((product, index) => (
              <Link
                key={product.id}
                href="/merch"
                className={`${styles.productCard} ${
                  index === 0 ? styles.productCardPrimary : ""
                }`}
                aria-label={`Open merch store and view ${product.name}`}
              >
                <div className={styles.media}>
                  <Image
                    src={product.image || "/logo.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 980px) 100vw, 34vw"
                  />
                </div>

                <div className={styles.overlay} />

                <div className={styles.productBody}>
                  <div className={styles.kickerRow}>
                    <span className={styles.category}>{product.category}</span>
                    {product.badge && (
                      <span className={styles.badge}>{product.badge}</span>
                    )}
                  </div>

                  <div className={styles.productFooter}>
                    <div>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      {product.shortDesc && (
                        <p className={styles.productText}>{product.shortDesc}</p>
                      )}
                    </div>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
