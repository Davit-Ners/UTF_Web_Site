"use client";

import { useId, useState } from "react";
import type { CartItem } from "@/app/lib/products";
import { calculateShipping } from "@/app/lib/shipping";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import type { MerchOrderStatus } from "@/lib/merch-order-result";
import styles from "./orderPanel.module.css";

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
    faxNumber: string;
  }) => Promise<boolean>;
  orderStatus: MerchOrderStatus;
  hasSizedItem: boolean;
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

export default function OrderPanel({
  items,
  subtotal,
  onUpdateQty,
  onRemove,
  onRequestOrder,
  orderStatus,
  hasSizedItem,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [faxNumber, setFaxNumber] = useState("");
  const id = useId();
  const hasItems = items.length > 0;
  /* Units, matching the order request trigger */
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingEstimate = calculateShipping(subtotal);
  const total = subtotal + shippingEstimate;
  const isLoading = orderStatus.type === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await onRequestOrder({ name, email, country, notes, faxNumber });
    if (ok) {
      setName("");
      setEmail("");
      setCountry("");
      setNotes("");
      setFaxNumber("");
    }
  }

  return (
    <section id="order-request" className={styles.panel} aria-labelledby={`${id}-title`}>
      <header className={styles.head}>
        <h2 id={`${id}-title`} className={styles.title}>
          Your order request
        </h2>
        <p className={styles.count}>
          {String(units).padStart(2, "0")} {units === 1 ? "item" : "items"}
        </p>
      </header>

      <p className={styles.notice}>
        No payment is taken on the site. We confirm stock, shipping and payment details by email.
      </p>

      {hasItems ? (
        <ul className={styles.rows}>
          {items.map((item) => {
            const max = getMaxQty(item);
            const qtyId = `${id}-qty-${item.product.id}`;
            return (
              <li key={item.product.id} className={styles.row}>
                <div className={styles.rowInfo}>
                  <span className={styles.rowName}>{item.product.name}</span>
                  <span className={styles.rowPrice}>{formatPrice(item.product.price)}</span>
                </div>
                <div className={styles.rowActions}>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      −
                    </button>
                    <label htmlFor={qtyId} className="srOnly">
                      Quantity of {item.product.name}
                    </label>
                    <input
                      id={qtyId}
                      type="number"
                      min={1}
                      max={max}
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => onUpdateQty(item.product.id, Number(e.target.value))}
                      className={styles.qty}
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= max}
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.product.id)}
                    className={styles.remove}
                    aria-label={`Remove ${item.product.name}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Nothing added yet.</p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="faxNumber"
          value={faxNumber}
          onChange={(event) => setFaxNumber(event.target.value)}
          className={styles.honey}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <label className={styles.field}>
          <span>Name *</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="country-name"
            disabled={!hasItems || isLoading}
          />
        </label>

        <label className={`${styles.field} ${hasSizedItem ? styles.fieldFlag : ""}`}>
          <span>{hasSizedItem ? "Notes — add your T-shirt size" : "Notes"}</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={2000}
            placeholder="Sizes, delivery details, questions"
            rows={3}
            disabled={!hasItems || isLoading}
          />
        </label>

        <dl className={styles.totals}>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping estimate</dt>
            <dd>{shippingEstimate === 0 ? "Free" : formatPrice(shippingEstimate)}</dd>
          </div>
          <div className={styles.total}>
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

        <p className={styles.status} role="status" aria-live="polite">
          {orderStatus.type === "success" ? <span className={styles.ok}>{orderStatus.message}</span> : null}
          {orderStatus.type === "success-with-warning" ? (
            <span className={styles.ok}>
              {orderStatus.message}{" "}
              Contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if needed.
            </span>
          ) : null}
          {orderStatus.type === "error" ? <span className={styles.err}>{orderStatus.message}</span> : null}
        </p>

        <button type="submit" className={styles.submit} disabled={!hasItems || isLoading}>
          <span>{isLoading ? "Sending…" : "Request order"}</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}
