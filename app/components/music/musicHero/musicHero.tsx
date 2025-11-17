import styles from "./musicHero.module.css";

export default function MusicHero() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={`card ${styles.card}`}>
            <div className={styles.text}>
                <span className={styles.eyebrow}>Music</span>
                <h1 className={styles.title}>Modern metal from Brussels</h1>
                <p className={styles.subtitle}>
                Heavy riffs, big hooks and a live show built for festivals and
                clubs. Until They Fall blends modern metalcore, melodic death
                metal and cinematic atmospheres.
                </p>
                <p className={styles.forFans}>
                <span>For fans of</span> Trivium, As I Lay Dying, Parkway Drive,
                Architects.
                </p>
            </div>
            <div className={styles.side}>
                <p className={styles.highlight}>
                New album <strong>“Sent To Die”</strong> out now.
                </p>
                <ul className={styles.list}>
                <li>🔥 Tight, modern production — big guitars, huge drums.</li>
                <li>🎤 Screams & clean vocals with memorable choruses.</li>
                <li>🎧 Available on all streaming platforms.</li>
                </ul>
            </div>
            </div>
        </div>
        </section>
    );
};
