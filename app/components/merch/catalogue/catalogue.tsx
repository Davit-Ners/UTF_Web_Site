import Image from "next/image";
import type { Product } from "@/app/lib/products";
import { extraViews, isLowRes, merchImage, needsSize } from "@/app/lib/merchPresentation";
import styles from "./catalogue.module.css";

type Props = {
  products: Product[];
  onAdd: (product: Product) => void;
};

const pad = (n: number) => String(n).padStart(3, "0");

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
function availability(product: Product) {
  if (isSoldOut(product)) return "Sold out";
  if (product.badge === "Pre-order") return "Pre-order";
  return null;
}

/* Printed-catalogue rhythm: one lead plate, then a pair, repeated */
function toPlates(products: Product[]) {
  const plates: Product[][] = [];
  let i = 0;
  let lead = true;
  while (i < products.length) {
    const size = lead ? 1 : 2;
    plates.push(products.slice(i, i + size));
    i += size;
    lead = !lead;
  }
  return plates;
}

function Label({ product, n, onAdd }: { product: Product; n: number; onAdd: Props["onAdd"] }) {
  const state = availability(product);
  const soldOut = isSoldOut(product);

  return (
    <div className={styles.label}>
      <p className={styles.number}>{pad(n)}</p>
      <h2 className={styles.name}>{product.name}</h2>
      {product.shortDesc ? <p className={styles.desc}>{product.shortDesc}</p> : null}
      <p className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {state ? <span className={styles.state}>{state}</span> : null}
      </p>
      {needsSize(product.slug) && !soldOut ? (
        <p className={styles.sizeNote}>Size: add it in your order notes</p>
      ) : null}
      {soldOut ? null : (
        <button type="button" className={styles.add} onClick={() => onAdd(product)}>
          <span>
            Add to order <span className="srOnly">: {product.name}</span>
          </span>
          <span aria-hidden="true">+</span>
        </button>
      )}
    </div>
  );
}

function Product({
  product,
  n,
  lead,
  onAdd,
}: {
  product: Product;
  n: number;
  lead: boolean;
  onAdd: Props["onAdd"];
}) {
  const image = merchImage(product.image);
  const extras = extraViews(product.slug);

  /* No photo: a typographic plate, never a placeholder image */
  if (!image) {
    return (
      <article className={`${styles.product} ${styles.textOnly} ${lead ? styles.lead : ""}`}>
        <Label product={product} n={n} onAdd={onAdd} />
      </article>
    );
  }

  const small = isLowRes(image);

  return (
    <article className={`${styles.product} ${lead ? styles.lead : ""} ${small ? styles.small : ""}`}>
      <div className={styles.media}>
        <Image
          src={image.src}
          alt={product.name}
          width={image.width}
          height={image.height}
          sizes={lead ? "(max-width: 900px) 100vw, 36vw" : "(max-width: 900px) 84vw, 26vw"}
          className={styles.image}
        />
        {extras.map((view) => (
          <figure key={view.src} className={styles.extra}>
            <Image
              src={view.src}
              alt={`${product.name}, ${view.label?.toLowerCase() ?? "second view"}`}
              width={view.width}
              height={view.height}
              sizes="(max-width: 900px) 60vw, 18vw"
              className={styles.image}
            />
            {view.label ? <figcaption className={styles.extraLabel}>{view.label}</figcaption> : null}
          </figure>
        ))}
      </div>
      <Label product={product} n={n} onAdd={onAdd} />
    </article>
  );
}

export default function Catalogue({ products, onAdd }: Props) {
  let n = 0;

  return (
    <div className={styles.catalogue}>
      {toPlates(products).map((plate, pi) => {
        const lead = plate.length === 1 && pi % 2 === 0;
        return (
          <div key={pi} className={lead ? styles.plateA : styles.plateB}>
            {plate.map((product) => (
              <Product key={product.id} product={product} n={++n} lead={lead} onAdd={onAdd} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
