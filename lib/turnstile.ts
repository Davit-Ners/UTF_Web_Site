import { BOOKING_TURNSTILE_ACTION } from "@/lib/turnstile.shared";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

type TurnstileValidationSuccess = {
  success: true;
  action?: string;
  hostname?: string;
};

type TurnstileValidationFailure = {
  success: false;
  "error-codes"?: string[];
};

type TurnstileValidationResponse =
  | TurnstileValidationSuccess
  | TurnstileValidationFailure;

type ValidateTurnstileTokenParams = {
  expectedAction?: string;
  request: Request;
  token: string;
};

type ValidateTurnstileTokenResult =
  | { ok: true; skipped: boolean }
  | { ok: false; error: string };

function getRequestIp(headers: Headers) {
  const cfConnectingIp = headers.get("cf-connecting-ip");

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");

  if (!forwardedFor) {
    return null;
  }

  return forwardedFor.split(",")[0]?.trim() || null;
}

function getExpectedHostname(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    return host.split(",")[0]?.trim().split(":")[0] || null;
  }

  try {
    return new URL(request.url).hostname;
  } catch {
    return null;
  }
}

function getTurnstileErrorMessage(errorCodes: string[] = []) {
  if (
    errorCodes.includes("missing-input-response") ||
    errorCodes.includes("invalid-input-response")
  ) {
    return "Please complete the verification challenge.";
  }

  if (errorCodes.includes("timeout-or-duplicate")) {
    return "Verification expired. Please try again.";
  }

  return "Verification failed. Please try again.";
}

function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export async function validateTurnstileToken({
  expectedAction = BOOKING_TURNSTILE_ACTION,
  request,
  token,
}: ValidateTurnstileTokenParams): Promise<ValidateTurnstileTokenResult> {
  if (!turnstileSecretKey) {
    if (token) {
      console.error(
        "TURNSTILE SECRET KEY IS MISSING WHILE A CLIENT TOKEN WAS SUBMITTED."
      );

      return {
        ok: false,
        error: "Verification is misconfigured. Please try again later.",
      };
    }

    console.warn(
      "TURNSTILE_SECRET_KEY is missing. Booking requests are accepted without Turnstile verification."
    );
    return { ok: true, skipped: true };
  }

  if (!token) {
    return {
      ok: false,
      error: "Please complete the verification challenge.",
    };
  }

  if (token.length > 2048) {
    return {
      ok: false,
      error: "Verification failed. Please try again.",
    };
  }

  const formData = new FormData();
  formData.append("secret", turnstileSecretKey);
  formData.append("response", token);

  const remoteIp = getRequestIp(request.headers);

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      cache: "no-store",
      signal: controller.signal,
    });

    const validation = (await response.json()) as TurnstileValidationResponse;

    if (!response.ok || !validation.success) {
      const errorCodes =
        "error-codes" in validation ? validation["error-codes"] ?? [] : [];

      console.error("TURNSTILE VALIDATION FAILED:", errorCodes);

      return {
        ok: false,
        error: getTurnstileErrorMessage(errorCodes),
      };
    }

    if (expectedAction && validation.action !== expectedAction) {
      console.error("TURNSTILE ACTION MISMATCH:", {
        expectedAction,
        receivedAction: validation.action,
      });

      return {
        ok: false,
        error: "Verification failed. Please refresh the page and try again.",
      };
    }

    const expectedHostname = getExpectedHostname(request);

    if (expectedHostname && validation.hostname !== expectedHostname) {
      console.error("TURNSTILE HOSTNAME MISMATCH:", {
        expectedHostname,
        receivedHostname: validation.hostname,
      });

      return {
        ok: false,
        error: "Verification failed. Please retry from the booking form.",
      };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    console.error("TURNSTILE ERROR:", error);

    return {
      ok: false,
      error: isAbortError(error)
        ? "Verification timed out. Please try again."
        : "Verification is temporarily unavailable. Please try again.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
