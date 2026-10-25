export type SavedBookingResult = {
  success: true;
  stored: true;
  bookingRequestId: string;
  emailed: boolean;
  confirmationEmailed: boolean;
  notificationStatus: "complete" | "incomplete";
};

// Only explicit persistence confirmation can reset the form. Missing delivery
// confirmation is treated conservatively as incomplete, never as a failed save.
export function readSavedBookingResult(value: unknown): SavedBookingResult | null {
  if (typeof value !== "object" || value === null) return null;
  const result = value as Record<string, unknown>;
  if (result.stored !== true || typeof result.bookingRequestId !== "string" || !result.bookingRequestId.trim()) {
    return null;
  }
  const emailed = result.emailed === true;
  const confirmationEmailed = result.confirmationEmailed === true;
  return {
    success: true,
    stored: true,
    bookingRequestId: result.bookingRequestId,
    emailed,
    confirmationEmailed,
    notificationStatus: emailed && confirmationEmailed ? "complete" : "incomplete",
  };
}
