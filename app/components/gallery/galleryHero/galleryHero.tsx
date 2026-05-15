import styles from "./galleryHero.module.css";

export default function GalleryHero() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={`${styles.card} card`}>
            <div className={styles.text}>
                <span className={styles.eyebrow}>Gallery</span>
                <h1 className={styles.title}>Live shots from the floor</h1>
                <p className={styles.subtitle}>
                Stage shots, crowd pressure and live moments from Until They
                Fall shows.
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};
