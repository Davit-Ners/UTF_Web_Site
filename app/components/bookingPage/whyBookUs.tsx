import styles from "./whyBookUs.module.css";

export default function WhyBookUs() {
    return (
        <section className={styles.wrap}>
        <div className="container">
            <header className={styles.header}>
            <span className={styles.eyebrow}>Why book us</span>
            <h2 className={styles.title}>A tight, explosive live show</h2>
            <p className={styles.subtitle}>
                Until They Fall delivers a modern metal experience built for festivals,
                clubs and showcases — fast setup, pro attitude and maximum energy.
            </p>
            </header>

            <div className={styles.grid}>
            <div className={`${styles.feature} card`}>
                <h3>⚡ Fast & clean setup</h3>
                <p>
                Full in-ear / tracks rig, wireless guitars, minimal stage footprint.
                Changeover under 5 minutes.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>🎸 Modern metal sound</h3>
                <p>
                Huge live mix, tight drums, melodic leads, heavy rhythm section.
                Adaptable set from 25 to 60 minutes.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>🤝 Professional & reliable</h3>
                <p>
                Brussels-based, available EU/UK. Quick communication {"(< 24h)"}.
                Flexible and easy to work with.
                </p>
            </div>

            <div className={`${styles.feature} card`}>
                <h3>🔥 Crowd engagement</h3>
                <p>
                High-energy performance with crowd interaction.
                Designed to make festivals and club shows unforgettable.
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};
