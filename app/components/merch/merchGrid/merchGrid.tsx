import { Product } from "@/app/lib/products";
import styles from "./merchGrid.module.css";
import ProductCard from "../productCard/productCard";

type Props = {
  products: Product[];
  onAddToCart: (product: Product) => void;
};

export default function MerchGrid({ products, onAddToCart }: Props) {
    if (!products.length) {
        return (
            <p className={styles.empty}>
                No merch is online right now. Check back soon for the next drop.
            </p>
        );
    }

    return (
        <div className={styles.grid}>
        {products.map((product) => (
            <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            />
        ))}
        </div>
    );
};
