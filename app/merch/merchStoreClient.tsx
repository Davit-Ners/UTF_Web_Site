"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import AllItems from "../components/merch/allItems/allItems";
import Catalogue, { type NumberedProduct } from "../components/merch/catalogue/catalogue";
import OrderPanel from "../components/merch/orderPanel/orderPanel";
import { formatPrice } from "../components/merch/productParts";
import { needsSize } from "../lib/merchPresentation";
import type { CartItem, Product } from "../lib/products";
import styles from "./merch.module.css";
import { getSavedMerchOrderStatus, type MerchOrderStatus } from "@/lib/merch-order-result";

type Props = {
    products: Product[];
    masthead: ReactNode;
};

const DEFAULT_MAX_QTY = 20;
const FEATURED_MAX = 3;

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

export default function MerchStoreClient({ products, masthead }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderStatus, setOrderStatus] = useState<MerchOrderStatus>({ type: "idle" });
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const mastheadButtonRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleAddToCart(product: Product) {
        const maxQty = getMaxQty(product);

        if (maxQty <= 0) return;

        /* In-place feedback only; the drawer is not opened */
        const current = cart.find((item) => item.product.id === product.id)?.quantity ?? 0;
        const next = Math.min(current + 1, maxQty);
        const total = cart.reduce((sum, item) => sum + item.quantity, 0) - current + next;
        setAnnouncement(
            next > current
                ? `Added ${product.name}. ${total} ${total === 1 ? "item" : "items"} in your order request.`
                : `${product.name}: maximum quantity reached.`
        );
        setJustAdded(product.id);
        if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
        feedbackTimer.current = setTimeout(() => setJustAdded(null), 2000);

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

            const saved = getSavedMerchOrderStatus(result);
            if (saved) {
                setCart([]);
                setOrderStatus(saved);
                return true;
            }

            throw new Error(
                !res.ok && typeof result?.error === "string"
                    ? result.error
                    : "Order request failed. Please try again."
            );
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
    const inOrder = useMemo(
        () => Object.fromEntries(cart.map((item) => [item.product.id, item.quantity])),
        [cart]
    );

    /* One catalogue number per product, shared by Featured and All items */
    const numbered: NumberedProduct[] = products.map((product, i) => ({ product, n: i + 1 }));
    const featured = numbered.filter((item) => item.product.featured).slice(0, FEATURED_MAX);

    useEffect(() => () => {
        if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    }, []);

    function openDrawer(event: React.MouseEvent<HTMLButtonElement>) {
        openerRef.current = event.currentTarget;
        dialogRef.current?.showModal();
        closeRef.current?.focus();
    }

    /* Return focus to the control that opened the drawer, or to whichever order control is still visible */
    function restoreFocus() {
        const candidates = [openerRef.current, triggerRef.current, mastheadButtonRef.current];
        /* getClientRects works for fixed elements, unlike offsetParent */
        const target = candidates.find((el) => el && el.isConnected && el.getClientRects().length > 0);
        target?.focus();
    }

    const add = { onAdd: handleAddToCart, justAdded, inOrder };

    return (
        <>
            <header className={styles.masthead}>
                {masthead}
                {/* Desktop: a normal, non-sticky action; mobile keeps its bottom bar */}
                <button
                    ref={mastheadButtonRef}
                    type="button"
                    className={styles.mastAction}
                    onClick={openDrawer}
                    aria-haspopup="dialog"
                >
                    <span>Order request ({itemCount})</span>
                    {itemCount ? <span className={styles.triggerTotal}>{formatPrice(subtotal)}</span> : null}
                    <span aria-hidden="true">▸</span>
                </button>
            </header>

            {featured.length ? (
                <section className={styles.featured} aria-labelledby="featured-title">
                    <h2 id="featured-title" className={`meta ${styles.featuredLabel}`}>
                        Featured
                    </h2>
                    <Catalogue items={featured} {...add} />
                </section>
            ) : null}

            <AllItems items={numbered} {...add} />

            {/*
              Mobile: persistent bottom bar (quiet at 0).
              Desktop: an edge tab in the right page margin, only while the order is not empty.
            */}
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.trigger} ${itemCount ? styles.triggerActive : ""}`}
                onClick={openDrawer}
                aria-haspopup="dialog"
            >
                <span>Order request ({itemCount})</span>
                {itemCount ? <span className={styles.triggerTotal}>{formatPrice(subtotal)}</span> : null}
                <span aria-hidden="true">▸</span>
            </button>

            <p className="srOnly" role="status" aria-live="polite">
                {announcement}
            </p>

            <dialog
                ref={dialogRef}
                className={styles.drawer}
                aria-label="Your order request"
                onClose={restoreFocus}
                onClick={(e) => {
                    if (e.target === e.currentTarget) dialogRef.current?.close();
                }}
            >
                <div className={styles.drawerInner}>
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.close}
                        onClick={() => dialogRef.current?.close()}
                    >
                        Close <span aria-hidden="true">×</span>
                    </button>
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
            </dialog>
        </>
    );
}
