'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./hero.module.css";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

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
            <h1 className={styles.srOnly}>Until They Fall</h1>
            <div className={styles.logoMark} aria-hidden="true">
                <Image
                    src="/optimized/logo-typo.webp"
                    alt=""
                    width={2048}
                    height={1318}
                    priority
                    className={styles.logoImage}
                    sizes="(max-width: 700px) 92vw, (max-width: 1200px) 82vw, 980px"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                />
            </div>
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
