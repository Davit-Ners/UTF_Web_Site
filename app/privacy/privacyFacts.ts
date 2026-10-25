/*
 * Facts shared by the English and French policies, so both versions state
 * the same dates, storage keys and periods. Storage keys must match
 * lib/booking-attempt.ts and lib/merch-order-attempt.ts (checked in tests).
 */
export const PRIVACY_UPDATED = { en: "25 October 2026", fr: "25 octobre 2026" } as const;

export const SESSION_KEYS = {
  booking: "utf-booking-pending-attempt",
  merch: "utf-merch-checkout-attempt",
} as const;

/* Policy periods chosen by the band, not statutory periods */
export const RETENTION_MONTHS = {
  bookingWithoutShow: 24,
  bookingAfterShow: 24,
  merchNotCompleted: 12,
  merchAfterDelivery: 24,
} as const;

export const APD = {
  nameEn: "Belgian Data Protection Authority",
  nameFr: "Autorité de protection des données",
  address: "Rue de la Presse 35, 1000 Bruxelles",
  email: "contact@apd-gba.be",
  url: "https://www.autoriteprotectiondonnees.be",
} as const;

export const GOOGLE_PRIVACY_URL = "https://policies.google.com/privacy";
export const CLOUDFLARE_TURNSTILE_PRIVACY_URL = "https://www.cloudflare.com/turnstile-privacy-policy/";
