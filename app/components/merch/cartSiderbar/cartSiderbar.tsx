import type { CartItem } from "@/app/lib/products";
import styles from "./cartSidebar.module.css";

type Props = {
    items: CartItem[];
    subtotal: number;
    onUpdateQty: (productId: string, qty: number) => void;
    onRemove: (productId: string) => void;
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
}: Props) {
    const hasItems = items.length > 0;

    const shippingEstimate =
        subtotal === 0 ? 0 : subtotal >= 80 ? 0 : 7;

    const total = subtotal + shippingEstimate;

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

            <button type="button" className="button" disabled={!hasItems}>
            Checkout
            </button>

            <p className={styles.notice}>
            Orders are handled directly by the band.
            </p>
        </footer>
        </div>
    );
}
