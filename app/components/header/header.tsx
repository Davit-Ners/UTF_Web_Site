"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

const NAV = [
    { href: "/music", label: "Music" },
    { href: "/concerts", label: "Concerts" },
    { href: "/merch", label: "Merch" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Booking" },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [atTop, setAtTop] = useState(true);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setAtTop(window.scrollY < 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header className={`${styles.header} ${atTop ? "" : styles.headerScrolled}`}>
        <div className="container">
            <div className={styles.row}>
            <Link href="/" className={styles.brand} aria-label="Until They Fall — Home">
                <Image src="/logo.jpg" alt="Until They Fall" width={60} height={60} className={styles.logo}/>
                <span className={styles.brandText}>Until They Fall</span>
            </Link>

            <nav className={styles.nav} aria-label="Primary">
                {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.link} ${active ? styles.active : ""}`}
                    >
                    {item.label}
                    </Link>
                );
                })}
            </nav>

            <div className={styles.actions}>
                <Link href="/concerts" className={`button ${styles.tickets}`}>Tickets</Link>
                <button
                className={styles.theme}
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                {theme === "dark" ? "☀️" : "🌙"}
                </button>
                <button
                className={styles.burger}
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                >
                <span />
                <span />
                <span />
                </button>
            </div>
            </div>
        </div>

        {/* Mobile menu */}
        <div className={`${styles.mobile} ${open ? styles.mobileOpen : ""}`} aria-hidden={!open}>
            <nav className={styles.mobileNav}>
            {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                <Link key={item.href} href={item.href} className={`${styles.mobileLink} ${active ? styles.active : ""}`}>
                    {item.label}
                </Link>
                );
            })}
            <Link href="/concerts" className={`button ${styles.mobileCTA}`}>Tickets</Link>
            </nav>
        </div>
        </header>
    );
};
