"use client";

import { useMemo, useState } from "react";
import styles from "./merch.module.css";
import { Product } from "../lib/products";
import MerchHero from "../components/merch/merchHero/merchHero";
import MerchFilters from "../components/merch/merchFilters/merchFilters";
import MerchGrid from "../components/merch/merchGrid/merchGrid";
import CartSidebar from "../components/merch/cartSiderbar/cartSiderbar";

// MOCK PRODUITS (à remplacer plus tard par ta DB)
const PRODUCTS: Product[] = [
    {
        id: "tee-core-logo",
        name: "Core Logo Tee (Black)",
        price: 25,
        image: "/merch/core-tee.jpg",
        category: "apparel",
        badge: "New",
        shortDesc: "Black tee with the Until They Fall core logo.",
        stock: 42,
    },
    {
        id: "hoodie-skull",
        name: "Skull Hoodie",
        price: 50,
        image: "/merch/skull-hoodie.png",
        category: "apparel",
        badge: "Limited",
        shortDesc: "Thick black hoodie with front print and back artwork.",
        stock: 18,
    },
    {
        id: "cd-debut",
        name: "Debut Album CD",
        price: 12,
        image: "/merch/cd-st.png",
        category: "music",
        shortDesc: "Physical CD of our debut album “Sent To Die”.",
        stock: 60,
    },
    {
        id: "stickers-pack",
        name: "Sticker Pack",
        price: 5,
        image: "/merch/stickers.png",
        category: "accessories",
        shortDesc: "4 stickers: logo, artwork & symbols.",
        stock: 100,
    },
    {
        id: "tee-artwork",
        name: "Album Artwork Tee",
        price: 28,
        image: "",
        category: "apparel",
        shortDesc: "Full-color Sent To Die artwork on a black tee.",
        stock: 25,
    },
    {
        id: "poster-a2",
        name: "Tour Poster A2",
        price: 10,
        image: "",
        category: "accessories",
        shortDesc: "High quality A2 poster, matte finish.",
        stock: 40,
    },
];

export type CartItem = {
    product: Product;
    quantity: number;
};

type CategoryFilter = "all" | "apparel" | "music" | "accessories";

export default function MerchPage() {
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
        if (category === "all") return PRODUCTS;
        return PRODUCTS.filter((p) => p.category === category);
    }, [category]);

    const subtotal = useMemo(
        () =>
        cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        ),
        [cart]
    );

    return (
        <main className={styles.page}>
        <MerchHero />

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
        </main>
    );
};
