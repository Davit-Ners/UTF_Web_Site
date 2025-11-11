import styles from "./hero.module.css";
import Link from "next/link";

export default function Hero(){
    return (
        <section className={styles.hero}>
        {/* FX background layers */}
        <div className={styles.fx}>
            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />
            <div className={styles.vignette} />
            <div className={styles.grain} />
            {/* Optionnel: watermark mascotte (met ton chemin de fichier) */}
            {/* <div className={styles.watermark} aria-hidden /> */}
            <div className={styles.spotlight} aria-hidden />
        </div>

        <div className="container">
            <div className={styles.inner}>
            <h1 className={styles.title}>UNTIL THEY FALL</h1>
            <p className={styles.tag}>Modern Metal // Brussels</p>
            <div className={styles.actions}>
                <Link href="/concerts" className={`button ${styles.btn}`}>Tickets</Link>
                <Link href="/music" className={`button ${styles.btnAlt}`}>Listen</Link>
            </div>
            </div>
        </div>
        </section>
    );
};
