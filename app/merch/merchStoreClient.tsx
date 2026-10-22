"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Catalogue from "../components/merch/catalogue/catalogue";
import OrderPanel from "../components/merch/orderPanel/orderPanel";
import { needsSize } from "../lib/merchPresentation";
import type { CartItem, Product } from "../lib/products";
import styles from "./merch.module.css";

type Props = {
    products: Product[];
};

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
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderStatus, setOrderStatus] = useState<
        { type: "idle" } | { type: "loading" } | { type: "success"; message: string } | { type: "error"; message: string }
    >({ type: "idle" });
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelVisible, setPanelVisible] = useState(false);

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

    async function handleRequestOrder(input: {
        name: string;
        email: string;
        country: string;
        notes: string;
        faxNumber: string;
    }): Promise<boolean> {
        if (!cart.length) return false;

        setOrderStatus({ type: "loading" });

        try {
            const res = await fetch("/api/merch/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...input,
                    items: cart.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const result = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(
                    typeof result?.error === "string"
                        ? result.error
                        : "Order request failed. Please try again."
                );
            }

            setCart([]);
            setOrderStatus({
                type: "success",
                message:
                    typeof result?.orderNumber === "string"
                        ? `Request sent. Order ${result.orderNumber} is waiting for confirmation.`
                        : "Request sent. We will confirm availability and shipping by email.",
            });
            return true;
        } catch (error) {
            setOrderStatus({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Order request failed. Please try again.",
            });
            return false;
        }
    }

    const subtotal = useMemo(
        () =>
            cart.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        [cart]
    );

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const hasSizedItem = cart.some((item) => needsSize(item.product.slug));

    /* The mobile jump bar hides while the panel itself is on screen */
    useEffect(() => {
        const node = panelRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => setPanelVisible(entry.isIntersecting));
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.store}>
            <div className={styles.catalogueColumn}>
                <Catalogue products={products} onAdd={handleAddToCart} />
            </div>

            <div ref={panelRef} className={styles.panelColumn}>
                <OrderPanel
                    items={cart}
                    subtotal={subtotal}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemove}
                    onRequestOrder={handleRequestOrder}
                    orderStatus={orderStatus}
                    hasSizedItem={hasSizedItem}
                />
            </div>

            {cart.length > 0 && !panelVisible ? (
                <a href="#order-request" className={styles.jumpBar}>
                    <span>Order request ({itemCount})</span>
                    <span aria-hidden="true">↓</span>
                </a>
            ) : null}
        </div>
    );
}
