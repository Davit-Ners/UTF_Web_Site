import Link from "next/link";
import styles from "./sectionHeading.module.css";

type Align = "left" | "center";
type Variant = "default" | "subtle" | "divider";

export default function SectionHeading({
    eyebrow,
    title,
    subtitle,
    cta,
    align = "left",
    variant = "default",
    }: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    cta?: { href: string; label: string };
    align?: Align;
    variant?: Variant;
    }) {
    return (
        <header
        className={[
            styles.wrap,
            styles[`align_${align}`],
            styles[`variant_${variant}`],
        ].join(" ")}
        >
        <div className={styles.block}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {cta && (
            <div className={styles.ctaWrap}>
            <Link href={cta.href} className={`button ${styles.cta}`}>
                {cta.label}
            </Link>
            </div>
        )}
        </header>
    );
};
