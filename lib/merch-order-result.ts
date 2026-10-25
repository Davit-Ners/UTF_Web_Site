export type StoredMerchOrderResponse = {
  success: true;
  stored: true;
  orderId: string;
  orderNumber: string;
  emailed: boolean;
  confirmationEmailed: boolean;
  notificationStatus: "complete" | "incomplete" | "pending";
  alreadyProcessed: boolean;
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
  if (response.notificationStatus === "pending") {
    return {
      type: "success-with-warning",
      orderNumber,
      message: `Your order request was already received and saved as #${orderNumber}. Email notification status is not yet confirmed. Please don't submit it again. Keep this reference.`,
    };
  }
  if (response.emailed === true && response.confirmationEmailed === true) {
    return {
      type: "success",
      orderNumber,
      message: response.alreadyProcessed === true
        ? `Request already received. Order ${orderNumber} is waiting for confirmation.`
        : `Request sent. Order ${orderNumber} is waiting for confirmation.`,
    };
  }
  return {
    type: "success-with-warning",
    orderNumber,
    message: `Your order request was ${response.alreadyProcessed === true ? "already " : ""}received and saved as #${orderNumber}. Not all order notification emails could be delivered. Please don't submit it again. Keep this reference.`,
  };
}
