import styles from "./galleryHero.module.css";

export default function GalleryHero() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={`${styles.card} card`}>
            <div className={styles.text}>
                <span className={styles.eyebrow}>Gallery</span>
                <h1 className={styles.title}>Scenes from the pit</h1>
                <p className={styles.subtitle}>
                Live photos, lights and moments from Until They Fall shows. Use
                the gallery to get a feel for the energy on stage before you book
                us for your next festival or club night.
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};
