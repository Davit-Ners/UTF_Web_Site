import Image from "next/image";
import type { Product } from "@/app/lib/products";
import { extraViews, isLowRes, merchImage, needsSize } from "@/app/lib/merchPresentation";
import { AddButton, availability, catalogueNumber, formatPrice, type AddProps } from "../productParts";
import styles from "./catalogue.module.css";

/* A product with its catalogue number, shared by Featured and All items */
export type NumberedProduct = { product: Product; n: number };

type Props = AddProps & { items: NumberedProduct[] };

/* Printed-catalogue rhythm: one lead plate, then a pair, repeated */
function toPlates(items: NumberedProduct[]) {
  const plates: NumberedProduct[][] = [];
  let i = 0;
  let lead = true;
  while (i < items.length) {
    const size = lead ? 1 : 2;
    plates.push(items.slice(i, i + size));
    i += size;
    lead = !lead;
  }
  return plates;
}

function Label({ product, n, ...add }: AddProps & { product: Product; n: number }) {
  const state = availability(product);

  return (
    <div className={styles.label}>
      <p className={styles.number}>{catalogueNumber(n)}</p>
      <h3 className={styles.name}>{product.name}</h3>
      {product.shortDesc ? <p className={styles.desc}>{product.shortDesc}</p> : null}
      <p className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {state ? <span className={styles.state}>{state}</span> : null}
      </p>
      {needsSize(product.slug) && state !== "Sold out" ? (
        <p className={styles.sizeNote}>Size: add it in your order notes</p>
      ) : null}
      <div className={styles.action}>
        <AddButton product={product} tone="bone" {...add} />
      </div>
    </div>
  );
}

function Plate({ product, n, lead, ...add }: AddProps & NumberedProduct & { lead: boolean }) {
  const image = merchImage(product.image);
  const extras = extraViews(product.slug);

  /* No photo: a typographic plate, never a placeholder image */
  if (!image) {
    return (
      <article className={`${styles.product} ${styles.textOnly} ${lead ? styles.lead : ""}`}>
        <Label product={product} n={n} {...add} />
      </article>
    );
  }

  return (
    <article className={`${styles.product} ${lead ? styles.lead : ""} ${isLowRes(image) ? styles.small : ""}`}>
      <div className={styles.media}>
        <Image
          src={image.src}
          alt={product.name}
          width={image.width}
          height={image.height}
          sizes={lead ? "(max-width: 900px) 100vw, 46vw" : "(max-width: 900px) 84vw, 36vw"}
          className={styles.image}
        />
        {extras.map((view) => (
          <figure key={view.src} className={styles.extra}>
            <Image
              src={view.src}
              alt={`${product.name}, ${view.label?.toLowerCase() ?? "second view"}`}
              width={view.width}
              height={view.height}
              sizes="(max-width: 900px) 60vw, 22vw"
              className={styles.image}
            />
            {view.label ? <figcaption className={styles.extraLabel}>{view.label}</figcaption> : null}
          </figure>
        ))}
      </div>
      <Label product={product} n={n} {...add} />
    </article>
  );
}

/* Featured: the editorial core of the page */
export default function Catalogue({ items, ...add }: Props) {
  return (
    <div className={styles.catalogue}>
      {toPlates(items).map((plate, pi) => {
        const lead = plate.length === 1 && pi % 2 === 0;
        return (
          <div key={pi} className={lead ? styles.plateA : styles.plateB}>
            {plate.map((item) => (
              <Plate key={item.product.id} {...item} lead={lead} {...add} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
