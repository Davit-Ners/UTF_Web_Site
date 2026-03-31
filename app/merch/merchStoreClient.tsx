"use client";

import { useMemo, useState } from "react";
import CartSidebar from "../components/merch/cartSiderbar/cartSiderbar";
import MerchFilters from "../components/merch/merchFilters/merchFilters";
import MerchGrid from "../components/merch/merchGrid/merchGrid";
import type { CartItem, Product, ProductCategory } from "../lib/products";
import styles from "./merch.module.css";

type Props = {
    products: Product[];
};

type CategoryFilter = "all" | ProductCategory;

export default function MerchStoreClient({ products }: Props) {
    const [category, setCategory] = useState<CategoryFilter>("all");
    const [cart, setCart] = useState<CartItem[]>([]);

    function handleAddToCart(product: Product) {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    }

    function handleUpdateQty(productId: string, quantity: number) {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function handleRemove(productId: string) {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    }

    const filteredProducts = useMemo(() => {
        if (category === "all") return products;
        return products.filter((product) => product.category === category);
    }, [category, products]);

    const subtotal = useMemo(
        () =>
            cart.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        [cart]
    );

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.layout}>
                    <div className={styles.productsColumn}>
                        <MerchFilters
                            active={category}
                            onChange={setCategory}
                            count={filteredProducts.length}
                        />

                        <MerchGrid
                            products={filteredProducts}
                            onAddToCart={handleAddToCart}
                        />
                    </div>

                    <aside className={styles.cartColumn}>
                        <CartSidebar
                            items={cart}
                            subtotal={subtotal}
                            onUpdateQty={handleUpdateQty}
                            onRemove={handleRemove}
                        />
                    </aside>
                </div>
            </div>
        </section>
    );
}
