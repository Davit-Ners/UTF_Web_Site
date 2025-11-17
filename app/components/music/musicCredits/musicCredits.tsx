import styles from "./musicCredits.module.css";

export default function MusicCredits() {
    return (
        <div className={styles.grid}>
        <div className={`card ${styles.card}`}>
            <h3 className={styles.title}>Band</h3>
            <ul className={styles.list}>
            <li>
                <strong>Drums</strong> — Sabari Diakite
            </li>
            <li>
                <strong>Lead Guitar</strong> — Davit Nersesyan
            </li>
            <li>
                <strong>Rythm Guitar</strong> — Kevin Etstrada
            </li>
            <li>
                <strong>Vocals</strong> — Remy Vanbruene
            </li>
            </ul>
        </div>

        <div className={`card ${styles.card}`}>
            <h3 className={styles.title}>Production</h3>
            <ul className={styles.list}>
            <li>
                <strong>Produced by</strong> — Yarne Heylen
            </li>
            <li>
                <strong>Mixed by</strong> — Yarne Heylen
            </li>
            <li>
                <strong>Mastered by</strong> — Yarne Heylen
            </li>
            <li>
                <strong>Artwork</strong> — Until They Fall
            </li>
            </ul>
        </div>

        <div className={`card ${styles.card}`}>
            <h3 className={styles.title}>Fun facts</h3>
            <ul className={styles.list}>
            <li>Recorded at Project Zero Studio</li>
            <li>The main riff of “Sent To Die” was written in 2020 during the 44 days war in Nagorno Karabagh</li>
            <li><button className="button small">Read more</button></li>
            </ul>
        </div>
        </div>
    );
};
