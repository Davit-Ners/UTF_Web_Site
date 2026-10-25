import Image from "next/image";
import { merchImage, needsSize } from "@/app/lib/merchPresentation";
import { AddButton, availability, catalogueNumber, formatPrice, type AddProps } from "../productParts";
import type { NumberedProduct } from "../catalogue/catalogue";
import styles from "./allItems.module.css";

type Group = { key: string; label: string | null; items: NumberedProduct[] };

/*
 * One group today. When the catalogue grows (about 10+ items with at
 * least two categories of 3+), return one group per category here and
 * render an anchor line of group labels above the list; rows stay as is.
 */
function groupItems(items: NumberedProduct[]): Group[] {
  return [{ key: "all", label: null, items }];
}

function Row({ product, n, ...add }: AddProps & NumberedProduct) {
  const image = merchImage(product.image);
  const state = availability(product);

  return (
    <li className={`${styles.row} ${image ? "" : styles.textRow}`}>
      <span className={styles.thumb}>
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="(max-width: 600px) 72px, 112px"
            className={styles.thumbImage}
          />
        ) : null}
      </span>
      <span className={styles.number}>{catalogueNumber(n)}</span>
      <span className={styles.main}>
        <span className={styles.name}>{product.name}</span>
        {product.shortDesc ? <span className={styles.desc}>{product.shortDesc}</span> : null}
        {needsSize(product.slug) && state !== "Sold out" ? (
          <span className={styles.sizeNote}>Size: add it in your request notes</span>
        ) : null}
      </span>
      <span className={styles.price}>
        {formatPrice(product.price)}
        {state ? <span className={styles.state}>{state}</span> : null}
      </span>
      <span className={styles.action}>
        <AddButton product={product} compact {...add} />
      </span>
    </li>
  );
}

export default function AllItems({ items, ...add }: AddProps & { items: NumberedProduct[] }) {
  return (
    <section id="all-items" className={styles.section} aria-labelledby="all-items-title">
      <header className={styles.head}>
        <h2 id="all-items-title" className={styles.title}>
          All items
        </h2>
        <p className="meta">{String(items.length).padStart(2, "0")} items</p>
      </header>

      {groupItems(items).map((group) => (
        <div key={group.key} id={group.label ? `items-${group.key}` : undefined}>
          {group.label ? <h3 className={styles.groupLabel}>{group.label}</h3> : null}
          <ol className={styles.rows}>
            {group.items.map((item) => (
              <Row key={item.product.id} {...item} {...add} />
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
