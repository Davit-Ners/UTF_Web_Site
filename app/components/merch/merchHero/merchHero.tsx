import styles from "./merchHero.module.css";

export default function MerchHero() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={`card ${styles.card}`}>
            <div className={styles.text}>
                <span className={styles.eyebrow}>Store</span>
                <h1 className={styles.title}>Official Until They Fall merch</h1>
                <p className={styles.subtitle}>
                Support the band, look heavy. Tees, patchs, CDs and accessories
                directly from us.
                </p>
            </div>
            <div className={styles.side}>
                <p className={styles.highlight}>
                Worldwide shipping coming soon. For now, shipping from Brussels
                for EU orders.
                </p>
                <p className={styles.note}>
                Questions about sizes or shipping?{" "}
                <span>untiltheyfallband@gmail.com</span>
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};
