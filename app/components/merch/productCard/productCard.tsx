import Image from "next/image";
import styles from "./productCard.module.css";
import { Product } from "@/app/lib/products";

type Props = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
    const isOut = product.stock !== undefined && product.stock <= 0;

    return (
        <article className={`card ${styles.card}`}>
        <div className={styles.media}>
            <Image
            src={product.image || '/next.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 260px"
            />
            {product.badge && (
            <span className={`${styles.badge} ${styles[`badge_${product.badge}`]}`}>
                {product.badge}
            </span>
            )}
            {isOut && <span className={styles.badgeOut}>Sold out</span>}
        </div>

        <div className={styles.body}>
            <h3 className={styles.name}>{product.name}</h3>
            {product.shortDesc && (
            <p className={styles.desc}>{product.shortDesc}</p>
            )}

            <div className={styles.footer}>
                <div className={styles.priceBlock}>
                    <span className={styles.price}>€{product.price}</span>
                    {product.stock !== undefined && product.stock > 0 && (
                    <span className={styles.stock}>
                        {product.stock <= 5 ? "Low stock" : "In stock"}
                    </span>
                    )}
                </div>

                <button
                    type="button"
                    className="button small"
                    onClick={() => onAddToCart(product)}
                    disabled={isOut}
                >
                    {isOut ? "Sold out" : "Add to cart"}
                </button>
            </div>
        </div>
        </article>
    );
};
