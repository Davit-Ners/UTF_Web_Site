/* Merch shipping rule, shared by the order API and the /merch page */
export const SHIPPING_FLAT_EUR = 7;
export const FREE_SHIPPING_FROM_EUR = 80;

export function calculateShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_FROM_EUR ? 0 : SHIPPING_FLAT_EUR;
}
