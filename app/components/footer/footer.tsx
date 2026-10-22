import Link from "next/link";
import { BAND_PROFILES } from "@/app/lib/links";
import styles from "./footer.module.css";

const FOOTER_NAV = [
  { href: "/music", label: "Music" },
  { href: "/concerts", label: "Concerts" },
  { href: "/merch", label: "Merch" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/booking", label: "Booking" },
];

const FOOTER_EXTERNALS = [
  BAND_PROFILES.spotify,
  BAND_PROFILES.youtube,
  BAND_PROFILES.instagram,
  BAND_PROFILES.facebook,
];

const CONTACT_EMAIL = "contact@untiltheyfall.com";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.brandBlock}>
        <Link href="/" className={styles.brand}>
          Until They Fall
        </Link>
        <p className="meta">Melodic death metal — Brussels</p>
      </div>

      <nav className={styles.nav} aria-label="Footer">
        <ul className={styles.list}>
          {FOOTER_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className={`${styles.list} ${styles.externals}`} aria-label="Listen and follow">
        {FOOTER_EXTERNALS.map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_blank" rel="noreferrer" className={styles.link}>
              {item.label} <span className={styles.arrow} aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.base}>
        <p className={styles.copy}>© {year} Until They Fall</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contact}>
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
