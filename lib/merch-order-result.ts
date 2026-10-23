export type StoredMerchOrderResponse = {
  success: true;
  stored: true;
  orderId: string;
  orderNumber: string;
  emailed: boolean;
  confirmationEmailed: boolean;
  notificationStatus: "complete" | "incomplete";
};

export type SavedMerchOrderStatus = {
  type: "success" | "success-with-warning";
  orderNumber: string;
  message: string;
};

export type MerchOrderStatus =
  | { type: "idle" }
  | { type: "loading" }
  | SavedMerchOrderStatus
  | { type: "error"; message: string };

/* Persistence takes precedence over HTTP/email errors, including older 502 responses. */
export function getSavedMerchOrderStatus(result: unknown): SavedMerchOrderStatus | null {
  if (typeof result !== "object" || result === null) return null;
  const response = result as Record<string, unknown>;
  if (response.stored !== true || typeof response.orderNumber !== "string" || !response.orderNumber.trim()) {
    return null;
  }

  const orderNumber = response.orderNumber;
  if (response.emailed === true && response.confirmationEmailed === true) {
    return {
      type: "success",
      orderNumber,
      message: `Request sent. Order ${orderNumber} is waiting for confirmation.`,
    };
  }
  return {
    type: "success-with-warning",
    orderNumber,
    message: `Your order request was received and saved as #${orderNumber}. Not all order notification emails could be delivered. Please don't submit it again. Keep this reference.`,
  };
}
