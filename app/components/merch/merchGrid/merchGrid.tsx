import { Product } from "@/app/lib/products";
import styles from "./merchGrid.module.css";
import ProductCard from "../productCard/productCard";

type Props = {
  products: Product[];
  onAddToCart: (product: Product) => void;
};

export default function MerchGrid({ products, onAddToCart }: Props) {
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
