'use client';
import { useEffect, useState } from "react";
import styles from "./hero.module.css";
import Link from "next/link";

export default function Hero(){
    const [offset, setOffset] = useState(0);
        useEffect(() => {
            const handleScroll = () => setOffset(window.scrollY * 0.25);
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className={styles.hero} style={{ backgroundPositionY: `${offset}px` }}>
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
            <p className={styles.tag}>Melodic death metal from Brussels</p>
            <div className={styles.actions}>
                <Link href="/concerts" className={`button ${styles.btn}`}>See Live Dates</Link>
                <Link href="/music" className={`button ${styles.btnAlt}`}>Listen Now</Link>
            </div>
            </div>
        </div>
        </section>
    );
};
