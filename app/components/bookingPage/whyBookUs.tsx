import styles from "./whyBookUs.module.css";

export default function WhyBookUs() {
    return (
        <section className={styles.wrap}>
        <div className="container">
            <header className={styles.header}>
            <span className={styles.eyebrow}>Live</span>
            <h2 className={styles.title}>A heavy set built for the room.</h2>
            <p className={styles.subtitle}>
                Until They Fall is available for club shows, support slots,
                independent festivals and metal events across Belgium and Europe.
            </p>
            </header>

            <div className={styles.grid}>
            <div className={`${styles.feature} card`}>
                <h3>Stage-ready setup</h3>
                <p>
                Tech rider ready, fast changeovers and a setup built to keep the
                show moving.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>Modern metal sound</h3>
                <p>
                Melodic death metal weight, metalcore tension, aggressive riffs
                and atmospheric leads.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>Belgian stage experience</h3>
                <p>
                Active on the Belgian metal scene with club shows, independent
                festivals and support slots.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>Radio airplay</h3>
                <p>
                Uprising aired several times on Classic 21; Wrath Of Gaia aired
                on Radio Panik.
                </p>
            </div>
            </div>
        </div>
        </section>
    );
}
