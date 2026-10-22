/*
 * Public contact address shown across the site and used as the API
 * fallback. Internal destinations (BOOKING_TO_EMAIL, MERCH_TO_EMAIL,
 * RESEND_FROM_EMAIL) stay environment-controlled and may differ.
 */
export const CONTACT_EMAIL = "contact@untiltheyfall.com";

/* Technical rider; facts on /booking are derived from this version */
export const TECH_RIDER = {
  href: "/docs/UTF_technical_rider_2026.pdf",
  version: "18.02.2026",
  pages: 5,
  sizeLabel: "206 KB",
} as const;
