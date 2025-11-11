"use client";

import Link from "next/link";
import styles from "./actionHub.module.css";
import NewsletterForm from "../newsLetterForm/newsLetterForm";
import { useMemo } from "react";
import { concerts } from "@/app/lib/concerts";

// Mini icônes SVG (inline, légers)
function IconTicket(){ 
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h6v2a2 2 0 1 0 4 0V5h4a2 2 0 0 1 2 2v3h-2a2 2 0 1 0 0 4h2v3a2 2 0 0 1-2 2h-4v-2a2 2 0 1 0-4 0v2H5a2 2 0 0 1-2-2V7z" fill="currentColor"/>
    </svg>
  );
}
function IconBag(){
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zm3 0a3 3 0 1 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function IconMail(){
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M3.5 6.5h17v11h-17z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

export default function ActionHub(){
  // Badge “next show” (prend la date >= today la plus proche)
  const nextShow = useMemo(() => {
    const today = new Date();
    const upcoming = concerts
      .map(c => ({...c, d: new Date(c.date)}))
      .filter(c => c.d >= new Date(today.toDateString()))
      .sort((a,b) => a.d.getTime() - b.d.getTime())[0];
    if (!upcoming) return null;
    const date = new Intl.DateTimeFormat("en-GB", { day:"2-digit", month:"short"}).format(upcoming.d).toUpperCase();
    return { date, city: upcoming.city, venue: upcoming.venue, href: "/concerts" };
  }, []);

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.grid}>

          {/* TOUR */}
        <Link href="/concerts" className={`${styles.card} ${styles.cardTour}`} aria-label="See tour dates and tickets">
        <div>
            <div className={styles.head}>
            <span className={styles.icon}><IconTicket/></span>
            <h3 className={styles.title}>Tour</h3>
            </div>
            <p className={styles.desc}>Upcoming dates, tickets, venues.</p>
            {nextShow ? (
            <div className={styles.badge}>
                <span className={styles.dot}></span>
                <span className={styles.badgeTxt}>
                Next: {nextShow.date} — {nextShow.city.split(",")[0]} @ {nextShow.venue}
                </span>
            </div>
            ) : (
            <div className={styles.badgeMuted}>New dates soon</div>
            )}
        </div>
        </Link>

        {/* SHOP */}
        <Link href="/merch" className={`${styles.card} ${styles.cardShop}`} aria-label="Shop official merch">
        <div>
            <div className={styles.head}>
            <span className={styles.icon}><IconBag/></span>
            <h3 className={styles.title}>Merch</h3>
            </div>
            <p className={styles.desc}>Tees, hoodies, CD & more.</p>
            <div className={styles.pills}>
            <span className={styles.pillHot}>New drop</span>
            <span className={styles.pillStock}>In stock</span>
            </div>
        </div>
        </Link>

          {/* NEWSLETTER */}
          <div className={`${styles.card} ${styles.cardMail}`} aria-labelledby="hub-newsletter-title">
            <div className={styles.head}>
              <span className={styles.icon}><IconMail/></span>
              <h3 id="hub-newsletter-title" className={styles.title}>Mailing list</h3>
            </div>
            <p className={styles.desc}>Drops, shows & exclusives — no spam.</p>
            <div className={styles.formWrap}>
              <NewsletterForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
