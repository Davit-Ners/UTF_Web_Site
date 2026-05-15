export type BookingRequestPayload = {
  name: string;
  email: string;
  org: string;
  type: string;
  city: string;
  capacity: string;
  date: string;
  budget: string;
  message: string;
  faxNumber: string;
};

export type ValidBookingRequestPayload = Omit<BookingRequestPayload, "faxNumber">;

type BookingValidationResult =
  | { ok: true; data: ValidBookingRequestPayload }
  | { ok: false; error?: string; spam?: boolean };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseBookingPayload(input: unknown): BookingRequestPayload {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  return {
    name: readString(record.name),
    email: readString(record.email).toLowerCase(),
    org: readString(record.org),
    type: readString(record.type),
    city: readString(record.city),
    capacity: readString(record.capacity),
    date: readString(record.date),
    budget: readString(record.budget),
    message: readString(record.message),
    faxNumber: readString(record.faxNumber),
  };
}

export function buildBookingPayload(formData: FormData): BookingRequestPayload {
  return parseBookingPayload(Object.fromEntries(formData.entries()));
}

export function validateBookingPayload(
  payload: BookingRequestPayload
): BookingValidationResult {
  if (payload.faxNumber) {
    return { ok: false, spam: true };
  }

  if (!payload.name || !payload.email || !payload.message || !payload.date) {
    return { ok: false, error: "Please fill all required fields." };
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  if (!DATE_REGEX.test(payload.date)) {
    return { ok: false, error: "Please provide a valid date." };
  }

  if (payload.message.length < 10) {
    return { ok: false, error: "Please add a few more details to your message." };
  }

  if (payload.name.length > 120 || payload.email.length > 320) {
    return { ok: false, error: "One or more fields are too long." };
  }

  if (
    payload.org.length > 160 ||
    payload.type.length > 120 ||
    payload.city.length > 160 ||
    payload.capacity.length > 80 ||
    payload.budget.length > 80 ||
    payload.message.length > 5000
  ) {
    return { ok: false, error: "One or more fields are too long." };
  }

  return {
    ok: true,
    data: {
      name: payload.name,
      email: payload.email,
      org: payload.org,
      type: payload.type,
      city: payload.city,
      capacity: payload.capacity,
      date: payload.date,
      budget: payload.budget,
      message: payload.message,
    },
  };
}

export function bookingDateToDateTime(rawDate: string) {
  return DATE_REGEX.test(rawDate) ? new Date(`${rawDate}T12:00:00.000Z`) : null;
}
