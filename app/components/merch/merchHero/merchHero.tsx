import styles from "./merchHero.module.css";

export default function MerchHero() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={`card ${styles.card}`}>
            <div className={styles.text}>
                <span className={styles.eyebrow}>Store</span>
                <h1 className={styles.title}>Official merch</h1>
                <p className={styles.subtitle}>
                Tees, patches, CDs and limited pieces shipped directly by the
                band.
                </p>
            </div>
            <div className={styles.side}>
                <p className={styles.highlight}>
                Support the band directly.
                </p>
                <p className={styles.note}>
                Questions about sizes, stock or shipping?{" "}
                <span>contact@untiltheyfall.com</span>
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};
