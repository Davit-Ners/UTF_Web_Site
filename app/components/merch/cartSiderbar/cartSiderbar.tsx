"use client";

import { useState } from "react";
import type { CartItem } from "@/app/lib/products";
import styles from "./cartSidebar.module.css";

type Props = {
    items: CartItem[];
    subtotal: number;
    onUpdateQty: (productId: string, qty: number) => void;
    onRemove: (productId: string) => void;
    onRequestOrder: (input: {
        name: string;
        email: string;
        country: string;
        notes: string;
        website: string;
    }) => Promise<boolean>;
    orderStatus:
        | { type: "idle" }
        | { type: "loading" }
        | { type: "success"; message: string }
        | { type: "error"; message: string };
};

const DEFAULT_MAX_QTY = 20;

function getMaxQty(item: CartItem) {
    if (typeof item.product.stock === "number") {
        return Math.max(1, Math.min(item.product.stock, DEFAULT_MAX_QTY));
    }

    return DEFAULT_MAX_QTY;
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("fr-BE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(price);
}

export default function CartSidebar({
    items,
    subtotal,
    onUpdateQty,
    onRemove,
    onRequestOrder,
    orderStatus,
}: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [notes, setNotes] = useState("");
    const [website, setWebsite] = useState("");
    const hasItems = items.length > 0;

    const shippingEstimate =
        subtotal === 0 ? 0 : subtotal >= 80 ? 0 : 7;

    const total = subtotal + shippingEstimate;
    const isLoading = orderStatus.type === "loading";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const ok = await onRequestOrder({
            name,
            email,
            country,
            notes,
            website,
        });

        if (ok) {
            setName("");
            setEmail("");
            setCountry("");
            setNotes("");
            setWebsite("");
        }
    }

    return (
        <div className={`card ${styles.card}`}>
        <header className={styles.header}>
            <h2 className={styles.title}>Cart</h2>
            <span className={styles.count}>
                {items.length} item{items.length === 1 ? "" : "s"}
            </span>
        </header>

        <div className={styles.body}>
            {!hasItems && (
            <p className={styles.empty}>
                Your cart is empty. Add a tee, patch or CD to support the band.
            </p>
            )}

            {hasItems && (
            <ul className={styles.list}>
                {items.map((item) => (
                <li key={item.product.id} className={styles.row}>
                    <div className={styles.rowInfo}>
                    <span className={styles.rowName}>{item.product.name}</span>
                    <span className={styles.rowPrice}>
                        {formatPrice(item.product.price)} - Qty
                    </span>
                    </div>

                    <div className={styles.rowActions}>
                    <input
                        type="number"
                        min={1}
                        max={getMaxQty(item)}
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(e) =>
                        onUpdateQty(
                            item.product.id,
                            Number(e.target.value)
                        )
                        }
                        className={styles.qtyInput}
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(item.product.id)}
                        className={styles.remove}
                    >
                        Remove
                    </button>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>

        <form className={styles.orderForm} onSubmit={handleSubmit}>
            <input
                type="text"
                name="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className={styles.honey}
                tabIndex={-1}
                autoComplete="off"
            />

            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span>Name *</span>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        maxLength={120}
                        placeholder="Your name"
                        disabled={!hasItems || isLoading}
                    />
                </label>

                <label className={styles.field}>
                    <span>Email *</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        maxLength={320}
                        placeholder="you@email.com"
                        disabled={!hasItems || isLoading}
                    />
                </label>

                <label className={styles.field}>
                    <span>Country *</span>
                    <input
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        required
                        maxLength={120}
                        placeholder="Belgium"
                        disabled={!hasItems || isLoading}
                    />
                </label>

                <label className={styles.field}>
                    <span>Notes</span>
                    <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        maxLength={2000}
                        placeholder="Sizes, delivery details, questions..."
                        rows={3}
                        disabled={!hasItems || isLoading}
                    />
                </label>
            </div>

            {orderStatus.type === "success" && (
                <p className={styles.success}>{orderStatus.message}</p>
            )}
            {orderStatus.type === "error" && (
                <p className={styles.error}>{orderStatus.message}</p>
            )}

        <footer className={styles.footer}>
            <div className={styles.line}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.lineSub}>
            <span>Shipping estimate</span>
            <span>
                {shippingEstimate === 0 ? "Free" : formatPrice(shippingEstimate)}
            </span>
            </div>

            <div className={styles.lineTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
            </div>

            <button type="submit" className="button" disabled={!hasItems || isLoading}>
            {isLoading ? "Sending..." : "Request Order"}
            </button>

            <p className={styles.notice}>
            No payment is taken on the site. We confirm stock, shipping and
            payment details by email.
            </p>
        </footer>
        </form>
        </div>
    );
}
