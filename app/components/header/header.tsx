"use client";

import NewTabLink from "@/app/components/newTabLink";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import { BAND_PROFILES } from "@/app/lib/links";
import styles from "./header.module.css";

const NAV = [
  { href: "/music", label: "Music" },
  { href: "/concerts", label: "Concerts" },
  { href: "/merch", label: "Merch" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/booking", label: "Booking" },
];

const EXTERNALS = [BAND_PROFILES.spotify, BAND_PROFILES.youtube];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Match the mobile navigation media query in header.module.css exactly.
const MOBILE_NAV_QUERY = "(max-width: 980px)";

export type HeaderTickets = {
  href: string;
  date: string;
};

type Props = {
  tickets?: HeaderTickets | null;
};

export default function Header({ tickets }: Props) {
  const pathname = usePathname();
  // Menu state is tied to the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [solid, setSolid] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlay = pathname === "/";

  const closeMenu = () => setOpenOn(null);

  useEffect(() => {
    // On the homepage the header sits over the hero until the hero has scrolled away.
    const onScroll = () => {
      const threshold = overlay ? window.innerHeight - 80 : 8;
      setSolid(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overlay]);

  useEffect(() => {
    if (!open) return;

    const mobileNav = window.matchMedia(MOBILE_NAV_QUERY);
    const closeOnDesktop = () => {
      if (!mobileNav.matches) setOpenOn(null);
    };
    mobileNav.addEventListener("change", closeOnDesktop);
    closeOnDesktop();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOn(null);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mobileNav.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  const headerClass = [
    styles.header,
    overlay ? styles.overlay : "",
    solid || open || !overlay ? styles.solid : "",
  ].join(" ");

  return (
    <header ref={headerRef} className={headerClass}>
      <div className={styles.row}>
        <Link href="/" className={styles.brand} aria-label="Until They Fall home" onClick={closeMenu}>
          {/* Temporary mark: Gerard, until the four-eye SVG exists */}
          <Image
            src="/optimized/gerard-logo.webp"
            alt=""
            width={28}
            height={28}
            className={styles.mark}
          />
          <span className={styles.wordmark}>Until They Fall</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.end}>
          {tickets ? (
            <NewTabLink href={tickets.href} className={styles.tickets}>
              Tickets <span className={styles.ticketDate}>{tickets.date}</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </NewTabLink>
          ) : null}
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        inert={!open}
      >
        {/* Shutter: the panel's edge travels down while this layer holds the content still */}
        <div className={styles.panelInner}>
          <nav className={styles.panelNav} aria-label="Mobile">
            {NAV.map((item, index) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.panelLink} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.panelFoot}>
            {tickets ? (
              <NewTabLink href={tickets.href} className="action-link">
                Tickets {tickets.date} <span className="arrow" aria-hidden="true">↗</span>
              </NewTabLink>
            ) : null}
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.panelMeta}>
              {CONTACT_EMAIL}
            </a>
            <div className={styles.panelExternals}>
              {EXTERNALS.map((item) => (
                <NewTabLink key={item.href} href={item.href} className={styles.panelMeta}>
                  {item.label}
                </NewTabLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
