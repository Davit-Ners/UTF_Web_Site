import styles from "./productGrid.module.css";
import ProductCard from "../productCard/productCard";
import { Product } from "@/app/lib/products";

export default function ProductGrid({
    items,
    limit = 4,
}: { items: Product[]; limit?: number }) {
    return (
        <div className={styles.grid}>
        {items.slice(0, limit).map((p) => (
            <ProductCard key={p.id} product={p} />
        ))}
        </div>
    );
};
