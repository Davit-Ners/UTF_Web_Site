export const BOOKING_TURNSTILE_ACTION = "booking_form";

export const BOOKING_UNAVAILABLE_MESSAGE =
  "Online booking requests are temporarily unavailable. Please email us directly.";

/* Only this public state crosses the server/client boundary, never the secret. */
export type BookingTurnstileConfig =
  | { state: "disabled" }
  | { state: "enabled"; siteKey: string }
  | { state: "unavailable" };

export function resolveBookingTurnstileConfig(
  siteKeyValue?: string,
  secretKeyValue?: string
): BookingTurnstileConfig {
  const siteKey = siteKeyValue?.trim() ?? "";
  const secretKey = secretKeyValue?.trim() ?? "";

  if (!siteKey && !secretKey) return { state: "disabled" };
  if (!/^[0-3]x[A-Za-z0-9_-]+$/.test(siteKey) || !secretKey) {
    return { state: "unavailable" };
  }
  return { state: "enabled", siteKey };
}
