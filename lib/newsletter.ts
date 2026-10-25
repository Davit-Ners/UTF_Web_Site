/*
 * Newsletter launch state. Signup is disabled for launch: the homepage shows
 * no form and POST /api/newsletter refuses before reading the body or touching
 * the database. This is a code constant, not an environment variable, so no
 * deployment setting can switch collection back on.
 *
 * Do not set this to true for the current handler. Reactivation is a dedicated
 * phase (consent wording, double opt-in, unsubscribe, consent evidence,
 * suppression and safe re-subscription); see passation.md.
 */
export const NEWSLETTER_SIGNUP_ENABLED = false as boolean;

export const NEWSLETTER_DISABLED_RESPONSE = {
  error: "Mailing list signup is not available.",
  code: "NEWSLETTER_DISABLED",
} as const;
