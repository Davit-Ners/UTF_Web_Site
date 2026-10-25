const STORAGE_KEY = "utf-booking-pending-attempt";

export function isBookingAttemptKey(value: string | null): value is string {
  return value !== null && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Store only the UUID, never the promoter's form data. Session storage survives
// reloads within this tab. If storage is unavailable, fail before sending.
export function getBookingAttempt(storage: Storage): string {
  const pending = storage.getItem(STORAGE_KEY);
  if (isBookingAttemptKey(pending)) return pending;
  const key = crypto.randomUUID();
  storage.setItem(STORAGE_KEY, key);
  return key;
}

export function completeBookingAttempt(storage: Storage, key: string) {
  if (storage.getItem(STORAGE_KEY) === key) storage.removeItem(STORAGE_KEY);
}
