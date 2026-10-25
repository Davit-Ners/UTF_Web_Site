import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const WAYS_BACK = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/concerts", label: "Live" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      {/* R2: the page's one signature; the ember copy is decorative and unannounced */}
      <h1 className={`${styles.code} registration registration-text`} data-registration="404">
        404<span className="srOnly"> — page not found</span>
      </h1>
      <p className={styles.line}>This page doesn&apos;t exist, or it has moved.</p>
      <ul className={styles.links} aria-label="Ways back">
        {WAYS_BACK.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="action-link">
              {link.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
