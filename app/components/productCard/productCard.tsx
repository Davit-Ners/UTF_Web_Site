import Image from "next/image";
import styles from "./productCard.module.css";
import { Product } from "@/app/lib/products";

export default function ProductCard({ product }: { product: Product }) {
    const price = new Intl.NumberFormat("fr-BE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(product.price);

    const soldOut = product.stock !== undefined && product.stock <= 0;

    return (
        <article className={`card ${styles.card}`}>
        <div className={styles.media}>
            <Image
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            />
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            {soldOut && <span className={`${styles.badge} ${styles.badgeMuted}`}>Sold out</span>}
        </div>

        <div className={styles.body}>
            <h3 className={styles.title} title={product.name}>{product.name}</h3>
            <div className={styles.meta}>
            <span className={styles.price}>{price}</span>
            {soldOut ? (
                <span className={styles.sold}>Unavailable</span>
            ) : (
                <button className={`button ${styles.add}`}>Add to cart</button>
            )}
            </div>
        </div>
        </article>
    );
};
