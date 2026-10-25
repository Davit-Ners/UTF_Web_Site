import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { createMerchOrderAttempt, isMerchIdempotencyKey } from "./merch-order-attempt";

test("one checkout retains its key through retries/remounts, then rotates after saved acknowledgement", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  const attempt = createMerchOrderAttempt(storage, randomUUID);
  const key = attempt.getKey();
  assert.ok(isMerchIdempotencyKey(key));
  assert.equal(attempt.getKey(), key); // Network/API uncertainty does not complete an attempt.
  const remounted = createMerchOrderAttempt(storage, randomUUID);
  assert.equal(remounted.getKey(), key);
  remounted.complete(key);
  assert.equal(values.size, 0);
  assert.notEqual(remounted.getKey(), key);
  assert.equal(values.size, 1);
});

test("blocked storage still permits stable retries within the mounted checkout", () => {
  const storage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
    removeItem: () => { throw new Error("blocked"); },
  };
  const attempt = createMerchOrderAttempt(storage, randomUUID);
  const key = attempt.getKey();
  assert.equal(attempt.getKey(), key);
  attempt.complete(key);
  assert.notEqual(attempt.getKey(), key);
});
