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
const DEFAULT_MAX_QTY = 20;

function getMaxQty(product: Product) {
    if (typeof product.stock === "number") {
        return Math.max(0, Math.min(product.stock, DEFAULT_MAX_QTY));
    }

    return DEFAULT_MAX_QTY;
}

function clampQty(product: Product, quantity: number) {
    const maxQty = getMaxQty(product);
    const safeQty = Number.isFinite(quantity) ? Math.floor(quantity) : 1;

    return Math.min(Math.max(safeQty, 1), maxQty);
}

export default function MerchStoreClient({ products }: Props) {
    const [category, setCategory] = useState<CategoryFilter>("all");
    const [cart, setCart] = useState<CartItem[]>([]);

    function handleAddToCart(product: Product) {
        const maxQty = getMaxQty(product);

        if (maxQty <= 0) return;

        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: clampQty(product, item.quantity + 1) }
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
                    item.product.id === productId
                        ? { ...item, quantity: clampQty(item.product, quantity) }
                        : item
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
