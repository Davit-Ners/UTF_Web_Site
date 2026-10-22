import type { Product } from "@/app/lib/products";
import styles from "./productParts.module.css";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function isSoldOut(product: Product) {
  return product.stock !== undefined && product.stock <= 0;
}

/* Only states a buyer needs; New / Limited / stock levels are not shown */
export function availability(product: Product) {
  if (isSoldOut(product)) return "Sold out";
  if (product.badge === "Pre-order") return "Pre-order";
  return null;
}

export const catalogueNumber = (n: number) => String(n).padStart(3, "0");

export type AddProps = {
  onAdd: (product: Product) => void;
  /* id of the product added in the last moments, for in-place feedback */
  justAdded: string | null;
  /* quantity of each product currently in the order request */
  inOrder: Record<string, number>;
};

/* Add action with brief in-place confirmation; sold out replaces the action */
export function AddButton({
  product,
  onAdd,
  justAdded,
  inOrder,
  compact = false,
  tone = "ink",
}: AddProps & { product: Product; compact?: boolean; tone?: "ink" | "bone" }) {
  const toneClass = tone === "bone" ? styles.onBone : "";
  if (isSoldOut(product)) {
    return <span className={`${styles.soldOut} ${toneClass}`}>Sold out</span>;
  }

  const added = justAdded === product.id;
  const qty = inOrder[product.id] ?? 0;

  return (
    <button
      type="button"
      className={`${styles.add} ${toneClass} ${compact ? styles.compact : ""} ${added ? styles.added : ""}`}
      onClick={() => onAdd(product)}
    >
      <span>
        {added ? "Added ✓" : "Add to order"}
        <span className="srOnly">: {product.name}</span>
      </span>
      <span className={styles.addMark} aria-hidden="true">
        {qty > 0 ? `${qty} +` : "+"}
      </span>
    </button>
  );
}
