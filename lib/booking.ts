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
export type BookingField = keyof ValidBookingRequestPayload;
export type BookingFieldErrors = Partial<Record<BookingField, string>>;

type BookingValidationResult =
  | { ok: true; data: ValidBookingRequestPayload }
  | { ok: false; error?: string; spam?: boolean; fieldErrors?: BookingFieldErrors };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type FieldIssue = { kind: "required" | "format" | "short" | "long"; message: string };

function getBookingFieldIssues(payload: BookingRequestPayload) {
  const issues: Partial<Record<BookingField, FieldIssue>> = {};
  const required = {
    name: "Please enter your name.",
    email: "Please enter your email address.",
    date: "Please choose a date.",
    message: "Please enter a message.",
  } as const;
  for (const field of Object.keys(required) as (keyof typeof required)[]) {
    if (!payload[field]) issues[field] = { kind: "required", message: required[field] };
  }
  if (!issues.email && !EMAIL_REGEX.test(payload.email)) {
    issues.email = { kind: "format", message: "Please provide a valid email address." };
  }
  if (!issues.date && !DATE_REGEX.test(payload.date)) {
    issues.date = { kind: "format", message: "Please provide a valid date." };
  }
  if (!issues.message && payload.message.length < 10) {
    issues.message = { kind: "short", message: "Please add a few more details (at least 10 characters)." };
  }
  const limits = { name: 120, email: 320, org: 160, type: 120, city: 160, capacity: 80, budget: 80, message: 5000 } as const;
  for (const field of Object.keys(limits) as (keyof typeof limits)[]) {
    if (!issues[field] && payload[field].length > limits[field]) {
      issues[field] = { kind: "long", message: `Please use ${limits[field]} characters or fewer.` };
    }
  }
  return issues;
}

export function getBookingFieldErrors(payload: BookingRequestPayload): BookingFieldErrors {
  return Object.fromEntries(Object.entries(getBookingFieldIssues(payload)).map(([field, issue]) => [field, issue.message]));
}

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

  const issues = getBookingFieldIssues(payload);
  const fieldErrors: BookingFieldErrors = Object.fromEntries(Object.entries(issues).map(([field, issue]) => [field, issue.message]));

  if (Object.values(issues).some((issue) => issue.kind === "required")) {
    return { ok: false, error: "Please fill all required fields.", fieldErrors };
  }

  if (issues.email?.kind === "format") {
    return { ok: false, error: "Please provide a valid email address.", fieldErrors };
  }

  if (issues.date?.kind === "format") {
    return { ok: false, error: "Please provide a valid date.", fieldErrors };
  }

  if (issues.message?.kind === "short") {
    return { ok: false, error: "Please add a few more details to your message.", fieldErrors };
  }

  if (Object.values(issues).some((issue) => issue.kind === "long")) {
    return { ok: false, error: "One or more fields are too long.", fieldErrors };
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
