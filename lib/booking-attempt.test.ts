import assert from "node:assert/strict";
import { test } from "node:test";
import { completeBookingAttempt, getBookingAttempt, isBookingAttemptKey } from "./booking-attempt";

test("Booking attempt survives retries/reloads and changes only after a confirmed save", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as Storage;
  const first = getBookingAttempt(storage);
  assert.equal(isBookingAttemptKey(first), true);
  assert.equal(getBookingAttempt(storage), first); // Retry or remount/reload.
  completeBookingAttempt(storage, crypto.randomUUID());
  assert.equal(getBookingAttempt(storage), first); // Stale completion cannot clear it.
  completeBookingAttempt(storage, first);
  assert.notEqual(getBookingAttempt(storage), first);
});

test("Booking never sends an unpersisted attempt when session storage is unavailable", () => {
  assert.throws(() => getBookingAttempt({ getItem: () => { throw new Error("blocked"); } } as unknown as Storage));
  assert.equal(isBookingAttemptKey("not-a-key"), false);
});
