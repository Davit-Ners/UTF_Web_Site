import type { CartItem } from "@/app/lib/products";
import styles from "./cartSidebar.module.css";

type Props = {
    items: CartItem[];
    subtotal: number;
    onUpdateQty: (productId: string, qty: number) => void;
    onRemove: (productId: string) => void;
};

export default function CartSidebar({
    items,
    subtotal,
    onUpdateQty,
    onRemove,
}: Props) {
    const hasItems = items.length > 0;

    const shippingEstimate =
        subtotal === 0 ? 0 : subtotal >= 80 ? 0 : 7; // exemple

    const total = subtotal + shippingEstimate;

    return (
        <div className={`card ${styles.card}`}>
        <header className={styles.header}>
            <h2 className={styles.title}>Cart</h2>
            <span className={styles.count}>{items.length} items</span>
        </header>

        <div className={styles.body}>
            {!hasItems && (
            <p className={styles.empty}>
                Your cart is empty. Add a tee, hoodie or CD to support the band.
            </p>
            )}

            {hasItems && (
            <ul className={styles.list}>
                {items.map((item) => (
                <li key={item.product.id} className={styles.row}>
                    <div className={styles.rowInfo}>
                    <span className={styles.rowName}>{item.product.name}</span>
                    <span className={styles.rowPrice}>
                        €{item.product.price} · Qty
                    </span>
                    </div>

                    <div className={styles.rowActions}>
                    <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) =>
                        onUpdateQty(
                            item.product.id,
                            Math.max(1, Number(e.target.value) || 1)
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
            <span>€{subtotal.toFixed(2)}</span>
            </div>

            <div className={styles.lineSub}>
            <span>Shipping (estimate)</span>
            <span>
                {shippingEstimate === 0 ? "Free" : `€${shippingEstimate.toFixed(2)}`}
            </span>
            </div>

            <div className={styles.lineTotal}>
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
            </div>

            <button type="button" className="button" disabled={!hasItems}>
            Checkout (soon)
            </button>

            <p className={styles.notice}>
            Secure checkout & worldwide shipping will be added once the store
            goes live. For now this is a preview of how the merch page works.
            </p>
        </footer>
        </div>
    );
};
