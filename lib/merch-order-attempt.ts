const STORAGE_KEY = "utf-merch-checkout-attempt";

export function isMerchIdempotencyKey(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/* Keep only the opaque key in session storage, never customer or cart data. */
export function createMerchOrderAttempt(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null,
  generateKey: () => string = () => crypto.randomUUID()
) {
  let key: string | null = null;
  return {
    getKey() {
      if (key) return key;
      try {
        const saved = storage?.getItem(STORAGE_KEY);
        if (isMerchIdempotencyKey(saved)) key = saved;
      } catch { /* Storage may be blocked; the in-memory attempt still protects retries. */ }
      key ??= generateKey();
      try { storage?.setItem(STORAGE_KEY, key); } catch { /* Keep the in-memory key. */ }
      return key;
    },
    complete(completedKey: string) {
      if (key !== completedKey) return;
      key = null;
      try {
        if (storage?.getItem(STORAGE_KEY) === completedKey) storage.removeItem(STORAGE_KEY);
      } catch { /* Storage may be blocked. */ }
    },
  };
}
