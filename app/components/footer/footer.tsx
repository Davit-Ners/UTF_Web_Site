import Link from "next/link";
import { latestRelease } from "@/app/lib/music";
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
  latestRelease.spotifyUrl
    ? { href: latestRelease.spotifyUrl, label: "Spotify" }
    : null,
  latestRelease.youtubeMusicUrl
    ? { href: latestRelease.youtubeMusicUrl, label: "YouTube" }
    : null,
].filter(Boolean) as { href: string; label: string }[];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.brand}>
              Until They Fall
            </Link>
            <p className={styles.tagline}>Melodic death metal from Brussels.</p>
          </div>

          <nav className={styles.nav} aria-label="Footer">
            {FOOTER_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
            {FOOTER_EXTERNALS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.meta}>
            <a href="mailto:contact@untiltheyfall.com" className={styles.contact}>
              contact@untiltheyfall.com
            </a>
            <p className={styles.copy}>Copyright {year} Until They Fall. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
