export type MerchOrderItemInput = {
  productId: string;
  quantity: number;
};

export type MerchOrderPayload = {
  name: string;
  email: string;
  country: string;
  notes: string;
  faxNumber: string;
  items: MerchOrderItemInput[];
};

export type ValidMerchOrderPayload = Omit<MerchOrderPayload, "faxNumber">;

type MerchOrderValidationResult =
  | { ok: true; data: ValidMerchOrderPayload }
  | { ok: false; error?: string; spam?: boolean };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ITEMS = 12;
const MAX_QTY_PER_ITEM = 20;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseItems(value: unknown): MerchOrderItemInput[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;

      const record = item as Record<string, unknown>;
      const productId = readString(record.productId);
      const rawQuantity = Number(record.quantity);
      const quantity = Number.isFinite(rawQuantity) ? Math.floor(rawQuantity) : 0;

      if (!productId || quantity <= 0) return null;

      return {
        productId,
        quantity: Math.min(quantity, MAX_QTY_PER_ITEM),
      };
    })
    .filter((item): item is MerchOrderItemInput => Boolean(item))
    .slice(0, MAX_ITEMS);
}

export function parseMerchOrderPayload(input: unknown): MerchOrderPayload {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  return {
    name: readString(record.name),
    email: readString(record.email).toLowerCase(),
    country: readString(record.country),
    notes: readString(record.notes),
    faxNumber: readString(record.faxNumber),
    items: parseItems(record.items),
  };
}

export function validateMerchOrderPayload(
  payload: MerchOrderPayload
): MerchOrderValidationResult {
  if (payload.faxNumber) {
    return { ok: false, spam: true };
  }

  if (!payload.name || !payload.email || !payload.country) {
    return { ok: false, error: "Please fill all required fields." };
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  if (!payload.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (
    payload.name.length > 120 ||
    payload.email.length > 320 ||
    payload.country.length > 120 ||
    payload.notes.length > 2000
  ) {
    return { ok: false, error: "One or more fields are too long." };
  }

  return {
    ok: true,
    data: {
      name: payload.name,
      email: payload.email,
      country: payload.country,
      notes: payload.notes,
      items: payload.items,
    },
  };
}
